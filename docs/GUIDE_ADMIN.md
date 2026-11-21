# PronoFoot — Guide de l’administrateur

Ce guide explique comment utiliser l’administration de PronoFoot au quotidien.

**À retenir :** PronoFoot repère des situations de match et vous envoie un signal. **Il ne place jamais de pari.** Aucun gain n’est garanti. Jeu réservé aux 18 ans et plus.

## 1. Se connecter

1. Ouvrez l’adresse de PronoFoot (par exemple `https://pronofoot.example.com/login`).
2. Saisissez votre adresse e-mail, votre mot de passe, puis le **code à 6 chiffres** affiché par votre application d’authentification (Google Authenticator, Microsoft Authenticator…).
3. Chaque code ne sert qu’une fois et change toutes les 30 secondes. En cas d’erreur, attendez le code suivant.
4. Après 5 essais ratés, attendez une minute avant de réessayer.

Si le code d’authentification est temporairement désactivé (`AUTH_TWO_FACTOR_ENABLED=false` dans `.env`), le champ du code n’apparaît pas : l’adresse et le mot de passe suffisent.

Pour vous déconnecter, utilisez le bouton **Se déconnecter** en haut à droite de chaque page, à côté de vos initiales. Sur téléphone, touchez le menu ☰ en haut à gauche : le panneau qui s’ouvre contient la navigation, l’état du scan et le bouton **Se déconnecter**. Les listes de matchs s’y affichent en cartes. Ne partagez jamais votre mot de passe ni vos codes.

## 2. Les pages de l’administration

| Page | À quoi elle sert |
|---|---|
| **Tableau de bord** | Quatre indicateurs (matchs suivis, alertes actives, quota API restant, fréquence de scan), une carte par alerte active (niveau, minute et score, score suggéré, cote, écart, compte à rebours) et le tableau des matchs suivis avec leur vitalité et leur décision. L’état du scan et l’heure du dernier relevé sont en bas du menu. Un bandeau orange apparaît en mode économie, rouge quand le quota est épuisé. |
| **Matchs suivis** | Choisir les matchs à surveiller, voir leur fiche (tirs, tirs cadrés, corners, possession de chaque équipe, vitalité). |
| **Moteur de règles** | Les règles disponibles, et vos **profils** : méthodes activées, poids, seuil de validation. Vous pouvez créer un profil, l’enregistrer, l’activer et le tester. Un nouveau profil démarre avec les règles par défaut cochées ; un avertissement rouge s’affiche si le profil actif n’a aucune règle cochée (aucune alerte de règle possible). Une règle décochée ne donne jamais d’alerte. |
| **Testeur manuel** | Essayer une situation (score, cotes, vitalité, tendance, mi-temps) pour voir la décision du moteur. Rien n’est envoyé. |
| **Journal des décisions** | Tout ce que le système a vu et décidé, match par match. C’est ici que vous notez si une alerte a été gagnée ou perdue. |
| **Statistiques** | Le nombre d’alertes et le taux de réussite (gagnées ÷ (gagnées + perdues), annulées et en attente exclues), au total, par règle et par type d’option (ciblée, neutre…). Deux taux : sur toutes les options (résultat automatique) et sur les seules options que vous avez marquées « jouées ». Filtre par dates. |
| **Paramètres** | Les seuils et fréquences (vitalité, tendance, écarts, quota, ligues suivies…). Une modification s’applique au passage suivant du scan. Les lignes marquées « À confirmer » attendent une décision de votre part. |

**Les deux équipes sont évaluées.** À chaque relevé, PronoFoot regarde le prochain but de l’équipe à domicile et celui de l’équipe à l’extérieur, chacun avec son écart et sa tendance. Chaque alerte propose des options, et aucune n’est jouée automatiquement. Si une seule équipe donne un signal : option 1 ciblée « prochain but de l’équipe » (score, cote, écart), puis option 2 neutre « un but de plus dans le match » (Over 1.5 à 1-0, Over 4.5 à 2-2…), avec sa cote quand le marché Over/Under est disponible. Si les deux équipes donnent un signal : pas d’équipe désignée, option neutre seule. La justification du Journal détaille les deux côtés.

