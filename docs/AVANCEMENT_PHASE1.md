# PronoFoot — Avancement de la Phase 1

Dernière mise à jour : 14 novembre 2026

## Références et périmètre

Le CDC V9.1 décrit le produit complet. Le développement en cours est limité à la Phase 1 : un outil réservé à l’administrateur qui surveille des matchs, évalue les règles et filtres définis, consigne les décisions et peut envoyer un signal. Le système ne place aucun pari.

Documents de référence présents dans `docs/` :

- `PRONOFOOT_CDC_V9.1.pdf` : périmètre global du produit.
- `PRONOFOOT_CDC_Phase1_Signaux_Live.pdf` : périmètre actuel et règles Phase 1.
- `PronoFoot Phase 1 – PRD.docx` : objectifs, critères d’acceptation et questions ouvertes.
- `PronoFoot Phase 1 – TRD.docx` : architecture et ordre de développement.
- `PRONOFOOT_Annexe_Phase1_Corrigee.pdf` : décisions figées du client (vitalité, tendance, F121-D, F121-E1/E2, quota, matchs surveillés, 10 situations de test). Elle remplace les points « à confirmer » du CDC Phase 1 sur ces sujets ; leur application est détaillée dans [`DECISIONS_ANNEXE_PHASE1.md`](./DECISIONS_ANNEXE_PHASE1.md).
- `PRONOFOOT_Maquette_Demo_V9.1.pdf` : maquette du produit complet ; les écrans hors Phase 1 sont reportés.

L’ordre appliqué est celui de `Claude.md` :

1. Migrations et modèles.
2. Moteur de règles et tests.
3. Connexion administrateur et authentification à deux facteurs.
4. Pages d’administration React.
5. Clients API Odds et Football, puis commande de faisabilité.
6. Scan, nouvelle analyse après un but et expiration des alertes.
7. Alertes WhatsApp avec Telegram en repli.
8. Journal, statistiques et déploiement.

## Réalisé

### Étape 1 — Base de données et modèles

- Backend Laravel 13, frontend React avec Vite, base MySQL locale via WampServer.
- Configuration locale de `backend/.env` pour MySQL sur `127.0.0.1:3306`, base `pronofoot`, utilisateur `root` et mot de passe vide.
- Base `pronofoot` créée sur l’instance MySQL locale WampServer.
- InnoDB configuré pour les tables MySQL Laravel, car l’instance WampServer utilisait MyISAM par défaut et ne permettait pas les contraintes/index attendus.
- Tables Laravel initiales : utilisateurs, sessions, cache et tâches.
- Tables métier Phase 1 : matchs suivis, instantanés, profils de règles, journal des opportunités et alertes.
- Relations Eloquent et tests de persistance ajoutés.

### Étape 2 — Moteur de règles et tests disponibles

**État : code et tests techniques réalisés ; validation métier encore partielle.**

- Moteur PHP pur dans `backend/app/Rules/`, sans appel réseau ni accès à la base.
- F121-C : calcul des écarts domicile et extérieur depuis les cotes du score actuel et des deux scores suivants ; la plus petite différence indique la direction. L’égalité ou une cote manquante ne donne pas de signal exploitable.
- F121-C.2 : lorsque l’écart de score atteint au moins deux buts, la règle sélectionne l’équipe en tête.
- F121-D : seuil strict des cotes inférieur à 7,00, appliqué aux exemples de score 2–3 et 3–2. Une proposition Over 5.5 dépend d’un paramètre fourni ; aucune règle temporelle n’est inventée.
- Filtre d’écart : seuil 1,50 ; exception 0–0 lorsque la cote du score 0–0 est inférieure à 2,50, avec un écart requis inférieur à 1,00.
- Filtre de vitalité : seuil 40/100 fourni par le document ; la valeur doit être fournie en entrée. La normalisation des statistiques brutes n’est pas définie et n’est pas calculée par le moteur.
- Filtre de tendance : le moteur exige une variation calculée, la source `cote_suggeree` et un seuil stable renseigné. Si la source ou le seuil manque, aucune tendance ne passe le filtre.
- Convergence : moyenne pondérée des notes fournies, exemple de calcul 82 × 0,6 + 68 × 0,3 + 90 × 0,1 = 78,6 ; l’alerte exige un score strictement supérieur au seuil configuré, par défaut 75.
- F121-E et les règles sans formule connue F121-K, F121-T, F121-X, F122, F124 et F126 restent « non définies » et ne produisent aucune alerte.
- Tests de règles, filtres et convergence dans `backend/tests/Unit/RuleEngineTest.php`.

**Validation métier incomplète :** le CDC Phase 1 demande au moins dix situations écrites par l’administrateur, avec données d’entrée et décision attendue. Une seule situation complète est fournie dans les documents : l’exemple 0–0 (cotes 7,50 / 8,60 / 9,80, vitalité 61 et tendance stable). Les tests techniques ajoutés ne remplacent pas ces dix cas.

### Étape 3 — Accès administrateur et 2FA

