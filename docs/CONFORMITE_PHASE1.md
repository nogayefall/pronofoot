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

## Ordre de décision appliqué (complément 2 de l’annexe)

| Étape | Condition | Décision |
|---|---|---|
| 1. F121-E2 | Mi-temps, Under 2.5 entre 1.15 et 1.40 inclus | **Alerte Mi-temps** (Over 0.5 en 2e MT) ; à la mi-temps, aucune autre alerte |
| 2. F121-D | Au moins 4 buts et cotes des deux scores suivants ≤ 8.00 | **Pari neutre** Over 4.5 |
| 3. Vitalité | ≤ 40 ou non calculable | Abstention |
| 4. F162-Bis | Baisse de la cote du score suggéré de plus de 5 % en 2 minutes | **Alerte Critique** ; abstention si une seule équipe est en signal avec un écart > 0.50 (réglage, activé par défaut) |
| 5. Hausse | Variation > 0, ou tendance non calculable (moins de 2 minutes de cotes depuis le début du suivi) | Abstention |
| Après un but (complément 4) | Pendant 2 minutes, les étapes 4 à 9 sont remplacées : premier relevé → écart < 0 Critique, 0 ≤ écart ≤ 0.50 Haute, sinon attente ; relevés suivants → seule une baisse de plus de 5 % depuis la première cote post-but donne une alerte Critique | Voir `DECISIONS_ANNEXE_PHASE1.md` |
| 6. F121-E1 | Écart < 0 | **Alerte Critique** |
| 7. F121-G | Écart > 0.50 | Abstention |
| 8. Petit écart | 0 < écart ≤ 0.50 | **Alerte Haute** |
| 9. Sinon | Écart nul | Abstention |

Libellés : « Alerte Critique » et « Alerte Haute » sont modifiables (`alerts.level_negative_gap`, `alerts.level_positive_gap`). Étapes facultatives désactivées : minutes restantes (N = 10) et convergence.

## Critères d’acceptation du CDC Phase 1 (section 8)

Tests automatiques : `backend/tests/Feature/AcceptanceCriteriaTest.php`, `backend/tests/Unit/AnnexSituationsTest.php`, `backend/tests/Unit/RuleEngineTest.php`.

| Critère | Statut | Preuve | Remarque |
|---|---|---|---|
| Chaque règle est testée avec des cas écrits à l’avance (au moins 10 situations de l’admin, résultat identique) | **Conforme** | `AnnexSituationsTest` : les 10 situations, avec les données complètes du complément 2, donnent toutes la décision attendue | L’ordre de décision s’écarte du pseudo-code du client sur plusieurs points (voir `DECISIONS_ANNEXE_PHASE1.md`), à confirmer. |
| Alerte reçue en moins de 60 secondes après la détection | **Conforme avec le canal `log`** ; Telegram branché, délai réel **à mesurer** (procédure ci-dessous) ; WhatsApp **à confirmer** | `test_alert_is_delivered_through_the_log_channel_less_than_60_seconds_after_detection` : détection et envoi dans le même passage | En production, l’envoi passe par la file : `queue:work` doit tourner (Supervisor). WhatsApp réel n’est pas branché (hors périmètre de cette étape). |
| Aucune alerte si un des 3 filtres n’est pas validé ; refus noté au Journal | **À confirmer** | `test_no_alert_when_a_filter_is_refused_and_the_refusal_is_written_in_the_journal` (écart, vitalité, tendance) | Vitalité et hausse de cote bloquent toujours. Depuis le 25 novembre 2026, le filtre d’écart bloque aussi une forte baisse (F162-Bis) quand une seule équipe est en signal ; il ne bloque pas l’alerte neutre (deux équipes en signal) ni les 2 minutes après un but. Un match dont l’écart dépasse 2.00 n’est pas scanné : une ligne au Journal à l’entrée dans cet état et une à la sortie (à confirmer). Depuis le 21 novembre 2026, un match suivi **sans statistiques** (ligue non couverte) peut donner une alerte sans filtre vitalité, avec la mention « Vitalité non disponible (statistiques non couvertes) » : dérogation demandée par le client, **à confirmer**. |
| Le Journal conserve les détections et permet le taux de réussite par règle | **Conforme** | `test_journal_gives_the_success_rate_per_rule` ; page Statistiques | Le résultat (gagné / perdu / annulé) est saisi par l’administrateur dans le Journal ; aucun calcul automatique du résultat d’un pari n’est prévu en Phase 1. |
| Les paramètres se modifient depuis la page admin et s’appliquent au scan suivant | **Conforme** | `test_settings_changed_in_the_admin_page_apply_to_the_next_scan` | Les paramètres et le profil actif sont relus à chaque passage, sans redémarrer `scan:run`. |

