<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBuildingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        $buildingId = $this->route('building');

        return [
            'building_code'      => ['sometimes', 'string', 'max:20', Rule::unique('buildings', 'building_code')->ignore($buildingId, 'building_id')],
            'building_name'      => ['sometimes', 'string', 'max:255'],
            'building_type_id'   => ['sometimes', 'exists:building_types,building_type_id'],
            'building_status_id' => ['sometimes', 'exists:building_statuses,building_status_id'],
            'barangay_id'        => ['sometimes', 'exists:barangays,barangay_id'],
            'street_address'     => ['nullable', 'string', 'max:255'],
            'managing_office'    => ['nullable', 'string', 'max:255'],
            'year_built'         => ['nullable', 'integer', 'min:1800', 'max:2100'],
            'description'        => ['nullable', 'string'],
            'latitude'           => ['nullable', 'numeric', 'between:-90,90'],
            'longitude'          => ['nullable', 'numeric', 'between:-180,180'],
            'elevation_m'        => ['nullable', 'numeric'],
            'coordinate_source'  => ['nullable', 'string', 'max:50'],
        ];
    }
}