- Connexion Laravel par mot de passe **et** code TOTP à six chiffres.
- Secret TOTP chiffré dans la base avec la clé d’application Laravel.
- Commande `php artisan admin:create` pour créer le compte destiné à la livraison ; elle demande les informations de compte, affiche un secret TOTP à configurer dans l’application d’authentification, puis vérifie un premier code avant d’enregistrer le compte.
- Commandes de développement local `php artisan admin:create-test` et `php artisan admin:test-password-reset`. Elles créent un compte réservé à `APP_ENV=local` et permettent de remplacer le mot de passe en le saisissant de façon masquée. Ce compte de test local se connecte uniquement avec son adresse et son mot de passe ; les autres comptes administrateur gardent le TOTP.
- Le compte de test local est refusé hors de l’environnement `local` et doit être supprimé avant toute livraison.
- Aucun formulaire d’inscription publique ; le seeder ne crée plus de compte de démonstration.
- Protection de `/admin`, fermeture de session avec invalidation et régénération du jeton.
- Limitation des tentatives de connexion.
- Page de connexion française en Blade. L’interface d’administration React relève de l’étape 4.
- Tests TOTP fondés sur les vecteurs RFC 6238, tests de connexion, de refus, de limitation, de fermeture de session, de protection administrateur et de chiffrement du secret.
- La double authentification reste obligatoire pour le compte client hors environnement local ; le raccourci sans TOTP est limité au compte de test local.
- Validation initiale : `php artisan test` — 27 tests réussis, 100 assertions ; `vendor\bin\pint --test` — réussi ; migrations MySQL — appliquées.
- Le compte administrateur destiné au client doit être créé séparément au déploiement avec `php artisan admin:create` et une application TOTP. Il ne faut pas réutiliser le compte local.

### Étape 4 — Interface d’administration React

- Remplacement de la page provisoire par un tableau de bord React en français, adapté aux téléphones.
- Navigation admin : vue d’ensemble, matchs suivis, moteur de règles, testeur manuel, journal et paramètres.
- Vue d’ensemble revue pour la lisibilité mobile : statut du scan mis en évidence, compteur d’alertes actives et tableau des matchs avec équipes, score, minute, vitalité et état. Les données non disponibles ne sont pas simulées ; une seule action principale ouvre la gestion des matchs.
- Passe de lisibilité sur les autres pages : titres principaux à 28 px minimum, titres de panneaux à 18 px minimum, texte courant et champs à 16 px, texte secondaire à 14 px minimum, commandes principales à 44 px minimum et contraste renforcé.
- Typographie de la vue d’ensemble agrandie (texte principal 16 px, texte secondaire 14 px minimum, titre 30 px minimum) et principales zones tactiles portées à au moins 44 px.
- Les listes et indicateurs affichent un état vide honnête plutôt que des matchs, alertes ou statistiques fictifs. L’interface indique quand une fonction attend les prochaines étapes.
- Écran des règles qui distingue les règles utilisables, partielles et non définies ; aucune règle métier inconnue n’est présentée comme disponible.
- Testeur F125 relié au moteur PHP par `POST /admin/rule-test`, derrière la session administrateur et la protection CSRF. Les cotes, scores, vitalité et variation de tendance sont validés avant l’évaluation.
- La simulation indique explicitement qu’elle ne transmet pas de signal. Sans notes et poids de convergence fournis, elle ne calcule pas de convergence et ne peut pas déclencher d’alerte.
- Le bouton de déconnexion utilise la session protégée Laravel.
- Vite produit les ressources dans `backend/public/admin-assets/`, servies dans la page admin Laravel ; le tableau de bord n’est pas servi comme page publique dans les ressources de production. En mode développement, la racine Vite est refusée et les composants ne sont chargés que par la page Laravel après connexion.
- Les URL des ressources compilées sont relatives au sous-chemin WampServer du projet (`/pronofoot/backend/public/`), afin que les fichiers React restent accessibles même lorsque `APP_URL` ne correspond pas au chemin Wamp. La page conserve aussi un message de chargement utile si React ne démarre pas.
- Tests ciblés du formulaire React avec le moteur de test Node intégré, sans nouvelle dépendance.
- Vérification visuelle de la vue d’ensemble et navigation vers le testeur sur petit écran.

**Vérification (27 octobre 2026) :** `backend/php artisan test` — 39 tests réussis, 164 assertions ; Pint — réussi ; `frontend/npm test` — 3 tests réussis ; `frontend/npm run lint` — réussi ; `frontend/npm run build` — réussi.

### Étape 5 — Pilotes de données et faisabilité

- Contrats et DTO distincts pour les fournisseurs de cotes et de matchs.
- Pilotes `fake` rejouables depuis `backend/database/fixtures/football.json`, couvrant une situation candidate, les refus d’écart et de vitalité, l’absence de donnée de tendance, un but entre deux instantanés, des statistiques manquantes et une panne d’API.
- Sélection des pilotes par `ODDS_DRIVER` et `FOOTBALL_DRIVER`. Le mode fictif est marqué « MODE SIMULATION : données fictives » et ne produit aucun appel réseau.
- Le pilote réel Odds n’invente pas de marché de score exact : le catalogue officiel consulté ne le documente pas ; `feasibility:test` l’affiche comme non disponible et ne tente aucune substitution.
- Le mapper API-Football convertit les champs fournis pour `odds/live?bet=23` : identifiant et état du match, score, indicateurs, horodatage et cotes exactes non suspendues. Les statistiques sont mappées depuis le 11 novembre 2026 (voir « Statistiques réelles API-Football ») ; le branchement complet du fournisseur réel et les quotas restent à valider.
- Les fixtures `backend/database/fixtures/api-football/odds_live_bets.json` (266 marchés) et `odds_live_bet23.json` sont fournies par le client depuis le Live tester d’API-Football. Les tableaux de bord affichaient les réponses sans virgules et le client les a converties en JSON valide : le contenu est identique, mais ce ne sont pas des copies octet par octet des réponses HTTP. Le test confirme que le marché `id: 23` se nomme `Final Score`.
- `php artisan feasibility:test` affiche la disponibilité, les matchs en direct, les marchés, les statistiques et les quotas connus. Le calcul indicatif des appels exige les fréquences confirmées fournies par options ; l’hypothèse d’un appel par match est signalée et ne prétend pas connaître le regroupement ou le coût réel.
- `php artisan feasibility:test --capture` enregistre les corps de réponses dans `backend/storage/feasibility/`, sans enregistrer les clés d’accès. Ce dossier est ignoré par Git.
- Les éléments à fournir et les limites des pilotes réels sont consignés dans `A_FOURNIR_PAR_LE_CLIENT.md` et `PASSER_EN_REEL.md`.

