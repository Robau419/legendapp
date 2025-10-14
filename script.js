document.getElementById('sportRadio').addEventListener('change', function() {
            const selectSportBlock = document.getElementById('select-sport-block');
            if (this.checked) {
                selectSportBlock.style.display = 'block'; // Affiche la div
            }
        });

        // Gérer le cas du bouton "Reportage"
        document.querySelector('input[value="reportage"]').addEventListener('change', function() {
            const selectSportBlock = document.getElementById('select-sport-block');
            selectSportBlock.style.display = 'none'; // Masque la div
        });

// Fonction pour obtenir la date au format DD-MM-YYYY
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
}

// Fonction pour trier les options du datalist par ordre alphabétique
function sortCityOptions() {
    const datalist = document.getElementById('city-list');
    const optionsArray = Array.from(datalist.options);

    // Trier les options par ordre alphabétique
    optionsArray.sort((a, b) => a.value.localeCompare(b.value));

    // Vider le datalist
    datalist.innerHTML = '';

    // Réinsérer les options triées
    optionsArray.forEach(option => {
        const newOption = document.createElement('option');
        newOption.value = option.value; // Assurez-vous que l'option a une valeur
        datalist.appendChild(newOption);
    });
}

// Appeler la fonction pour trier les options après que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    sortCityOptions();

    // Écouter l'événement pour le bouton addToDescription
    document.getElementById('addToDescription').addEventListener('click', function() {
        const titleText = document.getElementById('title').value; // Récupérer le texte du titre
        if (titleText) {
            document.getElementById('description').value += titleText; // Ajouter le titre au champ de description
        } else {
            alert("Le champ de titre est vide !");
        }
    });

    // Autres écouteurs d'événements
    document.getElementById('dateInput').addEventListener('input', generateLegend);
    document.getElementById('city').addEventListener('input', generateLegend);
    document.getElementById('photographer').addEventListener('input', generateLegend);
    document.getElementById('searchCity').addEventListener('input', filterCities);
    document.getElementById('title').addEventListener('input', generateLegend);
    document.getElementById('description').addEventListener('input', generateLegend);
});

// Fonction pour générer la légende
function generateLegend() {
    const dateInput = document.getElementById('dateInput').value;
    let todayDate = dateInput ? new Date(dateInput) : new Date();

    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function reformatText() {
        const input = document.getElementById("textkeywords").value;
        return removeAccents(input).replace(/,/g, " / ").toUpperCase();
    }

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const formattedDate = formatDate(todayDate);
    const cityInput = document.getElementById('city').value;
    const creditPhoto = document.getElementById('photographer').value;
    const formattedText = reformatText();

    const legendForm = `${removeAccents(description)} / ${cityInput} / ${formattedDate} / Photo ${creditPhoto} / ${formattedText}`;
    document.getElementById('legendTxt').innerHTML = legendForm;
    document.getElementById('titleDisplay').innerText = title;
}

// Fonction pour filtrer les villes
function filterCities() {
    const searchInput = document.getElementById('searchCity').value.toLowerCase();
    const datalist = document.getElementById('city-list');
    const options = datalist.options;

    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const cityName = option.value.toLowerCase();
        option.style.display = cityName.includes(searchInput) ? 'block' : 'none';
    }
}

// bouton de suppression de la ville
document.getElementById('cityMoulins').addEventListener('click', function() {
    var champTexte = document.getElementById('city');
    champTexte.value = "Moulins";
});
document.getElementById('cityYzeure').addEventListener('click', function() {
    var champTexte = document.getElementById('city');
    champTexte.value = "Yzeure";
});
document.getElementById('citySuppr').addEventListener('click', function() {
    var champTexte = document.getElementById('city');
    champTexte.value = "";
});
document.getElementById('citySaintPourcainBesbre').addEventListener('click', function() {
    var champTexte = document.getElementById('city');
    champTexte.value = "Saint-Pourcain-sur-Besbre";
});
document.getElementById('citySaintPourcainSioule').addEventListener('click', function() {
    var champTexte = document.getElementById('city');
    champTexte.value = "Saint-Pourcain-sur-Sioule";
});



// POUR PRE REMPLIR SPORT
// const team_one = document.getElementById('first-team').value;
// const team_two=document.getElementById('second-team').value;
// function getMatchText() {
//     // Remplacez ceci par la logique pour obtenir le texte souhaité
//     return "Match de football " + team_one + " et " + team_two;
// }

document.getElementById('foot-myf').addEventListener('click', function() {
    const team_two = document.getElementById('second-team').value;
    const titleTeam = `Match de football MYF contre ${team_two}`;
    document.getElementById('textkeywords').value = "MOULINS YZEURE FOOT, NATIONAL 3, SPORT,FOOTBALL";
    document.getElementById('title').value = titleTeam;
    document.getElementById('description').value = titleTeam;
});

document.getElementById('foot-ac').addEventListener('click', function() {
    const team_two = document.getElementById('second-team').value;
    const titleTeam = `Match de football AS Moulins contre ${team_two}`;
    const legendTeam = `Match de football Academie Sportive de Moulins contre ${team_two}`;
    document.getElementById('city').value = "";
    document.getElementById('textkeywords').value = "ACADEMIE DE MOULINS, REGIONAL 2, SPORT,FOOTBALL";
    document.getElementById('title').value = titleTeam;
    document.getElementById('description').value = legendTeam;
});

document.getElementById('rugby').addEventListener('click', function() {
    const team_two = document.getElementById('second-team').value;
    const titleTeam = `Match de rugby FCM contre ${team_two}`;
    const legendTeam = `Match de rugby Football Club Moulinois contre ${team_two}`;
    document.getElementById('city').value = "Moulins";
    document.getElementById('textkeywords').value = "RUGBY, REGIONAL 1, SPORT, FCM";
    document.getElementById('title').value = titleTeam;
    document.getElementById('description').value = legendTeam;
});

document.getElementById('waterpolo').addEventListener('click', function() {
    const team_two = document.getElementById('second-team').value;
    const titleTeam = `Match de waterpolo NCM contre ${team_two}`;
    const legendTeam = `Match de waterpolo Nautic Club Moulinois contre ${team_two}`;
    document.getElementById('city').value = "Moulins";
    document.getElementById('textkeywords').value = "waterpolo, National 1, SPORT, water polo";
    document.getElementById('title').value = titleTeam;
    document.getElementById('description').value = legendTeam;
});

// bouton de suppression de tous les champs
document.getElementById('deleteAll').addEventListener('click', function() {
    document.getElementById('city').value = "";
    document.getElementById('textkeywords').value = "";
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
});

// Copier le texte de la légende 
document.getElementById('copyLegend').addEventListener('click', function() {
    const legendText = document.getElementById('legendTxt').innerText;
    navigator.clipboard.writeText(legendText);    
});

// Copier le texte du titre
document.getElementById('copyTitle').addEventListener('click', function() {
    const titleText = document.getElementById('titleDisplay').innerText;
    navigator.clipboard.writeText(titleText);    
});

// Appeler la fonction pour générer la légende au chargement de la page
generateLegend();
