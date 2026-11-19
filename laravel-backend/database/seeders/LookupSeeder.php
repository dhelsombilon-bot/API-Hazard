<?php

namespace Database\Seeders;

use App\Models\Barangay;
use App\Models\BuildingStatus;
use App\Models\BuildingType;
use App\Models\DocumentType;
use App\Models\HazardLevel;
use App\Models\HazardType;
use App\Models\PermitStatus;
use App\Models\PermitType;
use Illuminate\Database\Seeder;

class LookupSeeder extends Seeder
{
    public function run(): void
    {
        // Official barangays of Bongabong, Oriental Mindoro (PhilAtlas / PSA, 36 total)
        $barangays = [
            'Anilao', 'Aplaya', 'Bagumbayan I', 'Bagumbayan II', 'Batangan',
            'Bukal', 'Camantigue', 'Carmundo', 'Cawayan', 'Dayhagan',
            'Formon', 'Hagan', 'Hagupit', 'Ipil', 'Kaligtasan',
            'Labasan', 'Labonan', 'Libertad', 'Lisap', 'Luna',
            'Malitbog', 'Mapang', 'Masaguisi', 'Mina de Oro', 'Morente',
            'Ogbot', 'Orconuma', 'Poblacion', 'Polusahi', 'Sagana',
            'San Isidro', 'San Jose', 'San Juan', 'Santa Cruz', 'Sigange',
            'Tawas',
        ];

        foreach ($barangays as $name) {
            Barangay::firstOrCreate(['barangay_name' => $name]);
        }

        // Building types
        $buildingTypes = [
            'Health Facility', 'Government Office', 'Market',
            'Education', 'Emergency Facility', 'Sports Facility',
            'Multipurpose Hall', 'Barangay Hall', 'Church / Religious',
            'Commercial Building', 'Infrastructure / Utility',
        ];

        foreach ($buildingTypes as $type) {
            BuildingType::firstOrCreate(['type_name' => $type]);
        }

        // Building statuses
        $buildingStatuses = [
            'Verified', 'Needs Review', 'For Assessment',
            'Under Construction', 'Under Renovation', 'Condemned',
        ];

        foreach ($buildingStatuses as $status) {
            BuildingStatus::firstOrCreate(['status_name' => $status]);
        }

        // Permit types
        $permitTypes = [
            'Building Permit', 'Occupancy Permit', 'Electrical Permit',
            'Plumbing Permit', 'Demolition Permit', 'Fencing Permit',
            'Renovation Permit', 'Signage Permit',
        ];

        foreach ($permitTypes as $type) {
            PermitType::firstOrCreate(['type_name' => $type]);
        }

        // Permit statuses
        $permitStatuses = [
            'Compliant', 'Incomplete', 'For Review',
            'Expired', 'Revoked', 'Pending',
        ];

        foreach ($permitStatuses as $status) {
            PermitStatus::firstOrCreate(['status_name' => $status]);
        }

        // Document types
        $documentTypes = [
            ['document_name' => 'Building Permit',         'is_required' => true],
            ['document_name' => 'Occupancy Permit',        'is_required' => true],
            ['document_name' => 'Fire Safety Certificate', 'is_required' => true],
            ['document_name' => 'Sanitary Permit',         'is_required' => true],
            ['document_name' => 'Electrical Permit',       'is_required' => false],
            ['document_name' => 'Plumbing Permit',         'is_required' => false],
            ['document_name' => 'Structural Analysis',     'is_required' => false],
            ['document_name' => 'Environmental Clearance', 'is_required' => false],
        ];

        foreach ($documentTypes as $doc) {
            DocumentType::firstOrCreate(['document_name' => $doc['document_name']], $doc);
        }

        // Hazard types relevant to Oriental Mindoro
        $hazardTypes = [
            'Flood', 'Landslide', 'Storm Surge',
            'Earthquake', 'Tsunami', 'Volcanic Activity',
        ];

        foreach ($hazardTypes as $hazard) {
            HazardType::firstOrCreate(['hazard_name' => $hazard]);
        }

        // Hazard levels
        $hazardLevels = [
            ['level_name' => 'Low',              'color_code' => '#4CAF50', 'severity_order' => 1],
            ['level_name' => 'Moderate',         'color_code' => '#FFEB3B', 'severity_order' => 2],
            ['level_name' => 'Moderate-to-High', 'color_code' => '#FF9800', 'severity_order' => 3],
            ['level_name' => 'High',             'color_code' => '#F44336', 'severity_order' => 4],
            ['level_name' => 'Very High',        'color_code' => '#9C27B0', 'severity_order' => 5],
        ];

        foreach ($hazardLevels as $level) {
            HazardLevel::firstOrCreate(['level_name' => $level['level_name']], $level);
        }
    }
}
