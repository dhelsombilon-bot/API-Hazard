<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\Permit;
use App\Models\PermitFinding;
use App\Models\Report;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $reports = Report::with('generatedBy')
            ->orderByDesc('generated_at')
            ->get()
            ->map(fn ($r) => [
                'report_id'    => $r->report_id,
                'report_type'  => $r->report_type,
                'generated_at' => $r->generated_at?->toISOString(),
                'file_path'    => $r->file_path,
                'file_url'     => $r->file_url,
                'generated_by' => trim($r->generatedBy?->first_name.' '.$r->generatedBy?->last_name),
            ]);

        return $this->success($reports);
    }

    public function preview(Request $request): JsonResponse
    {
        $type       = $request->query('report_type', 'permit_compliance');
        $barangayId = $request->query('barangay_id');
        $dateFrom   = $request->query('date_from');
        $dateTo     = $request->query('date_to');

        switch ($type) {
            case 'building_inventory':
            case 'inventory_summary':
                $buildings = Building::with(['buildingType', 'barangay', 'buildingStatus'])
                    ->when($barangayId, fn ($q) => $q->where('barangay_id', $barangayId))
                    ->get();

                $chartData = $buildings->groupBy(fn ($b) => $b->buildingType?->type_name ?? 'Unknown')
                    ->map(fn ($g, $k) => ['name' => $k, 'value' => $g->count()])
                    ->values();

                return $this->success([
                    'title'      => 'Building Inventory Summary',
                    'chart_type' => 'bar',
                    'chart_data' => $chartData,
                    'table_data' => $buildings->map(fn ($b) => [
                        'building_code' => $b->building_code,
                        'building_name' => $b->building_name,
                        'barangay'      => $b->barangay?->barangay_name,
                        'type'          => $b->buildingType?->type_name,
                        'status'        => $b->buildingStatus?->status_name,
                    ]),
                ]);

            case 'hazard_exposure':
                $buildings = Building::with(['hazardAssessments', 'barangay'])->get();
                $riskGroups = $buildings->groupBy(fn ($b) => $b->risk_level)
                    ->map(fn ($g, $k) => ['name' => $k, 'value' => $g->count()])
                    ->values();

                return $this->success([
                    'title'      => 'Hazard Exposure Report',
                    'chart_type' => 'pie',
                    'chart_data' => $riskGroups,
                    'table_data' => $buildings->map(fn ($b) => [
                        'building_name' => $b->building_name,
                        'barangay'      => $b->barangay?->barangay_name,
                        'risk_level'    => $b->risk_level,
                    ]),
                ]);

            case 'inspection_findings':
                $open     = PermitFinding::where('status', 'Open')->count();
                $resolved = PermitFinding::where('status', 'Resolved')->count();

                return $this->success([
                    'title'      => 'Inspection Findings Log',
                    'chart_type' => 'bar',
                    'chart_data' => [['name' => 'Open', 'value' => $open], ['name' => 'Resolved', 'value' => $resolved]],
                    'table_data' => Permit::with(['building', 'permitStatus'])->whereHas('findings')->get()
                        ->map(fn ($p) => [
                            'permit_number' => $p->permit_number,
                            'building'      => $p->building?->building_name,
                            'status'        => $p->permitStatus?->status_name,
                        ]),
                ]);

            default: // permit_compliance
                $permits = Permit::with(['permitType', 'permitStatus', 'building'])
                    ->when($barangayId, fn ($q) => $q->whereHas('building', fn ($b) => $b->where('barangay_id', $barangayId)))
                    ->when($dateFrom,   fn ($q) => $q->where('issue_date', '>=', $dateFrom))
                    ->when($dateTo,     fn ($q) => $q->where('issue_date', '<=', $dateTo))
                    ->get();

                $chartData = $permits->groupBy(fn ($p) => $p->permitStatus?->status_name ?? 'Unknown')
                    ->map(fn ($g, $k) => ['name' => $k, 'value' => $g->count()])
                    ->values();

                return $this->success([
                    'title'      => 'Permit Compliance Summary',
                    'chart_type' => 'pie',
                    'chart_data' => $chartData,
                    'table_data' => $permits->map(fn ($p) => [
                        'permit_number' => $p->permit_number,
                        'building'      => $p->building?->building_name,
                        'type'          => $p->permitType?->type_name,
                        'status'        => $p->permitStatus?->status_name,
                        'expiry_date'   => $p->expiry_date?->toDateString(),
                    ]),
                ]);
        }
    }

    public function generate(Request $request): JsonResponse
    {
        $report = Report::create([
            'report_type'  => $request->input('report_type', 'permit_compliance'),
            'generated_by' => $request->user()->user_id,
            'generated_at' => now(),
            'parameters'   => $request->except('report_type'),
        ]);

        return $this->created([
            'report_id'    => $report->report_id,
            'report_type'  => $report->report_type,
            'generated_at' => $report->generated_at->toISOString(),
        ], 'Report generated.');
    }

    public function download(int $id): JsonResponse
    {
        return $this->error('Report download not available yet.', 404);
    }
}
