const key = "SQCVM9uDdJ0aC2utMPkJ2L5fj3uGn5y8";
let from = "toulon";
let to = "nice";
let distanceKilometre;

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

    // Utilisez la variable distanceKilometre déjà déclarée
    let coutCarburantTotal = distanceKilometre * consommationParKm * prixCarburant;

    // Prise en compte des frais de péage pour l'aller-retour
    if (allerRetour) {
        coutCarburantTotal *= 2; // Double le coût du carburant pour un aller-retour
        coutCarburantTotal += coutPeage * 2; // Double les frais de péage pour un aller-retour
    } else {
        coutCarburantTotal += coutPeage; // Les frais de péage pour un seul trajet
    }

    // Estimation du coût d'usure de la voiture
    const coutUsureParKm = 1500 / 15000; // 1500 € par an pour 15 000 km
    const coutUsureTotal = distanceKilometre * coutUsureParKm;

    // Calcul du coût total du trajet en fonction du nombre de trajets
    const coutTotalTrajet = (coutCarburantTotal * nombreTrajets + coutUsureTotal).toFixed(2);

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
}
