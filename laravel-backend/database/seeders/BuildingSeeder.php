<?php

namespace Database\Seeders;

use App\Models\Barangay;
use App\Models\Building;
use App\Models\BuildingHazardAssessment;
use App\Models\BuildingStatus;
use App\Models\BuildingType;
use App\Models\HazardType;
use App\Models\User;
use Illuminate\Database\Seeder;

class BuildingSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@geopermit.test')->first();

        $bType  = fn($n) => BuildingType::where('type_name', $n)->value('building_type_id');
        $bStat  = fn($n) => BuildingStatus::where('status_name', $n)->value('building_status_id');
        $brgId  = fn($n) => Barangay::where('barangay_name', $n)->value('barangay_id');
        $hzType = fn($n) => HazardType::where('hazard_name', $n)->value('hazard_type_id');

        // Public buildings in Bongabong, Oriental Mindoro
        // Coordinates are within the municipality (~12.73–12.78°N, ~121.46–121.50°E)
        $buildings = [
            [
                'code' => 'GP-0001', 'name' => 'Municipal Health Center',
                'type' => 'Health Facility', 'status' => 'Verified',
                'barangay' => 'Poblacion', 'office' => 'Municipal Health Office',
                'lat' => 12.7518, 'lng' => 121.4872, 'elev' => 12, 'year' => 1998,
            ],
            [
                'code' => 'GP-0002', 'name' => 'Bongabong Public Market',
                'type' => 'Market', 'status' => 'Verified',
                'barangay' => 'Poblacion', 'office' => 'Municipal Treasury',
                'lat' => 12.7523, 'lng' => 121.4895, 'elev' => 8, 'year' => 2005,
            ],
            [
                'code' => 'GP-0003', 'name' => 'Municipal Hall',
                'type' => 'Government Office', 'status' => 'Verified',
                'barangay' => 'Poblacion', 'office' => "Mayor's Office",
                'lat' => 12.7510, 'lng' => 121.4860, 'elev' => 15, 'year' => 1985,
            ],
            [
                'code' => 'GP-0004', 'name' => 'Libertad Elementary School',
                'type' => 'Education', 'status' => 'Verified',
                'barangay' => 'Libertad', 'office' => 'DepEd',
                'lat' => 12.7598, 'lng' => 121.4762, 'elev' => 18, 'year' => 1992,
            ],
            [
                'code' => 'GP-0005', 'name' => 'San Isidro Barangay Hall',
                'type' => 'Barangay Hall', 'status' => 'Needs Review',
                'barangay' => 'San Isidro', 'office' => 'Barangay Council',
                'lat' => 12.7445, 'lng' => 121.4830, 'elev' => 22, 'year' => 2001,
            ],
            [
                'code' => 'GP-0006', 'name' => 'Masaguisi Health Station',
                'type' => 'Health Facility', 'status' => 'Verified',
                'barangay' => 'Masaguisi', 'office' => 'Municipal Health Office',
                'lat' => 12.7380, 'lng' => 121.4790, 'elev' => 25, 'year' => 2010,
            ],
            [
                'code' => 'GP-0007', 'name' => 'Camantigue Multi-Purpose Hall',
                'type' => 'Multipurpose Hall', 'status' => 'Needs Review',
                'barangay' => 'Camantigue', 'office' => 'Barangay Council',
                'lat' => 12.7350, 'lng' => 121.4750, 'elev' => 30, 'year' => 2015,
            ],
            [
                'code' => 'GP-0008', 'name' => 'Formon Elementary School',
                'type' => 'Education', 'status' => 'Verified',
                'barangay' => 'Formon', 'office' => 'DepEd',
                'lat' => 12.7290, 'lng' => 121.4700, 'elev' => 35, 'year' => 1988,
            ],
            [
                'code' => 'GP-0009', 'name' => 'Batangan Fire Station',
                'type' => 'Emergency Facility', 'status' => 'Verified',
                'barangay' => 'Batangan', 'office' => 'Bureau of Fire Protection',
                'lat' => 12.7648, 'lng' => 121.4728, 'elev' => 10, 'year' => 2012,
            ],
            [
                'code' => 'GP-0010', 'name' => 'Dayhagan Covered Court',
                'type' => 'Sports Facility', 'status' => 'Verified',
                'barangay' => 'Dayhagan', 'office' => 'Municipal Sports Office',
                'lat' => 12.7705, 'lng' => 121.4705, 'elev' => 9, 'year' => 2018,
            ],
            [
                'code' => 'GP-0011', 'name' => 'Bagumbayan I Barangay Hall',
                'type' => 'Barangay Hall', 'status' => 'Needs Review',
                'barangay' => 'Bagumbayan I', 'office' => 'Barangay Council',
                'lat' => 12.7572, 'lng' => 121.4755, 'elev' => 14, 'year' => 1999,
            ],
            [
                'code' => 'GP-0012', 'name' => 'Labasan Health Station',
                'type' => 'Health Facility', 'status' => 'Verified',
                'barangay' => 'Labasan', 'office' => 'Municipal Health Office',
                'lat' => 12.7692, 'lng' => 121.4710, 'elev' => 20, 'year' => 2008,
            ],
            [
                'code' => 'GP-0013', 'name' => 'Bongabong National High School',
                'type' => 'Education', 'status' => 'Verified',
                'barangay' => 'Poblacion', 'office' => 'DepEd',
                'lat' => 12.7535, 'lng' => 121.4878, 'elev' => 11, 'year' => 1975,
            ],
            [
                'code' => 'GP-0014', 'name' => 'Poblacion Day Care Center',
                'type' => 'Education', 'status' => 'Verified',
                'barangay' => 'Poblacion', 'office' => 'DSWD',
                'lat' => 12.7505, 'lng' => 121.4852, 'elev' => 13, 'year' => 2003,
            ],
            [
                'code' => 'GP-0015', 'name' => 'Rural Health Unit II – Libertad',
                'type' => 'Health Facility', 'status' => 'Needs Review',
                'barangay' => 'Libertad', 'office' => 'Municipal Health Office',
                'lat' => 12.7605, 'lng' => 121.4758, 'elev' => 17, 'year' => 2007,
            ],
        ];

        $hazardData = [
            'GP-0001' => [['Flood', 'Low'], ['Landslide', 'Low']],
            'GP-0002' => [['Flood', 'Moderate'], ['Storm Surge', 'Moderate']],
            'GP-0003' => [['Flood', 'Low']],
            'GP-0004' => [['Flood', 'Low']],
            'GP-0005' => [['Flood', 'Moderate-to-High'], ['Landslide', 'Moderate']],
            'GP-0006' => [['Landslide', 'Low'], ['Flood', 'Low']],
            'GP-0007' => [['Flood', 'High'], ['Landslide', 'Moderate-to-High']],
            'GP-0008' => [['Landslide', 'Low'], ['Flood', 'Low']],
            'GP-0009' => [['Flood', 'Moderate-to-High']],
            'GP-0010' => [['Flood', 'Low']],
            'GP-0011' => [['Flood', 'High']],
            'GP-0012' => [['Flood', 'Low']],
            'GP-0013' => [['Flood', 'Low']],
            'GP-0014' => [['Flood', 'Low']],
            'GP-0015' => [['Flood', 'Moderate-to-High']],
        ];

        foreach ($buildings as $bd) {
            $building = Building::firstOrCreate(
                ['building_code' => $bd['code']],
                [
                    'building_name'      => $bd['name'],
                    'building_type_id'   => $bType($bd['type']),
                    'building_status_id' => $bStat($bd['status']),
                    'barangay_id'        => $brgId($bd['barangay']),
                    'managing_office'    => $bd['office'],
                    'latitude'           => $bd['lat'],
                    'longitude'          => $bd['lng'],
                    'elevation_m'        => $bd['elev'],
                    'year_built'         => $bd['year'],
                    'coordinate_source'  => 'GPS',
                    'created_by'         => $admin?->user_id,
                    'verified_at'        => now(),
                    'verified_by'        => $admin?->user_id,
                ]
            );

            if ($building->wasRecentlyCreated && isset($hazardData[$bd['code']])) {
                foreach ($hazardData[$bd['code']] as [$hazardName, $level]) {
                    BuildingHazardAssessment::create([
                        'building_id'      => $building->building_id,
                        'hazard_type_id'   => $hzType($hazardName),
                        'hazard_level'     => $level,
                        'dataset_name'     => $hazardName === 'Flood' ? 'PAGASA Flood Map 2022' : 'MGB Landslide Map 2021',
                        'assessment_date'  => '2022-06-01',
                        'assessment_notes' => '',
                    ]);
                }
            }
        }
    }
}
