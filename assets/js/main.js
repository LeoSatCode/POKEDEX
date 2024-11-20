const pokemonList = document.getElementById('pokemonList');
const loadMore = document.getElementById('loadMore');
const popup = document.getElementById('popup');
const popupDetails = document.getElementById('popupDetails');
const closePopup = document.getElementById('closePopup');
const maxRecords = 151;
const limit = 12;
let offset = 0;

function loadPokemon(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => `
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
        `).join('');
        pokemonList.innerHTML += newHtml;
    });
}

function showPopup(pokemon) {
    popupDetails.innerHTML = `
        <div class="popup-header" style="background-color: ${pokemon.typeColor};">
            <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
            <span class="number">#${pokemon.number}</span>
        </div>
        <div class="popup-image" style="background-color: ${pokemon.typeColor};">
            <img src="${pokemon.photo}" alt="${capitalizeFirstLetter(pokemon.name)}" />
        </div>
        <div class="popup-details">
            <p><strong>Weight:</strong> ${pokemon.weight} kg</p>
            <p><strong>Height:</strong> ${pokemon.height} m</p>
            <div class="base-stats">
                <strong>Base Stats:</strong>
                ${pokemon.baseStats.map(stat => `<p class="stat-item">${stat}</p>`).join('')}
            </div>
            <div class="base-moves">
                <strong>Base Moves:</strong>
                ${pokemon.baseMoves.map(move => `<p class="move-item">${move}</p>`).join('')}
            </div>
        </div>
    `;
    popup.classList.remove('hidden');
    popup.style.display = 'flex';
    popup.style.backgroundColor = pokemon.typeColor;
  
    // Adiciona um evento para fechar o pop-up ao clicar fora dele
    document.addEventListener('click', (event) => {
      if (!popup.contains(event.target) && !event.target.closest('.pokemon')) {
        hidePopup();
      }
    });
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






