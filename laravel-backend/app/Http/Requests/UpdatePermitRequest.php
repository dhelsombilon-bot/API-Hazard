<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePermitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        $permitId = $this->route('permit');

        return [
            'permit_number'    => ['sometimes', 'string', 'max:50', Rule::unique('permits', 'permit_number')->ignore($permitId, 'permit_id')],
            'building_id'      => ['sometimes', 'exists:buildings,building_id'],
            'permit_type_id'   => ['sometimes', 'exists:permit_types,permit_type_id'],
            'permit_status_id' => ['sometimes', 'exists:permit_statuses,permit_status_id'],
            'issue_date'       => ['nullable', 'date'],
            'expiry_date'      => ['nullable', 'date'],
            'issuing_authority'=> ['nullable', 'string', 'max:255'],
            'permit_fee_amount'=> ['nullable', 'numeric', 'min:0'],
            'remarks'          => ['nullable', 'string'],
        ];
    }
}
