import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

// Botón hamburguesa: abre el Drawer desde cualquier Stack/Tab anidado
export default function MenuButton() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())} hitSlop={12} style={{ paddingRight: 12 }}>
      <Ionicons name="menu" size={28} color="#fff" />
    </Pressable>
  );
}
