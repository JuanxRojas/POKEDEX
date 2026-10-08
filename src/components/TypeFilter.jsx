import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { FILTER_TYPES } from '../constants/pokemonTypes';
import { colors, spacing } from '../theme';
import { getTypeColor, getTypeEmoji } from '../utils/pokemonColors';
import { capitalize } from '../utils/pokemonHelpers';

export default function TypeFilter({ selected, onSelect }) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={FILTER_TYPES}
      keyExtractor={(t) => t}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const active = selected === item;
        const c = getTypeColor(item);
        return (
          <Pressable
            onPress={() => onSelect(active ? null : item)}
            style={[styles.chip, { borderColor: c, backgroundColor: active ? c : colors.white }]}
          >
            <Text style={[styles.txt, { color: active ? '#fff' : colors.dark }]}>
              {getTypeEmoji(item)} {capitalize(item)}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  chip: { minHeight: 40, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 999, borderWidth: 2 },
  txt: { fontWeight: '800', fontSize: 13 },
});
