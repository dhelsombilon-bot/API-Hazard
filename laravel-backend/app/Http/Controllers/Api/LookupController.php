<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barangay;
use App\Models\BuildingStatus;
use App\Models\BuildingType;
use App\Models\DocumentType;
use App\Models\HazardLevel;
use App\Models\HazardType;
use App\Models\PermitStatus;
use App\Models\PermitType;
use App\Models\Role;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class LookupController extends Controller
{
    use ApiResponse;

    public function barangays(): JsonResponse
    {
        return $this->success(
            Barangay::orderBy('barangay_name')->get(['barangay_id', 'barangay_name'])
        );
    }

    public function buildingTypes(): JsonResponse
    {
        return $this->success(
            BuildingType::orderBy('type_name')->get(['building_type_id', 'type_name'])
        );
    }

    public function buildingStatuses(): JsonResponse
    {
        return $this->success(
            BuildingStatus::orderBy('status_name')->get(['building_status_id', 'status_name'])
        );
    }

    public function permitTypes(): JsonResponse
    {
        return $this->success(
            PermitType::orderBy('type_name')->get(['permit_type_id', 'type_name'])
        );
    }

    public function permitStatuses(): JsonResponse
    {
        return $this->success(
            PermitStatus::orderBy('status_name')->get(['permit_status_id', 'status_name'])
        );
    }

    public function documentTypes(): JsonResponse
    {
        return $this->success(
            DocumentType::orderBy('document_name')->get(['document_type_id', 'document_name', 'is_required'])
        );
    }

    public function hazardTypes(): JsonResponse
    {
        return $this->success(
            HazardType::orderBy('hazard_name')->get(['hazard_type_id', 'hazard_name'])
        );
    }

    public function hazardLevels(): JsonResponse
    {
        return $this->success(
            HazardLevel::orderBy('severity_order')->get(['hazard_level_id', 'level_name', 'color_code', 'severity_order'])
        );
    }

    public function roles(): JsonResponse
    {
        return $this->success(
            Role::orderBy('role_name')->get(['role_id', 'role_name', 'description'])
        );
    }

    /** Combined — all lookups in one request */
    public function all(): JsonResponse
    {
        return $this->success([
            'barangays'         => Barangay::orderBy('barangay_name')->get(['barangay_id', 'barangay_name']),
            'building_types'    => BuildingType::orderBy('type_name')->get(['building_type_id', 'type_name']),
            'building_statuses' => BuildingStatus::orderBy('status_name')->get(['building_status_id', 'status_name']),
            'permit_types'      => PermitType::orderBy('type_name')->get(['permit_type_id', 'type_name']),
            'permit_statuses'   => PermitStatus::orderBy('status_name')->get(['permit_status_id', 'status_name']),
            'document_types'    => DocumentType::orderBy('document_name')->get(['document_type_id', 'document_name', 'is_required']),
            'hazard_types'      => HazardType::orderBy('hazard_name')->get(['hazard_type_id', 'hazard_name']),
            'hazard_levels'     => HazardLevel::orderBy('severity_order')->get(['hazard_level_id', 'level_name', 'color_code', 'severity_order']),
            'roles'             => Role::orderBy('role_name')->get(['role_id', 'role_name', 'description']),
        ]);
    }
}