**Fin d’un match.** Dès que le fournisseur indique la fin (FT, AET, PEN, reporté, annulé…), le match est retiré du suivi, ses alertes actives expirent et une seule ligne « Match terminé : suivi arrêté » est inscrite au Journal ; il ne consomme plus aucune requête. Un match absent du flux en direct pendant 4 relevés (environ 2 minutes), ou commencé depuis plus de 4 h 30, est aussi retiré. Le temps additionnel et les prolongations ne terminent pas un match ; les tirs au but ne sont pas analysés. Quand plus rien n’est à suivre, le scan espace ses appels (paramètre « Pause sans match à suivre »).

**Matchs sans statistiques.** Un match dont la ligue ne fournit pas de statistiques peut être suivi s’il a des cotes de score exact (badge « Sans stats ») : la vitalité n’est pas disponible et son filtre n’est pas appliqué (à confirmer), les alertes le mentionnent. Sans cotes, « Suivre » reste indisponible et la raison est affichée. Paramètre « Autoriser le suivi sans statistiques ».

**Matchs à venir aujourd’hui.** Sous les rencontres en direct, la liste des matchs du jour pas encore commencés (heure, compétition, équipes), avec le même filtre par championnat et la même recherche. Elle est relue au plus toutes les 15 minutes. **Suivre dès le coup d’envoi** planifie le suivi : rien n’est demandé au fournisseur avant le coup d’envoi, puis le suivi démarre tout seul dès que le match est en direct. **Annuler** retire la planification.

**Cote du pari neutre.** Dans une alerte, l’option « un but de plus dans le match » affiche sa cote quand le marché Over/Under est disponible ; elle est demandée une seule fois, au moment où l’alerte est créée.

**Mode de scan.** En haut de « Matchs suivis » et de « Paramètres » : **Automatique** (les 7 championnats suivis et vos matchs) ou **Manuel** (seulement les matchs que vous ajoutez), et **Pause / Reprendre** (en pause, aucune requête n’est faite). Le changement s’applique au tour suivant du scan, sans redémarrage ; il apparaît dans l’historique des paramètres. L’état (« Scan automatique », « Scan manuel », « Scan en pause ») est rappelé en bas du menu.

**Journal plus court.** Quand un relevé donne exactement la même décision et la même justification que le précédent pour un match, la ligne existante est mise à jour (« N relevés identiques depuis… ») au lieu d’en ajouter une.

Dans le tableau des matchs suivis, la colonne **Décision** affiche le niveau de l’alerte active du match (Alerte Critique, Alerte Haute…). Sans alerte, elle indique **Surveillance**, ou **Match mort · abstention** quand la vitalité est sous le minimum réglé dans Paramètres. Chaque état porte toujours un libellé, pas seulement une couleur.

Un bandeau **« Mode simulation »** en haut de page signifie que les données sont fictives : elles servent aux essais, pas aux vrais matchs.

## 3. Suivre un match

Deux possibilités, qui fonctionnent ensemble :

- **Suivi automatique** : si le paramètre « Suivi automatique des championnats majeurs » est activé, PronoFoot suit tout seul les matchs en direct de la Premier League, de la Liga, de la Serie A, de la Bundesliga, de la Ligue 1, de la Ligue des champions et de l’Europa League, à condition que le match ait des cotes de score exact et des statistiques. Un match terminé est retiré automatiquement.
- **Scan ciblé (choix manuel)** : ouvrez **Matchs suivis**, cliquez sur **Actualiser**, puis sur **Suivre** à côté du match voulu. Au-dessus du tableau, des pastilles filtrent par championnat, avec le nombre de matchs en direct de chacun : **Tous** (les 7 championnats suivis), un championnat précis, ou **Autres** (toutes les autres compétitions du fournisseur). Le champ de recherche (équipe ou compétition) se combine avec ce filtre. Le choix reste dans l’adresse de la page (`?ligue=`) : après un rechargement, la page et le filtre sont conservés. Les matchs suivis ou en alerte sont en tête, puis les plus avancés dans le temps ; 15 lignes s’affichent, **Afficher plus** charge la suite. Le bouton est grisé (« Indisponible ») si le match n’a pas de cotes de score exact ou pas de statistiques : survolez-le pour lire la raison. Pour arrêter, cliquez sur **Retirer** : un match retiré à la main n’est jamais repris par le suivi automatique.

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
| Options : décision et résultat | Pour chaque option de l’alerte (ciblée, neutre, Over 4.5, Over 0.5 en 2e mi-temps) : votre **décision** (Jouée, Ignorée, Non renseignée) et le **résultat** (Gagnée, Perdue, Annulée, En attente). |

Le filtre en haut de page permet d’afficher seulement les alertes envoyées, en attente, expirées, etc.

