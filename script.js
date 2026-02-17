// Formules de calcul 1RM
const formulas = {
    epley: (weight, reps) => weight * (1 + reps / 30),
    brzycki: (weight, reps) => weight * 36 / (37 - reps),
    lander: (weight, reps) => weight * 100 / (101.3 - 2.67123 * reps),
    lombardi: (weight, reps) => weight * Math.pow(reps, 0.10),
    mayhew: (weight, reps) => weight * 100 / (52.2 + 41.9 * Math.exp(-0.055 * reps)),
    mcglothin: (weight, reps) => weight * 100 / (101.3 - 2.67123 * reps),
    wathen: (weight, reps) => weight * 100 / (48.8 + 53.8 * Math.exp(-0.075 * reps))
};

// Noms des formules en français
const formulaNames = {
    epley: { name: "Epley", year: "1985" },
    brzycki: { name: "Brzycki", year: "1993" },
    lander: { name: "Lander", year: "1985" },
    lombardi: { name: "Lombardi", year: "1989" },
    mayhew: { name: "Mayhew", year: "1992" },
    mcglothin: { name: "McGlothin", year: "1984" },
    wathen: { name: "Wathen", year: "1994" }
};

// Noms des exercices en français
const exerciseNames = {
    squat: "Squat",
    bench: "Développé couché",
    deadlift: "Soulevé de terre",
    other: "Autre mouvement"
};

// Calcul RPE
function calculateRPE(weight, reps, rpe) {
    const rpeTable = {
        10: [1, 0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538],
        9.5: [0.978, 0.939, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.728, 0.707, 0.685, 0.665, 0.644, 0.624, 0.605, 0.586, 0.567, 0.548, 0.53],
        9: [0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538, 0.52],
        8.5: [0.939, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.728, 0.707, 0.685, 0.665, 0.644, 0.624, 0.605, 0.586, 0.567, 0.548, 0.53, 0.512],
        8: [0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538, 0.52, 0.502],
        7.5: [0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.728, 0.707, 0.685, 0.665, 0.644, 0.624, 0.605, 0.586, 0.567, 0.548, 0.53, 0.512, 0.494],
        7: [0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538, 0.52, 0.502, 0.485],
        6.5: [0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.728, 0.707, 0.685, 0.665, 0.644, 0.624, 0.605, 0.586, 0.567, 0.548, 0.53, 0.512, 0.494, 0.477],
        6: [0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538, 0.52, 0.502, 0.485, 0.469]
    };
    
    const percentage = rpeTable[rpe] && rpeTable[rpe][reps - 1];
    return percentage ? weight / percentage : null;
}

// Fonction pour déterminer la fiabilité selon le nombre de répétitions
function getReliability(reps) {
    if (reps <= 3) return { class: 'excellent', text: 'Excellent' };
    if (reps <= 5) return { class: 'good', text: 'Très bon' };
    if (reps <= 8) return { class: 'average', text: 'Moyen' };
    if (reps <= 12) return { class: 'poor', text: 'Faible' };
    return { class: 'high', text: 'Peu fiable' };
}

// Fonction pour calculer l'écart par rapport à la moyenne
function getDeviation(value, average) {
    const deviation = Math.abs(value - average);
    const percentage = (deviation / average) * 100;
    
    if (percentage <= 2) return { class: 'low', text: `+${deviation.toFixed(1)}kg` };
    if (percentage <= 5) return { class: 'medium', text: `+${deviation.toFixed(1)}kg` };
    return { class: 'high', text: `+${deviation.toFixed(1)}kg` };
}

// Fonction principale de calcul
function calculate() {
    const weight = parseFloat(document.getElementById('weight').value);
    const reps = parseInt(document.getElementById('reps').value);
    const rpe = parseFloat(document.getElementById('rpe').value);
    const exercise = document.getElementById('exercise').value;

    if (!weight || !reps || weight <= 0 || reps <= 0) {
        alert('Veuillez remplir tous les champs obligatoires avec des valeurs positives.');
        return;
    }

    if (reps > 20) {
        alert('Les formules ne sont pas fiables au-delà de 20 répétitions.');
        return;
    }

    // Afficher le loader
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');

    // Simuler un délai pour l'effet visuel (enlever en production si calcul instantané)
    setTimeout(() => {
        performCalculation(weight, reps, rpe, exercise);
        loadingOverlay.classList.remove('active');
    }, 300);
}

