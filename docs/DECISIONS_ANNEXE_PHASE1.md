# PronoFoot — Application de l’annexe Phase 1 et de ses compléments 2 et 4

Sources :

- `docs/PRONOFOOT_Annexe_Phase1_Corrigee.pdf` (« décisions figées ») : vitalité, tendance, F121-E1/E2, F121-D, quota, matchs surveillés, 10 situations.
- `docs/PRONOFOOT_Annexe_Phase1_Complement2.pdf` : ordre de priorité des règles, données complètes des 10 situations (statistiques et cotes à T−2 min), pseudo-code du moteur.
- `docs/PRONOFOOT_Annexe_Phase1_Complement4.pdf` : gestion des cotes après un but (remplace le complément 3, `docs/PRONOFOOT_Annexe_Phase1_Complement3.pdf`, conservé pour mémoire).

## Règles appliquées

| Sujet | Règle | Paramètre |
|---|---|---|
| Vitalité (F166/F167) | Totaux des deux équipes, bornes incluses. Tirs ≥ 15 : 30, ≥ 8 : 20, ≥ 3 : 10. Cadrés ≥ 6 : 30, ≥ 3 : 20, ≥ 1 : 10. Possession de l’équipe la plus haute ≥ 60 % : 20, ≥ 50 % : 10. Corners ≥ 8 : 20, ≥ 4 : 10. Une statistique manquante rend l’indice non calculable, jamais 0. | `rules.vitality_normalization_references` |
| Vitalité | ≤ 40 « match mort » : abstention. | `rules.minimum_vitality` = 41 |
| Tendance | Pour **chaque équipe** : variation sur 2 minutes de la cote du score de son prochain but (domicile h+1-a, extérieur h-a+1). | `tendance_source` |
| F162-Bis (baisse obligatoire) | Baisse de plus de 5 % : alerte Critique. Depuis le 25 novembre 2026, si **une seule équipe** est en signal, l’écart doit être ≤ 0.50 (voir « F162-Bis exige un écart »). | `tendance_seuil_stable` = 5, `rules.strong_drop_requires_gap` = activé |
| Hausse | Variation > 0 : abstention. Une baisse faible ou une cote stable ne bloque plus. | — |
| F121-E1 (écart négatif) | Écart = cote du prochain but − cote du score actuel. Négatif : alerte Critique. | `alerts.level_negative_gap` |
| F121-G (filtre d’abstention) | Écart > 0.50 : abstention. | `rules.abstention_gap_threshold` = 0.50 |
| Alerte Haute | 0 < écart ≤ 0.50. | `alerts.level_positive_gap` |
| F121-E2 (mi-temps) | Under 2.5 (total du match) entre 1.15 et 1.40 inclus : Over 0.5 en 2e MT. Seule alerte possible à la mi-temps. | `rules.halftime_under25_min`, `rules.halftime_under25_max` |
| F121-D (match ouvert) | Au moins 4 buts et cotes des deux scores suivants ≤ 8.00 (inclus) : Over 4.5. Confirmé par le client le 22 novembre 2026. | `rules.open_match_min_goals` = 4, `rules.upcoming_score_odds_limit` = 8.00 |
| F121-A (1.50) et règle 0-0 du CDC | N’interviennent plus dans l’ordre de décision ; conservés comme paramètres inactifs. | `rules.maximum_directional_gap`, `rules.zero_zero_*` |

## Ordre de décision appliqué (modifiable : `rules.decision_pipeline`)

1. `F121-E2` — à la mi-temps : Under 2.5 entre 1.15 et 1.40 → alerte Mi-temps ; sinon abstention (aucune autre alerte à la mi-temps).
2. `F121-D` — au moins 4 buts et cotes à venir ≤ 8.00 → pari neutre Over 4.5.
3. `vitality` — vitalité ≤ 40 ou non calculable → abstention.
4. `trend_drop` — baisse de plus de 5 % → alerte Critique (F162-Bis) ; retirée ensuite si une seule équipe est en signal et que son écart dépasse 0.50.
5. `trend_rise` — hausse → abstention.
6. `gap_negative` — écart < 0 → alerte Critique (F121-E1).
7. `gap_too_high` — écart > 0.50 → abstention (F121-G).
8. `gap_small` — 0 < écart ≤ 0.50 → alerte Haute.
9. Sinon (écart nul) → abstention.

