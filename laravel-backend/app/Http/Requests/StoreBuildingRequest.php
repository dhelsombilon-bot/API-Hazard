<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBuildingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'building_code'      => ['required', 'string', 'max:20', 'unique:buildings,building_code'],
            'building_name'      => ['required', 'string', 'max:255'],
            'building_type_id'   => ['required', 'exists:building_types,building_type_id'],
            'building_status_id' => ['required', 'exists:building_statuses,building_status_id'],
            'barangay_id'        => ['required', 'exists:barangays,barangay_id'],
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
