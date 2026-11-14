# PronoFoot — Application de l’annexe Phase 1 et de son complément 2

Sources :

- `docs/PRONOFOOT_Annexe_Phase1_Corrigee.pdf` (« décisions figées ») : vitalité, tendance, F121-E1/E2, F121-D, quota, matchs surveillés, 10 situations.
- `docs/PRONOFOOT_Annexe_Phase1_Complement2.pdf` : ordre de priorité des règles, données complètes des 10 situations (statistiques et cotes à T−2 min), pseudo-code du moteur.

## Règles appliquées

| Sujet | Règle | Paramètre |
|---|---|---|
| Vitalité (F166/F167) | Totaux des deux équipes, bornes incluses. Tirs ≥ 15 : 30, ≥ 8 : 20, ≥ 3 : 10. Cadrés ≥ 6 : 30, ≥ 3 : 20, ≥ 1 : 10. Possession de l’équipe la plus haute ≥ 60 % : 20, ≥ 50 % : 10. Corners ≥ 8 : 20, ≥ 4 : 10. Une statistique manquante rend l’indice non calculable, jamais 0. | `rules.vitality_normalization_references` |
| Vitalité | ≤ 40 « match mort » : abstention. | `rules.minimum_vitality` = 41 |
| Tendance | Variation de la cote du score suggéré (score après le but de l’équipe désignée) sur 2 minutes. | `tendance_source` |
| F162-Bis (baisse obligatoire) | Baisse de plus de 5 % : alerte Critique, **prioritaire sur l’écart**. | `tendance_seuil_stable` = 5 |
| Hausse | Variation > 0 : abstention. Une baisse faible ou une cote stable ne bloque plus. | — |
| F121-E1 (écart négatif) | Écart = cote du prochain but − cote du score actuel. Négatif : alerte Critique. | `alerts.level_negative_gap` |
| F121-G (filtre d’abstention) | Écart > 0.50 : abstention. | `rules.abstention_gap_threshold` = 0.50 |
| Alerte Haute | 0 < écart ≤ 0.50. | `alerts.level_positive_gap` |
| F121-E2 (mi-temps) | Under 2.5 (total du match) entre 1.15 et 1.40 inclus : Over 0.5 en 2e MT. Seule alerte possible à la mi-temps. | `rules.halftime_under25_min`, `rules.halftime_under25_max` |
| F121-D (match ouvert) | Score « élevé » et cotes des deux scores suivants ≤ 8.00 : Over 4.5. | `rules.open_match_min_goals` = 4, `rules.upcoming_score_odds_limit` = 8.00 |
| F121-A (1.50) et règle 0-0 du CDC | N’interviennent plus dans l’ordre de décision ; conservés comme paramètres inactifs. | `rules.maximum_directional_gap`, `rules.zero_zero_*` |

## Ordre de décision appliqué (modifiable : `rules.decision_pipeline`)

1. `F121-E2` — à la mi-temps : Under 2.5 entre 1.15 et 1.40 → alerte Mi-temps ; sinon abstention (aucune autre alerte à la mi-temps).
2. `F121-D` — au moins 4 buts et cotes à venir ≤ 8.00 → pari neutre Over 4.5.
3. `vitality` — vitalité ≤ 40 ou non calculable → abstention.
4. `trend_drop` — baisse de plus de 5 % → alerte Critique (F162-Bis).
5. `trend_rise` — hausse → abstention.
6. `gap_negative` — écart < 0 → alerte Critique (F121-E1).
7. `gap_too_high` — écart > 0.50 → abstention (F121-G).
8. `gap_small` — 0 < écart ≤ 0.50 → alerte Haute.
9. Sinon (écart nul) → abstention.

Étapes facultatives, désactivées par défaut :

- `minutes_remaining` (`rules.minutes_remaining_enabled`, N = `rules.minutes_remaining_min` = 10) : abstention s’il reste moins de N minutes sur 90. **Ne figure pas dans le pseudo-code du client ; à confirmer.** Insérée juste après F121-E2 quand elle est activée.
- `convergence` (`rules.convergence_enabled`) : une alerte sur une équipe exige un score de confiance supérieur au seuil du profil.

L’équipe désignée (dont on suit le « prochain but ») vient de F121-C (plus petit écart), remplacé par F121-C.2 si une équipe mène d’au moins deux buts.

## Écarts avec le pseudo-code du client (complément 2, section 4) — à confirmer

| # | Pseudo-code du client | Ordre appliqué | Pourquoi |
|---|---|---|---|
| 1 | Pas d’étape mi-temps : la vitalité est calculée d’abord. | F121-E2 en premier. | La situation 1 (mi-temps) n’a pas de statistiques ; l’annexe fait d’E2 la seule alerte possible à la mi-temps. |
| 2 | F121-D en 7e position, après les écarts. | F121-D en 2e position. | Avec l’ordre du client, la situation 9 donnerait une alerte Critique (baisse −7.6 %) et la situation 10 une abstention (écart 3.25 − 2.448 = +0.80 > 0.50), au lieu du pari neutre attendu. |
| 3 | « toutes_cotes_scores <= 8.00 », sans définir le score concerné. | Score d’au moins 4 buts (paramètre), cotes des deux scores suivants ≤ 8.00. | Le CDC cite 2-3 et 3-2 ; la situation 9 est à 2-2 (4 buts). Le seuil de 4 buts est à confirmer. |
| 4 | Pas d’étape « hausse ». | Hausse → abstention, avant l’écart. | Sans elle, la situation 5 (écart −2.07, hausse +1.5 %) donnerait une alerte Critique au lieu de l’abstention attendue. |
| 5 | « prochain_but » non défini. | Score suivant de l’équipe désignée (F121-C / C.2). | Nécessaire pour la situation 4 (but de Villarreal, équipe à l’extérieur). |
| 6 | Situation 7 expliquée par F121-G (écart +0.86 > 0.50). | Abstention à l’étape « hausse » (+1.6 %), avant F121-G. | Même décision, motif différent dans le Journal. |
| 7 | Écart nul : passe à F121-D puis abstention. | Abstention en fin d’ordre. | Même décision (situation 8). |
| 8 | Tendance supposée toujours disponible. | Tendance non calculable (pas d’instantané à −2 min) → abstention. | Comportement prudent, à confirmer. |
| 9 | Pas de règle de fin de match. | Règle facultative des minutes restantes, désactivée. | Demandée hors pseudo-code ; N = 10 à confirmer. |

