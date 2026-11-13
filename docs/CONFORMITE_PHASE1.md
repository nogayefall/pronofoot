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
