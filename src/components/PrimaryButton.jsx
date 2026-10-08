import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, shadow } from '../theme';

export default function PrimaryButton({ label, onPress, color = colors.primary, disabled, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.btn, { backgroundColor: color, opacity: disabled ? 0.6 : pressed ? 0.85 : 1 }, style]}
    >
      <Text style={styles.txt}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { minHeight: 52, paddingHorizontal: 28, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  txt: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 0.5 },
});
