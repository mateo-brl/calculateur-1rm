// Formules 1RM (cf. README pour les références)
const formulas = {
    epley:   (w, r) => w * (1 + r / 30),
    wathen:  (w, r) => w * 100 / (48.8 + 53.8 * Math.exp(-0.075 * r)),
    mayhew:  (w, r) => w * 100 / (52.2 + 41.9 * Math.exp(-0.055 * r)),
    brzycki: (w, r) => w * 36 / (37 - r)
};

const formulaNames = {
    epley:   { name: "Epley",   year: "1985" },
    wathen:  { name: "Wathen",  year: "1994" },
    mayhew:  { name: "Mayhew",  year: "1992" },
    brzycki: { name: "Brzycki", year: "1993" }
};

// Pondération par exercice : Epley/Wathen dominantes en squat/DL,
// Mayhew dominante en bench (validée r=0.98), Brzycki minoritaire
// car sous-estime les lifters forts au-delà de 5 reps.
const liftWeights = {
    squat:    { epley: 0.35, wathen: 0.35, mayhew: 0.20, brzycki: 0.10 },
    bench:    { epley: 0.25, wathen: 0.25, mayhew: 0.40, brzycki: 0.10 },
    deadlift: { epley: 0.40, wathen: 0.35, mayhew: 0.20, brzycki: 0.05 },
    overhead: { epley: 0.30, wathen: 0.25, mayhew: 0.30, brzycki: 0.15 },
    row:      { epley: 0.30, wathen: 0.25, mayhew: 0.30, brzycki: 0.15 },
    other:    { epley: 0.25, wathen: 0.25, mayhew: 0.25, brzycki: 0.25 }
};

const liftPreferred = {
    squat:    ["epley", "wathen"],
    bench:    ["mayhew", "wathen"],
    deadlift: ["epley", "wathen"],
    overhead: ["mayhew", "epley"],
    row:      ["mayhew", "epley"],
    other:    []
};

const exerciseNames = {
    squat: "Squat",
    bench: "Développé couché",
    deadlift: "Soulevé de terre",
    overhead: "Développé militaire",
    row: "Rowing",
    other: "Autre mouvement"
};

// Table RPE de Mike Tuchscherer (Reactive Training Systems)
function calculateRPE(weight, reps, rpe) {
    const rpeTable = {
        10:  [1,     0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538],
        9.5: [0.978, 0.939, 0.907, 0.878, 0.85,  0.824, 0.799, 0.774, 0.751, 0.728, 0.707, 0.685, 0.665, 0.644, 0.624, 0.605, 0.586, 0.567, 0.548, 0.53],
        9:   [0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538, 0.52],
        8.5: [0.939, 0.907, 0.878, 0.85,  0.824, 0.799, 0.774, 0.751, 0.728, 0.707, 0.685, 0.665, 0.644, 0.624, 0.605, 0.586, 0.567, 0.548, 0.53,  0.512],
        8:   [0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538, 0.52,  0.502],
        7.5: [0.907, 0.878, 0.85,  0.824, 0.799, 0.774, 0.751, 0.728, 0.707, 0.685, 0.665, 0.644, 0.624, 0.605, 0.586, 0.567, 0.548, 0.53,  0.512, 0.494],
        7:   [0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538, 0.52,  0.502, 0.485],
        6.5: [0.878, 0.85,  0.824, 0.799, 0.774, 0.751, 0.728, 0.707, 0.685, 0.665, 0.644, 0.624, 0.605, 0.586, 0.567, 0.548, 0.53,  0.512, 0.494, 0.477],
        6:   [0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.717, 0.695, 0.674, 0.653, 0.633, 0.613, 0.594, 0.575, 0.556, 0.538, 0.52,  0.502, 0.485, 0.469]
    };
    const percentage = rpeTable[rpe] && rpeTable[rpe][reps - 1];
    return percentage ? weight / percentage : null;
}

function getReliability(reps) {
    if (reps <= 3) return { class: 'excellent', text: 'Excellent' };
    if (reps <= 5) return { class: 'good', text: 'Très bon' };
    if (reps <= 8) return { class: 'average', text: 'Moyen' };
    if (reps <= 12) return { class: 'poor', text: 'Faible' };
    return { class: 'high', text: 'Peu fiable' };
}

