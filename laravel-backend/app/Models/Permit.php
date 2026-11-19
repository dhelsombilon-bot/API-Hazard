<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permit extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'permit_id';

    protected $fillable = [
        'permit_number', 'building_id', 'permit_type_id', 'permit_status_id',
        'issue_date', 'expiry_date', 'issuing_authority', 'permit_fee_amount',
        'remarks', 'recorded_by',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiry_date' => 'date',
        'permit_fee_amount' => 'decimal:2',
    ];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id', 'building_id');
    }

    public function permitType()
    {
        return $this->belongsTo(PermitType::class, 'permit_type_id', 'permit_type_id');
    }

    public function permitStatus()
    {
        return $this->belongsTo(PermitStatus::class, 'permit_status_id', 'permit_status_id');
    }

    public function recordedBy()
    {
        return $this->belongsTo(User::class, 'recorded_by', 'user_id');
    }

    public function documents()
    {
        return $this->hasMany(PermitDocument::class, 'permit_id', 'permit_id');
    }

    public function complianceChecks()
    {
        return $this->hasMany(PermitComplianceCheck::class, 'permit_id', 'permit_id');
    }

    public function findings()
    {
        return $this->hasMany(PermitFinding::class, 'permit_id', 'permit_id');
    }

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }
}
