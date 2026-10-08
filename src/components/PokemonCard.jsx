import { memo, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PokemonImage from './PokemonImage';
import PokemonTypeBadge from './PokemonTypeBadge';
import FavoriteButton from './FavoriteButton';
import { usePokemon } from '../hooks/usePokemon';
import { colors, radius, shadow, spacing } from '../theme';
import { formatId, formatName } from '../utils/pokemonHelpers';
import { getCardGradient } from '../utils/pokemonColors';

const useCardWidth = () => (useWindowDimensions().width - spacing.lg * 2 - spacing.md) / 2;

// Tarjeta presentacional: recibe { id, name, image, types }
function PokemonCard({ pokemon, onPress, index = 0 }) {
  const w = useCardWidth();
  const a = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(a, { toValue: 1, duration: 350, delay: (index % 2) * 80, useNativeDriver: true }).start();
  }, [a, index]);

  return (
    <Animated.View
      style={[styles.shadow, { width: w, opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
    >
      <Pressable onPress={() => onPress(pokemon)} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        <LinearGradient colors={getCardGradient(pokemon.types)} style={styles.card}>
          <View style={styles.top}>
            <Text style={styles.id}>{formatId(pokemon.id)}</Text>
            <FavoriteButton pokemon={pokemon} size={22} />
          </View>
          <PokemonImage uri={pokemon.image} size={w * 0.62} />
          <Text style={styles.name} numberOfLines={1}>{formatName(pokemon.name).toUpperCase()}</Text>
          <View style={styles.types}>
            {pokemon.types.map((t) => <PokemonTypeBadge key={t} type={t} small />)}
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default memo(PokemonCard);

// Para la lista: recibe { id, name } y carga el resto (imagen, tipos) bajo demanda
export const LazyPokemonCard = memo(function LazyPokemonCard({ item, onPress, index }) {
  const { data, error, retry } = usePokemon(item.id);
  const w = useCardWidth();
  if (!data) {
    return (
      <Pressable onPress={error ? retry : undefined} style={[styles.skeleton, { width: w }]}>
        {error ? <Text style={{ fontSize: 28 }}>😢</Text> : <ActivityIndicator color={colors.primary} />}
      </Pressable>
    );
  }
  return <PokemonCard pokemon={data} onPress={onPress} index={index} />;
});

const styles = StyleSheet.create({
  shadow: { borderRadius: radius.md, backgroundColor: colors.white, ...shadow.card },
  card: { borderRadius: radius.md, padding: spacing.md, alignItems: 'center', overflow: 'hidden' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' },
  id: { fontWeight: '800', color: colors.muted },
  name: { marginTop: spacing.xs, fontWeight: '900', fontSize: 14, color: colors.dark, letterSpacing: 0.5 },
  types: { flexDirection: 'row', gap: 4, marginTop: spacing.sm, minHeight: 22 },
  skeleton: { height: 200, borderRadius: radius.md, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});
