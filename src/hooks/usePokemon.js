import { useCallback, useEffect, useState } from 'react';
import { getEvolutionChain, getPokemonById } from '../services/pokemonApi';

// Hook genérico de carga: { data, loading, error, retry }
export function useAsync(fn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const retry = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, retry };
}

export const usePokemon = (id) => useAsync(() => getPokemonById(id), [id]);
export const useEvolutionChain = (id) => useAsync(() => getEvolutionChain(id), [id]);
