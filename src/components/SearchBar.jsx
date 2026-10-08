import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadow, spacing } from '../theme';

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.box}>
      <Ionicons name="search" size={20} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar Pokémon por nombre o número..."
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        style={styles.input}
      />
      {!!value && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={20} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginHorizontal: spacing.lg, paddingHorizontal: spacing.md, height: 50, borderRadius: radius.pill, backgroundColor: colors.white, ...shadow.card },
  input: { flex: 1, fontSize: 15, color: colors.dark },
});
