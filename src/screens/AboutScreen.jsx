import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Pokeball from '../components/Pokeball';
import { colors, radius, shadow, spacing, typography } from '../theme';

const TECH = ['React Native', 'Expo', 'React Navigation', 'PokéAPI'];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ backgroundColor: colors.bg }}
      contentContainerStyle={{ alignItems: 'center', padding: spacing.xl, paddingBottom: insets.bottom + spacing.xl }}
    >
      <Pokeball size={96} />
      <Text style={styles.title}>Pokémon Trainer Papá!!</Text>
      <View style={styles.card}>
        <Text style={styles.p}>Aplicación móvil desarrollada por juanito el alimaña el propio, con react claramente</Text>
      </View>
      <View style={styles.chips}>
        {TECH.map((t) => (
          <View key={t} style={styles.chip}><Text style={styles.chipTxt}>{t}</Text></View>
        ))}
      </View>
      <Text style={styles.note}>Proyecto no oficial, aun le faltan cositas, 2 noches mas y lo hago juego. JAJAJAJ.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, marginVertical: spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, gap: spacing.md, alignSelf: 'stretch', ...shadow.card },
  p: { ...typography.body, textAlign: 'center', lineHeight: 21 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl },
  chip: { backgroundColor: colors.blue, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  chipTxt: { color: '#fff', fontWeight: '800' },
  note: { ...typography.caption, textAlign: 'center', marginTop: spacing.xl },
});