### Étape 6 — Scan, relance après un but et expiration

- Les PDF `PRONOFOOT_CDC_Phase1_Signaux_Live.pdf` et `PRONOFOOT_CDC_V9.1.pdf` ont été relus avant l’implémentation. Le CDC Phase 1 indique une lecture des cotes toutes les 30 secondes, des statistiques toutes les 60 secondes et l’expiration d’une alerte sans but après 15 minutes.
- Les paramètres correspondants sont enregistrés en base et appliqués par le scan. La relance à 15 secondes pendant 120 secondes après détection d’un but vient du TRD ; elle reste configurable et est distinguée des cadences explicitement indiquées dans le CDC.
- `php artisan scan:once` effectue un passage ; `php artisan scan:run` maintient le processus en boucle. Les statistiques ne sont demandées qu’à leur cadence ; les cotes sont rafraîchies à leur cadence ou immédiatement après un but.
- Chaque passage conserve un instantané des données disponibles et leur heure de capture. Des données absentes ou trop anciennes ne sont pas utilisées pour déclencher une alerte ; les erreurs de fournisseurs sont journalisées dans les opportunités.
- Un changement à la hausse du score est journalisé comme but, invalide les alertes actives du match et déclenche une réévaluation. Les corrections de score à la baisse ne sont pas interprétées comme un but.
- Les alertes ne sont créées que si le moteur les autorise, si un profil actif et sa convergence sont configurés et si toutes les données requises sont disponibles. Une alerte active n’est pas dupliquée pour le même match, règle et sélection.
- Les paramètres `tendance_source` et `tendance_seuil_stable` sont persistés sans valeur jusqu’à confirmation du client. L’hypothèse fake explicite les paramètres dans la fixture. La vitalité n’est pas calculée à partir de statistiques brutes ; une donnée manquante entraîne l’abstention.
- La tendance est calculée sur la cote du score exact suggéré, avec le dernier instantané de cotes datant d’au moins deux minutes ; formule : `(cote actuelle − cote à −2 min) / cote à −2 min × 100`. Une baisse est négative ; une variation absolue inférieure ou égale au seuil configuré est stable. Une référence absente ou trop récente, une source différente ou un paramètre vide provoque l’abstention.
- Les alertes restent en file d’attente à cette étape ; aucun envoi WhatsApp ou Telegram n’est encore branché. Aucun pari n’est placé.

**Vérification (8 novembre 2026) :** migrations appliquées à la base locale ; `php artisan test` — 67 tests réussis, 290 assertions ; `vendor\bin\pint --test` — réussi. Les tests de scan couvrent la création de signal fake, le calcul de tendance depuis l’instantané, l’abstention si la référence manque ou est trop récente, l’anti-doublon, le but et l’invalidation, l’expiration, l’indisponibilité des cotes exactes, la panne fournisseur et les statistiques absentes. Les vérifications frontend et `feasibility:test --capture` réalisées à l’étape 5 restent valides.

### Étape 7 — Notifications WhatsApp et repli Telegram

- Interface de notification et canaux `log`, `whatsapp` et `telegram`, sélectionnés avec `NOTIFICATION_CHANNEL` et `NOTIFICATION_FALLBACK`.
- En mode fake, WhatsApp et Telegram sont simulés sans réseau ; le canal `log` écrit le message dans le journal Laravel. Une panne simulée du canal principal utilise le repli configuré.
- Le mode `real` refuse explicitement les canaux WhatsApp et Telegram tant que leurs formats et comptes ne sont pas vérifiés ; aucun endpoint réel ni format non confirmé n’est utilisé.
- Les alertes passent par le job `SendAlertNotification`, après validation de la transaction, avec trois tentatives. Le statut, le canal utilisé, le recours au repli et les échecs sont conservés.
- Le point d’entrée admin protégé `POST /admin/notifications/test` est relié au bouton de test de la page Paramètres.
- Le message court inclut match, minute, score, équipe/sélection, règle, écart, vitalité, tendance, convergence et expiration ; il ne promet aucun gain.
- Pour tester le job lorsque la file n’est pas `sync`, lancer `php artisan queue:work --tries=3` dans un terminal en plus du scan.
- Tests ciblés des notifications et du scan : `php artisan test --filter="ScanServiceTest|AdministratorAuthenticationTest"` — 33 tests réussis, 162 assertions ; suite complète : 71 tests, 304 assertions ; `vendor\bin\pint --test` — réussi.