Étapes facultatives, désactivées par défaut :

- `minutes_remaining` (`rules.minutes_remaining_enabled`, N = `rules.minutes_remaining_min` = 10) : abstention s’il reste moins de N minutes sur 90. **Ne figure pas dans le pseudo-code du client ; à confirmer.** Insérée juste après F121-E2 quand elle est activée.
- `convergence` (`rules.convergence_enabled`, **désactivée**) : une alerte sur une équipe exige un score de confiance supérieur au seuil du profil. Désactivée, le score est seulement calculé et affiché (voir « Score de confiance automatique »).

Les étapes 1 à 3 (et les facultatives `minutes_remaining`, `convergence`) sont communes au match. Les étapes 4 à 9 sont appliquées **à chaque équipe** (voir ci-dessous).

## Règle F121 pour les deux équipes (retour du client, 20 novembre 2026)

Avant, seule l’équipe « désignée » (F121-C : plus petit écart, ou F121-C.2 si une équipe mène de deux buts) était évaluée : après un but, le moteur s’abstenait souvent (« aucune équipe désignée »). Désormais :

| Point | Application |
|---|---|
| Deux candidats à chaque relevé | Domicile : prochain but à domicile (score h+1-a). Extérieur : prochain but à l’extérieur (score h-a+1). |
| Écart de chaque équipe | Cote du score de son prochain but − cote du score actuel. |
| Tendance de chaque équipe | Variation de la cote de ce score par rapport au relevé d’il y a 2 minutes ; après un but, par rapport à la première cote après le but (complément 4, une référence par équipe). |
| Ordre de décision | Étapes 4 à 9 appliquées à chaque équipe (forte baisse, hausse, écart négatif, écart > 0.50, petit écart). Vitalité, E2 et F121-D restent communs au match. |
| Résultat du match (règle du client, 21 novembre 2026) | **Une seule équipe en signal** : deux options, la ciblée en premier — option 1 « prochain but [équipe] » (score suggéré, cote, écart, niveau), option 2 neutre « un but de plus dans le match » (Over buts actuels + 0,5 : 1-0 → Over 1.5, 2-2 → Over 4.5, avec sa cote si le marché Over/Under est disponible, sinon sans cote). **Les deux équipes en signal** : pas d’équipe désignée, option neutre seule ; les écarts des deux équipes figurent dans la justification ; niveau et règle du signal le plus grave. **Aucun signal** : abstention, aucune option. Aucune option n’est jouée automatiquement. |
| Alerte (Telegram et Journal) | Montre les options : « Option 1 (ciblée) : prochain but Sénégal — score 2-0, cote 3.50, écart +0.70 », « Option 2 (neutre) : un but de plus dans le match — Over 1.5, cote non disponible », « Aucune option n’est jouée automatiquement. ». Anti-doublon : une alerte active par match, règle et sélection (l’équipe, ou le pari neutre « Over 1.5 buts »). |
| Cote de l’option neutre | Lue dans le pari 36 (« Over/Under Line ») d’API-Football, ligne Over (buts actuels + 0,5). Demandée **une seule fois, à la création d’une alerte**, jamais à chaque relevé ; la réponse est gardée 60 secondes (plusieurs alertes créées dans la minute partagent la même requête). Marché indisponible : « cote non disponible ». |
| F121-D | Inchangée : Over 4.5, sans option ciblée. |
| F121-X (écart croisé) | \|écart domicile − écart extérieur\| < 1.00 et match ouvert (au moins 4 buts, seuil de F121-D) → pari neutre « un but de plus ». **Désactivée par défaut, à confirmer** (définition du « match ouvert » à confirmer). | `rules.f121x_enabled`, `rules.f121x_cross_gap_max` = 1.00 |
| F121-C.2 (suivre le leader) | Si une équipe mène de 2 buts ou plus, seule elle est évaluée. **Désactivée par défaut, à confirmer.** Active seulement si le paramètre est activé et la case F121-C.2 cochée dans le profil actif. | `rules.follow_leader_enabled` |
| Justification au Journal | Les deux côtés : « Domicile (2-0) : cote 3.20, écart +0.91, tendance +12 % → abstention (la cote monte) ; Extérieur (1-1) : cote 4.75, écart +2.99, tendance −8 % → … ». Le message « aucune équipe désignée (F121-C est inactive) » n’existe plus. |
| F121-C et F121-C.2 | Comme les autres règles, elles respectent la case du profil actif : l’alerte Haute (petit écart, y compris au premier relevé après un but) exige F121-C cochée ; le suivi du leader exige le paramètre **et** la case F121-C.2. |