// Fonction de calcul séparée
function performCalculation(weight, reps, rpe, exercise) {
    try {
        // Calcul avec toutes les formules
        const results = {};
        const validResults = [];

        for (const [key, formula] of Object.entries(formulas)) {
            try {
                const result = formula(weight, reps);
                if (result > 0 && isFinite(result)) {
                    results[key] = result;
                    validResults.push(result);
                }
            } catch (error) {
                console.error(`Erreur avec la formule ${key}:`, error);
            }
        }

        // Calcul RPE si disponible
        let rpeResult = null;
        if (rpe) {
            rpeResult = calculateRPE(weight, reps, rpe);
        }

        // Calcul de la moyenne
        const average = validResults.length > 0 ?
            validResults.reduce((sum, val) => sum + val, 0) / validResults.length : 0;

        // Affichage des résultats
        displayResults(results, rpeResult, average, weight, reps, rpe, exercise);

        // Génération du tableau des pourcentages
        generatePercentageTable(rpeResult || average);
    } catch (error) {
        console.error('Erreur lors du calcul:', error);
        alert('Une erreur s\'est produite lors du calcul.');
    }
}

// Fonction d'affichage des résultats
function displayResults(results, rpeResult, average, weight, reps, rpe, exercise) {
    const resultsDiv = document.getElementById('results');
    const exerciseName = exerciseNames[exercise] || exercise;
    const reliability = getReliability(reps);
    
    let html = `
        <div class="results-header">
            <h2>${exerciseName} - Toutes les formules</h2>
            <p class="test-info">Basé sur ${weight}kg × ${reps} répétitions${rpe ? ` (RPE ${rpe})` : ''}</p>
        </div>
        
        <div class="statistics-summary">
            <div class="stat-item">
                <strong>Moyenne</strong>
                <span>${average.toFixed(1)} kg</span>
            </div>
            <div class="stat-item">
                <strong>Fiabilité</strong>
                <span class="reliability-badge ${reliability.class}">${reliability.text}</span>
            </div>
            <div class="stat-item">
                <strong>Écart type</strong>
                <span>${calculateStandardDeviation(Object.values(results)).toFixed(1)} kg</span>
            </div>
        </div>
        
        <div class="results-table-container">
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Méthode</th>
                        <th>Résultat</th>
                        <th>Écart</th>
                        <th>Fiabilité</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Ajout du RPE en premier s'il existe
    if (rpeResult) {
        const deviation = getDeviation(rpeResult, average);
        html += `
            <tr class="rpe-row">
                <td class="method-name">
                    <span class="method-label">Calcul avec RPE ${rpe} (RECOMMANDÉ)</span>
                    <small>Estimation basée sur l'effort ressenti - Plus précise que les formules classiques</small>
                </td>
                <td class="result-value">${rpeResult.toFixed(1)} kg</td>
                <td class="deviation-value ${deviation.class}">${deviation.text}</td>
                <td><span class="reliability-badge high">Très fiable</span></td>
            </tr>
        `;
    }
    
    // Ajout de toutes les formules
    html += `<tr><td colspan="4" class="formulas-separator">Toutes les formules de calcul</td></tr>`;
    
    for (const [key, result] of Object.entries(results)) {
        const formulaInfo = formulaNames[key];
        const deviation = getDeviation(result, average);
        const reliability = getReliability(reps);
        
        html += `
            <tr>
                <td class="method-name">
                    <span class="method-label">${formulaInfo.name}</span>
                    <small>Formule ${formulaInfo.year}</small>
                </td>
                <td class="result-value">${result.toFixed(1)} kg</td>
                <td class="deviation-value ${deviation.class}">${deviation.text}</td>
                <td><span class="reliability-badge ${reliability.class}">${reliability.text}</span></td>
            </tr>
        `;
    }
    
    // Ligne moyenne
    html += `
            <tr class="average-row">
                <td class="method-name">
                    <span class="method-label">Moyenne des formules</span>
                    <small>Estimation générale</small>
                </td>
                <td class="result-value">${average.toFixed(1)} kg</td>
                <td class="deviation-value low">Référence</td>
                <td><span class="reliability-badge ${reliability.class}">${reliability.text}</span></td>
            </tr>
        </tbody>
    </table>
    </div>
    `;
    
    // Recommandations
    html += generateRecommendations(rpeResult || average, reps, rpe);
    
    resultsDiv.innerHTML = html;
}

// Fonction pour calculer l'écart-type
function calculateStandardDeviation(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    
    return Math.sqrt(variance);
}

// Fonction pour générer les recommandations
function generateRecommendations(oneRM, reps, rpe) {
    let html = `
        <div class="recommendations">
            <h4>Recommandations d'entraînement</h4>
            <ul>
    `;
    
    if (rpe) {
        html += `<li><strong>Calcul RPE recommandé :</strong> ${oneRM.toFixed(1)}kg (basé sur votre effort ressenti)</li>`;
    }
    
    html += `
                <li><strong>Force maximale (90-95%) :</strong> ${(oneRM * 0.9).toFixed(1)}kg - ${(oneRM * 0.95).toFixed(1)}kg</li>
                <li><strong>Force (80-90%) :</strong> ${(oneRM * 0.8).toFixed(1)}kg - ${(oneRM * 0.9).toFixed(1)}kg</li>
                <li><strong>Hypertrophie (70-80%) :</strong> ${(oneRM * 0.7).toFixed(1)}kg - ${(oneRM * 0.8).toFixed(1)}kg</li>
                <li><strong>Endurance (60-70%) :</strong> ${(oneRM * 0.6).toFixed(1)}kg - ${(oneRM * 0.7).toFixed(1)}kg</li>
            </ul>
        </div>
    `;
    
    return html;
}

// Fonction pour générer le tableau des pourcentages
function generatePercentageTable(oneRM) {
    const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];

    let html = `
        <div class="percentage-table">
            <h3>Tableau des pourcentages d'entraînement</h3>
            <div class="percentage-grid">
    `;
    
    percentages.forEach(percent => {
        const weight = oneRM * (percent / 100);
        html += `
            <div class="percentage-item">
                <strong>${percent}%</strong>
                <span>${weight.toFixed(1)}kg</span>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    document.getElementById('results').innerHTML += html;
}

