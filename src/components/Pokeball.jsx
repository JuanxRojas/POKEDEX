import { View } from 'react-native';
import { colors } from '../theme';

// Pokéball dibujada con Views (sin assets oficiales)
export default function Pokeball({ size = 56 }) {
  const b = size * 0.06;
  const c = size * 0.3;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: '#fff', overflow: 'hidden', borderWidth: b, borderColor: colors.dark }}>
      <View style={{ height: '50%', backgroundColor: colors.primary }} />
      <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: size * 0.08, marginTop: -size * 0.04, backgroundColor: colors.dark }} />
      <View style={{ position: 'absolute', top: '50%', left: '50%', width: c, height: c, borderRadius: c / 2, marginLeft: -c / 2, marginTop: -c / 2, backgroundColor: '#fff', borderWidth: b, borderColor: colors.dark }} />
    </View>
  );
}
