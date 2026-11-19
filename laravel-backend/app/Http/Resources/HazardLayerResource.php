<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HazardLayerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'layer_id'      => $this->layer_id,
            'dataset_name'  => $this->dataset_name,
            'source_agency' => $this->source_agency,
            'data_year'     => $this->data_year,
            'is_active'     => $this->is_active,
            'file_path'     => $this->file_path,
            'hazard_type'   => [
                'hazard_type_id' => $this->hazardType?->hazard_type_id,
                'hazard_name'    => $this->hazardType?->hazard_name,
            ],
            'geojson'       => $this->when(
                request()->routeIs('*.hazard-layers.show'),
                $this->geojson
            ),
            'created_at'    => $this->created_at?->toISOString(),
            'updated_at'    => $this->updated_at?->toISOString(),
        ];
    }
}
