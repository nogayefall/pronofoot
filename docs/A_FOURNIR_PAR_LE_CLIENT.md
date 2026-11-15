# Informations à fournir avant la mise en réel

Dernière mise à jour : 14 novembre 2026, d’après `PRONOFOOT_Annexe_Phase1_Corrigee.pdf`.

## Décisions reçues dans l’annexe (appliquées)

Ces points ne sont plus à fournir : vitalité (barème, bornes incluses, minimum 41), tendance (cote du score suggéré, baisse de plus de 5 %), F121-E remplacée par F121-E1 (écart négatif → alerte Critique) et F121-E2 (Under 2.5 entre 1.15 et 1.40 à la mi-temps), F121-D à 8.00 inclus avec Over 4.5, seuil d’alerte du quota à 10 %, mode économie, arrêt à quota nul, suivi automatique des championnats majeurs. Le détail est dans [`DECISIONS_ANNEXE_PHASE1.md`](./DECISIONS_ANNEXE_PHASE1.md).

## Règles et décisions métier encore à confirmer

- **Ordre de décision** : le complément 2 donne les données complètes des 10 situations (toutes passent) et un pseudo-code. L’ordre appliqué s’en écarte sur neuf points (F121-E2 en premier, F121-D avant les écarts, étape « hausse », équipe désignée, tendance non calculable…) : voir le tableau de [`DECISIONS_ANNEXE_PHASE1.md`](./DECISIONS_ANNEXE_PHASE1.md). À confirmer.
- **F162-Bis et filtre d’écart** : une forte baisse déclenche une alerte même si l’écart dépasse 0.50, alors que le CDC Phase 1 exige que les trois filtres soient validés. Est-ce voulu ?
- **Règle des minutes restantes** (hors pseudo-code) : abstention s’il reste moins de 10 minutes ? Désactivée par défaut.
- **Convergence** : l’annexe ne la mentionne pas ; elle est calculée mais ne bloque plus les alertes. Faut-il la remettre dans l’ordre de décision ?
- **Baisse exactement égale à 5 %** : pas « plus de 5 % », donc pas de F162-Bis ; le moteur passe à l’écart.
- **F121-D, score « élevé »** : au moins 4 buts au total (la situation 9 est à 2-2). Seuil à confirmer.
- **Mode économie** :
  - un écart entre 1.50 et 2.00 est-il bien « calme » ?
  - un match est-il bien chaud dès que l’écart est < 1.50 ou que la cote baisse de plus de 5 % ?
  - l’alerte se déclenche-t-elle à 10 % inclus ?
  - en permanence, un match dont l’écart dépasse 2.00 n’est jamais scanné : est-ce voulu hors mode économie ?
- **Tendance après un but** : appliqué selon votre réponse — point de départ = première cote relevée après le but, variation calculée dès le relevé suivant, relevés d’avant le but conservés en base sans compter dans le calcul. À la première cote après le but, la variation vaut 0 % et les règles d’écart s’appliquent : à confirmer.
- **Module 3.6 — poids et scores des méthodes** : le CDC montre des poids 60 / 30 / 10 % pour « Écart directionnel / Vitalité / Tendance », qui ne sont pas des méthodes à score dans le moteur, et dit que « chaque méthode donne un score » sans formule. Fournir les méthodes à pondérer, leurs poids et la façon de calculer chaque score (0–100). En attendant, les poids restent vides et l’étape convergence reste désactivée.
- **Activation de la convergence** : faut-il l’ajouter à l’ordre de décision une fois les poids fournis ? Seuil de validation : 75 % (PRD) ou une autre valeur par profil ?
- **Matchs à écart > 2.00** : non scannés selon l’annexe ; le Journal note désormais une ligne à l’entrée dans cet état et une à la sortie. Cela suffit-il ?
- **Adresse e-mail** pour les alertes de quota : l’annexe cite l’e-mail, il faut une adresse. En attendant, les alertes de quota passent par le canal de notification (Telegram).
- Les formules de F121-K, F121-T, F121-X, F122, F124 et F126 : ces règles restent « non définies ».
- Confirmer les cadences de relance après but du TRD (15 secondes pendant 120 secondes).

Sans confirmation d’un paramètre nécessaire, le comportement reste l’abstention : aucune alerte n’est créée.

## Sources et pilotes réels

- **API-Football :** clé fournie et conservée dans `.env`. Liste live, statistiques par équipe et cotes de score exact (bet 23) sont mappées sur de vraies réponses. Un scan réel a été effectué le 13 novembre 2026 (voir `AVANCEMENT_PHASE1.md`).
- **Cote Under 2.5 (pari 36 « Over/Under Line »)** : capturée le 13 novembre 2026 et branchée pour F121-E2. Elle n’est demandée que lorsqu’un match suivi est à la mi-temps.
- **The Odds API :** le catalogue officiel des marchés ne documente pas les scores exacts en direct ; le pilote réel refuse de l’inventer. API-Football (`ODDS_DRIVER=api_football`) le remplace.
- Fournir un compte et un destinataire WhatsApp Business autorisés, ainsi qu’un modèle de message approuvé si nécessaire.
- **Telegram (branché)** : fournir le jeton d’un robot créé avec @BotFather et l’identifiant de la conversation de l’administrateur, à placer uniquement dans `.env` (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`). Confirmer le format des messages (exemple de la section 5 du CDC) et l’envoi des messages « alerte expirée » et « but marqué ».
- **Abstention** : le message existe, mais il n’est pas envoyé automatiquement (un match peut s’abstenir toutes les 30 secondes). Faut-il l’envoyer, et dans quels cas ?
- WhatsApp reste `NON VÉRIFIÉ` : aucun appel ni format réel n’est branché.
- Confirmer l’offre API-Football retenue : le plan Pro donne 7 500 requêtes par jour ; le compte de test actuel en donne 100, ce qui ne permet pas de suivre 30 à 50 matchs en continu. Le quota n’est pas à configurer : PronoFoot le lit à chaque appel dans les en-têtes `x-ratelimit-requests-limit` et `x-ratelimit-requests-remaining`.
- **Déploiement** : serveur, nom de domaine, mécanisme de livraison du code (accès Git ou archive), durée de conservation des sauvegardes de la base et des instantanés. Les fichiers de `deploy/` sont prêts ; aucune mise en production n’a été faite.
- Fournir un serveur et un nom de domaine lorsque la mise en production sera autorisée. Le guide [`DEPLOIEMENT.md`](./DEPLOIEMENT.md) décrit les prérequis, dont `npm run build` sur le serveur.

Les clés API, jetons et identifiants doivent être remis et configurés exclusivement dans `.env`. Ne pas les envoyer dans un dépôt Git, un journal ou un rapport. Les captures sont enregistrées localement dans `backend/storage/feasibility/`, dossier ignoré par Git.
