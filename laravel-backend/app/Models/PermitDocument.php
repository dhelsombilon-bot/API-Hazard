<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PermitDocument extends Model
{
    protected $primaryKey = 'permit_document_id';

    protected $fillable = [
        'permit_id', 'document_type_id', 'file_path', 'file_name',
        'document_reference', 'date_submitted', 'verification_status',
        'remarks', 'uploaded_by', 'uploaded_at',
    ];

    protected $casts = [
        'date_submitted' => 'date',
        'uploaded_at' => 'datetime',
    ];

    public function permit()
    {
        return $this->belongsTo(Permit::class, 'permit_id', 'permit_id');
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id', 'document_type_id');
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by', 'user_id');
    }
}
