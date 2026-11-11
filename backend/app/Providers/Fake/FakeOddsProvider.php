<?php

namespace App\Providers\Fake;

use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\OddsFeed;
use App\Providers\Data\OddsMatch;

final class FakeOddsProvider implements OddsProvider
{
    public function __construct(private readonly FakeFixtureLoader $fixtures) {}

    public function getLiveOdds(int $scanNumber = 0): OddsFeed
    {
        $fixture = $this->fixtures->load();
        $matches = [];

        foreach ($fixture['matches'] as $match) {
            $timeline = $match['timeline'] ?? null;
            if (! is_array($timeline) || $timeline === []) {
                continue;
            }

            $snapshot = $timeline[min(max($scanNumber, 0), count($timeline) - 1)];
            $football = $snapshot['football'] ?? null;
            $odds = $snapshot['odds'] ?? null;
            if (! is_array($football) || ($football['status'] ?? null) !== 'live' || ! is_array($odds)) {
                continue;
            }

            $matches[] = new OddsMatch(
                providerMatchId: (string) $match['id'],
                exactScoreOdds: is_array($odds['exact_score_odds'] ?? null) ? $odds['exact_score_odds'] : [],
                overUnderOdds: is_array($odds['over_under_odds'] ?? null) ? $odds['over_under_odds'] : [],
                minute: isset($football['minute']) ? (int) $football['minute'] : null,
                homeScore: isset($football['home_score']) ? (int) $football['home_score'] : null,
                awayScore: isset($football['away_score']) ? (int) $football['away_score'] : null,
            );
        }

        return new OddsFeed(
            driver: 'fake',
            reachable: true,
            exactScoreMarketAvailable: collect($matches)->contains(fn (OddsMatch $match): bool => $match->exactScoreOdds !== []),
            overUnderMarketAvailable: collect($matches)->contains(fn (OddsMatch $match): bool => $match->overUnderOdds !== []),
            statusMessage: 'Simulation : cotes fictives déterministes, aucune API ni mise réelle.',
            matches: $matches,
            requestsUsed: 0,
            rawResponse: $this->fixtures->raw(),
            matchesWithExactScoreMarket: collect($matches)->filter(
                fn (OddsMatch $match): bool => $match->exactScoreOdds !== [],
            )->count(),
        );
    }
}