### Étape 8 — Administration, journal, statistiques et préparation au déploiement

- API admin protégée pour le tableau de bord, les quotas connus, les rencontres disponibles et suivies, les paramètres et leur historique, le profil de règles, le journal, les résultats manuels et les statistiques.
- L’interface React consomme ces API : ajout/retrait de matchs (refus si le fournisseur annonce un quota nul), configuration, test des notifications, filtres du journal et des statistiques, résultats d’alertes et compte à rebours.
- L’interface indique visiblement le mode simulation lorsqu’un pilote fictif fournit les données. Elle ne présente pas de données de fournisseurs inventées en mode normal ; les absences restent explicites.
- Les poids de convergence sont laissés vides jusqu’à validation, les règles non définies restent bloquées, et les paramètres de tendance restent à confirmer par défaut.
- Le tableau de bord affiche l’état du scan et les dernières données disponibles ; aucun indicateur de scan ou quota n’est fabriqué lorsqu’il est inconnu.
- Les styles de l’interface garantissent une taille minimale de 13 px, un texte secondaire d’au moins 14 px et des commandes tactiles d’au moins 44 px.
- En-têtes de sécurité ajoutés ; le cookie de session devient Secure en production par défaut. Les canaux/API réels restent non vérifiés et sans appels réels.
- `backend/public/admin-assets/hot` est ignoré par Git. Le guide [`DEPLOIEMENT.md`](./DEPLOIEMENT.md) décrit Nginx, Supervisor, HTTPS, sauvegardes, rotation et contrôles sans effectuer de déploiement.
- Test du quota nul et tests des API admin ajoutés.

### Statistiques réelles API-Football (11 novembre 2026)

- Capture du match couvert 1644163 copiée sans modification dans `backend/database/fixtures/api-football/fixtures-statistics-covered.json`.
- `ApiFootballMapper` lit uniquement `Total Shots`, `Shots on Goal`, `Corner Kicks` et `Ball Possession` (`"40%"` → `40`). Chaque entrée est associée au domicile ou à l’extérieur par son `team.id`, comparé aux identifiants d’équipes de `fixtures?live=all`, et non par l’ordre de la réponse. Une valeur absente ou `null` reste non disponible, jamais 0 ; une équipe inconnue est ignorée.
- Le pilote réel transmet au mapper la réponse de chaque match interrogé, et non plus seulement la première.
- Format réel : `statistics.home` et `statistics.away`, chacun avec `shots`, `shots_on_target`, `corners` et `possession`. Les scénarios fake gardent leurs valeurs agrégées ; l’interface ne les présente pas comme des valeurs par équipe.
- Page **Matchs suivis** : une fiche par match suivi affiche ces quatre valeurs brutes par équipe. La vitalité n’est pas calculée ; sans valeur fournie, elle est affichée « Non calculable : normalisation non définie ».
- Cotes bet 23 dans `odds-live-bet23-20261111-184704-489376.json` (seule capture contenant ces matchs) : 1638318, 1644157, 1644159 et 1644160 ont des cotes non suspendues et un statut non arrêté. 1644163 et 1644162 ont des cotes non suspendues, mais sont à la mi-temps avec `status.stopped = true` ; le mapper les écarte donc dans cette capture.
- Vérification : `php artisan test` — 105 tests réussis, 559 assertions ; `vendor\bin\pint --test` — réussi ; `npm test` — 4 tests réussis ; `npm run lint` — réussi ; `npm run build` — réussi.

### Statistiques limitées aux matchs suivis (11 novembre 2026)

- Le scan demande `fixtures/statistics` uniquement pour les matchs suivis actifs, un appel par match, à la cadence `scan.statistics_interval_seconds`. Un match live non suivi ne déclenche jamais d’appel statistiques. La commande de faisabilité garde son échantillon d’un match.
- Quota : le quota restant est relu après chaque appel. Le seuil d’alerte de cette étape est remplacé par le mode économie de l’annexe (voir partie B) ; l’arrêt n’a plus lieu qu’à quota nul.
- Échec des statistiques d’un match (connexion, HTTP, champ `errors`) : ce match est consigné `statistics_unavailable`, sans vitalité ni alerte ; les autres matchs continuent.
- Match arrêté (`status.stopped = true` dans `odds/live`, par exemple la mi-temps) : ses cotes et statistiques sont conservées dans l’instantané, mais il est consigné `match_stopped` et ne reçoit aucune alerte. Le mapper ne les écarte plus du flux de cotes.
- Un match API-Football est considéré en cours selon les codes « In Play » de la documentation (`1H`, `HT`, `2H`, `ET`, `BT`, `P`, `SUSP`, `INT`, `LIVE`).
- Tests `ScanRealStatisticsTest` avec `Http::fake` : 10 matchs live, 3 suivis, exactement 3 appels statistiques.
- Vérification : `php artisan test` — 113 tests réussis, 604 assertions ; `vendor\bin\pint --test` — réussi ; `npm test` — 4 tests réussis ; `npm run lint` et `npm run build` — réussis.

### Partie A — Règles de l’annexe Phase 1 corrigée (13 novembre 2026)

