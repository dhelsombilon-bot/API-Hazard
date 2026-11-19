<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PermitResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'permit_id'          => $this->permit_id,
            'permit_number'      => $this->permit_number,
            'issue_date'         => $this->issue_date?->toDateString(),
            'expiry_date'        => $this->expiry_date?->toDateString(),
            'is_expired'         => $this->is_expired,
            'issuing_authority'  => $this->issuing_authority,
            'permit_fee_amount'  => $this->permit_fee_amount,
            'remarks'            => $this->remarks,
            // Flat FK IDs (needed by edit forms)
            'building_id'        => $this->building_id,
            'permit_type_id'     => $this->permit_type_id,
            'permit_status_id'   => $this->permit_status_id,
            // Flat display strings (used by list/overview pages)
            'building_name'      => $this->building?->building_name,
            'building_code'      => $this->building?->building_code,
            'permit_type'        => $this->permitType?->type_name,
            'permit_status'      => $this->permitStatus?->status_name,
            'recorded_by'        => $this->whenLoaded('recordedBy', fn () => [
                'user_id'   => $this->recordedBy?->user_id,
                'full_name' => $this->recordedBy?->first_name.' '.$this->recordedBy?->last_name,
            ]),
            'documents'          => $this->whenLoaded('documents', function () {
                return $this->documents->map(fn ($d) => [
                    'permit_document_id'  => $d->permit_document_id,
                    'document_type_id'    => $d->document_type_id,
                    'document_type'       => $d->documentType?->document_name,
                    'is_present'          => ! empty($d->file_name) || ! empty($d->date_submitted),
                    'file_name'           => $d->file_name,
                    'uploaded_at'         => $d->uploaded_at?->toDateString() ?? $d->date_submitted?->toDateString(),
                    'verification_status' => $d->verification_status,
                ]);
            }),
            'compliance_checks'  => $this->whenLoaded('complianceChecks', function () {
                return $this->complianceChecks->map(fn ($c) => [
                    'check_id'   => $c->check_id,
                    'check_type' => $c->check_type,
                    'result'     => $c->result,
                    'checked_by' => $c->checkedBy ? trim("{$c->checkedBy->first_name} {$c->checkedBy->last_name}") : null,
                    'checked_at' => $c->checked_at?->toDateString(),
                    'notes'      => $c->notes,
                ]);
            }),
            'findings'           => $this->whenLoaded('findings', function () {
                return $this->findings->map(fn ($f) => [
                    'finding_id'       => $f->finding_id,
                    'description'      => $f->description,
                    'severity'         => $f->severity ?? 'Major',
                    'status'           => $f->status,
                    'reported_by'      => $f->reportedBy ? trim("{$f->reportedBy->first_name} {$f->reportedBy->last_name}") : null,
                    'reported_at'      => $f->reported_at?->toISOString(),
                    'resolution_notes' => $f->resolution_notes,
                ]);
            }),
            'findings_count'     => $this->whenLoaded('findings', fn () => $this->findings->count()),
            'created_at'         => $this->created_at?->toISOString(),
            'updated_at'         => $this->updated_at?->toISOString(),
        ];
    }
}
