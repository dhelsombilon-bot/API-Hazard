<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitComplianceCheck extends Model
{
    protected $primaryKey = 'check_id';

    protected $fillable = [
        'permit_id', 'check_type', 'result', 'checked_by', 'checked_at', 'notes',
    ];

    protected $casts = [
        'checked_at' => 'datetime',
    ];

    public function permit()
    {
        return $this->belongsTo(Permit::class, 'permit_id', 'permit_id');
    }

    public function checkedBy()
    {
        return $this->belongsTo(User::class, 'checked_by', 'user_id');
    }

    public function findings()
    {
        return $this->hasMany(PermitFinding::class, 'check_id', 'check_id');
    }
}
