<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBuildingRequest;
use App\Http\Requests\UpdateBuildingRequest;
use App\Http\Resources\BuildingResource;
use App\Models\Building;
use App\Models\BuildingActivityLog;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Building::with(['barangay', 'buildingType', 'buildingStatus', 'hazardAssessments.hazardType', 'permits']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('building_name', 'like', "%{$search}%")
                  ->orWhere('building_code', 'like', "%{$search}%")
                  ->orWhere('street_address', 'like', "%{$search}%");
            });
        }

        if ($barangayId = $request->query('barangay_id')) {
            $query->where('barangay_id', $barangayId);
        }

        if ($typeId = $request->query('building_type_id')) {
            $query->where('building_type_id', $typeId);
        }

        if ($statusId = $request->query('building_status_id')) {
            $query->where('building_status_id', $statusId);
        }

        $perPage = min((int) $request->query('per_page', 15), 100);
        $buildings = $query->orderBy('building_name')->paginate($perPage);

        return $this->success([
            'data' => BuildingResource::collection($buildings->items()),
            'meta' => [
                'total'        => $buildings->total(),
                'per_page'     => $buildings->perPage(),
                'current_page' => $buildings->currentPage(),
                'last_page'    => $buildings->lastPage(),
            ],
        ]);
    }

    public function store(StoreBuildingRequest $request): JsonResponse
    {
        $building = Building::create(array_merge(
            $request->validated(),
            ['created_by' => $request->user()->user_id]
        ));

        $building->load(['barangay', 'buildingType', 'buildingStatus']);

        BuildingActivityLog::create([
            'building_id' => $building->building_id,
            'user_id'     => $request->user()->user_id,
            'action'      => 'created',
            'new_values'  => $request->validated(),
        ]);

        return $this->created(new BuildingResource($building), 'Building created successfully.');
    }

    public function show(int $id): JsonResponse
    {
        $building = Building::with([
            'barangay', 'buildingType', 'buildingStatus',
            'hazardAssessments.hazardType', 'landscapeFeatures',
            'permits.permitType', 'permits.permitStatus',
        ])->find($id);

        if (! $building) {
            return $this->notFound('Building not found.');
        }

        return $this->success(new BuildingResource($building));
    }

    public function update(UpdateBuildingRequest $request, int $id): JsonResponse
    {
        $building = Building::find($id);

        if (! $building) {
            return $this->notFound('Building not found.');
        }

        $old = $building->toArray();
        $building->update($request->validated());
        $building->load(['barangay', 'buildingType', 'buildingStatus']);

        BuildingActivityLog::create([
            'building_id' => $building->building_id,
            'user_id'     => $request->user()->user_id,
            'action'      => 'updated',
            'old_values'  => $old,
            'new_values'  => $request->validated(),
        ]);

        return $this->success(new BuildingResource($building), 'Building updated successfully.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->canEdit()) {
            return $this->forbidden();
        }

        $building = Building::find($id);

        if (! $building) {
            return $this->notFound('Building not found.');
        }

        BuildingActivityLog::create([
            'building_id' => $building->building_id,
            'user_id'     => $request->user()->user_id,
            'action'      => 'deleted',
            'old_values'  => $building->toArray(),
        ]);

        $building->delete();

        return $this->success(null, 'Building deleted successfully.');
    }

    public function geojson(): JsonResponse
    {
        $buildings = Building::with(['barangay', 'buildingType', 'buildingStatus', 'hazardAssessments.hazardType'])
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get();

        $features = $buildings->map(function ($b) {
            $hazardLevels = [];
            foreach ($b->hazardAssessments as $a) {
                $typeName = $a->hazardType?->hazard_name ?? null;
                if ($typeName) {
                    $hazardLevels[$typeName] = $a->hazard_level;
                }
            }

            return [
                'type'       => 'Feature',
                'properties' => [
                    'id'            => $b->building_id,
                    'building_id'   => $b->building_id,
                    'building_code' => $b->building_code,
                    'building_name' => $b->building_name,
                    'barangay_id'   => $b->barangay_id,
                    'barangay_name' => $b->barangay?->barangay_name,
                    'building_type' => $b->buildingType?->type_name,
                    'building_status' => $b->buildingStatus?->status_name,
                    'risk_level'    => $b->risk_level,
                    'hazard_levels' => $hazardLevels,
                ],
                'geometry' => [
                    'type'        => 'Point',
                    'coordinates' => [(float) $b->longitude, (float) $b->latitude],
                ],
            ];
        });

        return $this->success([
            'type'     => 'FeatureCollection',
            'features' => $features,
        ]);
    }
}