- **Vitalité** calculée par `VitalityCalculator` avec le barème de l’annexe (paramètre modifiable) : totaux des deux équipes, possession de l’équipe la plus haute, bornes incluses. Minimum 41 ; une statistique manquante rend l’indice non calculable. Exemples Atlético – Osasuna = 40 (mort) et Bayern – Dortmund = 90 (vivant) testés. Le scan calcule la vitalité depuis les statistiques réelles par équipe.
- **Tendance** sur la cote du score suggéré : baisse de plus de 5 % validée ; stable ou hausse : abstention ; exactement 5 % : abstention à confirmer.
- **F121-E1** (écart négatif → alerte Critique) et **F121-E2** (Under 2.5 entre 1.15 et 1.40 à la mi-temps → Over 0.5 en 2e MT, seule alerte possible à la mi-temps) remplacent F121-E.
- **F121-D** : seuil 8.00 inclus, décision Over 4.5, scores couverts en paramètre (2-2, 2-3, 3-2 — 2-2 à confirmer).
- **Ordre de décision** paramétrable, lu dans les exemples du client et marqué « à confirmer » : E2, D, désignation, vitalité, tendance, écart. Niveaux « Critique » et « Haute » modifiables. La convergence devient une étape facultative, absente de l’ordre par défaut.
- **Bet 36 (Over/Under Line)** : absent des captures. `php artisan api-football:capture --fixture=<id> --bet36` enregistre la réponse sans la mapper ; le pilote réel de la cote Under 2.5 attend cette capture. Le pilote fictif fournit la cote (scénario `halftime-signal`).
- Simulateur : mi-temps, cote Under 2.5, vitalité et tendance facultatives, niveau d’alerte et trace de l’ordre de décision.
- Les 10 situations de l’annexe sont dans `backend/tests/Unit/AnnexSituationsTest.php` : 1, 9 et 10 réussissent avec l’ordre complet ; 2 et 3 réussissent sur les étapes dont l’annexe donne les données ; 4 à 8 sont marquées « en attente du fichier Excel du client ». Les situations 6 et 7 contredisent les règles écrites (voir `DECISIONS_ANNEXE_PHASE1.md`).

### Partie B — Quota et matchs surveillés (13 novembre 2026)

- **Seuil d’alerte : 10 % du quota journalier**, lu dans `x-ratelimit-requests-limit` (`scan.quota_economy_percent`). Lorsque les requêtes restantes atteignent ce pourcentage, une alerte part une seule fois par le canal de notification existant (WhatsApp, Telegram en repli) et le scan passe en **mode économie** au passage suivant. L’envoi par e-mail est hors périmètre tant que le client ne donne pas l’adresse.
- **Mode économie** : classement de chaque match suivi sur son dernier instantané. Chaud (écart < 1.50 ou cote en baisse) : scanné toutes les 30 s. Calme : toutes les 2 min. Écart > 2.00 : pas de scan. Écart entre 1.50 et 2.00 : calme, **à confirmer**. Match sans instantané exploitable : calme. Seuils et fréquences sont des paramètres.
- **Quota nul** : le live s’arrête avec « Quota épuisé. Le live est arrêté. Rechargez le quota. », le message est journalisé, notifié une fois et affiché dans le tableau de bord ; `scan:run` se termine.
- **Suivi automatique** (`scan.auto_mode`, actif par défaut selon l’annexe) des ligues `scan.auto_league_ids` : Premier League 39, Liga 140, Serie A 135, Bundesliga 78, Ligue 1 61, Ligue des champions 2, Europa League 3. Seuls les matchs live ayant à la fois des cotes de score exact non suspendues et une couverture statistique confirmée sont suivis. La couverture n’est demandée (une fois par heure, en cache) que si un match live appartient à ces ligues. Un match automatique terminé est retiré ; un retrait manuel n’est jamais annulé par le mode automatique. Le Scan Ciblé manuel reste disponible.
- Le pilote fictif n’a pas de match dans ces ligues : le suivi automatique est testé avec `Http::fake` (`ScanRealStatisticsTest`).

### Premier scan réel et interface en mode réel (13 novembre 2026)

- **Cotes Under 2.5 (pari 36)** : à 20 h 26, 46 matchs étaient en direct, mais aucun dans les ligues suivies (trêve internationale). Aucune capture bet 36 n’a donc été faite ; le pilote réel de F121-E2 reste à écrire après une vraie réponse.
- **Scan réel** (`php artisan scan:once`, pilotes `real` et `api_football`) sur Serbie – Allemagne (Ligue des nations, 1528965) et Leganés – Burgos (Segunda División, 1570019), choisis pour leurs cotes bet 23 et leur couverture statistique. Trois appels ; quota restant 93/100. Journal :
  - Serbie 0-2 Allemagne, 42′ : F121-C.2 désigne l’Allemagne, écart 4.00 − 6.50 = −2.50 (candidat F121-E1 Critique) ; vitalité 60 ; tendance non calculable faute d’instantané de plus de deux minutes, donc abstention, conforme à l’ordre de décision.
  - Leganés 3-0 Burgos, mi-temps : seul F121-E2 est permis ; abstention, car la cote Under 2.5 est indisponible. Statistiques conservées, vitalité 50.
- Un profil de règles actif (les 5 règles définies, sans poids) a été créé localement pour ce scan ; les anciens matchs suivis, terminés, ont été retirés.
- Interface : le texte sur les données fictives n’apparaît plus qu’en simulation ; la vitalité et la tendance suivent l’annexe. Le pilote réel lit l’horaire (`fixture.date`) et ajoute le pays à la compétition (« Primera División · Uruguay »).
- `backend/public/admin-assets/app.js`, `app.css` et `hot` ne sont plus suivis par Git ; `npm run build` est obligatoire sur le serveur (voir `DEPLOIEMENT.md`).

