<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BuildingController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HazardLayerController;
use App\Http\Controllers\Api\LookupController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PermitController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('v1.')->group(function () {

    // -------------------------------------------------------------------------
    // Auth (Step 4)
    // -------------------------------------------------------------------------
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('login',           [AuthController::class, 'login'])->name('login');
        Route::post('register',        [AuthController::class, 'register'])->name('register');
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('me',      [AuthController::class, 'me'])->name('me');
            Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        });
    });

    Route::middleware('auth:sanctum')->group(function () {

        // -------------------------------------------------------------------------
        // Lookups (Step 17) — combined endpoint + individual
        // -------------------------------------------------------------------------
        Route::get('lookups', [LookupController::class, 'all'])->name('lookups.all');

        Route::prefix('lookups')->name('lookups.')->group(function () {
            Route::get('barangays',         [LookupController::class, 'barangays'])->name('barangays');
            Route::get('building-types',    [LookupController::class, 'buildingTypes'])->name('building-types');
            Route::get('building-statuses', [LookupController::class, 'buildingStatuses'])->name('building-statuses');
            Route::get('permit-types',      [LookupController::class, 'permitTypes'])->name('permit-types');
            Route::get('permit-statuses',   [LookupController::class, 'permitStatuses'])->name('permit-statuses');
            Route::get('document-types',    [LookupController::class, 'documentTypes'])->name('document-types');
            Route::get('hazard-types',      [LookupController::class, 'hazardTypes'])->name('hazard-types');
            Route::get('hazard-levels',     [LookupController::class, 'hazardLevels'])->name('hazard-levels');
            Route::get('roles',             [LookupController::class, 'roles'])->name('roles');
        });

        // -------------------------------------------------------------------------
        // Dashboard (Step 20)
        // -------------------------------------------------------------------------
        Route::get('dashboard/stats', [DashboardController::class, 'stats'])->name('dashboard.stats');

        // -------------------------------------------------------------------------
        // Buildings (Steps 9-10) — geojson BEFORE {building}
        // -------------------------------------------------------------------------
        Route::get('buildings/geojson',      [BuildingController::class, 'geojson'])->name('buildings.geojson');
        Route::get('buildings',              [BuildingController::class, 'index'])->name('buildings.index');
        Route::post('buildings',             [BuildingController::class, 'store'])->name('buildings.store');
        Route::get('buildings/{building}',   [BuildingController::class, 'show'])->name('buildings.show');
        Route::put('buildings/{building}',   [BuildingController::class, 'update'])->name('buildings.update');
        Route::delete('buildings/{building}',[BuildingController::class, 'destroy'])->name('buildings.destroy');

        // -------------------------------------------------------------------------
        // Permits (Steps 12-13)
        // -------------------------------------------------------------------------
        Route::get('permits',           [PermitController::class, 'index'])->name('permits.index');
        Route::post('permits',          [PermitController::class, 'store'])->name('permits.store');
        Route::get('permits/{permit}',  [PermitController::class, 'show'])->name('permits.show');
        Route::put('permits/{permit}',  [PermitController::class, 'update'])->name('permits.update');
        Route::delete('permits/{permit}',[PermitController::class, 'destroy'])->name('permits.destroy');

        // Findings resolve
        Route::put('findings/{finding}', [PermitController::class, 'resolveFind'])->name('findings.resolve');

        // -------------------------------------------------------------------------
        // Hazard layers (Steps 15-16) + map helpers
        // -------------------------------------------------------------------------
        Route::get('hazards/layers',  [HazardLayerController::class, 'layersForMap'])->name('hazards.layers');
        Route::get('hazards/assess',  [HazardLayerController::class, 'assess'])->name('hazards.assess');
        Route::get('landscape/layers',[HazardLayerController::class, 'landscapeLayers'])->name('landscape.layers');

        Route::get('hazard-layers',              [HazardLayerController::class, 'index'])->name('hazard-layers.index');
        Route::post('hazard-layers',             [HazardLayerController::class, 'store'])->name('hazard-layers.store');
        Route::get('hazard-layers/{layer}',      [HazardLayerController::class, 'show'])->name('hazard-layers.show');
        Route::put('hazard-layers/{layer}',      [HazardLayerController::class, 'update'])->name('hazard-layers.update');
        Route::delete('hazard-layers/{layer}',   [HazardLayerController::class, 'destroy'])->name('hazard-layers.destroy');

        // -------------------------------------------------------------------------
        // Users (Steps 18-19)
        // -------------------------------------------------------------------------
        Route::get('users',          [UserController::class, 'index'])->name('users.index');
        Route::post('users',         [UserController::class, 'store'])->name('users.store');
        Route::get('users/{user}',   [UserController::class, 'show'])->name('users.show');
        Route::put('users/{user}',   [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}',[UserController::class, 'destroy'])->name('users.destroy');

        // -------------------------------------------------------------------------
        // Reports — preview & download BEFORE {report}
        // -------------------------------------------------------------------------
        Route::get('reports/preview',             [ReportController::class, 'preview'])->name('reports.preview');
        Route::get('reports',                     [ReportController::class, 'index'])->name('reports.index');
        Route::post('reports',                    [ReportController::class, 'generate'])->name('reports.generate');
        Route::get('reports/{report}/download',   [ReportController::class, 'download'])->name('reports.download');

        // -------------------------------------------------------------------------
        // Notifications
        // -------------------------------------------------------------------------
        Route::get('notifications',           [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('notifications/read',     [NotificationController::class, 'markRead'])->name('notifications.read');
        Route::post('notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.read-all');
    });
});
