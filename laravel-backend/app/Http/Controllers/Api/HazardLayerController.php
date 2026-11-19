<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHazardLayerRequest;
use App\Http\Resources\HazardLayerResource;
use App\Models\HazardLayer;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HazardLayerController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = HazardLayer::with('hazardType');

        if ($hazardTypeId = $request->query('hazard_type_id')) {
            $query->where('hazard_type_id', $hazardTypeId);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $layers = $query->orderBy('dataset_name')->get();

        return $this->success(HazardLayerResource::collection($layers));
    }

    public function store(StoreHazardLayerRequest $request): JsonResponse
    {
        $layer = HazardLayer::create($request->validated());
        $layer->load('hazardType');

        return $this->created(new HazardLayerResource($layer), 'Hazard layer created successfully.');
    }

    public function show(int $id): JsonResponse
    {
        $layer = HazardLayer::with('hazardType')->find($id);

        if (! $layer) {
            return $this->notFound('Hazard layer not found.');
        }

        return $this->success(new HazardLayerResource($layer));
    }

    public function update(StoreHazardLayerRequest $request, int $id): JsonResponse
    {
        $layer = HazardLayer::find($id);

        if (! $layer) {
            return $this->notFound('Hazard layer not found.');
        }

        $layer->update($request->validated());
        $layer->load('hazardType');

        return $this->success(new HazardLayerResource($layer), 'Hazard layer updated successfully.');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        if (! $request->user()->canEdit()) {
            return $this->forbidden();
        }

        $layer = HazardLayer::find($id);

        if (! $layer) {
            return $this->notFound('Hazard layer not found.');
        }

        $layer->delete();

        return $this->success(null, 'Hazard layer deleted successfully.');
    }

    /** GeoJSON layers for the map (by hazard_type name query param) */
    public function layersForMap(Request $request): JsonResponse
    {
        $hazardType = $request->query('hazard_type');

        $query = HazardLayer::with('hazardType')->where('is_active', true);

        if ($hazardType) {
            $query->whereHas('hazardType', fn ($q) => $q->where('hazard_name', 'like', "%{$hazardType}%"));
        }

        $layers = $query->get()->map(fn ($layer) => [
            'layer_id'      => $layer->layer_id,
            'dataset_name'  => $layer->dataset_name,
            'hazard_type'   => $layer->hazardType?->hazard_name,
            'source_agency' => $layer->source_agency,
            'data_year'     => $layer->data_year,
            'geojson'       => $layer->geojson ? json_decode($layer->geojson, true) : null,
        ]);

        return $this->success($layers);
    }

    /** Point-in-polygon hazard assessment */
    public function assess(Request $request): JsonResponse
    {
        $lat  = (float) $request->query('latitude');
        $lng  = (float) $request->query('longitude');
        $none = ['status' => 'no_data', 'level' => null, 'dataset' => null];

        return $this->success([
            'latitude'  => $lat,
            'longitude' => $lng,
            'hazards'   => ['Flood' => $none, 'Landslide' => $none],
            'overall'   => ['status' => 'no_data', 'level' => null],
        ]);
    }

    /** Barangay boundary polygons */
    public function landscapeLayers(): JsonResponse
    {
        return $this->success(['type' => 'FeatureCollection', 'features' => []]);
    }
}
