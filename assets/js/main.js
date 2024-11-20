const pokemonList = document.getElementById('pokemonList');
const loadMore = document.getElementById('loadMore');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
const maxRecords = 151;
const limit = 12;
let offset = 0;

function loadPokemon(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(createPokemonHtml).join('');
        pokemonList.innerHTML += newHtml;
    });
}

function createPokemonHtml(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}" />
            </div>
        </li>
    `;
}

function showPopup(pokemon) {
    document.getElementById('pokemonName').innerText = capitalizeFirstLetter(pokemon.name);
    document.getElementById('pokemonNumber').innerText = `#${pokemon.number}`;
    document.getElementById('pokemonPhoto').src = pokemon.photo;
    document.getElementById('pokemonWeight').innerText = pokemon.weight;
    document.getElementById('pokemonHeight').innerText = pokemon.height;

    const pokemonTypes = document.getElementById('pokemonTypes');
    pokemonTypes.innerHTML = pokemon.types.map(type => `<li class="type ${type}">${type}</li>`).join('');

    pokeApi.getPokemonDescription(pokemon.number).then(description => {
        document.getElementById('pokemonDescription').innerText = description;
    });

    const baseStatsContent = pokemon.baseStats.map(stat => `<p class="stat-item">${stat}</p>`).join('');
    document.getElementById('BaseStats').innerHTML = `<strong>Base Stats:</strong>${baseStatsContent}`;

    const baseMovesContent = pokemon.baseMoves.map(move => `<p class="move-item">${move}</p>`).join('');
    document.getElementById('BaseMoves').innerHTML = `<strong>Base Moves:</strong>${baseMovesContent}`;

    openTab(null, 'About');

    popup.classList.remove('hidden');
    popup.style.display = 'flex';
    popup.style.backgroundColor = pokemon.typeColor;

    document.addEventListener('click', (event) => {
        if (!popup.contains(event.target) && !event.target.closest('.pokemon')) {
            hidePopup();
        }
    });
}


function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    if (evt) {
        evt.currentTarget.className += " active";
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function hidePopup() {
    popup.classList.add('hidden');
    popup.style.display = 'none'; 
}

pokemonList.addEventListener('click', (event) => {
    const pokemonItem = event.target.closest('.pokemon');
    if (pokemonItem) {
        const pokemonId = pokemonItem.getAttribute('data-id');
        pokeApi.getPokemonDetail({ url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}` }).then(showPopup);
    }
});

closePopup.addEventListener('click', hidePopup);

loadPokemon(offset, limit);

loadMore.addEventListener('click', () => {
    offset += limit;
    const qtdRecordNextPage = offset + limit;
    if (qtdRecordNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemon(offset, newLimit);
        loadMore.parentElement.removeChild(loadMore);
    } else {
        loadPokemon(offset, limit);
    }
});

pokeApi.getPokemonDescription = (pokemonId) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`)
        .then(response => response.json())
        .then(data => {
            const flavorTextEntries = data.flavor_text_entries;
            const entry = flavorTextEntries.find(entry => entry.language.name === 'en');
            return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Description not available';
        });
};
