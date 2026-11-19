<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name'  => ['sometimes', 'string', 'max:100'],
            'email'      => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($userId, 'user_id')],
            'password'   => ['sometimes', 'string', 'min:8'],
            'role_id'    => ['sometimes', 'exists:roles,role_id'],
            'is_active'  => ['boolean'],
        ];
    }
}