**Résultat automatique.** À la fin du match, PronoFoot calcule seul le résultat de chaque option à partir des scores relevés (pastille **Auto**) :

- **Ciblée** « Prochain but [équipe] » : gagnée si cette équipe marque le prochain but, perdue si l’autre équipe marque d’abord ou si plus aucun but n’est marqué. Un but contre son camp compte pour l’équipe qui en profite.
- **Neutre** « Un but de plus » : gagnée si au moins un but est marqué après l’alerte.
- **Over 4.5** (F121-D) : gagnée si le match finit avec 5 buts ou plus.
- **Over 0.5 en 2e mi-temps** (F121-E2) : gagnée si au moins un but est marqué en 2e mi-temps.
- Match arrêté, abandonné ou annulé : **Annulée**, sans effet sur les statistiques.

Vous pouvez corriger un résultat dans la liste : il passe en **Manuel** et n’est plus recalculé. Indiquez aussi si vous avez **joué** l’option : les Statistiques donnent un second taux sur vos seules options jouées. Deux réglages, à confirmer, sont dans Paramètres : la validité du pari (fin du match ou durée de l’alerte) et la prise en compte de la prolongation.

Sur téléphone, le Journal s’affiche en cartes : match, score, règle, décision, justification repliable, puis les listes Décision et Résultat de chaque option, sans défilement horizontal.

Quelques événements fréquents :

- **But détecté** : un but vient d’être marqué. L’alerte précédente du match est **invalidée** et PronoFoot attend la première cote après le but (le bookmaker rouvre ses cotes).
- **Alerte expirée** : 15 minutes sont passées sans but. Le signal n’est plus valable.
- **Doublon évité** : une alerte identique est déjà active pour ce match ; aucune nouvelle alerte n’est envoyée.
- **Incident** : une donnée manquait (cotes absentes, statistiques indisponibles, match introuvable). Le match est simplement ignoré à ce passage.
- **Pas de scan (écart trop grand)** : l’écart du match dépasse 2,00, PronoFoot arrête de l’analyser. Une seule ligne est écrite à ce moment-là, puis une ligne **Scan repris** quand l’écart redescend.
- **Après un but** (règles du complément 4) : pendant 2 minutes, PronoFoot relève les cotes toutes les 15 secondes. Au **premier relevé** après le but, il décide tout de suite : écart négatif → **Alerte Critique** ; écart entre 0 et 0,50 (0 compris) → **Alerte Haute** ; écart au-delà de 0,50 → il attend. Aux **relevés suivants**, seule une baisse de plus de 5 % par rapport à cette première cote donne une **Alerte Critique** ; sinon, abstention. Un match « mort » (vitalité de 40 ou moins) reste en abstention (à confirmer). Un nouveau but relance une nouvelle fenêtre. Les cotes d’avant le but sont conservées mais ne comptent plus.

## 5. Que veulent dire les décisions ?

| Décision | Signification |
|---|---|
| **Alerte Critique** | Un but de l’équipe désignée est très probable. Deux cas : la cote de son prochain but a **baissé de plus de 5 %** en deux minutes (le bookmaker a eu une information), ou cette cote est **plus basse** que celle du score actuel (écart négatif). |
| **Alerte Haute** | Un but de l’équipe désignée est probable : la cote de son prochain but est un peu plus haute que celle du score actuel (écart entre 0 et 0,50). |
| **Alerte Mi-temps** | À la mi-temps, la cote « moins de 2,5 buts » est entre 1,15 et 1,40 : signal « plus de 0,5 but en 2e mi-temps ». C’est la seule alerte possible pendant la mi-temps. |
| **Pari neutre (Over 4.5)** | Match très ouvert (par exemple 2-3) où les cotes des scores suivants sont toutes à 8,00 ou moins. |
| **Abstention** | Aucune alerte. La justification indique pourquoi : match « mort » (vitalité de 40 ou moins), cote stable ou en hausse, écart trop grand ou nul, donnée manquante… |

PronoFoot vérifie toujours dans cet ordre et s’arrête à la première condition remplie :

1. **Mi-temps** : cote « moins de 2,5 buts » entre 1,15 et 1,40 → Alerte Mi-temps ; sinon, rien pendant la mi-temps.
2. **Match ouvert** : au moins 4 buts et cotes des scores suivants à 8,00 ou moins → Pari neutre Over 4.5.
3. **Vitalité** de 40 ou moins → Abstention (match « mort »).
4. **Forte baisse** de la cote du prochain but (plus de 5 % en deux minutes) → **Alerte Critique**.
5. **Hausse** de cette cote, ou tendance pas encore calculable (moins de 2 minutes de cotes depuis le début du suivi) → Abstention.
6. **Écart négatif** → **Alerte Critique**.
7. **Écart au-delà de 0,50** → Abstention.
8. **Écart entre 0 et 0,50** → **Alerte Haute**.
9. Sinon (écart nul) → Abstention.

