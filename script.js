function calculatePrice() {
    // Récupération des valeurs des champs du formulaire
    const distance = parseFloat(document.getElementById('distance').value);
    const consommation = parseFloat(document.getElementById('consommation').value);
    const prixCarburant = parseFloat(document.getElementById('prix-carburant').value);
    const coutPeage = parseFloat(document.getElementById('cout-peage').value);
    const nombreTrajets = parseInt(document.getElementById('nombre-trajets').value);
    const allerRetour = document.getElementById('aller-retour').checked;
    const passagers = parseInt(document.getElementById('passagers').value);

    // Vérification des données d'entrée (assurez-vous qu'elles sont numériques et valides)
    if (isNaN(distance) || isNaN(consommation) || isNaN(prixCarburant) || isNaN(coutPeage) || isNaN(nombreTrajets)) {
        alert("Veuillez saisir des valeurs numériques valides.");
        return;
    }

    // Conversion de la consommation en litres par kilomètre
    const consommationParKm = (consommation / 100);

    // Calcul du coût total du carburant en supposant que le conducteur effectue la distance totale
    let coutCarburantTotal = distance * consommationParKm * prixCarburant;

    // Prise en compte des frais de péage pour l'aller-retour
    if (allerRetour) {
        coutCarburantTotal *= 2; // Double le coût du carburant pour un aller-retour
        coutCarburantTotal += coutPeage * 2; // Double les frais de péage pour un aller-retour
    } else {
        coutCarburantTotal += coutPeage; // Les frais de péage pour un seul trajet
    }

    // Calcul du coût total du trajet en fonction du nombre de trajets
    const coutTotalTrajet = coutCarburantTotal * nombreTrajets;

    // Affichage du coût total du trajet
    document.getElementById('resultat-prix').textContent = `Coût total du trajet : ${coutTotalTrajet.toFixed(2)} €`;

    // Calcul du coût par passager en fonction du nombre de passagers
    if (passagers > 0) {
        const coutParPassager = coutTotalTrajet / (passagers + 1); // +1 pour inclure le conducteur
        document.getElementById('prix-passagers').textContent = `Coût par passager : ${coutParPassager.toFixed(2)} € par passager`;
    } else {
        document.getElementById('prix-passagers').textContent = `Coût par passager : 0.00 €`;
    }
}

// Écouteur d'événement pour le changement du nombre de passagers
document.getElementById('passagers').addEventListener('change', calculatePrice);