### Procédure manuelle : délai d’alerte en conditions réelles

1. Dans `backend/.env` : `NOTIFICATION_MODE=fake`, `NOTIFICATION_CHANNEL=log`.
2. Lancer dans deux terminaux : `php artisan scan:run` et `php artisan queue:work --tries=3`.
3. Attendre une alerte (Journal, décision « alert »).
4. Comparer l’heure de détection (Journal, colonne date) et l’heure d’envoi (`alerts.sent_at`, ou la ligne correspondante dans `storage/logs/laravel.log`). L’écart doit rester sous 60 secondes.
5. Refaire la mesure avec Telegram (`NOTIFICATION_MODE=real`, `NOTIFICATION_CHANNEL=telegram`) : comparer l’heure de détection et l’heure de réception sur le téléphone. Puis avec WhatsApp quand il sera branché.

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

## Revue de sécurité (14 novembre 2026)

| Point | Statut | Détail |
|---|---|---|
| 2FA obligatoire hors `APP_ENV=local` | Conforme (tests) ; **désactivable temporairement** | Mot de passe **et** code TOTP exigés. Le compte de test `admin-test@pronofoot.local` est refusé hors `local`, même avec un bon code. `AUTH_TWO_FACTOR_ENABLED=false` supprime le code (le mot de passe et la limitation des tentatives restent) ; seule la valeur `false` désactive. Désactivée en production le 20 novembre 2026 à la demande de l’administrateur, le temps des tests du client : **à réactiver** ensuite. |
| Réutilisation d’un code TOTP | **Corrigé** | Un code pouvait servir plusieurs fois pendant sa fenêtre de validité (environ 90 s). Le dernier pas de temps accepté est désormais mémorisé (`users.totp_last_counter`) : un code déjà utilisé est refusé. |
| Indice d’existence d’un compte par le temps de réponse | **Corrigé** | Le mot de passe n’était vérifié que si l’email existait. Une vérification factice de même coût est faite pour un email inconnu. |
| Limitation des tentatives | Conforme | 5 essais par minute par couple email + IP, et 10 requêtes par minute par IP sur `POST /login`. Message identique pour un email, un mot de passe ou un code faux. |
| En-têtes de sécurité | **Complété** | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` déjà présents ; HSTS en production HTTPS. Ajout d’une **Content-Security-Policy** avec nonce par requête (hors `local`, où Vite tourne sur une autre origine). Les pages d’erreur 419 et 500 sont personnalisées en français : leurs styles portent le nonce de la requête et restent lisibles sous cette CSP (test). Depuis la refonte visuelle du 20 novembre 2026, la CSP autorise aussi Google Fonts (`fonts.googleapis.com` pour les styles, `fonts.gstatic.com` pour les polices) : l’adresse IP de chaque visiteur est alors transmise à Google. Pour l’éviter, il faudrait héberger les polices sur le serveur (à décider). |
| Cookies | Conforme | Cookie de session `HttpOnly`, `SameSite=Lax`, `Secure` par défaut en production ; `deploy/.env.production.example` impose aussi `SESSION_ENCRYPT=true`. Session régénérée à la connexion, invalidée à la déconnexion. |
| Secrets dans les journaux | Conforme (test) | Masquage automatique (voir « Robustesse »). |
| Secrets dans l’historique Git | **Aucun trouvé** | 45 commits parcourus. Aucun fichier `.env` versionné (seulement les modèles `.example`). La clé API-Football et l’`APP_KEY` locales n’apparaissent dans aucun commit. Les correspondances au motif « clé » sont des exemples factices de la documentation API-Football (`XxXx…`), la valeur de test `test-api-key` et le `content-hash` de `composer.lock`. |
