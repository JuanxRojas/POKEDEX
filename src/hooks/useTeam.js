import { MAX_TEAM, usePokemonContext } from '../context/PokemonContext';

export default function useTeam() {
  const { team, addToTeam, removeFromTeam, isInTeam } = usePokemonContext();
  return { team, addToTeam, removeFromTeam, isInTeam, MAX_TEAM };
}