function getDeviation(value, ref) {
    const diff = value - ref;
    const sign = diff >= 0 ? '+' : '−';
    const abs = Math.abs(diff);
    const percentage = (abs / ref) * 100;
    const text = `${sign}${abs.toFixed(1)}kg`;
    if (percentage <= 2) return { class: 'low', text };
    if (percentage <= 5) return { class: 'medium', text };
    return { class: 'high', text };
}

function weightedAverage(results, exercise) {
    const weights = liftWeights[exercise] || liftWeights.other;
    let sumVal = 0, sumW = 0;
    for (const [key, val] of Object.entries(results)) {
        const w = weights[key] ?? 0;
        sumVal += val * w;
        sumW += w;
    }
    return sumW > 0 ? sumVal / sumW : 0;
}

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

    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
    setTimeout(() => {
        performCalculation(weight, reps, rpe, exercise);
        loadingOverlay.classList.remove('active');
    }, 300);
}

function performCalculation(weight, reps, rpe, exercise) {
    try {
        const results = {};
        for (const [key, formula] of Object.entries(formulas)) {
            const v = formula(weight, reps);
            if (v > 0 && isFinite(v)) results[key] = v;
        }
        const rpeResult = rpe ? calculateRPE(weight, reps, rpe) : null;
        const weighted = weightedAverage(results, exercise);
        const primary = rpeResult || weighted;
        displayResults(results, rpeResult, weighted, weight, reps, rpe, exercise);
        generatePercentageTable(primary);
    } catch (error) {
        console.error('Erreur lors du calcul:', error);
        alert('Une erreur s\'est produite lors du calcul.');
    }
}

