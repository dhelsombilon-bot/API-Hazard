<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BuildingHazardAssessment extends Model
{
    protected $primaryKey = 'hazard_assessment_id';

    protected $fillable = [
        'building_id', 'hazard_type_id', 'hazard_level', 'dataset_name',
        'assessment_date', 'assessment_notes',
    ];

    protected $casts = [
        'assessment_date' => 'date',
    ];

    public function building()
    {
        return $this->belongsTo(Building::class, 'building_id', 'building_id');
    }

    public function hazardType()
    {
        return $this->belongsTo(HazardType::class, 'hazard_type_id', 'hazard_type_id');
    }
}
