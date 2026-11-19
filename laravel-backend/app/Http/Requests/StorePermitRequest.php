<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePermitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->canEdit() ?? false;
    }

    public function rules(): array
    {
        return [
            'permit_number'    => ['required', 'string', 'max:50', 'unique:permits,permit_number'],
            'building_id'      => ['required', 'exists:buildings,building_id'],
            'permit_type_id'   => ['required', 'exists:permit_types,permit_type_id'],
            'permit_status_id' => ['required', 'exists:permit_statuses,permit_status_id'],
            'issue_date'       => ['nullable', 'date'],
            'expiry_date'      => ['nullable', 'date', 'after_or_equal:issue_date'],
            'issuing_authority'=> ['nullable', 'string', 'max:255'],
            'permit_fee_amount'=> ['nullable', 'numeric', 'min:0'],
            'remarks'          => ['nullable', 'string'],
        ];
    }
}