Autres points à confirmer :

- Une baisse de **exactement** 5 % n’est pas « plus de 5 % » : pas de F162-Bis, le moteur passe à l’écart.
- Avec F162-Bis prioritaire, une forte baisse donne une alerte même si l’écart dépasse 0.50 : le « filtre » d’écart ne bloque plus dans ce cas, contrairement au critère d’acceptation du CDC Phase 1 (« aucune alerte si un des 3 filtres n’est pas validé »).
- Tendance calculée à travers un but : la référence d’il y a deux minutes peut précéder le but, ce qui crée une forte « baisse » mécanique (constaté en réel : −26 %). Avec F162-Bis, cela déclenche une alerte Critique juste après un but.

## Cote Under 2.5 réelle (pari 36)

Branchée d’après la capture réelle `backend/database/fixtures/api-football/odds-live-bet36.json` (13 novembre 2026, 43 matchs). Le pari 36 « Over/Under Line » donne des valeurs `Over`/`Under` avec un `handicap` texte égal au total de buts du match. Seule une valeur `Under` 2.5 unique et non suspendue est retenue ; la ligne 2.5 n’est pas toujours proposée (11 matchs sur 43). Le pari 36 n’est demandé que si un match suivi est à la mi-temps.

## Quota et matchs surveillés (annexe, sections 5 et 6)

| Sujet | Application | Paramètre |
|---|---|---|
| Seuil d’alerte | 10 % du quota journalier (`x-ratelimit-requests-limit`) ; alerte unique par le canal de notification. E-mail hors périmètre sans adresse fournie. | `scan.quota_economy_percent` |
| Fréquences (en permanence) | Matchs chauds toutes les 30 s, calmes toutes les 2 min, écart > 2.00 jamais scannés. Chaud = écart < 1.50 ou baisse de la cote suggérée de plus de 5 %. | `scan.hot_interval_seconds`, `scan.calm_interval_seconds`, `scan.hot_gap_threshold`, `scan.no_scan_gap_threshold` |
| Mode économie | Seuls les matchs chauds sont scannés. | — |
| Quota nul | « Quota épuisé. Le live est arrêté. Rechargez le quota. » | — |
| Suivi automatique | Ligues 39, 140, 135, 78, 61, 2, 3 ; seulement avec cotes de score exact et statistiques. | `scan.auto_mode`, `scan.auto_league_ids` |

À confirmer : écart entre 1.50 et 2.00 traité comme « calme » ; définition d’un match chaud ; seuil de 10 % inclus ; classement chaud / calme sur le dernier instantané (au plus 30 s de retard) ; pronostics pré-match absents en Phase 1.

## Les 10 situations (annexe section 7 et complément 2)

Tests : `backend/tests/Unit/AnnexSituationsTest.php`. Vitalité recalculée depuis les statistiques, tendance recalculée depuis la cote à T−2 min. **Les 10 passent.**

| N° | Match | Données clés | Décision obtenue | Attendu |
|---|---|---|---|---|
| 1 | Como – Man U, 45e | Mi-temps, Under 2.5 = 1.36 | Alerte Mi-temps (F121-E2) | ✓ |
| 2 | Real Madrid – Allemagne, 22e | Vitalité 50, tendance −3.2 %, écart −0.66 | Alerte Critique, Real (F121-E1) | ✓ |
| 3 | Grimsby – Cheltenham, 68e | Vitalité 70, tendance 0 %, écart −0.09 | Alerte Critique, Grimsby (F121-E1) | ✓ |
| 4 | Vallecano – Villarreal, 62e | Vitalité 80, tendance −4.4 %, écart +0.06 (Villarreal) | Alerte Haute, Villarreal | ✓ |
| 5 | Arsenal – Everton, 27e | Vitalité 70, tendance +1.6 % | Abstention (hausse) | ✓ |
| 6 | Arsenal – Everton, 64e | Vitalité 100, tendance −17.3 %, écart +0.18 | Alerte Critique, Arsenal (F162-Bis) | ✓ |
| 7 | Crewe – Wigan, 71e | Vitalité 60, tendance +1.6 %, écart +0.86 | Abstention (hausse) | ✓ |
| 8 | Rennes – Racing, 51e | 2 buts, vitalité 70, tendance 0 %, écart 0.00 | Abstention (écart nul) | ✓ |
| 9 | Atalanta – Frosinone, 43e | 2-2 (4 buts), 3-2 = 6.00, 2-3 = 8.00 | Pari neutre Over 4.5 (F121-D) | ✓ |
| 10 | Zagreb – NEC, 73e | 2-3 (5 buts), 3-3 = 3.25, 2-4 = 7.00 | Pari neutre Over 4.5 (F121-D) | ✓ |