### Cote Under 2.5 réelle, fréquences permanentes et scan continu réel (13 novembre 2026)

- **Pari 36** capturé en un appel (43 matchs en direct, hors ligues suivies) et copié dans `backend/database/fixtures/api-football/odds-live-bet36.json`. Le pilote lit la valeur `Under` de handicap 2.5 ; il n’appelle le pari 36 que si un match suivi est à la mi-temps.
- **Fréquences permanentes** : chaud toutes les 30 s, calme toutes les 2 min, écart > 2.00 jamais ; en économie, chauds seulement. Chaque passage rafraîchit l’instantané de tous les matchs suivis sans appel supplémentaire.
- **`scan:run` réel de 10 minutes** (20 h 51 – 21 h 01) sur Serbie – Allemagne : 24 passages, 24 instantanés, 60 requêtes consommées (quota 89 → 29 sur 100). Journal :
  - mi-temps (0-2) : abstention, aucune ligne Under 2.5 proposée pour ce match ;
  - 47′ : **alerte Critique F121-E1** « prochain but Allemagne » (écart 3.75 − 6.00 = −2.25, tendance −6.25 %, vitalité 70) ; les passages suivants sont dédoublonnés ;
  - de 48′ à 50′ : abstentions « cote stable » (baisse inférieure à 5 %) ;
  - **but 0-3 à 50′** : alerte précédente invalidée, réévaluation immédiate, nouvelle alerte Critique (écart −1.50, tendance −26.32 %), relance toutes les 15 s pendant 2 minutes ;
  - de 52′ à 55′ : abstentions « cote stable » ;
  - 56′ : cotes de score exact absentes du flux à ce passage, incident consigné sans réutiliser d’anciennes cotes.
- Les alertes sont restées « en file » : `QUEUE_CONNECTION=database` exige `php artisan queue:work` en parallèle du scan pour les envoyer (canal `log` en mode fictif ici).
- Avec 100 requêtes par jour, 10 minutes de suivi d’un seul match consomment 60 % du quota.

### Module 3.6, acceptation, robustesse, déploiement et sécurité (14 novembre 2026)

Détails et tableaux : [`CONFORMITE_PHASE1.md`](./CONFORMITE_PHASE1.md). Guide du client : [`GUIDE_ADMIN.md`](./GUIDE_ADMIN.md).

- **Module 3.6 (moteur de règles modulaire)** : plusieurs profils (créer, sauvegarder, activer), méthodes et poids par profil (vides tant que non confirmés), seuil de validation par profil, « Tester la combinaison » avec affichage du score de confiance. La convergence est une étape facultative de l’ordre de décision, **désactivée par défaut** (`rules.convergence_enabled`). Le constructeur no-code reste hors Phase 1.
- **Critères d’acceptation (section 8 du CDC Phase 1)** : tests automatiques pour le délai d’alerte (canal `log`), le refus des trois filtres noté au Journal, le taux de réussite par règle et l’application des paramètres au scan suivant. **Non conforme** tant que le fichier Excel des dix situations manque ; WhatsApp à mesurer quand il sera branché.
- **Robustesse de `scan:run`** : erreur isolée par match et par passage, reconnexion à la base, arrêt propre (SIGTERM ou `php artisan scan:stop`), limite mémoire relancée par Supervisor, pas d’alerte en double après redémarrage, clés et jetons masqués dans les journaux.
- **Déploiement** (non effectué) : dossier `deploy/` prêt à copier (`.env.production.example`, Nginx, Supervisor, sauvegarde quotidienne, logrotate, `deploy.sh`), commande `php artisan admin:delete-test` et liste de contrôle avant livraison dans [`DEPLOIEMENT.md`](./DEPLOIEMENT.md).
- **Sécurité** : codes TOTP non réutilisables, temps de réponse identique pour un email inconnu, Content-Security-Policy avec nonce. Historique Git parcouru : aucun secret.
- **Journal** : décisions affichées en français (Abstention, Doublon évité, But détecté, Incident…).

### Complément 2 de l’annexe : ordre de décision et 10 situations (15 novembre 2026)

- Nouvel ordre de décision (paramètre `rules.decision_pipeline`) : F121-E2 à la mi-temps, F121-D (au moins 4 buts, à confirmer ; cotes à venir ≤ 8.00), vitalité ≤ 40, forte baisse de plus de 5 % (F162-Bis, alerte Critique prioritaire sur l’écart), hausse (abstention), écart négatif (F121-E1, Critique), écart > 0.50 (F121-G, abstention), 0 < écart ≤ 0.50 (Haute), sinon abstention.
- La tendance n’exige plus une forte baisse : seule une hausse bloque. F121-A (1.50) et la règle 0-0 restent des paramètres inactifs.
- Règle facultative « abstention s’il reste moins de N minutes de jeu » (N = 10), désactivée par défaut, à confirmer.
- `AnnexSituationsTest` : les 10 situations, avec statistiques et cotes à T−2 min du complément 2, passent toutes ; plus aucun test en attente.
- Les écarts avec le pseudo-code du client sont listés dans [`DECISIONS_ANNEXE_PHASE1.md`](./DECISIONS_ANNEXE_PHASE1.md).

