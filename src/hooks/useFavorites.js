import { usePokemonContext } from '../context/PokemonContext';

export default function useFavorites() {
  const { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite } = usePokemonContext();
  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite };
}