Dans les 2 minutes qui suivent un but, les étapes 4 à 9 sont remplacées par les règles « après un but » décrites dans la section 4 (premier relevé, puis baisse de plus de 5 % seulement).

L’alerte reçue rappelle le match, la minute, le score, le niveau (Alerte Critique, Alerte Haute…), le signal, l’écart, la vitalité, la tendance et l’heure d’expiration.

## 6. Quand le quota est épuisé

Le fournisseur de données limite le nombre de requêtes par jour : 7 500 avec le plan API-Football Pro. PronoFoot lit le quota du jour et le nombre de requêtes restantes à chaque appel ; ils s’affichent sur le Tableau de bord (« Quota API restant » et « Fournisseurs »).

- **Quand il reste 10 % du quota** (750 requêtes avec le plan Pro) : vous recevez une alerte et PronoFoot passe en **mode économie** : il ne scanne plus que les matchs « chauds » (écart sous 1,50 ou cote en forte baisse). Un bandeau orange l’indique sur le Tableau de bord.
- **Quand le quota tombe à 0** : le live s’arrête avec le message **« Quota épuisé. Le live est arrêté. Rechargez le quota. »**

Que faire :

1. Rechargez ou augmentez votre abonnement chez le fournisseur de données (API-Football), ou attendez la remise à zéro quotidienne du quota.
2. Demandez à votre prestataire de relancer le scan (voir ci-dessous).
3. Pour économiser le quota, suivez moins de matchs.

## 7. Recevoir les alertes sur Telegram

Les alertes arrivent sur Telegram, dans la conversation avec le robot PronoFoot. Exemple :

```text
ALERTE HAUTE · valable jusqu’à 21:15
Équipe A - Équipe B  0-0  34'
Prochain but : Équipe A
Cote suggérée (1-0) : 8.60 | Écart : +0.40
Vitalité : 61/100 | Tendance : stable
Règle : F121-C
Signal de détection, sans garantie de gain. Aucun pari n’est placé.
```

Vous recevez aussi : **ALERTE EXPIRÉE** (15 minutes sans but), **BUT MARQUÉ · analyse relancée** (l’alerte en cours est annulée) et **QUOTA API À 10 %**.

Pour vérifier que tout fonctionne, ouvrez **Paramètres** et cliquez sur **Envoyer un message de test** :

- « Message envoyé » en vert : le message doit apparaître sur votre téléphone dans les secondes qui suivent.
- « Attention » en orange : Telegram a échoué et le message est parti par le canal de secours (journal), ou le mode simulation est actif.
- « Échec de l’envoi » en rouge : le motif est indiqué (jeton invalide, conversation introuvable, réseau…). Transmettez-le à votre prestataire.

## 8. Lancer et arrêter le scan

Sur le serveur, le scan est lancé et surveillé automatiquement : s’il s’arrête, il redémarre seul. Le bas du menu indique **Scan en cours** et l’heure du dernier relevé.

Si vous devez intervenir (ou demander à votre prestataire de le faire), sur le serveur :

| Action | Commande |
|---|---|
| Voir l’état | `sudo supervisorctl status` |
| Arrêter le scan proprement | `sudo supervisorctl stop pronofoot-scan` (ou `php artisan scan:stop`) |
| Relancer le scan | `sudo supervisorctl start pronofoot-scan` |
| Faire un seul passage de vérification | `php artisan scan:once` (affiche chaque incident en clair) |

Le scan s’arrête toujours à la fin du passage en cours : aucune alerte n’est perdue ni envoyée deux fois. L’envoi des alertes dépend aussi du programme `pronofoot-queue`, qui doit être en état « RUNNING ».

## 9. En cas de doute

- Une alerte semble étrange : ouvrez le **Journal des décisions**, retrouvez la ligne et lisez la **Justification**.
- Vous voulez comprendre une règle : utilisez le **Testeur manuel** avec les mêmes cotes.
- Un problème persiste : notez l’heure et le match, puis contactez votre prestataire **sans jamais envoyer votre mot de passe, vos codes ou vos clés**.
