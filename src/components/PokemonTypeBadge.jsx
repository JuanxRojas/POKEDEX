import { StyleSheet, Text, View } from 'react-native';
import { getTypeColor, getTypeEmoji } from '../utils/pokemonColors';

export default function PokemonTypeBadge({ type, small }) {
  return (
    <View style={[styles.badge, small && styles.small, { backgroundColor: getTypeColor(type) }]}>
      <Text style={[styles.txt, small && { fontSize: 10 }]}>
        {getTypeEmoji(type)} {type.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  small: { paddingHorizontal: 8, paddingVertical: 3 },
  txt: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textShadowColor: 'rgba(0,0,0,0.25)', textShadowRadius: 2, textShadowOffset: { width: 0, height: 1 } },
});
