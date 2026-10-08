import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { STAT_LABELS } from '../utils/pokemonHelpers';

const MAX_STAT = 255;

// Barras animadas: width 0 -> valor real (el ancho no admite native driver)
export default function PokemonStats({ stats, color }) {
  const anims = useRef(stats.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      90,
      anims.map((a) => Animated.timing(a, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }))
    ).start();
  }, [anims]);

  return (
    <View>
      {stats.map((s, i) => (
        <View key={s.name} style={styles.row}>
          <Text style={styles.label}>{STAT_LABELS[s.name] || s.name}</Text>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                {
                  backgroundColor: color,
                  width: anims[i].interpolate({ inputRange: [0, 1], outputRange: ['0%', `${Math.min(s.value / MAX_STAT, 1) * 100}%`] }),
                },
              ]}
            />
          </View>
          <Text style={styles.value}>{s.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  label: { width: 66, fontSize: 11, fontWeight: '800', color: colors.muted },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 5 },
  value: { width: 36, textAlign: 'right', fontWeight: '800', color: colors.dark },
});
