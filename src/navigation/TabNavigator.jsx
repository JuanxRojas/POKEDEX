import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FavoritesStack, PokedexStack, RandomStack } from './PokemonStack';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

function TabIcon({ name, focused, color }) {
  const s = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.spring(s, { toValue: focused ? 1.2 : 1, friction: 5, useNativeDriver: true }).start();
  }, [focused, s]);
  return (
    <Animated.View style={{ transform: [{ scale: s }] }}>
      <Ionicons name={focused ? name : `${name}-outline`} size={24} color={color} />
    </Animated.View>
  );
}

const icon = (name) => ({ focused, color }) => <TabIcon name={name} focused={focused} color={color} />;

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
        },
      }}
    >
      <Tab.Screen name="TabPokedex" component={PokedexStack} options={{ title: 'Pokédex', tabBarActiveTintColor: colors.primary, tabBarIcon: icon('albums') }} />
      <Tab.Screen name="TabFavorites" component={FavoritesStack} options={{ title: 'Favoritos', tabBarActiveTintColor: '#E8A400', tabBarIcon: icon('star') }} />
      <Tab.Screen name="TabRandom" component={RandomStack} options={{ title: 'Aleatorio', tabBarActiveTintColor: colors.blue, tabBarIcon: icon('shuffle') }} />
    </Tab.Navigator>
  );
}
