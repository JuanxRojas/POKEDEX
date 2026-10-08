import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EvolutionChain from '../components/EvolutionChain';
import { ErrorView, LoadingView } from '../components/StateViews';
import { useEvolutionChain } from '../hooks/usePokemon';
import { colors, spacing, typography } from '../theme';

export default function EvolutionDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const evo = useEvolutionChain(id);
  const insets = useSafeAreaInsets();

  if (evo.loading) return <LoadingView text="Cargando evoluciones..." />;
  if (evo.error) return <ErrorView onRetry={evo.retry} message="No pudimos cargar las evoluciones." />;

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xl }}>
      <Text style={styles.title}>Cadena evolutiva</Text>
      <Text style={styles.sub}>Toca un Pokémon para ver su detalle.</Text>
      <EvolutionChain
        stages={evo.data}
        currentId={id}
        onPressPokemon={(n) => navigation.push('PokemonDetail', { id: n.id, name: n.name })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  title: { ...typography.title, textAlign: 'center' },
  sub: { ...typography.caption, textAlign: 'center', marginBottom: spacing.lg },
});
