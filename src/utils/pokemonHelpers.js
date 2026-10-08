export const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);
export const formatName = (s = '') => s.split('-').map(capitalize).join(' ');
export const formatId = (id) => `#${String(id).padStart(3, '0')}`;
export const getIdFromUrl = (url) => Number(url.split('/').filter(Boolean).pop());
export const toSummary = ({ id, name, image, types }) => ({ id, name, image, types });

export const STAT_LABELS = {
  hp: 'HP',
  attack: 'ATTACK',
  defense: 'DEFENSE',
  'special-attack': 'SP. ATK',
  'special-defense': 'SP. DEF',
  speed: 'SPEED',
};