## Guide de démarrage et de test local

### 1. Démarrer les deux serveurs et ouvrir la connexion

Dans un premier terminal PowerShell :

```powershell
Set-Location C:\wamp64\www\pronofoot\backend
php artisan serve --host=127.0.0.1 --port=8001
```

Dans un deuxième terminal PowerShell :

```powershell
Set-Location C:\wamp64\www\pronofoot\frontend
npm run dev
```

Vite ouvre le navigateur automatiquement sur `http://127.0.0.1:5174/` et redirige vers la connexion Laravel `http://127.0.0.1:8001/login`. Le port `8000` est déjà utilisé par un autre projet sur cette machine, donc PronoFoot utilise `8001`. Le port Vite `5173` pouvant aussi être occupé par cet autre projet, PronoFoot utilise `5174` par défaut. Si le navigateur ne s’ouvre pas, saisis directement l’adresse `http://127.0.0.1:8001/login`. Garde les deux terminaux ouverts pendant le développement.

La session web utilise le cookie `pronofoot-session`, afin d’éviter les collisions avec les cookies d’autres projets locaux servis sur `127.0.0.1`.

Le fichier `backend/public/admin-assets/hot` est automatiquement réglé sur le port Vite utilisé. Pour changer le port Laravel, modifie `APP_URL` dans `backend/.env` et définis l’adresse correspondante dans `VITE_BACKEND_URL` avant `npm run dev`. Pour choisir un autre port Vite, définis `VITE_PORT` avant de lancer Vite.

Pour reconstruire les ressources de production servies par Laravel :

```powershell
Set-Location C:\wamp64\www\pronofoot\frontend
npm run build
```

### 2. Créer ou réparer le compte de test

Dans PowerShell, depuis `backend/` :

```powershell
Set-Location C:\wamp64\www\pronofoot\backend
php artisan admin:create-test
```

La commande crée une seule fois le compte local et affiche l’adresse `admin-test@pronofoot.local` et un mot de passe temporaire généré. Conserve ce mot de passe de façon privée. En environnement `local`, ce compte de test se connecte avec ces deux informations seulement ; le code TOTP n’est pas demandé.

Si le mot de passe initial est perdu, remplace-le sans l’afficher dans le terminal :

```powershell
php artisan admin:test-password-reset
```

Au formulaire de connexion ouvert par Vite, saisis l’adresse `admin-test@pronofoot.local` et le mot de passe temporaire ou le nouveau mot de passe. Les autres comptes administrateur conservent le code TOTP, et la double authentification reste obligatoire hors de l’environnement local. Ne partage jamais le mot de passe.

### 3. Vérifier les pages de l’interface

Après connexion, essaie les rubriques du menu :

- **Vue d’ensemble** : les compteurs à zéro et l’état en attente sont normaux avant l’intégration des API et du scan.
- **Matchs suivis** : liste vide attendue avant l’intégration des clients API.
- **Moteur de règles** : vérifie que les règles documentées, partielles et non définies sont distinguées.
- **Testeur manuel** : essaie le cas du CDC ci-dessous.
- **Journal** : vide jusqu’à l’étape de journalisation.
- **Paramètres** : seuils affichés à titre de référence ; ils ne sont pas encore enregistrés.
- **Déconnexion** : renvoie à la connexion ; `/admin` redemande une session authentifiée. La racine Vite te ramène directement à cette connexion.

### 4. Tester le moteur avec l’exemple du cahier des charges

Dans **Testeur manuel**, utilise :

- score : `0` – `0` ;
- cotes des scores exacts :
  ```text
  0-0 = 7,50
  1-0 = 8,60
  0-1 = 9,80
  ```
- vitalité : `61` ;
- variation des cotes sur deux minutes : `-6`.

Clique sur **Évaluer la situation**. Résultats attendus : F121-C sélectionne l’équipe à domicile ; son écart est `1,10`, entre 0 et `1,50` ; vitalité et baisse de plus de 5 % validées : alerte Haute théorique. Avec une variation de `-1` (stable), la décision devient une abstention. Aucune alerte réelle n’est envoyée.

Pour vérifier le refus du filtre de vitalité, recommence avec `40` : vitalité doit être refusée et aucune alerte ne doit être déclenchée. Pour vérifier le cas 0–0 spécial, utilise une cote 0–0 inférieure à `2,50` et un écart exactement égal à `1,00` : il doit être refusé car le seuil est strictement inférieur.

### 5. Lancer les vérifications automatisées

Backend Laravel :

```powershell
Set-Location C:\wamp64\www\pronofoot\backend
php artisan migrate:status
php artisan test
vendor\bin\pint --test
```

Frontend React :

```powershell
Set-Location C:\wamp64\www\pronofoot\frontend
npm test
npm run lint
npm run build
```

Les tests automatisés ne remplacent pas les dix situations complètes avec décisions attendues que l’administrateur doit encore fournir pour valider l’acceptation métier.

## Ce qui reste à faire

### Règles et décisions client à obtenir

