import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PokemonImage from './PokemonImage';
import PokemonTypeBadge from './PokemonTypeBadge';
import { colors, spacing } from '../theme';
import { formatName } from '../utils/pokemonHelpers';

// stages: [[{id,name,detail,image,types}], ...]
export default function EvolutionChain({ stages, currentId, onPressPokemon, compact }) {
  if (!stages || stages.length < 2) return <Text style={styles.none}>Este Pokémon no evoluciona.</Text>;
  const size = compact ? 64 : 110;

  return (
    <View>
      {stages.map((stage, i) => (
        <View key={i}>
          {i > 0 && (
            <View style={styles.arrow}>
              <Ionicons name="arrow-down" size={22} color={colors.muted} />
            </View>
          )}
          <View style={styles.row}>
            {stage.map((n) => (
              <Pressable
                key={n.id}
                onPress={() => n.id !== currentId && onPressPokemon(n)}
                style={[styles.node, n.id === currentId && styles.current]}
              >
                <PokemonImage uri={n.image} size={size} />
                <Text style={styles.name}>{formatName(n.name)}</Text>
                {!compact && !!n.detail && <Text style={styles.detail}>{n.detail}</Text>}
                {!compact && (
                  <View style={styles.types}>{n.types?.map((t) => <PokemonTypeBadge key={t} type={t} small />)}</View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  none: { color: colors.muted, textAlign: 'center', paddingVertical: spacing.md },
  arrow: { alignItems: 'center', paddingVertical: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.md },
  node: { alignItems: 'center', padding: spacing.sm, borderRadius: 16, borderWidth: 2, borderColor: 'transparent', minWidth: 90 },
  current: { borderColor: colors.primary, backgroundColor: '#FFF1EE' },
  name: { fontWeight: '800', color: colors.dark, marginTop: 4 },
  detail: { fontSize: 12, color: colors.blue, fontWeight: '700', marginVertical: 2 },
  types: { flexDirection: 'row', gap: 4, marginTop: 4 },
});