// Fonction pour vider les champs
function clearInputs() {
    document.getElementById('weight').value = '';
    document.getElementById('reps').value = '';
    document.getElementById('rpe').value = '';
    document.getElementById('exercise').value = 'squat';
    document.getElementById('results').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h3>Résultats</h3>
            <p>Remplissez les champs et cliquez sur "Calculer" pour voir vos résultats</p>
        </div>
    `;
}

// Fonction d'export
function exportResults() {
    const results = document.getElementById('results');
    if (results.innerHTML.includes('Remplissez les champs')) {
        alert('Aucun résultat à exporter. Effectuez d\'abord un calcul.');
        return;
    }
    
    const weight = document.getElementById('weight').value;
    const reps = document.getElementById('reps').value;
    const rpe = document.getElementById('rpe').value;
    const exercise = document.getElementById('exercise').value;
    
    const data = {
        date: new Date().toLocaleDateString('fr-FR'),
        exercise: exerciseNames[exercise] || exercise,
        weight: parseFloat(weight),
        reps: parseInt(reps),
        rpe: rpe ? parseFloat(rpe) : null,
        results: extractResultsData()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `1RM_${exercise}_${new Date().toISOString().substr(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Fonction pour extraire les données des résultats
function extractResultsData() {
    const table = document.querySelector('.results-table');
    if (!table) return {};
    
    const rows = table.querySelectorAll('tbody tr');
    const data = {};
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            const method = cells[0].textContent.trim();
            const result = cells[1].textContent.trim();
            data[method] = result;
        }
    });
    
    return data;
}

// Fonction d'impression
function printResults() {
    const results = document.getElementById('results');
    if (results.innerHTML.includes('Remplissez les champs')) {
        alert('Aucun résultat à imprimer. Effectuez d\'abord un calcul.');
        return;
    }
    
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Résultats 1RM</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .results-header { text-align: center; margin-bottom: 20px; }
                .recommendations { background: #f8f9fa; padding: 15px; margin: 20px 0; }
                .percentage-table { margin-top: 20px; }
                .percentage-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
                .percentage-item { text-align: center; padding: 10px; border: 1px solid #ddd; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Calculateur 1RM - Résultats</h1>
            ${results.innerHTML}
            <div style="margin-top: 30px; text-align: center; color: #666;">
                <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Gestion des événements clavier
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculate();
            }
        });
    });

    // Auto-calcul avec debounce pour optimiser les performances
    const weightInput = document.getElementById('weight');
    const repsInput = document.getElementById('reps');

    let debounceTimer;
    function autoCalculate() {
        const weight = parseFloat(weightInput.value);
        const reps = parseInt(repsInput.value);

        clearTimeout(debounceTimer);

        if (weight > 0 && reps > 0) {
            debounceTimer = setTimeout(calculate, 250); // Délai optimisé avec debounce
        }
    }

    weightInput.addEventListener('input', autoCalculate);
    repsInput.addEventListener('input', autoCalculate);

    // Ajouter des animations au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.formula-card, .info-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// Validation des entrées
document.getElementById('weight').addEventListener('input', function(e) {
    const value = parseFloat(e.target.value);
    if (value < 0) {
        e.target.value = '';
    }
    if (value > 1000) {
        e.target.value = '1000';
    }
});

document.getElementById('reps').addEventListener('input', function(e) {
    const value = parseInt(e.target.value);
    if (value < 0) {
        e.target.value = '';
    }
    if (value > 20) {
        e.target.value = '20';
    }
});

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    alert('Une erreur s\'est produite. Veuillez rafraîchir la page.');
});

// Gestion du thème clair/sombre
(function() {
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    function getStoredTheme() {
        return localStorage.getItem('theme');
    }

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Initialisation : préférence stockée > préférence système > dark par défaut
    const initialTheme = getStoredTheme() || getSystemTheme();
    applyTheme(initialTheme);

    // Toggle au clic
    toggle.addEventListener('click', function() {
        const current = root.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
        if (!getStoredTheme()) {
            applyTheme(e.matches ? 'light' : 'dark');
        }
    });
})();
