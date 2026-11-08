<?php

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
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
