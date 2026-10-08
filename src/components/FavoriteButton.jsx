import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useFavorites from '../hooks/useFavorites';
import { colors, radius } from '../theme';
import { toSummary } from '../utils/pokemonHelpers';

export default function FavoriteButton({ pokemon, size = 26, withLabel = false }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(pokemon.id);
  const scale = useRef(new Animated.Value(1)).current;

  const onPress = () => {
    toggleFavorite(toSummary(pokemon));
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.2, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const icon = <Ionicons name={active ? 'star' : 'star-outline'} size={size} color={active ? colors.secondary : colors.muted} />;

  if (!withLabel) {
    return (
      <Pressable onPress={onPress} hitSlop={12}>
        <Animated.View style={{ transform: [{ scale }] }}>{icon}</Animated.View>
      </Pressable>
    );
  }
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable onPress={onPress} style={[styles.btn, active && styles.active]}>
        {icon}
        <Text style={styles.txt}>{active ? 'En favoritos' : 'Agregar a favoritos'}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 20, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.border },
  active: { borderColor: colors.secondary, backgroundColor: '#FFF8DB' },
  txt: { fontWeight: '800', color: colors.dark },
});
