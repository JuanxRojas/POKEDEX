import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import { LazyPokemonCard } from '../components/PokemonCard';
import { EmptyView, ErrorView, LoadingView } from '../components/StateViews';
import { useAsync } from '../hooks/usePokemon';
import useDebounce from '../hooks/useDebounce';
import { getAllPokemon, getPokemonByType } from '../services/pokemonApi';
import { colors, spacing } from '../theme';

const PAGE_SIZE = 20;

export default function PokemonListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState(null);
  const [page, setPage] = useState(1);
  const q = useDebounce(query.trim().toLowerCase(), 300);

  const all = useAsync(getAllPokemon, []);
  const byType = useAsync(() => (type ? getPokemonByType(type) : Promise.resolve(null)), [type]);

  useEffect(() => {
    setPage(1);
  }, [q, type]);

  // Búsqueda local sobre el índice (sin una petición por tecla)
  const filtered = useMemo(() => {
    const source = byType.data || all.data || [];
    return q ? source.filter((p) => p.name.includes(q) || String(p.id) === q) : source;
  }, [all.data, byType.data, q]);

  // Paginación progresiva: solo se renderizan (y consultan) 20 por página
  const visible = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore = visible.length < filtered.length;

  const open = useCallback((p) => navigation.navigate('PokemonDetail', { id: p.id, name: p.name }), [navigation]);
  const renderItem = useCallback(
    ({ item, index }) => <LazyPokemonCard item={item} index={index} onPress={open} />,
    [open]
  );
  const loadMore = () => hasMore && setPage((p) => p + 1);
  const retry = () => { all.retry(); byType.retry(); };

  let body;
  if (all.loading || byType.loading) body = <LoadingView />;
  else if (all.error || byType.error) body = <ErrorView onRetry={retry} />;
  else if (!filtered.length) {
    body = <EmptyView emoji="🔍" title="Sin resultados" text="Prueba con otro nombre o cambia el filtro de tipo." />;
  } else {
    body = (
      <FlatList
        data={visible}
        keyExtractor={(p) => String(p.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.cols}
        contentContainerStyle={styles.list}
        onEndReached={loadMore}
        onEndReachedThreshold={0.6}
        initialNumToRender={8}
        windowSize={7}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={hasMore ? <ActivityIndicator style={{ margin: spacing.lg }} color={colors.primary} /> : null}
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.top}>
        <SearchBar value={query} onChangeText={setQuery} />
        <TypeFilter selected={type} onSelect={setType} />
      </View>
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  top: { paddingTop: spacing.md },
  cols: { justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  list: { paddingTop: spacing.xs, paddingBottom: spacing.xl },
});