function displayResults(results, rpeResult, weighted, weight, reps, rpe, exercise) {
    const resultsDiv = document.getElementById('results');
    const exerciseName = exerciseNames[exercise] || exercise;
    const reliability = getReliability(reps);
    const preferred = liftPreferred[exercise] || [];
    const primary = rpeResult || weighted;
    const ref = primary;

    let html = `
        <div class="results-header">
            <h2>${exerciseName} — Estimation 1RM</h2>
            <p class="test-info">Basé sur ${weight}kg × ${reps} répétitions${rpe ? ` (RPE ${rpe})` : ''}</p>
        </div>
    `;

    // Bloc résultat principal : RPE si fourni, sinon moyenne pondérée
    if (rpeResult) {
        html += `
            <div class="primary-result">
                <div class="primary-result-label">Calcul RPE ${rpe} <span class="primary-result-tag">prioritaire</span></div>
                <div class="primary-result-value">${rpeResult.toFixed(1)} <span class="primary-result-unit">kg</span></div>
                <div class="primary-result-sub">Basé sur l'effort ressenti — méthode la plus fiable. Table RTS (Tuchscherer).</div>
            </div>
        `;
    } else {
        html += `
            <div class="primary-result">
                <div class="primary-result-label">Estimation 1RM <span class="primary-result-tag">pondérée ${exerciseName.toLowerCase()}</span></div>
                <div class="primary-result-value">${weighted.toFixed(1)} <span class="primary-result-unit">kg</span></div>
                <div class="primary-result-sub">Moyenne pondérée selon l'exercice. Saisissez un RPE pour une estimation plus fiable.</div>
            </div>
        `;
    }

    html += `
        <div class="statistics-summary">
            <div class="stat-item">
                <strong>Moyenne pondérée</strong>
                <span>${weighted.toFixed(1)} kg</span>
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
                    </tr>
                </thead>
                <tbody>
    `;

    // Tri : formules optimales en haut
    const sortedKeys = Object.keys(results).sort((a, b) => {
        const aPref = preferred.includes(a) ? 0 : 1;
        const bPref = preferred.includes(b) ? 0 : 1;
        if (aPref !== bPref) return aPref - bPref;
        return results[b] - results[a];
    });

    for (const key of sortedKeys) {
        const result = results[key];
        const info = formulaNames[key];
        const dev = getDeviation(result, ref);
        const isPref = preferred.includes(key);
        const badge = isPref ? `<span class="formula-mini-badge">Optimale</span>` : '';
        html += `
            <tr${isPref ? ' class="preferred-row"' : ''}>
                <td class="method-name">
                    <span class="method-label">${info.name} ${badge}</span>
                    <small>Formule ${info.year}</small>
                </td>
                <td class="result-value">${result.toFixed(1)} kg</td>
                <td class="deviation-value ${dev.class}">${dev.text}</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
        </div>
    `;

    html += generateRecommendations(primary, reps, rpe);
    resultsDiv.innerHTML = html;
}

function calculateStandardDeviation(values) {
    if (values.length === 0) return 0;
    const mean = values.reduce((s, v) => s + v, 0) / values.length;
    const variance = values.map(v => Math.pow(v - mean, 2)).reduce((s, v) => s + v, 0) / values.length;
    return Math.sqrt(variance);
}

function generateRecommendations(oneRM, reps, rpe) {
    return `
        <div class="recommendations">
            <h4>Recommandations d'entraînement</h4>
            <ul>
                <li><strong>Force maximale (90-95%) :</strong> ${(oneRM * 0.9).toFixed(1)}kg — ${(oneRM * 0.95).toFixed(1)}kg</li>
                <li><strong>Force (80-90%) :</strong> ${(oneRM * 0.8).toFixed(1)}kg — ${(oneRM * 0.9).toFixed(1)}kg</li>
                <li><strong>Hypertrophie (70-80%) :</strong> ${(oneRM * 0.7).toFixed(1)}kg — ${(oneRM * 0.8).toFixed(1)}kg</li>
                <li><strong>Endurance (60-70%) :</strong> ${(oneRM * 0.6).toFixed(1)}kg — ${(oneRM * 0.7).toFixed(1)}kg</li>
            </ul>
        </div>
    `;
}

function generatePercentageTable(oneRM) {
    const percentages = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
    let html = `
        <div class="percentage-table">
            <h3>Tableau des pourcentages d'entraînement</h3>
            <div class="percentage-grid">
    `;
    percentages.forEach(percent => {
        html += `
            <div class="percentage-item">
                <strong>${percent}%</strong>
                <span>${(oneRM * percent / 100).toFixed(1)}kg</span>
            </div>
        `;
    });
    html += `</div></div>`;
    document.getElementById('results').innerHTML += html;
}

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
            <h3>En attente</h3>
            <p>Remplissez les champs et cliquez sur Calculer pour voir l'estimation.</p>
        </div>
    `;
}

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

function extractResultsData() {
    const table = document.querySelector('.results-table');
    if (!table) return {};
    const data = {};
    table.querySelectorAll('tbody tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            data[cells[0].textContent.trim()] = cells[1].textContent.trim();
        }
    });
    return data;
}

function printResults() {
    const results = document.getElementById('results');
    if (results.innerHTML.includes('Remplissez les champs')) {
        alert('Aucun résultat à imprimer. Effectuez d\'abord un calcul.');
        return;
    }
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html><head><title>Résultats 1RM</title>
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
        </style></head>
        <body>
            <h1>Calculateur 1RM — Résultats</h1>
            ${results.innerHTML}
            <div style="margin-top: 30px; text-align: center; color: #666;">
                <p>Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            </div>
        </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                calculate();
            }
        });
    });

    const weightInput = document.getElementById('weight');
    const repsInput = document.getElementById('reps');
    const exerciseInput = document.getElementById('exercise');
    const rpeInput = document.getElementById('rpe');

    let debounceTimer;
    function autoCalculate() {
        const weight = parseFloat(weightInput.value);
        const reps = parseInt(repsInput.value);
        clearTimeout(debounceTimer);
        if (weight > 0 && reps > 0) debounceTimer = setTimeout(calculate, 250);
    }

    weightInput.addEventListener('input', autoCalculate);
    repsInput.addEventListener('input', autoCalculate);
    exerciseInput.addEventListener('change', autoCalculate);
    rpeInput.addEventListener('input', autoCalculate);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.formula-card, .info-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    document.querySelectorAll('.reveal, [data-stagger]').forEach(el => observer.observe(el));
});

document.getElementById('weight').addEventListener('input', function(e) {
    const v = parseFloat(e.target.value);
    if (v < 0) e.target.value = '';
    if (v > 1000) e.target.value = '1000';
});

document.getElementById('reps').addEventListener('input', function(e) {
    const v = parseInt(e.target.value);
    if (v < 0) e.target.value = '';
    if (v > 20) e.target.value = '20';
});

window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    alert('Une erreur s\'est produite. Veuillez rafraîchir la page.');
});

(function() {
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const getStored = () => localStorage.getItem('theme');
    const getSystem = () => window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    const apply = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };
    apply(getStored() || getSystem());
    toggle.addEventListener('click', () => apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (!getStored()) apply(e.matches ? 'light' : 'dark');
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('navLinks');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => navLinks.classList.remove('active'));
        });
    }
});
