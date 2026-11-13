# PronoFoot Phase 1 — Conformité

Dernière mise à jour : 14 novembre 2026.

## Module 3.6 du CDC V9.1 — moteur de règles modulaire

Référence : `PRONOFOOT_CDC_V9.1.pdf`, section 4.1. Le constructeur de règles no-code (« Règles personnalisées », « + Ajouter une règle ») est exclu de la Phase 1.

| Élément du CDC | Avant | Maintenant | Détail |
|---|---|---|---|
| Sélection et activation des méthodes | Présent | Présent | Cases à cocher par profil pour F121-E2, F121-D, F121-C, F121-C.2 et F121-E1. Les méthodes sans formule (F121-K, F121-X, F160…) ne sont pas proposées. |
| Poids de chaque méthode | Partiel | Présent | Un poids par méthode et par profil. **Aucun poids par défaut** : les poids 60 / 30 / 10 % de la maquette portent sur « Écart directionnel / Vitalité / Tendance », qui ne sont pas des méthodes à score dans le moteur ; à confirmer par le client. |
| Seuil de validation | Partiel (paramètre global) | Présent | Seuil par profil (« score de confiance > X % »), sinon 75 % (PRD/TRD). |
| « Tester la combinaison » | Absent | Présent | Évalue la situation du Testeur manuel avec le profil sauvegardé et des scores de méthodes saisis ; affiche la décision, l’ordre de décision et le score de confiance. Aucune alerte n’est envoyée. |
| « Sauvegarder le profil » | Présent (profil actif seulement) | Présent | Sauvegarde de n’importe quel profil. |
| « Créer un nouveau profil » | Absent | Présent | Nouveau profil vide (aucune méthode, aucun poids). |
| Plusieurs profils | Absent | Présent | Liste, sélection et activation ; un seul profil actif, utilisé au passage suivant du scan. |
| Affichage du score de confiance | Absent | Présent | Dans le résultat du test et dans le message d’alerte (« non calculé » sans poids ni scores). |
| Convergence dans la décision | Étape à ajouter à la main dans l’ordre JSON | Présent | Paramètre `rules.convergence_enabled`, **désactivé par défaut** : ajoute l’étape « convergence » en fin d’ordre de décision. |

À confirmer : le score de chaque méthode (0–100). Le CDC dit « chaque méthode donne un verdict et un score » sans formule ; en scan réel, aucune méthode ne produit de score, donc le score de confiance reste « non calculé » et l’étape convergence, si on l’active, provoque l’abstention.

## Critères d’acceptation du CDC Phase 1 (section 8)

Tests automatiques : `backend/tests/Feature/AcceptanceCriteriaTest.php`, `backend/tests/Unit/AnnexSituationsTest.php`, `backend/tests/Unit/RuleEngineTest.php`.

| Critère | Statut | Preuve | Remarque |
|---|---|---|---|
| Chaque règle est testée avec des cas écrits à l’avance (au moins 10 situations de l’admin, résultat identique) | **Non conforme** (attend le client) | `AnnexSituationsTest` : situations 1, 9 et 10 identiques ; 2 et 3 identiques sur les étapes renseignées | Situations 2 à 8 incomplètes (vitalité, cote à −2 min) ; 6 et 7 contredisent les règles écrites. Fichier Excel attendu. |
| Alerte reçue en moins de 60 secondes après la détection | **Conforme avec le canal `log`** ; WhatsApp **à confirmer** | `test_alert_is_delivered_through_the_log_channel_less_than_60_seconds_after_detection` : détection et envoi dans le même passage | En production, l’envoi passe par la file : `queue:work` doit tourner (Supervisor). WhatsApp réel n’est pas branché (hors périmètre de cette étape). |
| Aucune alerte si un des 3 filtres n’est pas validé ; refus noté au Journal | **Conforme** | `test_no_alert_when_a_filter_is_refused_and_the_refusal_is_written_in_the_journal` (écart, vitalité, tendance) | Un match dont l’écart dépasse 2.00 n’est pas scanné (annexe) : il n’a pas de ligne au Journal tant qu’il reste dans cet état. |
| Le Journal conserve les détections et permet le taux de réussite par règle | **Conforme** | `test_journal_gives_the_success_rate_per_rule` ; page Statistiques | Le résultat (gagné / perdu / annulé) est saisi par l’administrateur dans le Journal ; aucun calcul automatique du résultat d’un pari n’est prévu en Phase 1. |
| Les paramètres se modifient depuis la page admin et s’appliquent au scan suivant | **Conforme** | `test_settings_changed_in_the_admin_page_apply_to_the_next_scan` | Les paramètres et le profil actif sont relus à chaque passage, sans redémarrer `scan:run`. |

### Procédure manuelle : délai d’alerte en conditions réelles

1. Dans `backend/.env` : `NOTIFICATION_MODE=fake`, `NOTIFICATION_CHANNEL=log`.
2. Lancer dans deux terminaux : `php artisan scan:run` et `php artisan queue:work --tries=3`.
3. Attendre une alerte (Journal, décision « alert »).
4. Comparer l’heure de détection (Journal, colonne date) et l’heure d’envoi (`alerts.sent_at`, ou la ligne correspondante dans `storage/logs/laravel.log`). L’écart doit rester sous 60 secondes.
5. Refaire la mesure avec WhatsApp quand le canal réel sera branché.

## Robustesse de `scan:run` en continu

Tests : `backend/tests/Feature/ScanRobustnessTest.php`.

| Exigence | Statut | Mise en œuvre |
|---|---|---|
| Pas de fuite de mémoire | Conforme (test) | Journal des requêtes désactivé, `gc_collect_cycles()` à chaque passage ; 60 passages fictifs ajoutent moins de 4 Mo. Garde-fou `--max-memory=256` : arrêt propre, Supervisor relance un processus neuf. |
| Reconnexion à la base après une coupure | Conforme (test) | Une coupure détectée (« server has gone away », etc.) provoque `DB::purge()` puis `DB::reconnect()` ; le passage suivant repart. À vérifier aussi manuellement : arrêter MySQL pendant `scan:run`, le redémarrer, constater la reprise. |
| Une exception sur un match n’arrête pas la boucle | Conforme (test) | Erreur isolée par match (incident `match_processing_error` au Journal) et par passage (pause `--error-backoff`, puis reprise). |
| Arrêt propre sur signal | Conforme (test pour `scan:stop`) ; signaux **à vérifier sur le serveur Linux** | SIGTERM, SIGINT et SIGQUIT (extension pcntl, absente sous Windows) ou `php artisan scan:stop` : arrêt après le passage en cours. Supervisor envoie SIGTERM (`stopwaitsecs=60`). |
| Reprise après redémarrage sans alerte en double | Conforme (test) | Le dédoublonnage s’appuie sur les alertes actives en base, pas sur la mémoire du processus. |
| Aucun jeton ni clé dans les journaux | Conforme (test) | Processeur `SecretRedactor` sur les canaux `single`, `daily` et `stderr` : toute valeur d’une variable d’environnement dont le nom contient KEY, TOKEN, SECRET ou PASSWORD, ainsi que la clé d’application, devient `[masqué]`. Les clés API sont envoyées en en-tête, jamais dans l’URL. |
