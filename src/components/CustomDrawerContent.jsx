import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Importamos la librería de iconos que ya viene con Expo
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Pokeball from './Pokeball';
import { MAX_TEAM, usePokemonContext } from '../context/PokemonContext';
import { radius, spacing } from '../theme';

// Ahora usamos los nombres de los iconos de MaterialCommunityIcons
const ITEMS = [
  { name: 'DrawerHome', icon: 'home', label: 'Inicio' },
  { name: 'DrawerTeam', icon: 'sword-cross', label: 'Mi equipo' },
  { name: 'DrawerFavorites', icon: 'star', label: 'Favoritos' },
  { name: 'DrawerRandom', icon: 'dice-multiple', label: 'Pokémon aleatorio' },
  { name: 'DrawerAbout', icon: 'information', label: 'Acerca de' },
];

export default function CustomDrawerContent({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const { favorites, team } = usePokemonContext();
  const active = state.routes[state.index].name;

  return (
    <View style={styles.root}>
      {/* Cambiamos el rojo por un gradiente de grises oscuros */}
      <LinearGradient colors={['#2C2C2C', '#121212']} style={[styles.header, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.avatar}>
          {/* Si tu Pokeball es un SVG negro, podría perderse. Si puedes, ajusta su color a blanco o gris claro en su propio componente */}
          <Pokeball size={52} />
        </View>
        <Text style={styles.app}>Pokémon Trainer</Text>
        
        {/* Subtítulo usando iconos vectoriales pequeños */}
        <View style={styles.subContainer}>
          <MaterialCommunityIcons name="star" size={14} color="#AAAAAA" style={styles.subIcon} />
          <Text style={styles.subText}>{favorites.length} favoritos   </Text>
          <MaterialCommunityIcons name="sword-cross" size={14} color="#AAAAAA" style={styles.subIcon} />
          <Text style={styles.subText}>{team.length}/{MAX_TEAM} en equipo</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.lg }}>
        {ITEMS.map((it) => {
          const focused = active === it.name;
          return (
            <Pressable
              key={it.name}
              onPress={() => {
                navigation.navigate(it.name);
                navigation.closeDrawer();
              }}
              style={[styles.item, focused && styles.itemActive]}
            >
              {/* Renderizamos el icono vectorial dinámicamente */}
              <MaterialCommunityIcons 
                name={it.icon} 
                size={24} 
                color={focused ? '#FFFFFF' : '#888888'} 
                style={styles.icon} 
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{it.label}</Text>
            </Pressable>
          );
        })}
        <Text style={styles.footer}>Datos de PokéAPI</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Fondo general oscuro (casi negro)
  root: { flex: 1, backgroundColor: '#121212' },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  // Círculo del avatar gris oscuro
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#333333', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  app: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  
  subContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  subIcon: { marginRight: 4 },
  subText: { color: '#AAAAAA', fontWeight: '600' },
  
  item: { flexDirection: 'row', alignItems: 'center', minHeight: 54, paddingHorizontal: spacing.md, borderRadius: radius.md, marginVertical: 3 },
  // Fondo de la pestaña activa (Gris sutil para resaltar)
  itemActive: { backgroundColor: '#2A2A2A' },
  
  icon: { marginRight: 12 },
  
  // Texto inactivo (Gris) y Activo (Blanco)
  label: { fontSize: 16, fontWeight: '700', color: '#888888' },
  labelActive: { color: '#FFFFFF' },
  footer: { textAlign: 'center', color: '#555555', marginTop: spacing.xl, fontSize: 12 },
});