Le Testeur manuel n’a qu’un champ de variation : il s’applique à l’équipe à l’écart le plus faible (comme avant) ; l’autre équipe a une tendance non calculable, donc s’abstient.

Tests : `tests/Unit/TwoSidedRuleTest.php` (Arsenal – Everton, Sénégal – Soudan, Grimsby – Cheltenham, Crewe – Wigan, 2-0 puis 3-0 avec baisse du score extérieur, deux équipes en signal) et `tests/Feature/TwoSidedScanTest.php` (scan complet).

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
- F162-Bis et écart supérieur à 0.50 : réglé le 25 novembre 2026 quand une seule équipe est en signal (abstention). Deux équipes en signal, ou 2 minutes après un but : l’alerte reste possible.
- **Tendance après un but** : voir la section « Gestion des cotes après un but (complément 4) ». La baisse mécanique de −26 % constatée en réel (2-0 de 9.60 avant le but à 7.10 après) ne compte plus : seules les cotes prises après le but servent.
- **Journal « pas de scan » (à confirmer)** : une seule ligne quand un match passe en « pas de scan » (écart supérieur à 2.00), et une autre quand il en sort ; rien entre les deux.

## F162-Bis exige un écart (décision du 25 novembre 2026)

Réglage « F162-Bis exige un écart <= seuil F121-G » (`rules.strong_drop_requires_gap`), **activé par défaut**. Quand **une seule équipe** est en signal et que ce signal est une baisse de cote (F162-Bis), l’écart de cette équipe doit être inférieur ou égal au seuil F121-G (`rules.abstention_gap_threshold` = 0.50, inclus). Sinon : abstention, motif au Journal « baisse de cote seule (F162-Bis), mais écart +4.13 supérieur à 0.50 (F121-G) : pas d’alerte » (étape `strong_drop_gap`). Le Testeur applique le même réglage.

- **Deux équipes en signal** : inchangé, alerte neutre seule (« un but de plus »).
- **2 minutes après un but** (complément 4) : inchangé, une baisse depuis la première cote après le but suffit.
- Écart négatif (F121-E1), petit écart (F121-C), F121-D et mode Plancher : inchangés.

**Origine** : 204 alertes où F162-Bis intervient, en production du 20 au 25 novembre 2026. Les 46 alertes à une seule équipe, hors but, avec un écart supérieur à 0.50 ont gagné 14 fois et perdu 24 fois (8 sans résultat). Les 70 alertes neutres (deux équipes en signal) que le réglage aurait transformées en paris ciblés ont gagné 48 fois sur 56 : elles sont gardées.

