# PronoFoot — Guide de l’administrateur

Ce guide explique comment utiliser l’administration de PronoFoot au quotidien.

**À retenir :** PronoFoot repère des situations de match et vous envoie un signal. **Il ne place jamais de pari.** Aucun gain n’est garanti. Jeu réservé aux 18 ans et plus.

## 1. Se connecter

1. Ouvrez l’adresse de PronoFoot (par exemple `https://pronofoot.example.com/login`).
2. Saisissez votre adresse e-mail, votre mot de passe, puis le **code à 6 chiffres** affiché par votre application d’authentification (Google Authenticator, Microsoft Authenticator…).
3. Chaque code ne sert qu’une fois et change toutes les 30 secondes. En cas d’erreur, attendez le code suivant.
4. Après 5 essais ratés, attendez une minute avant de réessayer.

Pour vous déconnecter, utilisez le bouton **Déconnexion** en bas du menu. Ne partagez jamais votre mot de passe ni vos codes.

## 2. Les pages de l’administration

| Page | À quoi elle sert |
|---|---|
| **Vue d’ensemble** | L’état du scan (actif ou en attente, dernier passage), les alertes en cours avec leur compte à rebours, le quota restant chez les fournisseurs et la liste des matchs suivis. Un bandeau orange apparaît en mode économie ou quand le quota est épuisé. |
| **Matchs suivis** | Choisir les matchs à surveiller, voir leur fiche (tirs, tirs cadrés, corners, possession de chaque équipe, vitalité). |
| **Moteur de règles** | Les règles disponibles, et vos **profils** : méthodes activées, poids, seuil de validation. Vous pouvez créer un profil, l’enregistrer, l’activer et le tester. |
| **Testeur manuel** | Essayer une situation (score, cotes, vitalité, tendance, mi-temps) pour voir la décision du moteur. Rien n’est envoyé. |
| **Journal** | Tout ce que le système a vu et décidé, match par match. C’est ici que vous notez si une alerte a été gagnée ou perdue. |
| **Statistiques** | Le nombre d’alertes et le taux de réussite, au total et par règle, à partir des résultats notés dans le Journal. |
| **Paramètres** | Les seuils et fréquences (vitalité, tendance, écarts, quota, ligues suivies…). Une modification s’applique au passage suivant du scan. Les lignes marquées « À confirmer » attendent une décision de votre part. |

Un bandeau **« Mode simulation »** en haut de page signifie que les données sont fictives : elles servent aux essais, pas aux vrais matchs.

## 3. Suivre un match

Deux possibilités, qui fonctionnent ensemble :

- **Suivi automatique** : si le paramètre « Suivi automatique des championnats majeurs » est activé, PronoFoot suit tout seul les matchs en direct de la Premier League, de la Liga, de la Serie A, de la Bundesliga, de la Ligue 1, de la Ligue des champions et de l’Europa League, à condition que le match ait des cotes de score exact et des statistiques. Un match terminé est retiré automatiquement.
- **Scan ciblé (choix manuel)** : ouvrez **Matchs suivis**, cliquez sur **Actualiser**, puis sur **Suivre** à côté du match voulu. Le bouton est grisé (« Indisponible ») si le match n’a pas de cotes de score exact ou pas de statistiques. Pour arrêter, cliquez sur **Retirer** : un match retiré à la main n’est jamais repris par le suivi automatique.

Chaque match ajouté consomme des requêtes chez le fournisseur : suivez seulement les matchs qui vous intéressent.

## 4. Lire le Journal

Chaque ligne correspond à un moment où PronoFoot a regardé un match.

| Colonne | Signification |
|---|---|
| Date | Heure de l’analyse. |
| Rencontre | Le match concerné. |
| Score / minute | Le score et la minute au moment de l’analyse. |
| Règle | La règle qui a produit la décision (par exemple F121-E1, F121-D). |
| Décision | Alerte, abstention, alerte invalidée, alerte expirée, but détecté, incident… |
| Justification | La raison en clair, par exemple « La cote est stable : abstention » ou « Match “mort” : vitalité inférieure au minimum ». |
| Résultat | À remplir par vous pour chaque alerte : **Gagnée**, **Perdue** ou **Annulée**. Ce résultat alimente les Statistiques. |

