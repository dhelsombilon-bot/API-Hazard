<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BuildingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'building_id'        => $this->building_id,
            'building_code'      => $this->building_code,
            'building_name'      => $this->building_name,
            'street_address'     => $this->street_address,
            'managing_office'    => $this->managing_office,
            'year_built'         => $this->year_built,
            'description'        => $this->description,
            'latitude'           => $this->latitude,
            'longitude'          => $this->longitude,
            'elevation_m'        => $this->elevation_m,
            'coordinate_source'  => $this->coordinate_source,
            'risk_level'         => $this->risk_level,
            // Flat FK IDs (needed by edit forms)
            'barangay_id'        => $this->barangay_id,
            'building_type_id'   => $this->building_type_id,
            'building_status_id' => $this->building_status_id,
            // Flat display strings (used by list/overview pages)
            'barangay_name'      => $this->barangay?->barangay_name,
            'building_type'      => $this->buildingType?->type_name,
            'building_status'    => $this->buildingStatus?->status_name,
            'hazard_assessments' => $this->whenLoaded('hazardAssessments', function () {
                return $this->hazardAssessments->map(fn ($a) => [
                    'hazard_assessment_id' => $a->hazard_assessment_id,
                    'hazard_type_id'       => $a->hazard_type_id,
                    'hazard_type'          => $a->hazardType?->hazard_name,
                    'hazard_level'         => $a->hazard_level,
                    'dataset_name'         => $a->dataset_name,
                    'assessment_date'      => $a->assessment_date?->toDateString(),
                    'assessment_notes'     => $a->assessment_notes,
                ]);
            }),
            'landscape_features' => $this->whenLoaded('landscapeFeatures', function () {
                return $this->landscapeFeatures->map(fn ($l) => [
                    'assessment_id'    => $l->assessment_id,
                    'feature_name'     => $l->feature_name,
                    'feature_type'     => $l->feature_type,
                    'distance_m'       => $l->distance_m,
                    'assessment_notes' => $l->assessment_notes,
                ]);
            }),
            'permits'            => $this->whenLoaded('permits', function () {
                return $this->permits->map(fn ($p) => [
                    'permit_id'     => $p->permit_id,
                    'permit_number' => $p->permit_number,
                    'permit_type'   => $p->permitType?->type_name,
                    'permit_status' => $p->permitStatus?->status_name,
                    'issue_date'    => $p->issue_date?->toDateString(),
                    'expiry_date'   => $p->expiry_date?->toDateString(),
                ]);
            }),
            'permits_count'      => $this->whenLoaded('permits', fn () => $this->permits->count()),
            'verified_at'        => $this->verified_at?->toISOString(),
            'created_at'         => $this->created_at?->toISOString(),
            'updated_at'         => $this->updated_at?->toISOString(),
        ];
    }
}