**Exemple testé** : RB Leipzig – Lens, 75e, 2-1 (alerte #2807, perdue) : extérieur 2-2 à 6.50, écart +4.13, baisse −7.1 % ; domicile en hausse (+4.6 %) → abstention.

**À valider par le client** : l’exemple Sénégal – Soudan qu’il avait transmis (2-0 de 4.00 à 3.50, écart +0.70, baisse −12.5 %, alerte Critique) devient une abstention avec ce réglage. Les 10 situations de l’annexe restent toutes conformes.

## Cote Under 2.5 réelle (pari 36)

Branchée d’après la capture réelle `backend/database/fixtures/api-football/odds-live-bet36.json` (13 novembre 2026, 43 matchs). Le pari 36 « Over/Under Line » donne des valeurs `Over`/`Under` avec un `handicap` texte égal au total de buts du match. Seule une valeur `Under` 2.5 unique et non suspendue est retenue ; la ligne 2.5 n’est pas toujours proposée (11 matchs sur 43). Le pari 36 n’est demandé que si un match suivi est à la mi-temps.

## Gestion des cotes après un but (complément 4, validé par le client)

Source : `docs/PRONOFOOT_Annexe_Phase1_Complement4.pdf`. Il **remplace le complément 3** : l’historique n’est jamais supprimé et on n’attend pas 2 minutes avant de recalculer.

| Moment | Règle appliquée |
|---|---|
| Relevé où le but est détecté | Alerte précédente du match invalidée, nouvelle fenêtre de 2 minutes, scan toutes les 15 s. Aucune décision : on attend la première cote après le but (le bookmaker rouvre ses cotes). |
| **Premier relevé après le but** (une seule fois par but) | Écart < 0 → **Alerte Critique** (F121-E1). 0 ≤ écart ≤ 0.50 (0 inclus) → **Alerte Haute**. Écart > 0.50 → attente, aucune alerte. La cote du score suggéré devient le **point de départ**. |
| Relevés suivants pendant la fenêtre (2 minutes) | Seule une baisse de plus de 5 % par rapport au point de départ donne une **Alerte Critique** (F162-Bis). Sinon abstention. Les règles d’écart ne redéclenchent pas d’alerte. |
| Après la fenêtre | Retour à l’ordre de décision normal (tendance sur 2 minutes), avec des cotes prises après le but uniquement. |
| Nouveau but pendant la fenêtre | Nouvelle fenêtre et nouveau point de départ à partir de ce but. |

Toujours appliqués : l’historique des cotes est conservé en entier (rien n’est supprimé) ; une seule alerte active par match, règle et sélection.

À confirmer :

- **Vitalité ≤ 40 prioritaire** : un match « mort » reste en abstention, y compris au premier relevé après un but. Le pseudo-code du complément 4 ne regarde pas la vitalité.
- E2 (mi-temps) et F121-D (match ouvert) restent vérifiés avant la règle après but.
- Si la cote du score suggéré n’est pas encore disponible au premier relevé (bookmaker fermé), le relevé suivant reste le « premier relevé ».
- Chaque équipe a son propre point de départ : la cote du score de son prochain but au premier relevé où elle est disponible.
- Le relevé de la détection du but n’est pas évalué, comme dans le pseudo-code (« attente première cote »).

Tests : `test_post_goal_window_follows_the_complement_4` et `test_after_the_post_goal_window_the_normal_order_resumes_with_post_goal_odds` (scan), `test_first_reading_after_a_goal_alerts_immediately_on_a_favourable_gap` et `test_later_readings_in_the_post_goal_window_only_alert_on_a_strong_drop` (moteur).

## Quota et matchs surveillés (annexe, sections 5 et 6)

| Sujet | Application | Paramètre |
|---|---|---|
| Quota | Lu à chaque appel dans les en-têtes `x-ratelimit-requests-limit` (quota du jour) et `x-ratelimit-requests-remaining` (restant). Le plan API-Football Pro donne 7 500 requêtes par jour ; le compte de test actuel en donne 100. | — |
| Seuil d’alerte | 10 % du quota journalier lu dans l’en-tête (750 requêtes avec le plan Pro) ; alerte unique par le canal de notification. E-mail hors périmètre sans adresse fournie. | `scan.quota_economy_percent` |
| Fréquences (en permanence) | Matchs chauds toutes les 30 s, calmes toutes les 2 min, écart > 2.00 jamais scannés. Chaud = écart < 1.50 ou baisse de la cote suggérée de plus de 5 %. | `scan.hot_interval_seconds`, `scan.calm_interval_seconds`, `scan.hot_gap_threshold`, `scan.no_scan_gap_threshold` |
| Mode économie | Seuls les matchs chauds sont scannés. | — |
| Pas de scan | Écart > 2.00 : match non scanné ; une ligne au Journal à l’entrée dans cet état et une à la sortie (à confirmer). | `scan.no_scan_gap_threshold` |
| Quota nul | « Quota épuisé. Le live est arrêté. Rechargez le quota. » | — |
| Suivi automatique | Ligues 39, 140, 135, 78, 61, 2, 3 ; seulement avec cotes de score exact et statistiques. | `scan.auto_mode`, `scan.auto_league_ids` |
| Suivi sans statistiques (21 novembre 2026) | Un match dont la ligue ne couvre pas les statistiques peut être suivi si ses cotes de score exact sont disponibles (badge « Sans stats »). Aucun appel de statistiques, vitalité « non disponible », **filtre vitalité ≤ 40 non appliqué** ; écart, tendance, mi-temps, F121-D et pari neutre s’appliquent normalement. Alertes et Journal portent la mention « Vitalité non disponible (statistiques non couvertes) ». **Dérogation à la règle du CDC « aucune alerte si un des 3 filtres n’est pas validé » : à confirmer.** Sans cotes de score exact, le match reste non suivable. Le suivi automatique exige toujours les statistiques. | `scan.allow_tracking_without_statistics` = activé |
| Matchs à venir aujourd’hui (21 novembre 2026) | Page Matchs suivis : une requête `fixtures?date=` (date du jour, UTC) pour toutes les compétitions, gardée 15 minutes en cache côté serveur, jamais à chaque chargement de page ; seuls les matchs non commencés (NS, TBD) sont listés. Même filtre par championnat et même recherche que les matchs en direct. « Suivre dès le coup d’envoi » enregistre un suivi planifié sans appel API ; avant l’heure du coup d’envoi, aucun appel ; ensuite, le flux en direct est lu et le suivi s’active dès que le match est en jeu (un événement « Match planifié passé en direct : suivi activé »), puis le match est scanné normalement au tour suivant. Pas de cotes pré-match ni de statistiques avant le coup d’envoi. Un match planifié jamais passé en direct est retiré 4 h 30 après l’heure prévue. | `scan.max_match_duration_minutes` |
| Mode de scan (21 novembre 2026) | Automatique : 7 championnats suivis et matchs ajoutés à la main. Manuel : seulement les matchs ajoutés à la main. Pause : aucun appel API. Enregistré en base, relu par `scan:run` à chaque tour (sans redémarrer Supervisor) ; chaque changement est conservé dans l’historique des paramètres (administrateur, date, ancienne et nouvelle valeur). | `scan.auto_mode`, `scan.paused` |
| Fin de match (retour du client, 20 novembre 2026) | Statut API-Football FT, AET, PEN, PST, CANC, ABD, AWD ou WO : match retiré du suivi (statut « Terminé »), alertes actives expirées, plus aucun appel (statistiques, cotes), un seul événement « Match terminé : suivi arrêté ». Jamais d’après la minute : 1H, HT, 2H, ET, BT, P, SUSP, INT, LIVE ne terminent pas le match ; les tirs au but (P) ne sont pas analysés. | — |
| Filets de sécurité | Absent du flux en direct pendant 4 relevés consécutifs (environ 2 minutes) : terminé. Coup d’envoi il y a plus de 4 h 30 : retiré sans appel. | `scan.missing_readings_before_end` = 4, `scan.max_match_duration_minutes` = 270 |
| Veille | Aucun match suivi et aucun match des championnats suivis en direct : ni statistiques ni cotes, et le flux en direct n’est relu qu’après une pause. **Durée à confirmer.** | `scan.idle_interval_seconds` = 300 |
| Journal sans doublons | Un relevé dont la décision et la justification sont identiques au précédent pour le même match met à jour la ligne existante (horodatage, nombre de relevés) au lieu d’en créer une. | — |

À confirmer : écart entre 1.50 et 2.00 traité comme « calme » ; définition d’un match chaud ; seuil de 10 % inclus ; classement chaud / calme sur le dernier instantané (au plus 30 s de retard) ; pronostics pré-match absents en Phase 1.

## Mode Plancher (annexe client « Quoi coder v2 », 23 novembre 2026)

Seul le mode **Plancher** est codé (`plancher()`, `proposer()`, `scan_du_moment()`), pas le mode Complet (festival, fourchette). Classe pure `GoalFloor`, appelée par le scan réel (`GoalFloorScanService`). Le pari ciblé (E1, F162-Bis…) reste en dehors de ce module.

| Étape | Règle appliquée | Paramètre |
|---|---|---|
| Liste | Scores exacts **atteignables** (h ≥ buts domicile et a ≥ buts extérieur), score actuel compris, cote ≤ 8.00 (**8.00 inclus**). Cotes absentes, suspendues ou verrouillées (≤ 1.001) ignorées. | `plancher.score_odds_limit` = 8.00 |
| total_max / plancher | total_max = plus grand total de la liste ; plancher = total_max − buts actuels ; **plancher < 1 : aucun pari**. | — |
| Paris | **Central** = Over (total_max − 0.5) ; **prudent** = Over (total_max − 1.5), seulement si plancher ≥ 2. Lignes sur le **total du match**. Cote < 1.25 : « valeur faible », sans bloquer. | `plancher.low_value_odds` = 1.25 |
| Doublons | Ligne déjà acquise (buts ≥ ligne) ou déjà posée pour ce match : non proposée. « Déjà posée » = paris Plancher précédents, **option neutre des alertes** et Over 4.5 de F121-D. Ligne sans cote : non proposée. | — |
| Scans | Trois par match, **jamais à chaque but** (ni au relevé où un but est détecté) : **départ** (1re mi-temps, minute 3 à 11), **pause** (statut mi-temps), **soixante** (2e mi-temps, minute 60 à 65). Premier relevé dans la fenêtre, une seule fois chacun. Chaque scan s’active séparément. | `plancher.scan_*_enabled`, `plancher.depart_minute_from/to`, `plancher.soixante_minute_from/to` |
| Pause = scan E2 | Le scan de la pause n’a lieu que si **F121-E2 est cochée dans le profil actif**. Le signal E2 d’origine (Under 2.5 entre 1.15 et 1.40) est **journalisé sans décider** : à la mi-temps, le moteur n’envoie plus l’alerte « Over 0.5 2e MT » (il la renvoie si le scan de la pause est désactivé). Le score de confiance de F121-E2 est inchangé. | `plancher.scan_pause_enabled` |
| Telegram | Une alerte par scan qui propose au moins un pari (titre « PLANCHER · scan … »), activable par scan. Désactivée : la ligne du Journal et les paris (notés en fin de match) restent. | `plancher.notify_depart/pause/soixante` |
| Journal | Ligne « Plancher » par scan : minute, score, liste ≤ 8.00, total_max, plancher, paris et cotes, « valeur faible », paris écartés et raison, scan, mode = Plancher, Under 2.5, Under de la ligne total_max + 0.5, signal E2 d’origine (pause). | colonne `opportunity_logs.plancher` |
| Résultat | Chaque pari est une option (`plancher_central`, `plancher_prudent`) notée à la fin du match : **gagnée si le total final dépasse la ligne**, sinon perdue (prolongation selon `results.count_extra_time`, tirs au but jamais). Pas d’expiration à 15 minutes, pas d’invalidation par un but. Statistiques par type. | — |

**Données lues.** Les scores exacts viennent du relevé déjà fait à chaque passage (bet 23). Les lignes Over/Under du total du match ne sont demandées que quand un scan Plancher est dû : bet 25 (« Match Goals », lignes .5) puis bet 36 (« Over/Under Line »), réunis, bet 25 d’abord. Coût : 2 requêtes par passage où un scan est dû (une à la mi-temps, où bet 36 est déjà lu), communes à tous les matchs.

**Constat en direct (API réelle, 23 novembre 2026, 14 h UTC, 8 matchs à la mi-temps).** Les cotes live existent pendant la pause : statut `stopped` = vrai, bet 23 avec 14 à 20 scores ouverts (les scores lointains suspendus), bet 36 et bet 25 ouverts. Mais pour 7 matchs sur 8, chaque marché ne donne qu’**une seule ligne** (la ligne principale, parfois un quart de ligne 1.25 ou 2.25 dans bet 36) ; un seul match avait toute l’échelle (3.5 à 7.5). Conséquence : la ligne du pari prudent (la plus basse) manque souvent ; le pari est alors écarté (« cote absente ou verrouillée ») et le Journal le dit.

**Tests.** Les 6 matchs réels du document (Getafe, Atalanta–Inter, Marseille–Le Mans, Chicago–Charlotte, Anderlecht–OHL, Paris FC–Angers) donnent exactement la liste, le total_max, le plancher et les paris du tableau ; Getafe avec la ligne 3.5 déjà posée ne propose que Over 2.5 ; Chicago à 2-1 ne propose rien.

## Score de confiance automatique (document client V12, 22 novembre 2026)

Un score de 0 à 100 par règle, puis la moyenne pondérée par les poids du profil actif (v11 et V11.9 : E1 25, C 20, F162-Bis 20, D 15, E2 10, C.2 10). Classe pure `ConfidenceScorer`, appelée par le moteur : le scan réel et le Testeur utilisent la même fonction. Le score et le détail par règle (score, poids, contribution, explication) sont conservés avec chaque évaluation (`opportunity_logs.confidence`) et affichés dans le Journal et le Testeur. **Il ne bloque aucune alerte** : l’étape « convergence » reste désactivée. Seuil de validation des profils « v11 » et « V11.9 » : **55 %** (score strictement supérieur, comme l’étape existante).

| Règle | Formule appliquée | Exemple vérifié par un test |
|---|---|---|
| F121-E1 | Écart le plus négatif des deux équipes ; (\|écart\| / 0.50) × 95, plafonné à 95 ; 0 si l’écart est >= 0 | −0.09 → 17.1 (17 dans le document, arrondi au dixième) ; −0.66 → 95 ; +0.18 → 0 |
| F121-C | Équipe désignée = celle qui a le **plus petit écart** ; 90 si une équipe est désignée et que le score n’est pas à égalité, 0 sinon (égalité au score, écarts égaux ou non calculables). Que l’équipe désignée mène ou soit derrière n’y change rien ; le score « 20 » du document n’est pas appliqué. **Interprétation retenue, exemple Espagne-Angleterre, à valider par le client.** | Espagne derrière (−0.29 contre +1.21) → 90 ; Arsenal (+0.18 contre +5.58) → 90 ; 1-1 → 0 |
| F162-Bis | Plus forte baisse des cotes du prochain but des deux équipes, sur la même fenêtre de tendance que le moteur (2 minutes ; après un but, variation depuis la première cote) ; baisse > 10 % = 95 ; 5 à 10 % (5 et 10 inclus) = 75 ; sinon 0 | −17 % → 95 ; −6.25 % → 75 ; +1.5 % → 0 |
| F121-D | Au moins 4 buts (`rules.open_match_min_goals`) ; deux scores suivants (h+1-a et h-a+1, par exemple 3-2 et 2-3 pour 2-2) ; 80 si les deux cotes sont <= 8.00 (inclus) ; sinon 0. **Confirmé par le client (22 novembre 2026).** Rennes-Racing (2-0) donne donc 0 | 3-2 à 6.00 et 2-3 à 8.00 → 80 |
| F121-E2 | Seulement à la mi-temps ; Under 2.5 dans la plage du moteur (1.15 à 1.40 inclus) = 85 ; < 1.15 = 30 ; > 1.40 = 0 ; hors mi-temps = 0 | 1.36 → 85 ; 1.40 → 85 ; 1.10 → 30 |
| F121-C.2 | Une équipe mène de 2 buts ou plus = 90 ; sinon 0 | 2-0 → 90 |

- **Exemple complet Arsenal-Everton (64e)** : 1-0 à 2.92, 2-0 à 3.10, 1-1 à 8.50, baisse de 17 % : E1 0, C 90 (18.0), F162-Bis 95 (19.0), D 0, E2 0, C.2 0 : **37.0 %** < 55 % (test unitaire). L’alerte F162-Bis reste envoyée, le score étant indicatif.
- Scores arrondis au dixième ; score final non calculé si le profil n’a aucun poids, ou s’il pondère une règle sans formule.
- Testeur : avec un profil choisi (test de combinaison), ses poids et son seuil ; sans profil, ceux du profil actif. Les scores ne se saisissent plus à la main.
- **Double Suggestion (F121-C + F121-X, section 7 du document)** : non modifiée, en attente des précisions du client.

## Résultat automatique des alertes, par option (21 novembre 2026)

Chaque alerte enregistre ses options (table `alert_options`) : **ciblée** « Prochain but [équipe] » (avec la cote du score suggéré), **neutre** « Un but de plus dans le match » (Over N), **Over 4.5** (F121-D) et **Over 0.5 en 2e mi-temps** (F121-E2). Pour chacune : décision de l’administrateur (jouée / ignorée / non renseignée), résultat (gagnée / perdue / annulée / en attente) et origine du résultat (automatique ou manuel).

| Option | Gagnée si… | Perdue si… |
|---|---|---|
| Ciblée | l’équipe désignée marque le **prochain but** après l’alerte | l’autre équipe marque d’abord, ou aucun but avant la fin de validité |
| Neutre | au moins un but est marqué après l’alerte | aucun but avant la fin de validité |
| Over 4.5 (F121-D) | le total final est de 5 buts ou plus | moins de 5 buts |
| Plancher central / prudent (Over N.5) | le total final dépasse la ligne | sinon |
| Over 0.5 2e MT (F121-E2) | au moins un but après l’alerte (donnée à la mi-temps), jusqu’à la fin du temps réglementaire (temps additionnel compris, prolongation exclue) | aucun but en 2e mi-temps |

- **Calcul** : à la fin du match (FT, AET, PEN, ou fin par absence du flux), à partir des scores déjà enregistrés à chaque relevé, **sans requête API en plus**. Un but contre son camp compte pour l’équipe qui en profite (le score l’indique déjà). Une baisse du score (but annulé par la VAR) remplace la référence sans compter de but.
- **Match arrêté, abandonné, reporté ou annulé** (ABD, CANC, PST, AWD, WO) : toutes les options sont **annulées** et exclues des statistiques.
- **Deux buts des deux équipes entre deux relevés** (ordre incertain, seulement pour une option ciblée en attente) : **une seule** requête `/fixtures/events` du match terminé, uniquement pour un match ayant une alerte. Les penalties manqués et la séance de tirs au but (événements « Penalty Shootout ») sont ignorés, et les buts sont remis dans l’ordre des minutes. Pour un but contre son camp, API-Football indique l’équipe qui en profite : elle est reprise telle quelle (vérifié sur une réponse réelle : Canada–Maroc, Coupe du monde 2022, CSC de N. Aguerd attribué au Canada). Si la requête échoue, l’option reste « en attente », à noter à la main.
- **Consommation de quota** : 0 requête dans le cas normal ; au plus 1 requête par match terminé ayant une alerte, et seulement dans le cas rare ci-dessus.
- **Correction manuelle** : l’administrateur peut corriger un résultat dans le Journal ; l’origine passe à « manuel » et le calcul automatique ne le remplace plus. Remettre « En attente » efface l’origine.
- **Alertes existantes** (migration) : une option est créée d’après la règle et la sélection de l’alerte (et l’option neutre si le message la mentionne). Le résultat déjà noté devient celui de l’option principale, origine « manuel ».
- **Statistiques** : taux = gagnées ÷ (gagnées + perdues), annulées et en attente exclues ; par règle et par type d’option, sur toutes les options (résultat automatique) et sur les seules options marquées « jouées ». Filtre par dates conservé (date de l’alerte).
- **Limite** : un match terminé par absence du flux est évalué sur son dernier relevé ; un but dans les toutes dernières secondes peut manquer (corrigeable à la main).

- **Tirs au but** : jamais comptés. Le score relevé (champ `goals` d’API-Football) reste celui de la fin de la prolongation pendant et après la séance (vérifié : finale de la Coupe du monde 2022, `goals` 3-3, `score.penalty` 4-2) ; les événements de la séance sont exclus.

| Point confirmé par le client (21 novembre 2026) | Valeur | Paramètre |
|---|---|---|
| But contre son camp | Compte pour l’équipe adverse (celle qui en profite) | — |
| Validité du pari (options ciblée et neutre) | Jusqu’à la fin du match ; les 15 minutes ne concernent que l’expiration de l’alerte. Autre choix possible : pendant la durée de l’alerte | `results.bet_validity` = `match` |
| Prolongation | Comptée comme le temps réglementaire (sauf pour Over 0.5 en 2e mi-temps) | `results.count_extra_time` = activé |

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
