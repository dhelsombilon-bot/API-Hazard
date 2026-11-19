<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermitRequest;
use App\Http\Requests\UpdatePermitRequest;
use App\Http\Resources\PermitResource;
use App\Models\Permit;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PermitController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Permit::with(['building', 'permitType', 'permitStatus', 'documents.documentType', 'findings']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('permit_number', 'like', "%{$search}%")
                  ->orWhereHas('building', fn ($b) => $b->where('building_name', 'like', "%{$search}%"));
            });
        }

        if ($buildingId = $request->query('building_id')) {
            $query->where('building_id', $buildingId);
        }

        if ($typeId = $request->query('permit_type_id')) {
            $query->where('permit_type_id', $typeId);
        }

        if ($statusId = $request->query('permit_status_id')) {
            $query->where('permit_status_id', $statusId);
        }

        if ($statusName = $request->query('permit_status')) {
            $query->whereHas('permitStatus', fn ($q) => $q->where('status_name', $statusName));
        }

        if ($request->boolean('expired')) {
            $query->whereNotNull('expiry_date')->where('expiry_date', '<', now());
        }

        $perPage = min((int) $request->query('per_page', 15), 100);
        $permits = $query->orderBy('permit_number')->paginate($perPage);

        return $this->success([
            'data' => PermitResource::collection($permits->items()),
            'meta' => [
                'total'        => $permits->total(),
                'per_page'     => $permits->perPage(),
                'current_page' => $permits->currentPage(),
                'last_page'    => $permits->lastPage(),
            ],
        ]);
    }

    public function store(StorePermitRequest $request): JsonResponse
    {
        $permit = Permit::create(array_merge(
            $request->validated(),
            ['recorded_by' => $request->user()->user_id]
        ));

        $permit->load(['building', 'permitType', 'permitStatus']);

        return $this->created(new PermitResource($permit), 'Permit created successfully.');
    }

    public function show(int $id): JsonResponse
    {
        $permit = Permit::with([
            'building.barangay', 'permitType', 'permitStatus',
            'recordedBy', 'documents.documentType', 'documents.uploadedBy',
            'complianceChecks.checkedBy', 'findings.reportedBy', 'findings.resolvedBy',
        ])->find($id);

        if (! $permit) {
            return $this->notFound('Permit not found.');
        }

        return $this->success(new PermitResource($permit));
    }

    public function update(UpdatePermitRequest $request, int $id): JsonResponse
    {
        $permit = Permit::find($id);

        if (! $permit) {
            return $this->notFound('Permit not found.');
        }

        $permit->update($request->validated());
        $permit->load(['building', 'permitType', 'permitStatus']);

        return $this->success(new PermitResource($permit), 'Permit updated successfully.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->canEdit()) {
            return $this->forbidden();
        }

        $permit = Permit::find($id);

        if (! $permit) {
            return $this->notFound('Permit not found.');
        }

        $permit->delete();

        return $this->success(null, 'Permit deleted successfully.');
    }

    public function resolveFind(Request $request, int $findingId): JsonResponse
    {
        $finding = \App\Models\PermitFinding::find($findingId);

        if (! $finding) {
            return $this->notFound('Finding not found.');
        }

        $finding->update([
            'status'           => 'Resolved',
            'resolved_by'      => $request->user()->user_id,
            'resolved_at'      => now(),
            'resolution_notes' => $request->input('resolution_notes'),
        ]);

        return $this->success($finding, 'Finding resolved.');
    }
}
