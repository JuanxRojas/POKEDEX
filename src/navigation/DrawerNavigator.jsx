import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../components/CustomDrawerContent';
import TabNavigator from './TabNavigator';
import { FavoritesStack, RandomStack, TeamStack } from './PokemonStack';
import AboutScreen from '../screens/AboutScreen';
import { colors } from '../theme';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="DrawerHome"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, // el header lo dibuja cada Stack
        drawerType: 'slide',
        drawerStyle: { width: 300 },
        overlayColor: 'rgba(0,0,0,0.35)',
      }}
    >
      <Drawer.Screen name="DrawerHome" component={TabNavigator} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="DrawerTeam" component={TeamStack} options={{ title: 'Mi equipo' }} />
      <Drawer.Screen name="DrawerFavorites" component={FavoritesStack} options={{ title: 'Favoritos' }} />
      <Drawer.Screen name="DrawerRandom" component={RandomStack} options={{ title: 'Pokémon aleatorio' }} />
      <Drawer.Screen
        name="DrawerAbout"
        component={AboutScreen}
        options={{
          title: 'Acerca de',
          headerShown: true,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
        }}
      />
    </Drawer.Navigator>
  );
}
