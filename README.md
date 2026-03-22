<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/Licence-Libre-brightgreen?style=flat-square)

<br/>

# Calculateur 1RM

**Estimez votre force maximale avec précision scientifique**

*7 formules validées · Support RPE · Tableau de charges · Export JSON*

</div>

---

## Apercu

> Section captures d'écran — à compléter avec une image de l'interface.

```
[ Capture d'écran de l'application ]
```

Ouvrez `index.html` dans votre navigateur et le calculateur est immédiatement opérationnel.
Aucune installation, aucune dépendance, aucun serveur requis.

---

## Fonctionnalites

- **7 formules scientifiques** — Brzycki, Epley, Lander, Lombardi, Mayhew, McGlothin, Wathen, calculées en parallèle avec affichage comparatif
- **Support RPE** — intégration de la table RPE (6 à 10, par demi-point) pour un résultat plus proche de la réalité
- **Tableau de pourcentages** — de 50 % à 95 % du 1RM estimé, recalculé automatiquement après chaque saisie
- **Export JSON** — sauvegarde structurée de vos résultats avec date, exercice, entrées et toutes les estimations
- **Thème sombre / clair** — bascule manuelle avec persistance via `localStorage` et respect de `prefers-color-scheme`
- **Calcul automatique** — debounce de 250 ms sur les champs poids et répétitions, Entrée clavier supportée
- **Responsive** — mise en page fluide de 320 px (mobile) à 1200 px (desktop)
- **Aucune dépendance** — HTML5, CSS3 et JavaScript vanilla, police Syne + Instrument Sans + DM Mono via Google Fonts

---

## Formules supportees

| Formule | Année | Equation | Plage optimale | Precision |
|---|---|---|---|---|
| **Brzycki** *(recommandée)* | 1993 | `Poids ÷ (1.0278 − 0.0278 × Reps)` | 2 — 10 reps | Excellente |
| **Epley** *(populaire)* | 1985 | `Poids × (1 + Reps ÷ 30)` | 1 — 8 reps | Très bonne |
| **Lander** | 1985 | `Poids ÷ (1.013 − 0.02671 × Reps)` | 2 — 10 reps | Bonne |
| **Lombardi** | 1989 | `Poids × Reps^0.10` | 1 — 15 reps | Bonne |
| **Mayhew** | 1992 | `Poids × 100 ÷ (52.2 + 41.9 × e^(−0.055 × Reps))` | 10 — 20 reps | Moyenne |
| **McGlothin** | 1984 | `Poids × 100 ÷ (101.3 − 2.671 × Reps)` | 2 — 10 reps | Bonne |
| **Wathen** | 1994 | `Poids × 100 ÷ (48.8 + 53.8 × e^(−0.075 × Reps))` | 1 — 15 reps | Bonne |

> Les estimations sont théoriques. La précision diminue au-delà de 15 répétitions.
> Utilisez le RPE quand il est disponible — c'est la méthode la plus fiable.

---

## Utilisation

```
1. Ouvrez index.html dans votre navigateur
2. Sélectionnez un exercice (Squat, Développé couché, Soulevé de terre…)
3. Saisissez le poids soulevé (kg) et le nombre de répétitions
4. Ajoutez un RPE si disponible (optionnel, valeurs 6 à 10 par pas de 0.5)
5. Cliquez sur "Calculer" ou appuyez sur Entrée
```

Les résultats apparaissent instantanément : comparatif des 7 formules, moyenne, écart-type, tableau de pourcentages et recommandations par zone d'intensité.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Structure | HTML5 sémantique |
| Style | CSS3 — Variables, Grid, Flexbox, `clamp()`, `backdrop-filter` |
| Logique | JavaScript ES6+ vanilla — aucun framework |
| Typographie | Syne (titres) · Instrument Sans (corps) · DM Mono (code/données) |
| Persistance | `localStorage` (préférence de thème) |
| Export | `Blob` + `URL.createObjectURL` (fichier JSON natif) |

---

## Structure

```
calculateur-1rm/
├── index.html      — page unique, structure et sections
├── style.css       — thème éditorial sombre/clair, design system complet
├── script.js       — formules, calcul RPE, affichage, export, thème
├── favicon.svg     — icône vectorielle
└── README.md       — cette documentation
```

---

## Compatibilite

| Navigateur | Support |
|---|---|
| Chrome / Edge (dernières versions) | Complet |
| Firefox (dernières versions) | Complet |
| Safari (dernières versions) | Complet |
| Mobile (iOS / Android) | Responsive |

---

<div align="center">

Projet statique — aucun build, aucun serveur, aucune collecte de données.

</div>
