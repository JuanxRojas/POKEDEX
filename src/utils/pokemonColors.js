import { POKEMON_TYPES } from '../constants/pokemonTypes';

export const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE6B2F', water: '#4F8EF7', electric: '#F5C518', grass: '#5DB94A',
  ice: '#6EC9E0', fighting: '#C22E28', poison: '#A33EA1', ground: '#D8B454', flying: '#8F9BF0',
  psychic: '#F95587', bug: '#A6B91A', rock: '#B6A136', ghost: '#6D4C9F', dragon: '#5B3FD9',
  dark: '#705746', steel: '#8E9BB5', fairy: '#D685AD',
};

const FALLBACK = '#9CA3AF';

export const getTypeColor = (type) => TYPE_COLORS[type] || FALLBACK;
export const getTypeEmoji = (type) => POKEMON_TYPES[type] || '❔';

// Degradado suave para tarjetas
export const getCardGradient = (types = []) => [`${getTypeColor(types[0])}55`, '#FFFFFF'];

// Degradado intenso para la cabecera del detalle
export const getHeroGradient = (types = []) => {
  const a = getTypeColor(types[0]);
  return [a, types[1] ? getTypeColor(types[1]) : `${a}99`];
};
