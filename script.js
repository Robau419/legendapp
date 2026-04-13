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

    // Etat initial des champs
    updateFieldStates();

    // Bouton "Aujourd'hui" → remplit la date avec aujourd'hui
    document.getElementById('today').addEventListener('click', function() {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        document.getElementById('dateInput').value = todayStr;
        generateLegend();
    });

    // Historique
    renderHistory();
    document.getElementById('clear-history').addEventListener('click', function() {
        saveHistory([]);
        renderHistory();
    });

    // Autres écouteurs d'événements
    document.getElementById('dateInput').addEventListener('input', generateLegend);
    document.getElementById('city').addEventListener('input', generateLegend);
    document.getElementById('photographer').addEventListener('input', generateLegend);
    document.getElementById('searchCity').addEventListener('input', filterCities);
    document.getElementById('title').addEventListener('input', generateLegend);
    document.getElementById('description').addEventListener('input', generateLegend);
});

// === HISTORIQUE ===
const HISTORY_KEY = 'legendapp_history';
const HISTORY_MAX = 20;

function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
}

function saveHistory(history) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addToHistory(title, legend) {
    if (!title && !legend) return;
    const history = loadHistory();
    history.unshift({ id: Date.now(), timestamp: new Date().toISOString(), title, legend });
    if (history.length > HISTORY_MAX) history.splice(HISTORY_MAX);
    saveHistory(history);
    renderHistory();
}

function deleteHistoryEntry(id) {
    saveHistory(loadHistory().filter(e => e.id !== id));
    renderHistory();
}

function formatTimeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return "À l'instant";
    if (m < 60) return `Il y a ${m} min`;
    if (h < 24) return `Il y a ${h} h`;
    return `Il y a ${d} j`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderHistory() {
    const container  = document.getElementById('history-list');
    const badge      = document.getElementById('history-count');
    const emptyState = document.getElementById('history-empty');
    const history    = loadHistory();

    badge.textContent = history.length;
    container.innerHTML = '';

    if (history.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    history.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'history-entry';
        div.innerHTML = `
            <div class="history-entry-header">
                <span class="history-time">${formatTimeAgo(entry.timestamp)}</span>
                <button class="history-delete" title="Supprimer">&#10005;</button>
            </div>
            ${entry.title ? `<p class="history-entry-title">${escapeHtml(entry.title)}</p>` : ''}
            <p class="history-entry-legend">${escapeHtml(entry.legend)}</p>
            <div class="history-entry-actions">
                <button class="btn-copy-small js-copy-title">Copier le titre</button>
                <button class="btn-copy-small js-copy-legend">Copier la légende</button>
            </div>`;

        div.querySelector('.history-delete').addEventListener('click', () => deleteHistoryEntry(entry.id));
        div.querySelector('.js-copy-title').addEventListener('click', () => navigator.clipboard.writeText(entry.title));
        div.querySelector('.js-copy-legend').addEventListener('click', () => navigator.clipboard.writeText(entry.legend));
        container.appendChild(div);
    });
}

// Surbrillance des champs vides + alerte date
function updateFieldStates() {
    ['title', 'description', 'city', 'textkeywords', 'dateInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('field-empty', el.value.trim() === '');
    });

    // Photographe vide OU contient uniquement la valeur par défaut
    const photoEl = document.getElementById('photographer');
    if (photoEl) photoEl.classList.toggle('field-empty', photoEl.value.trim() === '' || photoEl.value.trim() === 'Photographe');

    const dateEl = document.getElementById('dateInput');
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    dateEl.classList.toggle('date-warning', !!dateEl.value && dateEl.value !== todayStr);
}

