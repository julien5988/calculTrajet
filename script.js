const key = "SQCVM9uDdJ0aC2utMPkJ2L5fj3uGn5y8";
let from = "toulon";
let to = "nice";
let distanceKilometre;

import { cardata } from './carData.js';

// Fonction pour effectuer le calcul du coût
function calculatePrice() {
    // Récupération des valeurs des champs du formulaire
    const consommation = parseFloat(document.getElementById('consommation').value);
    const prixCarburant = parseFloat(document.getElementById('prix-carburant').value);
    const coutPeage = parseFloat(document.getElementById('cout-peage').value);
    const nombreTrajets = parseInt(document.getElementById('nombre-trajets').value);
    const allerRetour = document.getElementById('aller-retour').checked;
    const passagers = parseInt(document.getElementById('passagers').value);

    // Vérification des données d'entrée (assurez-vous qu'elles sont numériques et valides)
    if (isNaN(consommation) || isNaN(prixCarburant) || isNaN(coutPeage) || isNaN(nombreTrajets)) {
        alert("Veuillez saisir des valeurs numériques valides.");
        return;
    }

    // Conversion de la consommation en litres par kilomètre
    const consommationParKm = (consommation / 100);

    // Supposons que "selectedCar" contient la valeur de la marque de voiture sélectionnée
    const selectedCar = document.getElementById("Car").value;

    // Recherche du coût d'usure en fonction de la marque de voiture sélectionnée
    const selectedCarData = cardata.find(car => car.marque === selectedCar);

    if (selectedCarData) {
        const coutUsureParKm = selectedCarData.coutParKm;

        // Utilisez la variable distanceKilometre déjà déclarée
        let coutCarburantTotal = distanceKilometre * consommationParKm * prixCarburant;

        if (allerRetour) {
            coutCarburantTotal *= 2;
            coutCarburantTotal += coutPeage * 2;
        } else {
            coutCarburantTotal += coutPeage;
        }

        // Estimation du coût total du trajet en fonction du nombre de trajets
        const coutTotalTrajet = (coutCarburantTotal * nombreTrajets + distanceKilometre * coutUsureParKm).toFixed(2);

        // Affichage du coût total du trajet
        const resultatPrix = document.getElementById('resultat-prix');
        resultatPrix.textContent = `Coût total du trajet : ${coutTotalTrajet} €`;

        // Calcul du coût par passager en fonction du nombre de passagers
        const prixPassagers = document.getElementById('prix-passagers');
        if (passagers > 0) {
            const coutParPassager = (coutTotalTrajet / (passagers + 1)).toFixed(2);
            prixPassagers.textContent = `Coût par passager : ${coutParPassager} € par passager`;
        } else {
            prixPassagers.textContent = `Coût par passager : 0.00 €`;
        }
    } else {
        console.log("Marque de voiture non trouvée dans les données.");
    }
}

const directionsForm = document.getElementById('directions-form');

if (directionsForm) {
    directionsForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la soumission du formulaire

        // Récupère les nouvelles valeurs des champs "Point de départ" et "Point d'arrivée"
        const newPointDepart = document.getElementById('point-depart').value;
        const newPointArrivee = document.getElementById('point-arrivee').value;

        // Met à jour les variables from et to avec les nouvelles valeurs
        from = newPointDepart;
        to = newPointArrivee;

        // Effectuer la requête vers MapQuest pour obtenir la distance
        fetch(`https://www.mapquestapi.com/directions/v2/route?key=${key}&from=${from}&to=${to}&outFormat=json&ambiguities=ignore&routeType=fastest&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false`)
            .then(response => response.json())
            .then(data => {
                // Récupération de la distance en kilomètres à partir de la réponse de l'API
                let distanceMiles = data.route.distance;
                distanceKilometre = (distanceMiles * 1.60934).toFixed(2); // Affecte la valeur à la variable globale
                let duree = data.route.formattedTime;

                document.getElementById('km').textContent = `${distanceKilometre} Km`;
                document.getElementById('time').textContent = `${duree} H`;

                // Ensuite, vous pouvez appeler la fonction calculatePrice() pour effectuer le calcul en fonction des nouvelles valeurs
                calculatePrice();
            });
    });
}

// Code pour remplir la picklist (menu déroulant)
const selectElement = document.getElementById("Car");

cardata.forEach(cardata => { // Assurez-vous d'utiliser le nom correct, c'est "cardata"
    const option = document.createElement("option");
    option.value = cardata.marque;
    option.textContent = cardata.marque;
    selectElement.appendChild(option);
});
