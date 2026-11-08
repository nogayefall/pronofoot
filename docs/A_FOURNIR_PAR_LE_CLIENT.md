# Informations à fournir avant la mise en réel

## Règles et décisions métier

- Dix situations de test complètes (score, cotes, statistiques, décision attendue et règle concernée).
- La formule de normalisation de la vitalité, ses données de référence et des exemples chiffrés.
- La valeur maximale qui définit une tendance stable sur les deux dernières minutes.
- Le choix entre les deux définitions contradictoires de F121-E.
- Les formules de F121-K, F121-T, F121-X, F122, F124 et F126.
- Les situations supplémentaires auxquelles F121-D s’applique et les conditions du choix Over 4.5 / Over 5.5.
- La confirmation des bornes inclusives ou strictes lorsque le cahier des charges ne les précise pas.
- Les fréquences de scan, de statistiques, de relance après un but et d’expiration, confirmées dans le CDC Phase 1.

Sans confirmation d’un paramètre nécessaire, le comportement reste l’abstention : aucune alerte n’est créée.

## Sources et pilotes réels

- Les fichiers `PRONOFOOT_CDC_Phase1_Signaux_Live.md` et `PRONOFOOT_CDC_V9.1.md` annoncés ne sont pas présents dans le dossier `docs/` de l’espace de travail actuellement accessible. Les rendre disponibles avant l’étape 6 pour vérifier les cadences, les seuils et la relance post-but.
- **The Odds API :** confirmer auprès du fournisseur, pour le compte et le sport ciblés, la présence du marché de scores exacts en direct. Le [catalogue officiel des marchés](https://the-odds-api.com/sports-odds-data/betting-markets.html) consulté ne documente pas ce marché ; le pilote réel refuse de l’inventer et la commande de faisabilité le signale comme non disponible. Une clé seule ne suffit pas à lever ce blocage.
- **API-Football :** fournir une clé, une URL de requête et le nom de l’en-tête d’authentification confirmés dans la documentation officielle du compte. Le mapper actuel est explicitement `NON VÉRIFIÉ` et ne lit aucun champ de réponse.
- Fournir dix réponses brutes représentatives d’API-Football obtenues avec consentement, sans données personnelles ou secrets, pour définir et tester son mapper.
- Fournir un compte et un destinataire WhatsApp Business autorisés, ainsi qu’un modèle de message approuvé si nécessaire.
- Fournir, si le repli est retenu, un bot Telegram et un identifiant de conversation, conservés uniquement dans `.env`.
- Confirmer le budget de requêtes, les limites de quotas et les règles de regroupement des matchs pour chaque API.
- Fournir plus tard un serveur et un nom de domaine pour la préparation d’une livraison. Aucun déploiement n’est réalisé pendant cette étape.

Les clés API, jetons et identifiants doivent être remis et configurés exclusivement dans `.env`. Ne pas les envoyer dans un dépôt Git, un journal ou un rapport. Les captures `feasibility:test --capture` sont enregistrées localement dans `backend/storage/feasibility/` et masquent les valeurs identifiées comme secrets.
