<?php

namespace App\Providers\Fake;

use App\Providers\Contracts\OddsProvider;
use App\Providers\Data\OddsFeed;
use App\Providers\Data\OddsMatch;

final class FakeOddsProvider implements OddsProvider
{
    public function getOverLineOdds(): array
    {
        $lines = [];
        foreach ($this->fixtures->load()['matches'] as $match) {
            foreach (is_array($match['timeline'] ?? null) ? $match['timeline'] : [] as $snapshot) {
                if (is_array($snapshot['odds']['over_line_odds'] ?? null)) {
                    $lines[(string) $match['id']] = array_map('floatval', $snapshot['odds']['over_line_odds']);
                }
            }
        }

        return $lines;
    }

    public function __construct(private readonly FakeFixtureLoader $fixtures) {}

    public function getLiveOdds(int $scanNumber = 0, bool $includeUnder25 = false): OddsFeed
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
            if (! is_array($football) || ! in_array($football['status'] ?? null, ['live', 'halftime'], true) || ! is_array($odds)) {
                continue;
            }

            $matches[] = new OddsMatch(
                providerMatchId: (string) $match['id'],
                exactScoreOdds: is_array($odds['exact_score_odds'] ?? null) ? $odds['exact_score_odds'] : [],
                overUnderOdds: is_array($odds['over_under_odds'] ?? null) ? $odds['over_under_odds'] : [],
                minute: isset($football['minute']) ? (int) $football['minute'] : null,
                homeScore: isset($football['home_score']) ? (int) $football['home_score'] : null,
                awayScore: isset($football['away_score']) ? (int) $football['away_score'] : null,
                stopped: ($football['status'] ?? null) === 'halftime',
                under25Odds: $includeUnder25 && is_numeric($odds['under_2_5_odds'] ?? null) ? (float) $odds['under_2_5_odds'] : null,
                overLineOdds: is_array($odds['over_line_odds'] ?? null) ? array_map('floatval', $odds['over_line_odds']) : [],
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
