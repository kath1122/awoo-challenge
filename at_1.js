const axios = require('axios');

const base_url = 'https://pokeapi.co/api/v2/pokemon';

async function getPokemonData(idOrName) {
  try {
    const response = await axios.get(`${base_url}/${idOrName}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching Pokemon data: ${error}`);
    return null;
  }
}

async function listPokemonNameById(id) {
  const pokemonData = await getPokemonData(id);
  if (pokemonData) {
    console.log(`1. 列出 id 為 6 的寶可夢名稱（name）: ${pokemonData.name}`);
  }
}

async function listPokemonNamesByIdRange(startId, endId) {
  const pokemonList = [];

  for (let id = startId; id <= endId; id++) {
    const pokemonData = await getPokemonData(id);
    if (pokemonData && pokemonData.types) { 
      const types = pokemonData.types.map(type => type.type.name);
      pokemonList.push({ name: pokemonData.name || 'N/A', types });

    }

  }

  pokemonList.sort((a, b) => a.id - b.id);

  console.log('2. id < 20, id > 0 寶可夢名稱（name）及寶可夢的屬性（types）, id 由小至大排序:');
  pokemonList.forEach((pokemon) => {
    console.log(`   名稱: ${pokemon.name}, 屬性: ${pokemon.types}`);
  });
}

async function listPokemonByWeightRange(maxWeight) {
  try {
    const response = await axios.get(`${base_url}?limit=100`);
    const allPokemon = response.data.results;

    const filteredPokemon = [];
    for (const pokemon of allPokemon) {
      const pokemonData = await getPokemonData(pokemon.name);
      if (pokemonData && pokemonData.weight < maxWeight) {
        filteredPokemon.push({ name: pokemonData.name, weight: pokemonData.weight });
      }
    }

    const sortedPokemon = filteredPokemon.sort((a, b) => b.weight - a.weight);

    console.log('3. 體重 < 50 的寶可夢名稱（name）及寶可夢體重（weight）:');
    for (const pokemon of sortedPokemon) {
      console.log(`   名稱: ${pokemon.name}, 體重: ${pokemon.weight}`);
    }
  } catch (error) {
    console.error(`Error fetching Pokemon data: ${error}`);
  }
}

(async () => {
  // 1. 列出 id 為 6 的寶可夢名稱（name）
  await listPokemonNameById(6);

  // 2. 列出 id < 20, id > 0 的寶可夢名稱（name）以及其寶可夢的屬性（types），依照 id 由小至大排序
  await listPokemonNamesByIdRange(1, 19);

  // 3. 列出 id < 100, id > 0 的寶可夢中，體重（weight） < 50 的寶可夢名稱（name）及寶可夢體重（weight），並且依照體重由大至小排序
  await listPokemonByWeightRange(50);
})();
