<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreHazardLayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'hazard_type_id' => ['required', 'exists:hazard_types,hazard_type_id'],
            'dataset_name'   => ['required', 'string', 'max:255'],
            'source_agency'  => ['nullable', 'string', 'max:255'],
            'data_year'      => ['nullable', 'integer', 'min:1900', 'max:2100'],
            'geojson'        => ['nullable', 'json'],
            'file_path'      => ['nullable', 'string', 'max:255'],
            'is_active'      => ['boolean'],
        ];
    }
}
