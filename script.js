document.addEventListener("DOMContentLoaded", function () {
    plotCurve(35, 170, 90, 20);
    const form = document.getElementById("mb-form");
    const weightBaselineInput = document.getElementById("weight_baseline");
    const heightInput = document.getElementById("height");
    const ageInput = document.getElementById("age");
    const genderInput = document.getElementById("gender");
    const timelineInput = document.getElementById("timeline");
    const resultParagraph = document.getElementById("mb-result");


    const weightOutput = document.getElementById('weight_output');

    const heightOutput = document.getElementById('height_output');

    const ageOutput = document.getElementById('age_output');

    const timelineOutput = document.getElementById('timeline_output');


    weightBaselineInput.addEventListener('input', () => {
        weightOutput.textContent = weightBaselineInput.value;
    });

    heightInput.addEventListener('input', () => {
        heightOutput.textContent = heightInput.value;
    });

    ageInput.addEventListener('input', () => {
        ageOutput.textContent = ageInput.value;

    });

    timelineInput.addEventListener('input', () => {
        timelineOutput.textContent = timelineInput.value;
    });
    weightBaselineInput.addEventListener("input", updateCurve);
    heightInput.addEventListener("input", updateCurve);
    ageInput.addEventListener("input", updateCurve);
    genderInput.addEventListener("input", updateCurve);
    timelineInput.addEventListener("input", updateCurve);
    
    // Événement de soumission du formulaire
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Empêche le rechargement de la page

        // Récupération des valeurs saisies par l'utilisateur
        const weightBaseline = parseFloat(weightBaselineInput.value);
        const height = parseFloat(heightInput.value);
        const age = parseFloat(ageInput.value);
        const gender = genderInput.value;
        const timeline = parseFloat(timelineInput.value);

        // Calcul et affichage des résultats
        displayResults(age, height, weightBaseline, timeline, gender, resultParagraph);
    });

    // Ajoutez ces lignes après l'événement "submit"
    weightBaselineInput.addEventListener("input", updateCurve);
    heightInput.addEventListener("input", updateCurve);
    ageInput.addEventListener("input", updateCurve);
    genderInput.addEventListener("input", updateCurve);
    timelineInput.addEventListener("input", updateCurve);

    function updateCurve() {
        // Récupération des valeurs actuelles des curseurs
        const weightBaseline = parseFloat(weightBaselineInput.value);
        const height = parseFloat(heightInput.value);
        const age = parseFloat(ageInput.value);
        const gender = genderInput.value;
        const timeline = parseFloat(timelineInput.value);

        // Met à jour la courbe en utilisant les nouvelles valeurs
        plotCurve(age, height, weightBaseline, timeline);
    }
});

function displayResults(age, height, weightBaseline, timeline, gender, resultParagraph) {
    // Calcul du métabolisme de base (MB)
    let mb = 0;
    let mbCalories = 0;
    if (gender === "Men") {
        mb = 1.083 * weightBaseline ** 0.48 * (height / 100) ** 0.50 * age ** (-0.13);
        mbCalories = 259; // Coefficient pour les hommes
    } else if (gender === "Women") {
        mb = 0.963 * weightBaseline ** 0.48 * (height / 100) ** 0.50 * age ** (-0.13);
        mbCalories = 230; // Coefficient pour les femmes
    }

    // Conversion du métabolisme de base en calories
    const mbCaloriesConverted = mb * mbCalories;

    // Calcul de la perte de poids estimée
    const timelineTrans = (timeline + 1) ** 0.5; // Conversion des jours en mois
    let yNew = 0.3324 * mb + (0.6037 - (0.4320 * mb)) * Timeline_trans;
    // Arrondir à 2 décimales
    yNew = yNew.toFixed(2);

    // Affichage des résultats
    resultParagraph.innerHTML = `Your basal metabolism : ${mbCaloriesConverted.toFixed(2)} Kcal.<br>Your Weight Loss : ${yNew} kg.`;

}
let chart;
function plotCurve(age, height, weight_baseline, timeline) {
    // Calculs pour générer les données du graphique
    var MB_men = 1.083 * Math.pow(weight_baseline, 0.48) * Math.pow(height/100, 0.50) * Math.pow(age, -0.13);
    var MB_women = 0.963 * Math.pow(weight_baseline, 0.48) * Math.pow(height/100, 0.50) * Math.pow(age, -0.13);
    var Timeline = [];
    var Timeline_trans = [];
    var y_new_m = [];
    var y_new_f = [];

    for (var i = 0; i <= timeline; i++) {
        Timeline.push(i);
        Timeline_trans.push(Math.sqrt(i + 1));
        y_new_m.push(i === 0 ? 0 : ( 0.3324 * MB_men + (0.6037 - (0.4320 * MB_men)) * Timeline_trans[i] ));
        y_new_f.push(i === 0 ? 0 : ( 0.3324 * MB_women + (0.6037 - (0.4320 * MB_women)) * Timeline_trans[i] ));
    }

    // Création du graphique avec Chart.js
    var ctx = document.getElementById('weightChart').getContext('2d');
    
    if (!chart) { 
        chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Timeline,
            datasets: [
                {
                    label: 'Men',
                    data: y_new_m,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Women',
                    data: y_new_f,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Days'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Weight Loss'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Weight evolution over time'
                }
            }
        }
    });
    } else {
        chart.data.labels = Timeline;
        chart.data.datasets[0].data = y_new_m;
        chart.data.datasets[1].data = y_new_f;
        chart.update(); 
    }
}
