import { formatName, getIdFromUrl } from '../utils/pokemonHelpers';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const MAX_POKEMON_ID = 10000; // ids >= 10000 son formas alternativas

// Caché de promesas: evita peticiones duplicadas y repetidas.
const cache = new Map();
function cached(key, loader) {
  if (!cache.has(key)) {
    cache.set(key, loader().catch((e) => { cache.delete(key); throw e; }));
  }
  return cache.get(key);
}

async function get(path) {
  const res = await fetch(`${POKEAPI_BASE_URL}/${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const normalize = (d) => ({
  id: d.id,
  name: d.name,
  image: d.sprites?.other?.['official-artwork']?.front_default || d.sprites?.front_default || null,
  types: d.types.map((t) => t.type.name),
  height: d.height / 10, // m
  weight: d.weight / 10, // kg
  stats: d.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  abilities: d.abilities.map((a) => a.ability.name),
  moves: d.moves.map((m) => m.move.name),
});

export function getPokemonList(limit = 20, offset = 0) {
  return cached(`list:${limit}:${offset}`, async () => {
    const d = await get(`pokemon?limit=${limit}&offset=${offset}`);
    return { count: d.count, results: d.results.map((r) => ({ id: getIdFromUrl(r.url), name: r.name })) };
  });
}

// Índice liviano (id + nombre) de todos los Pokémon: sirve para búsqueda local y aleatorio.
export const getAllPokemon = () =>
  cached('all', async () => (await getPokemonList(2000, 0)).results.filter((p) => p.id < MAX_POKEMON_ID));

export const getPokemonById = (id) => cached(`pokemon:${id}`, async () => normalize(await get(`pokemon/${id}`)));
export const getPokemonByName = (name) => getPokemonById(String(name).toLowerCase());

export const getPokemonSpecies = (id) =>
  cached(`species:${id}`, async () => {
    const d = await get(`pokemon-species/${id}`);
    return { evolutionChainId: d.evolution_chain ? getIdFromUrl(d.evolution_chain.url) : null };
  });

function describeEvolution(d) {
  if (!d) return '';
  if (d.min_level) return `Nivel ${d.min_level}`;
  if (d.item) return formatName(d.item.name);
  if (d.trigger?.name === 'trade') return 'Intercambio';
  if (d.min_happiness) return 'Amistad';
  return formatName(d.trigger?.name || '');
}

// Devuelve las etapas evolutivas: [[{id,name,detail,image,types}], [...], ...]
export function getEvolutionChain(pokemonId) {
  return cached(`evo:${pokemonId}`, async () => {
    const { evolutionChainId } = await getPokemonSpecies(pokemonId);
    if (!evolutionChainId) return [];
    const data = await cached(`chain:${evolutionChainId}`, () => get(`evolution-chain/${evolutionChainId}`));
    const stages = [];
    let level = [data.chain];
    while (level.length) {
      stages.push(
        level.map((n) => ({
          id: getIdFromUrl(n.species.url),
          name: n.species.name,
          detail: describeEvolution(n.evolution_details?.[0]),
        }))
      );
      level = level.flatMap((n) => n.evolves_to);
    }
    await Promise.all(
      stages.flat().map(async (s) => {
        const p = await getPokemonById(s.id);
        s.image = p.image;
        s.types = p.types;
      })
    );
    return stages;
  });
}

export const getPokemonByType = (type) =>
  cached(`type:${type}`, async () => {
    const d = await get(`type/${type}`);
    return d.pokemon
      .map((p) => ({ id: getIdFromUrl(p.pokemon.url), name: p.pokemon.name }))
      .filter((p) => p.id < MAX_POKEMON_ID)
      .sort((a, b) => a.id - b.id);
  });

export async function getRandomPokemon() {
  const all = await getAllPokemon();
  const pick = all[Math.floor(Math.random() * all.length)];
  return getPokemonById(pick.id);
}
