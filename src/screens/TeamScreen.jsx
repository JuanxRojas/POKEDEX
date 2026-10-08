import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PokemonImage from '../components/PokemonImage';
import { EmptyView } from '../components/StateViews';
import useTeam from '../hooks/useTeam';
import { colors, radius, shadow, spacing, typography } from '../theme';
import { formatId, formatName } from '../utils/pokemonHelpers';
import { getCardGradient, getTypeEmoji } from '../utils/pokemonColors';

function Slot({ pokemon, width, onPress, onRemove }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(a, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  }, [a]);

  return (
    <Animated.View style={[styles.shadow, { width, opacity: a, transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
      <Pressable onPress={onPress}>
        <LinearGradient colors={getCardGradient(pokemon.types)} style={styles.slot}>
          <Pressable onPress={onRemove} hitSlop={10} style={styles.remove}>
            <Ionicons name="close-circle" size={26} color={colors.danger} />
          </Pressable>
          <Text style={styles.id}>{formatId(pokemon.id)}</Text>
          <PokemonImage uri={pokemon.image} size={width * 0.55} />
          <Text style={styles.name} numberOfLines={1}>{formatName(pokemon.name)}</Text>
          <Text style={styles.emojis}>{pokemon.types.map(getTypeEmoji).join(' ')}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

export default function TeamScreen({ navigation }) {
  const { team, removeFromTeam, MAX_TEAM } = useTeam();
  const insets = useSafeAreaInsets();
  const w = (useWindowDimensions().width - spacing.lg * 2 - spacing.md) / 2;

  if (!team.length) {
    return (
      <EmptyView
        emoji="⚔️"
        title="Tu equipo está vacío."
        text="¡Agrega hasta 6 Pokémon!"
        actionLabel="EXPLORAR"
        onAction={() => navigation.navigate('DrawerHome', { screen: 'TabPokedex' })}
      />
    );
  }

  const slots = Array.from({ length: MAX_TEAM }, (_, i) => team[i] || null);
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl }}>
      <Text style={styles.title}>⚔️ MI EQUIPO</Text>
      <View style={styles.grid}>
        {slots.map((p, i) =>
          p ? (
            <Slot
              key={p.id}
              pokemon={p}
              width={w}
              onPress={() => navigation.navigate('PokemonDetail', { id: p.id, name: p.name })}
              onRemove={() => removeFromTeam(p.id)}
            />
          ) : (
            <View key={`empty-${i}`} style={[styles.empty, { width: w }]}>
              <Text style={styles.plus}>+</Text>
            </View>
          )
        )}
      </View>
      <Text style={styles.count}>{team.length} / {MAX_TEAM}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, textAlign: 'center', marginBottom: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: spacing.md },
  shadow: { borderRadius: radius.md, backgroundColor: colors.white, ...shadow.card },
  slot: { borderRadius: radius.md, padding: spacing.md, alignItems: 'center', overflow: 'hidden', minHeight: 190 },
  remove: { position: 'absolute', top: 6, right: 6, zIndex: 2 },
  id: { alignSelf: 'flex-start', fontWeight: '800', color: colors.muted },
  name: { fontWeight: '900', color: colors.dark, marginTop: spacing.xs },
  emojis: { fontSize: 18, marginTop: 2 },
  empty: { minHeight: 190, borderRadius: radius.md, borderWidth: 2, borderStyle: 'dashed', borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  plus: { fontSize: 40, color: colors.border, fontWeight: '300' },
  count: { ...typography.subtitle, textAlign: 'center', marginTop: spacing.xl },
});
