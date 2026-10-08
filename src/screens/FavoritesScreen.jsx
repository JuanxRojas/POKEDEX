import { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PokemonCard from '../components/PokemonCard';
import { EmptyView } from '../components/StateViews';
import useFavorites from '../hooks/useFavorites';
import { colors, spacing } from '../theme';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();
  const insets = useSafeAreaInsets();
  const open = useCallback((p) => navigation.navigate('PokemonDetail', { id: p.id, name: p.name }), [navigation]);

  if (!favorites.length) {
    return (
      <EmptyView
        emoji="⭐"
        title="Todavía no tienes favoritos."
        text="Explora la Pokédex y agrega tus Pokémon favoritos."
        actionLabel="EXPLORAR"
        onAction={() => navigation.navigate('DrawerHome', { screen: 'TabPokedex' })}
      />
    );
  }
  return (
    <FlatList
      style={{ backgroundColor: colors.bg }}
      data={favorites}
      keyExtractor={(p) => String(p.id)}
      numColumns={2}
      columnWrapperStyle={styles.cols}
      contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: insets.bottom + spacing.xl }}
      renderItem={({ item, index }) => <PokemonCard pokemon={item} index={index} onPress={open} />}
    />
  );
}

const styles = StyleSheet.create({
  cols: { justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
});