// Fonction pour générer la légende
function generateLegend(saveToHist = false) {
    const dateInput = document.getElementById('dateInput').value;
    let todayDate = dateInput ? new Date(dateInput) : new Date();

    function removeAccents(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function sanitize(str) {
        // Couvre tous les types d'apostrophes : ' ' ʼ ʻ ` ´ ‚ ‛
        return removeAccents(str).replace(/[\u0027\u0060\u00B4\u02B9\u02BB\u02BC\u2018\u2019\u201A\u201B]/g, ' ');
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

    const legendForm = `${sanitize(description)} / ${cityInput} / ${formattedDate} / Photo ${creditPhoto} / ${formattedText}`;
    document.getElementById('legendTxt').innerHTML = legendForm;
    document.getElementById('titleDisplay').innerText = sanitize(title);

    if (saveToHist === true) {
        addToHistory(title, legendForm);
    }

    updateFieldStates();
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
    document.getElementById('city').value = "Moulins";
    generateLegend();
});
document.getElementById('cityYzeure').addEventListener('click', function() {
    document.getElementById('city').value = "Yzeure";
    generateLegend();
});
document.getElementById('citySuppr').addEventListener('click', function() {
    document.getElementById('city').value = "";
    generateLegend();
});
document.getElementById('citySaintPourcainBesbre').addEventListener('click', function() {
    document.getElementById('city').value = "Saint-Pourcain-sur-Besbre";
    generateLegend();
});
document.getElementById('citySaintPourcainSioule').addEventListener('click', function() {
    document.getElementById('city').value = "Saint-Pourcain-sur-Sioule";
    generateLegend();
});



// POUR PRE REMPLIR SPORT
document.getElementById('foot-myf').addEventListener('click', function() {
    const team_two = document.getElementById('second-team').value;
    const titleTeam = `Match de football MYF contre ${team_two}`;
    document.getElementById('textkeywords').value = "MOULINS YZEURE FOOT, NATIONAL 3, SPORT,FOOTBALL";
    document.getElementById('title').value = titleTeam;
    document.getElementById('description').value = titleTeam;
    generateLegend();
});

document.getElementById('foot-ac').addEventListener('click', function() {
    const team_two = document.getElementById('second-team').value;
    const titleTeam = `Match de football AS Moulins contre ${team_two}`;
    const legendTeam = `Match de football Academie Sportive de Moulins contre ${team_two}`;
    document.getElementById('city').value = "";
    document.getElementById('textkeywords').value = "ACADEMIE DE MOULINS, REGIONAL 2, SPORT,FOOTBALL";
    document.getElementById('title').value = titleTeam;
    document.getElementById('description').value = legendTeam;
    generateLegend();
});

document.getElementById('rugby').addEventListener('click', function() {
    const team_two = document.getElementById('second-team').value;
    const titleTeam = `Match de rugby FCM contre ${team_two}`;
    const legendTeam = `Match de rugby Football Club Moulinois contre ${team_two}`;
    document.getElementById('city').value = "Moulins";
    document.getElementById('textkeywords').value = "RUGBY, REGIONAL 1, SPORT, FCM";
    document.getElementById('title').value = titleTeam;
    document.getElementById('description').value = legendTeam;
    generateLegend();
});

document.getElementById('waterpolo').addEventListener('click', function() {
    const team_two = document.getElementById('second-team').value;
    const titleTeam = `Match de waterpolo NCM contre ${team_two}`;
    const legendTeam = `Match de waterpolo Nautic Club Moulinois contre ${team_two}`;
    document.getElementById('city').value = "Moulins";
    document.getElementById('textkeywords').value = "waterpolo, National 1, SPORT, water polo";
    document.getElementById('title').value = titleTeam;
    document.getElementById('description').value = legendTeam;
    generateLegend();
});

// bouton de suppression de tous les champs
document.getElementById('deleteAll').addEventListener('click', function() {
    document.getElementById('city').value = "";
    document.getElementById('textkeywords').value = "";
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('dateInput').value = "";
    document.getElementById('titleDisplay').innerText = "";
    document.getElementById('legendTxt').innerText = "";
    updateFieldStates();
});

// Bouton Illustration : ajoute "illustration" aux mots-clés
document.getElementById('addIllustration').addEventListener('click', function() {
    const kw = document.getElementById('textkeywords');
    const val = kw.value.trim();
    kw.value = val ? val + ', illustration' : 'illustration';
    generateLegend();
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
