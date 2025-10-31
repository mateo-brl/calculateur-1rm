# Calculateur 1RM - Estimation de la Force Maximale

Application web pour estimer votre force maximale (1RM - One Rep Max) en utilisant plusieurs formules scientifiques reconnues.

## Fonctionnalités

- **Multiples formules de calcul** : Brzycki, Epley, Lander, Lombardi, Mayhew, McGlothin, Wathen
- **Calcul avec RPE** : Utilisation du Rate of Perceived Exertion pour plus de précision
- **Interface intuitive** : Design moderne et responsive
- **Recommandations personnalisées** : Suggestions d'entraînement basées sur vos résultats
- **Tableau des pourcentages** : Calcul automatique des charges d'entraînement
- **Export des résultats** : Sauvegarde de vos calculs au format JSON

## Utilisation

1. Ouvrez `index.html` dans votre navigateur
2. Sélectionnez votre exercice
3. Entrez le poids soulevé et le nombre de répétitions
4. (Optionnel) Ajoutez votre RPE pour plus de précision
5. Cliquez sur "Calculer le 1RM"

## Formules utilisées

### Brzycki (1993) - Recommandée
```
1RM = Poids ÷ (1.0278 - 0.0278 × Répétitions)
```
Idéale pour 2-10 répétitions

### Epley (1985) - Populaire
```
1RM = Poids × (1 + Répétitions ÷ 30)
```
Idéale pour 1-8 répétitions

### Lander (1985)
```
1RM = Poids ÷ (1.013 - 0.0267123 × Répétitions)
```
Idéale pour 2-10 répétitions

### Lombardi (1989)
```
1RM = Poids × Répétitions^0.10
```
Idéale pour 1-15 répétitions

## Technologies utilisées

- HTML5
- CSS3 (Variables CSS, Grid, Flexbox)
- JavaScript vanilla
- Google Fonts (Inter)

## Structure du projet

```
.
├── index.html      # Page principale
├── style.css       # Styles de l'application
├── script.js       # Logique de calcul
└── README.md       # Documentation
```

## Compatibilité

- Chrome/Edge (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Responsive : Mobile, Tablette, Desktop

## Notes importantes

- Les résultats sont des **estimations théoriques**
- La précision diminue au-delà de 15 répétitions
- Toujours tester progressivement vos vrais maximums
- Utilisez le RPE quand possible pour plus de précision

## Licence

Projet créé avec l'assistance de l'IA - Usage libre

## Auteur

Made by AI - 2025
