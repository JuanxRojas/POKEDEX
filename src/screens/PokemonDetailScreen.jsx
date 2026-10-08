import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PokemonImage from '../components/PokemonImage';
import PokemonTypeBadge from '../components/PokemonTypeBadge';
import PokemonStats from '../components/PokemonStats';
import EvolutionChain from '../components/EvolutionChain';
import FavoriteButton from '../components/FavoriteButton';
import TeamButton from '../components/TeamButton';
import PrimaryButton from '../components/PrimaryButton';
import { ErrorView, LoadingView } from '../components/StateViews';
import { useEvolutionChain, usePokemon } from '../hooks/usePokemon';
import { colors, radius, shadow, spacing } from '../theme';
import { formatId, formatName } from '../utils/pokemonHelpers';
import { getHeroGradient, getTypeColor, getTypeEmoji } from '../utils/pokemonColors';

const Section = ({ title, children }) => (
  <View style={styles.card}>
    <Text style={styles.h}>{title}</Text>
    {children}
  </View>
);

export default function PokemonDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { data: p, loading, error, retry } = usePokemon(id);
  const evo = useEvolutionChain(id);
  const insets = useSafeAreaInsets();
  const [allMoves, setAllMoves] = useState(false);
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (p) Animated.spring(pop, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, [p, pop]);

  if (loading && !p) return <LoadingView text="Cargando Pokémon..." />;
  if (error || !p) return <ErrorView onRetry={retry} message="No pudimos cargar este Pokémon." />;

  const goTo = (n) => navigation.push('PokemonDetail', { id: n.id, name: n.name });
  const moves = allMoves ? p.moves : p.moves.slice(0, 12);
  const stages = evo.data || [];

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xxl }}>
      <LinearGradient colors={getHeroGradient(p.types)} style={styles.hero}>
        <Text style={styles.id}>{formatId(p.id)}</Text>
        <Text style={styles.name}>{formatName(p.name).toUpperCase()}</Text>
        <Animated.View style={{ opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] }}>
          <PokemonImage uri={p.image} size={220} />
        </Animated.View>
        <View style={styles.types}>{p.types.map((t) => <PokemonTypeBadge key={t} type={t} />)}</View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={[styles.card, styles.measures]}>
          <View style={styles.measure}><Text style={styles.mVal}>{p.height} m</Text><Text style={styles.mLbl}>Altura</Text></View>
          <View style={styles.divider} />
          <View style={styles.measure}><Text style={styles.mVal}>{p.weight} kg</Text><Text style={styles.mLbl}>Peso</Text></View>
        </View>

        <Section title="ESTADÍSTICAS">
          <PokemonStats stats={p.stats} color={getTypeColor(p.types[0])} />
        </Section>

        <Section title="HABILIDADES">
          <View style={styles.chips}>
            {p.abilities.map((a) => (
              <View key={a} style={styles.chip}><Text style={styles.chipTxt}>{getTypeEmoji(p.types[0])} {formatName(a)}</Text></View>
            ))}
          </View>
        </Section>

        <Section title="MOVIMIENTOS">
          <View style={styles.chips}>
            {moves.map((m) => (
              <View key={m} style={styles.chip}><Text style={styles.chipTxt}>{formatName(m)}</Text></View>
            ))}
          </View>
          {p.moves.length > 12 && (
            <Pressable onPress={() => setAllMoves((v) => !v)} style={styles.more}>
              <Text style={styles.moreTxt}>{allMoves ? 'Ver menos' : `Ver todos (${p.moves.length})`}</Text>
            </Pressable>
          )}
        </Section>

        <View style={styles.actions}>
          <FavoriteButton pokemon={p} withLabel />
          <TeamButton pokemon={p} />
        </View>

        <Section title="EVOLUCIONES">
          {evo.loading ? (
            <ActivityIndicator color={colors.primary} />
          ) : evo.error ? (
            <Text style={styles.err}>No se pudieron cargar las evoluciones.</Text>
          ) : (
            <>
              <EvolutionChain compact stages={stages} currentId={p.id} onPressPokemon={goTo} />
              {stages.length > 1 && (
                <PrimaryButton
                  label="Ver cadena completa"
                  color={colors.blue}
                  style={{ marginTop: spacing.md }}
                  onPress={() => navigation.navigate('EvolutionDetail', { id: p.id, name: p.name })}
                />
              )}
            </>
          )}
        </Section>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: { alignItems: 'center', paddingVertical: spacing.xl, paddingBottom: spacing.xxl + spacing.lg, borderBottomLeftRadius: radius.lg, borderBottomRightRadius: radius.lg },
  id: { color: 'rgba(255,255,255,0.85)', fontWeight: '900', fontSize: 16 },
  name: { color: '#fff', fontWeight: '900', fontSize: 28, letterSpacing: 1, marginBottom: spacing.sm },
  types: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  body: { paddingHorizontal: spacing.lg, marginTop: -spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, ...shadow.card },
  h: { fontWeight: '900', color: colors.muted, letterSpacing: 1, marginBottom: spacing.sm, fontSize: 12 },
  measures: { flexDirection: 'row', alignItems: 'center' },
  measure: { flex: 1, alignItems: 'center' },
  divider: { width: 1, height: 36, backgroundColor: colors.border },
  mVal: { fontSize: 20, fontWeight: '900', color: colors.dark },
  mLbl: { color: colors.muted, fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { backgroundColor: colors.bg, paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.pill },
  chipTxt: { fontWeight: '700', color: colors.dark, fontSize: 13 },
  more: { alignSelf: 'center', paddingVertical: spacing.md },
  moreTxt: { color: colors.blue, fontWeight: '800' },
  actions: { gap: spacing.sm },
  err: { color: colors.muted, textAlign: 'center' },
});
