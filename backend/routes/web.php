<?php

use App\Http\Controllers\Admin\Api\AdminDashboardController;
use App\Http\Controllers\Admin\Api\AdminStatisticsController;
use App\Http\Controllers\Admin\Api\OpportunityLogController;
use App\Http\Controllers\Admin\Api\RuleProfileController;
use App\Http\Controllers\Admin\Api\SettingsController;
use App\Http\Controllers\Admin\Api\TrackedMatchController;
use App\Http\Controllers\Admin\NotificationTestController;
use App\Http\Controllers\Admin\RuleSimulationController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Middleware\EnsureAdministrator;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('login.store');
});

Route::middleware(['auth', EnsureAdministrator::class])->group(function () {
    Route::view('/admin', 'admin.dashboard')->name('admin.dashboard');
    Route::post('/admin/rule-test', RuleSimulationController::class)->name('admin.rule-test');
    Route::post('/admin/notifications/test', NotificationTestController::class)
        ->middleware('throttle:3,1')
        ->name('admin.notifications.test');
    Route::prefix('/admin/api')->name('admin.api.')->middleware('throttle:60,1')->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
        Route::get('/matches', [TrackedMatchController::class, 'index'])->name('matches.index');
        Route::post('/matches', [TrackedMatchController::class, 'store'])->name('matches.store');
        Route::delete('/matches/{trackedMatch}', [TrackedMatchController::class, 'destroy'])->name('matches.destroy');
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::patch('/settings', [SettingsController::class, 'update'])->name('settings.update');
        Route::post('/settings/reset', [SettingsController::class, 'reset'])->name('settings.reset');
        Route::get('/settings/history', [SettingsController::class, 'history'])->name('settings.history');
        Route::get('/rule-profile', [RuleProfileController::class, 'show'])->name('rule-profile.show');
        Route::put('/rule-profile', [RuleProfileController::class, 'update'])->name('rule-profile.update');
        Route::get('/journal', [OpportunityLogController::class, 'index'])->name('journal.index');
        Route::patch('/journal/{opportunityLog}/outcome', [OpportunityLogController::class, 'updateOutcome'])->name('journal.outcome');
        Route::get('/statistics', AdminStatisticsController::class)->name('statistics');
    });
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
