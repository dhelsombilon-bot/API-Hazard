<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $primaryKey = 'report_id';

    protected $fillable = [
        'report_type', 'generated_by', 'generated_at', 'file_path', 'file_url', 'parameters',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'parameters' => 'array',
    ];

    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by', 'user_id');
    }
}