Le filtre en haut de page permet d’afficher seulement les alertes envoyées, en attente, expirées, etc.

Quelques événements fréquents :

- **But détecté** : un but vient d’être marqué. L’alerte précédente du match est **invalidée** et le match est réanalysé tout de suite.
- **Alerte expirée** : 15 minutes sont passées sans but. Le signal n’est plus valable.
- **Doublon évité** : une alerte identique est déjà active pour ce match ; aucune nouvelle alerte n’est envoyée.
- **Incident** : une donnée manquait (cotes absentes, statistiques indisponibles, match introuvable). Le match est simplement ignoré à ce passage.

## 5. Que veulent dire les décisions ?

| Décision | Signification |
|---|---|
| **Alerte Critique** | Deux cas : la cote du prochain but de l’équipe désignée a **baissé de plus de 5 %** en deux minutes (le bookmaker a eu une information), ou elle est **plus basse** que la cote du score actuel (écart négatif). |
| **Alerte Haute** | L’écart est positif mais faible (0,50 au plus) : un but de l’équipe désignée est probable. |
| **Alerte Mi-temps** | À la mi-temps, la cote « moins de 2,5 buts » est entre 1,15 et 1,40 : signal « plus de 0,5 but en 2e mi-temps ». C’est la seule alerte possible pendant la mi-temps. |
| **Pari neutre (Over 4.5)** | Match très ouvert (par exemple 2-3) où les cotes des scores suivants sont toutes à 8,00 ou moins. |
| **Abstention** | Aucune alerte. La justification indique pourquoi : match « mort » (vitalité de 40 ou moins), cote stable ou en hausse, écart trop grand ou nul, donnée manquante… |

L’ordre de vérification est toujours le même : mi-temps, match ouvert (Over 4.5), vitalité (40 ou moins : abstention), forte baisse de la cote (alerte Critique), hausse de la cote (abstention), puis l’écart (négatif : Critique ; au-delà de 0,50 : abstention ; entre 0 et 0,50 : Haute). L’alerte reçue rappelle le match, la minute, le score, le signal, l’écart, la vitalité, la tendance et l’heure d’expiration.

## 6. Quand le quota est épuisé

Le fournisseur de données limite le nombre de requêtes par jour.

- **Quand il reste 10 % du quota** : vous recevez une alerte et PronoFoot passe en **mode économie** : il ne scanne plus que les matchs « chauds » (écart sous 1,50 ou cote en forte baisse). Un bandeau orange l’indique sur la Vue d’ensemble.
- **Quand le quota tombe à 0** : le live s’arrête avec le message **« Quota épuisé. Le live est arrêté. Rechargez le quota. »**

Que faire :

1. Rechargez ou augmentez votre abonnement chez le fournisseur de données (API-Football), ou attendez la remise à zéro quotidienne du quota.
2. Demandez à votre prestataire de relancer le scan (voir ci-dessous).
3. Pour économiser le quota, suivez moins de matchs.

## 7. Lancer et arrêter le scan

Sur le serveur, le scan est lancé et surveillé automatiquement : s’il s’arrête, il redémarre seul. La Vue d’ensemble indique **Actif** et l’heure du dernier passage.

Si vous devez intervenir (ou demander à votre prestataire de le faire), sur le serveur :

| Action | Commande |
|---|---|
| Voir l’état | `sudo supervisorctl status` |
| Arrêter le scan proprement | `sudo supervisorctl stop pronofoot-scan` (ou `php artisan scan:stop`) |
| Relancer le scan | `sudo supervisorctl start pronofoot-scan` |
| Faire un seul passage de vérification | `php artisan scan:once` (affiche chaque incident en clair) |

Le scan s’arrête toujours à la fin du passage en cours : aucune alerte n’est perdue ni envoyée deux fois. L’envoi des alertes dépend aussi du programme `pronofoot-queue`, qui doit être en état « RUNNING ».

## 8. En cas de doute

- Une alerte semble étrange : ouvrez le **Journal**, retrouvez la ligne et lisez la **Justification**.
- Vous voulez comprendre une règle : utilisez le **Testeur manuel** avec les mêmes cotes.
- Un problème persiste : notez l’heure et le match, puis contactez votre prestataire **sans jamais envoyer votre mot de passe, vos codes ou vos clés**.
