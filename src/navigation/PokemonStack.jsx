import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuButton from '../components/MenuButton';
import PokemonListScreen from '../screens/PokemonListScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import EvolutionDetailScreen from '../screens/EvolutionDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import TeamScreen from '../screens/TeamScreen';
import RandomPokemonScreen from '../screens/RandomPokemonScreen';
import { colors } from '../theme';
import { formatName } from '../utils/pokemonHelpers';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '800' },
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
  animation: 'slide_from_right',
  contentStyle: { backgroundColor: colors.bg },
};

// Fábrica: cada sección tiene su propio Stack con una pantalla raíz distinta,
// pero todas comparten PokemonDetail y EvolutionDetail ("atrás" vuelve al origen).
export function createPokemonStack(rootName, RootScreen, rootTitle) {
  return function PokemonStack() {
    return (
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen
          name={rootName}
          component={RootScreen}
          options={{ title: rootTitle, headerLeft: () => <MenuButton /> }}
        />
        <Stack.Screen
          name="PokemonDetail"
          component={PokemonDetailScreen}
          options={({ route }) => ({ title: formatName(route.params?.name) || 'Detalle' })}
        />
        <Stack.Screen name="EvolutionDetail" component={EvolutionDetailScreen} options={{ title: 'Evoluciones' }} />
      </Stack.Navigator>
    );
  };
}

export const PokedexStack = createPokemonStack('PokemonList', PokemonListScreen, 'Pokédex');
export const FavoritesStack = createPokemonStack('Favorites', FavoritesScreen, 'Favoritos');
export const RandomStack = createPokemonStack('Random', RandomPokemonScreen, 'Aleatorio');
export const TeamStack = createPokemonStack('Team', TeamScreen, 'Mi equipo');