- Liste complète et à jour : [`A_FOURNIR_PAR_LE_CLIENT.md`](./A_FOURNIR_PAR_LE_CLIENT.md).
- Confirmer les écarts entre l’ordre de décision appliqué et le pseudo-code du complément 2, le seuil de 4 buts de F121-D, la règle facultative des minutes restantes et la place de la convergence.
- Confirmer les points du mode économie (écart entre 1.50 et 2.00, définition d’une baisse de cote, 10 % inclus, fréquences hors économie) et fournir l’adresse e-mail des alertes de quota.
- Capturer le pari 36 pendant un match des ligues suivies pour brancher la cote Under 2.5 réelle (F121-E2).
- Définir les formules manquantes de F121-K, F121-T, F121-X, F122, F124 et F126 avant de les activer.
- Clarifier les bornes exactes des seuils lorsque les documents ne disent que « inférieur » ou « supérieur ».
- Fournir les clés API, comptes de notification autorisés, domaine et serveur lorsque le client sera prêt à financer et valider une mise en réel.

### État des étapes

5. **Terminé :** pilotes fake et real prudents, commande de faisabilité et capture sans clés.
6. **Terminé :** scan paramétrable, instantanés, relance après but, anti-doublon et expiration.
7. **Terminé en mode fake/log :** file d’attente, bouton de test et repli simulé. WhatsApp et Telegram réels restent bloqués tant que leurs comptes et formats ne sont pas validés.
8. **Terminé pour la préparation logicielle :** API et interface d’administration, journal, statistiques et guide de déploiement. La mise en production elle-même n’est pas incluse.

### Contrôles de l’étape 8

- Validation finale (2026-11-08) : `php artisan test` — 78 tests réussis, 353 assertions ; `vendor\bin\pint --test` — réussi ; `npm test` — 3 tests réussis ; `npm run lint` — réussi ; `npm run build` — réussi.
- `php artisan migrate:status` confirme que les migrations locales sont appliquées.
- `php artisan feasibility:test` — mode simulation explicite, 6 matchs live Odds et 7 Football fictifs, scores exacts/Over-Under et statistiques présents dans les fixtures ; fréquences non fournies donc estimation horaire non calculée.
- Vérification HTTP locale : `/` sur le port Vite 5174 redirige vers `/login` sur Laravel 8001 ; la page de connexion répond 200 et inclut `X-Frame-Options: DENY`.
- Vérification CSS : aucune déclaration `font-size` inférieure à 13 px. La vérification visuelle de l’espace admin authentifié reste à réaliser dans un navigateur équipé d’un moteur Playwright.
- En développement, démarrer `php artisan serve --host=127.0.0.1 --port=8001` depuis `backend/` et `npm run dev` depuis `frontend/` dans deux terminaux. Laravel sert l’application sur le port 8001 et Vite redirige sa racine vers la connexion Laravel. Vite utilise le port 5174 par défaut pour éviter le port 5173 déjà occupé sur cette machine. Quand Vite n’est pas lancé, Laravel utilise les ressources compilées par `npm run build`.

Les limites et informations client requises sont listées dans [`A_FOURNIR_PAR_LE_CLIENT.md`](./A_FOURNIR_PAR_LE_CLIENT.md). Le passage progressif aux fournisseurs réels est décrit dans [`PASSER_EN_REEL.md`](./PASSER_EN_REEL.md) ; aucun appel payant n’est effectué en suivant les contrôles fake.

## Vérifications locales

Depuis `backend/` :

```powershell
php artisan migrate:status
php artisan test
vendor\bin\pint --test
```

Pour créer le compte administrateur la première fois :

```powershell
php artisan admin:create
```

Cette commande est prévue pour le compte client : elle exige une application TOTP pour enrôler et vérifier son authentificateur.

Pour accéder à l’interface pendant le développement local sans installer d’application TOTP :

```powershell
php artisan admin:create-test
```

La commande crée un compte local réservé aux tests, puis affiche une adresse courriel, un mot de passe temporaire généré et le code TOTP courant. Ce code expire après 30 secondes. Pour en obtenir un autre :

```powershell
php artisan admin:test-code
```

Utilise ces identifiants sur la page `/login` du backend Laravel. Ces commandes ne sont disponibles que si `APP_ENV=local`. Supprime le compte de test avant toute livraison.

Si le mot de passe initial du compte de test est perdu :

```powershell
php artisan admin:test-password-reset
```

Saisis deux fois un nouveau mot de passe d’au moins 12 caractères. La valeur est masquée au terminal et n’est jamais réaffichée.

Ne partage jamais un secret TOTP d’enrôlement, un code à usage unique ou un mot de passe.

## Sécurité et limites de l’environnement

- L’utilisateur MySQL `root` sans mot de passe est réservé au WampServer local de développement. Ne pas reprendre ce réglage sur un serveur ou un environnement exposé.
- Garder `APP_KEY`, mots de passe, secrets TOTP et futures clés API privés. `.env` ne doit pas être versionné.
- Avant tout déploiement : compte MySQL dédié avec mot de passe fort, HTTPS, configuration de production sans débogage, sauvegardes et procédure de récupération 2FA à définir.
- Le projet ne passe aucun pari et ne doit pas automatiser cette action.
### Tendance

Le calcul préparé compare la cote du score exact de l’équipe ciblée par la règle, entre la cote courante et le dernier instantané dont les données de cotes datent d’au moins deux minutes :

`(cote actuelle − cote à −2 min) / cote à −2 min × 100`

Selon l’annexe, seule une baisse strictement supérieure à `tendance_seuil_stable` (5 %) valide la tendance ; une variation stable ou une hausse donne une abstention, et une baisse exactement égale au seuil reste à confirmer (abstention). Une référence manquante ou trop récente provoque l’abstention.
