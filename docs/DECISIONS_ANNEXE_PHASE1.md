# PronoFoot — Application de l’annexe Phase 1 corrigée

Source : `docs/PRONOFOOT_Annexe_Phase1_Corrigee.pdf` (novembre 2026, « décisions figées »). Elle remplace les points « à confirmer » du CDC Phase 1 sur la vitalité, la tendance, F121-E et le quota.

## Règles appliquées telles qu’écrites dans l’annexe

| Sujet | Règle | Paramètre |
|---|---|---|
| Vitalité (F166/F167) | Totaux des deux équipes, bornes incluses. Tirs ≥ 15 : 30, ≥ 8 : 20, ≥ 3 : 10. Cadrés ≥ 6 : 30, ≥ 3 : 20, ≥ 1 : 10. Possession de l’équipe la plus haute ≥ 60 % : 20, ≥ 50 % : 10. Corners ≥ 8 : 20, ≥ 4 : 10. | `rules.vitality_normalization_references` |
| Décision vitalité | ≤ 40 « mort » (abstention), ≥ 41 « vivant ». Une statistique manquante rend l’indice non calculable, jamais 0. | `rules.minimum_vitality` = 41 |
| Tendance | Cote du score suggéré (score après le but de l’équipe désignée). Baisse de plus de 5 % : validée. Variation inférieure à 5 % ou hausse : abstention. | `tendance_source`, `tendance_seuil_stable` = 5 |
| F121-E1 | Écart = cote du prochain but − cote du score actuel. Négatif : alerte critique. Positif ou nul : pas de signal E1. | `alerts.level_negative_gap` |
| F121-E2 | À la mi-temps, Under 2.5 (total du match) entre 1.15 et 1.40 inclus : Over 0.5 en 2e mi-temps. Seule alerte possible à la mi-temps. | `rules.halftime_under25_min`, `rules.halftime_under25_max` |
| F121-D | Cotes des scores suivants ≤ 8.00 (inclus) : Over 4.5. | `rules.upcoming_score_odds_limit` = 8.00 |

## À confirmer par le client

1. **Ordre de décision.** Il est déduit des exemples du client ; ce n’est pas une règle écrite. Il est paramétrable (`rules.decision_pipeline`) :
   1. F121-E2 à la mi-temps ;
   2. F121-D ;
   3. désignation de l’équipe (F121-C, puis F121-C.2 si une équipe mène de deux buts ou plus) ;
   4. vitalité ≥ 41, sinon abstention ;
   5. tendance : baisse de plus de 5 %, sinon abstention ;
   6. écart : négatif → alerte Critique ; strictement entre 0 et 1.50 → alerte Haute ; exactement 0 ou ≥ 1.50 → abstention.

   F121-E2 et F121-D décident dès qu’ils produisent un signal. Une étape facultative `convergence` peut être ajoutée ; elle n’est pas dans l’ordre par défaut, car l’annexe ne la mentionne pas.
2. **Baisse exactement égale à 5 %** : non tranchée par l’annexe, traitée comme une abstention.
3. **Scores couverts par F121-D** : le CDC cite 2-3 et 3-2 ; la situation 9 de l’annexe attend Over 4.5 à 2-2. La liste `rules.open_match_scores` vaut donc 2-2, 2-3 et 3-2, et doit être confirmée.
4. **Seuil 0-0 (F121-R)** : la règle du CDC (cote du 0-0 sous 2.50, écart requis sous 1.00) est conservée pour l’alerte Haute ; l’annexe ne la remet pas en cause.
5. **Cote Under 2.5 réelle** : le pari API-Football « Over/Under Line » (id 36) n’apparaît dans aucune capture. Seul le pilote fictif fournit cette cote. Lancer `php artisan api-football:capture --fixture=<id> --bet36` pendant un match en direct, puis brancher le pilote réel après lecture de la vraie réponse.

## Quota et matchs surveillés (annexe, sections 5 et 6)

| Sujet | Application | Paramètre |
|---|---|---|
| Seuil d’alerte | 10 % du quota journalier (`x-ratelimit-requests-limit`) ; alerte unique par le canal de notification. E-mail hors périmètre sans adresse fournie. | `scan.quota_economy_percent` |
| Mode économie | Matchs chauds (écart < 1.50 ou baisse de cote) toutes les 30 s, calmes toutes les 2 min, écart > 2.00 non scannés. | `scan.hot_interval_seconds`, `scan.calm_interval_seconds`, `scan.hot_gap_threshold`, `scan.no_scan_gap_threshold` |
| Quota nul | « Quota épuisé. Le live est arrêté. Rechargez le quota. » | — |
| Suivi automatique | Ligues 39, 140, 135, 78, 61, 2, 3 ; seulement avec cotes de score exact et statistiques. | `scan.auto_mode`, `scan.auto_league_ids` |

À confirmer :

1. Écart entre 1.50 et 2.00 : traité comme « calme ».
2. « Baisse de cote » pour un match chaud : toute variation négative de la cote du score suggéré, sans seuil.
3. Le seuil de 10 % est atteint dès que les requêtes restantes sont inférieures **ou égales** à 10 % (l’annexe cite « 1 000 sur 10 000 » comme moment de l’alerte).
4. Les fréquences chaud/calme ne s’appliquent qu’en mode économie ; hors économie, le scan garde ses cadences du CDC (cotes 30 s, statistiques 60 s).
5. Les pronostics pré-match cités par l’annexe n’existent pas en Phase 1 ; rien n’est affiché à ce titre.

## Les 10 situations de l’annexe (section 7)

Tests : `backend/tests/Unit/AnnexSituationsTest.php`.

| N° | Match | Attendu | État du test |
|---|---|---|---|
| 1 | Como – Man U | Alerte mi-temps : Over 0.5 2e MT | Réussi |
| 2 | Real Madrid – Allemagne | Alerte Critique : prochain but Real | Réussi sur les étapes dont l’annexe fournit les données (désignation et écart). Vitalité et tendance absentes : la décision complète attend le fichier Excel. |
| 3 | Grimsby – Cheltenham | Alerte Critique : prochain but Grimsby | Idem situation 2 |
| 4 | Vallecano – Villarreal | Alerte Haute : Villarreal | En attente du fichier Excel (vitalité, cote à −2 min) |
| 5 | Arsenal – Everton 27′ | Abstention : cote stable | En attente du fichier Excel |
| 6 | Arsenal – Everton 64′ | Alerte Critique : Arsenal | En attente ; **incohérente** avec les règles écrites (écart 3.10 − 2.92 = +0.18, positif) |
| 7 | Crewe – Wigan | Abstention : écart positif (+0.86) | En attente ; **incohérente** avec l’étape 6 (0 < 0.86 < 1.50 donne une alerte Haute) |
| 8 | Rennes – Racing | Abstention : écart neutre (0.00) | En attente du fichier Excel |
| 9 | Atalanta – Frosinone | Pari neutre : Over 4.5 | Réussi (score 2-2) |
| 10 | Zagreb – NEC | Pari neutre : Over 4.5 | Réussi |
