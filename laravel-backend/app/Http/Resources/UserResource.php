<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'user_id'    => $this->user_id,
            'first_name' => $this->first_name,
            'last_name'  => $this->last_name,
            'full_name'  => $this->first_name.' '.$this->last_name,
            'email'      => $this->email,
            'is_active'  => $this->is_active,
            // Flat fields for form selects and table columns
            'role_id'    => $this->role?->role_id,
            'role_name'  => $this->role?->role_name,
            // Nested role for AuthContext role checks
            'role'       => [
                'role_id'   => $this->role?->role_id,
                'role_name' => $this->role?->role_name,
            ],
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
