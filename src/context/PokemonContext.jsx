import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadJSON, saveJSON } from '../utils/storage';

export const MAX_TEAM = 6;
const FAV_KEY = '@pokemon-trainer/favorites';
const TEAM_KEY = '@pokemon-trainer/team';

const PokemonContext = createContext(null);

export function PokemonProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [team, setTeam] = useState([]);
  const [ready, setReady] = useState(false);

  // Cargar desde AsyncStorage al iniciar
  useEffect(() => {
    let alive = true;
    Promise.all([loadJSON(FAV_KEY, []), loadJSON(TEAM_KEY, [])]).then(([f, t]) => {
      if (!alive) return;
      setFavorites(f);
      setTeam(t);
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  // Guardar en cada cambio (solo cuando ya se cargó lo anterior)
  useEffect(() => { if (ready) saveJSON(FAV_KEY, favorites); }, [favorites, ready]);
  useEffect(() => { if (ready) saveJSON(TEAM_KEY, team); }, [team, ready]);

  const isFavorite = useCallback((id) => favorites.some((p) => p.id === id), [favorites]);
  const addFavorite = useCallback((p) => setFavorites((l) => (l.some((x) => x.id === p.id) ? l : [...l, p])), []);
  const removeFavorite = useCallback((id) => setFavorites((l) => l.filter((p) => p.id !== id)), []);
  const toggleFavorite = useCallback(
    (p) => (isFavorite(p.id) ? removeFavorite(p.id) : addFavorite(p)),
    [isFavorite, addFavorite, removeFavorite]
  );

  const isInTeam = useCallback((id) => team.some((p) => p.id === id), [team]);
  // Devuelve 'added' | 'full' | 'exists'
  const addToTeam = useCallback(
    (p) => {
      if (team.some((x) => x.id === p.id)) return 'exists';
      if (team.length >= MAX_TEAM) return 'full';
      setTeam([...team, p]);
      return 'added';
    },
    [team]
  );
  const removeFromTeam = useCallback((id) => setTeam((l) => l.filter((p) => p.id !== id)), []);

  const value = useMemo(
    () => ({
      favorites, team, ready,
      isFavorite, addFavorite, removeFavorite, toggleFavorite,
      isInTeam, addToTeam, removeFromTeam,
    }),
    [favorites, team, ready, isFavorite, addFavorite, removeFavorite, toggleFavorite, isInTeam, addToTeam, removeFromTeam]
  );

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}

export function usePokemonContext() {
  const ctx = useContext(PokemonContext);
  if (!ctx) throw new Error('usePokemonContext debe usarse dentro de PokemonProvider');
  return ctx;
}
