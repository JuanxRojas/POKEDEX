import { useRef } from 'react';
import { Alert, Animated } from 'react-native';
import useTeam from '../hooks/useTeam';
import PrimaryButton from './PrimaryButton';
import { colors } from '../theme';
import { toSummary } from '../utils/pokemonHelpers';

export default function TeamButton({ pokemon }) {
  const { team, isInTeam, addToTeam, removeFromTeam, MAX_TEAM } = useTeam();
  const inTeam = isInTeam(pokemon.id);
  const a = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    if (inTeam) return removeFromTeam(pokemon.id);
    const result = addToTeam(toSummary(pokemon));
    if (result === 'full') {
      Alert.alert('⚠️ Tu equipo ya está completo', `Un equipo Pokémon puede tener máximo ${MAX_TEAM} Pokémon.`);
      return;
    }
    // fade + scale al agregar
    a.setValue(0.6);
    Animated.spring(a, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ opacity: a, transform: [{ scale: a }] }}>
      <PrimaryButton
        onPress={onPress}
        color={inTeam ? colors.success : colors.blue}
        label={inTeam ? '✅ En mi equipo (quitar)' : `⚔️ Agregar a mi equipo (${team.length}/${MAX_TEAM})`}
      />
    </Animated.View>
  );
}
