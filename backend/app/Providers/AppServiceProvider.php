<?php

namespace App\Providers;

use App\Providers\Contracts\FootballProvider;
use App\Providers\Contracts\OddsProvider;
use App\Providers\Fake\FakeFootballProvider;
use App\Providers\Fake\FakeOddsProvider;
use App\Providers\Real\ApiFootballOddsProvider;
use App\Providers\Real\ApiFootballProvider;
use App\Providers\Real\TheOddsApiProvider;
use Illuminate\Support\ServiceProvider;
use InvalidArgumentException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(OddsProvider::class, function (): OddsProvider {
            return match (config('services.pronofoot.odds_driver', 'fake')) {
                'fake' => $this->app->make(FakeOddsProvider::class),
                'real' => $this->app->make(TheOddsApiProvider::class),
                'api_football' => $this->app->make(ApiFootballOddsProvider::class),
                default => throw new InvalidArgumentException('ODDS_DRIVER doit être « fake », « real » ou « api_football ».'),
            };
        });

        $this->app->bind(FootballProvider::class, function (): FootballProvider {
            return match (config('services.pronofoot.football_driver', 'fake')) {
                'fake' => $this->app->make(FakeFootballProvider::class),
                'real' => $this->app->make(ApiFootballProvider::class),
                default => throw new InvalidArgumentException('FOOTBALL_DRIVER doit être « fake » ou « real ».'),
            };
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {}
}
