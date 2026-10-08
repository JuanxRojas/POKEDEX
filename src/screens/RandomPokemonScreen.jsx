import { useCallback, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PokemonImage from '../components/PokemonImage';
import PokemonTypeBadge from '../components/PokemonTypeBadge';
import FavoriteButton from '../components/FavoriteButton';
import PrimaryButton from '../components/PrimaryButton';
import { getRandomPokemon } from '../services/pokemonApi';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { formatId, formatName } from '../utils/pokemonHelpers';
import { getCardGradient } from '../utils/pokemonColors';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export default function RandomPokemonScreen({ navigation }) {
  const [pokemon, setPokemon] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const busyRef = useRef(false);
  const anim = useRef(new Animated.Value(1)).current; // fade + scale
  const rot = useRef(new Animated.Value(1)).current; // rotate
  const insets = useSafeAreaInsets();

  const roll = useCallback(async () => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(false);
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    try {
      const [p] = await Promise.all([getRandomPokemon(), delay(250)]);
      setPokemon(p);
    } catch {
      setError(true);
    }
    rot.setValue(0);
    Animated.parallel([
      Animated.spring(anim, { toValue: 1, friction: 6, useNativeDriver: true }),
      Animated.timing(rot, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
    busyRef.current = false;
    setBusy(false);
  }, [anim, rot]);

  const stageStyle = {
    opacity: anim,
    transform: [
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
      { rotate: rot.interpolate({ inputRange: [0, 1], outputRange: ['-15deg', '0deg'] }) },
    ],
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.dice}>🎲</Text>
      <Text style={styles.title}>¿QUÉ POKÉMON{'\n'}TE TOCARÁ?</Text>

      <Animated.View style={[styles.stage, stageStyle]}>
        {pokemon ? (
          <LinearGradient colors={getCardGradient(pokemon.types)} style={styles.card}>
            <Text style={styles.id}>{formatId(pokemon.id)}</Text>
            <PokemonImage uri={pokemon.image} size={200} />
            <Text style={styles.name}>{formatName(pokemon.name).toUpperCase()}</Text>
            <View style={styles.types}>{pokemon.types.map((t) => <PokemonTypeBadge key={t} type={t} />)}</View>
            <View style={styles.row}>
              <FavoriteButton pokemon={pokemon} size={30} />
              <PrimaryButton
                label="Ver detalle"
                color={colors.blue}
                onPress={() => navigation.navigate('PokemonDetail', { id: pokemon.id, name: pokemon.name })}
              />
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.card, styles.placeholder]}>
            <Text style={styles.question}>❓</Text>
          </View>
        )}
      </Animated.View>

      {error && (
        <Text style={styles.err}>😢 No pudimos obtener un Pokémon. Revisa tu conexión e intenta nuevamente.</Text>
      )}

      <PrimaryButton
        label={error ? 'REINTENTAR' : '🎲 SORPRENDERME'}
        onPress={roll}
        disabled={busy}
        style={styles.cta}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, alignItems: 'center', padding: spacing.lg },
  dice: { fontSize: 44 },
  title: { ...typography.title, textAlign: 'center', marginVertical: spacing.md },
  stage: { alignSelf: 'stretch', marginVertical: spacing.md },
  card: { borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', backgroundColor: colors.white, ...shadow.card },
  placeholder: { height: 300, justifyContent: 'center' },
  question: { fontSize: 90 },
  id: { alignSelf: 'flex-start', fontWeight: '900', color: colors.muted },
  name: { fontSize: 26, fontWeight: '900', color: colors.dark, letterSpacing: 1, marginTop: spacing.sm },
  types: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, marginTop: spacing.lg },
  err: { color: colors.danger, textAlign: 'center', marginBottom: spacing.md, fontWeight: '600' },
  cta: { alignSelf: 'stretch', marginTop: spacing.sm },
});
