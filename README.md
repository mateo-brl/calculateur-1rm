<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/Licence-Libre-brightgreen?style=flat-square)

<br/>

# Calculateur 1RM

**Estimation de force maximale — optimisée powerlifting**

*4 formules essentielles · Pondération par exercice · Table RPE prioritaire (Tuchscherer)*

</div>

---

## Utilisation

Ouvrez `index.html` dans votre navigateur. Aucun build, aucun serveur.

```
1. Sélectionnez l'exercice (squat, bench, deadlift…)
2. Saisissez poids et reps
3. Ajoutez le RPE si vous en utilisez (optionnel, 6 à 10 par 0.5)
```

**Logique du résultat :**
- Si un **RPE** est saisi → c'est le calcul RPE qui prime et qui s'affiche en gros.
- Sinon → moyenne pondérée des 4 formules selon le lift choisi.

---

## Formules

| Formule | Année | Équation |
|---|---|---|
| **Epley** | 1985 | `Poids × (1 + Reps / 30)` |
| **Wathen** | 1994 | `Poids × 100 / (48.8 + 53.8 × e^(−0.075 × Reps))` |
| **Mayhew** | 1992 | `Poids × 100 / (52.2 + 41.9 × e^(−0.055 × Reps))` |
| **Brzycki** | 1993 | `Poids × 36 / (37 − Reps)` |

---

## Pondération par exercice

| Formule | Squat | Bench | Deadlift |
|---|---|---|---|
| Epley | **0.35** | 0.25 | **0.40** |
| Wathen | **0.35** | 0.25 | **0.35** |
| Mayhew | 0.20 | **0.40** | 0.20 |
| Brzycki | 0.10 | 0.10 | 0.05 |

**Justifications :**
- **Bench → Mayhew dominante** : développée et validée sur le bench press (Mayhew et al., 1992, r=0.98, SEE ±4.8 kg).
- **Squat → Epley + Wathen** : les plus précises pour les athlètes forts sur basses-à-moyennes reps.
- **Deadlift → Brzycki minorisée** (0.05) : sous-estime fortement les 1RM en DL (LeSuer 1997).

---

## Table RPE

Table de Mike Tuchscherer (Reactive Training Systems), RPE 6 à 10 par demi-points, 1 à 20 reps. Si un RPE est saisi, le 1RM RPE s'affiche en gros au-dessus du tableau et devient la référence pour les pourcentages d'entraînement.

---

## Sources

- Mayhew J.L. et al. (1992). *Relative muscular endurance performance as a predictor of bench press strength in college men and women.* J Appl Sport Sci Res 6:200-206.
- LeSuer D.A. et al. (1997). *The accuracy of prediction equations for estimating 1-RM performance in the bench press, squat, and deadlift.* J Strength Cond Res 11(4):211-213.
- Tuchscherer M. *RPE Chart*, Reactive Training Systems.
- Brzycki M. (1993). *Strength testing: predicting a one-rep max from reps-to-fatigue.* JOPERD 64(1):88-90.

---

## Stack

HTML5 · CSS3 · JavaScript vanilla · aucune dépendance, aucun serveur, aucune collecte de données.

## Structure

```
calculateur-1rm/
├── index.html      page unique
├── style.css       thème sombre/clair
├── script.js       formules, pondération, RPE, export
├── favicon.svg
└── README.md
```
