<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\Permit;
use App\Models\PermitFinding;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    use ApiResponse;

    public function stats(): JsonResponse
    {
        $totalBuildings    = Building::count();
        $totalPermits      = Permit::count();
        $expiredPermits    = Permit::whereNotNull('expiry_date')->where('expiry_date', '<', now())->count();
        $openFindings      = PermitFinding::where('status', 'Open')->count();
        $activeUsers       = User::where('is_active', true)->count();

        $permitsByStatus = Permit::select('permit_statuses.status_name', DB::raw('COUNT(*) as count'))
            ->join('permit_statuses', 'permits.permit_status_id', '=', 'permit_statuses.permit_status_id')
            ->whereNull('permits.deleted_at')
            ->groupBy('permit_statuses.status_name')
            ->get()
            ->pluck('count', 'status_name');

        $buildingsByBarangay = Building::select('barangays.barangay_name', DB::raw('COUNT(*) as count'))
            ->join('barangays', 'buildings.barangay_id', '=', 'barangays.barangay_id')
            ->whereNull('buildings.deleted_at')
            ->groupBy('barangays.barangay_name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        $recentPermits = Permit::with(['building', 'permitType', 'permitStatus'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($p) => [
                'permit_number' => $p->permit_number,
                'building_name' => $p->building?->building_name,
                'type'          => $p->permitType?->type_name,
                'status'        => $p->permitStatus?->status_name,
                'issue_date'    => $p->issue_date?->toDateString(),
            ]);

        return $this->success([
            'totals' => [
                'buildings'       => $totalBuildings,
                'permits'         => $totalPermits,
                'expired_permits' => $expiredPermits,
                'open_findings'   => $openFindings,
                'active_users'    => $activeUsers,
            ],
            'permits_by_status'      => $permitsByStatus,
            'buildings_by_barangay'  => $buildingsByBarangay,
            'recent_permits'         => $recentPermits,
        ]);
    }
}
