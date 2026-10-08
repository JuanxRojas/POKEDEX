import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { colors, spacing, typography } from '../theme';

export function LoadingView({ text = 'Cargando Pokémon...' }) {
  return (
    <View style={styles.box}>
      <Text style={styles.emoji}>⚡</Text>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

export function ErrorView({ onRetry, message = 'No pudimos cargar los Pokémon.' }) {
  return (
    <View style={styles.box}>
      <Text style={styles.emoji}>😢</Text>
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.text}>Revisa tu conexión e intenta nuevamente.</Text>
      {onRetry && <PrimaryButton label="REINTENTAR" onPress={onRetry} style={styles.btn} />}
    </View>
  );
}

export function EmptyView({ emoji, title, text, actionLabel, onAction }) {
  return (
    <View style={styles.box}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {!!text && <Text style={styles.text}>{text}</Text>}
      {actionLabel && <PrimaryButton label={actionLabel} onPress={onAction} style={styles.btn} />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  emoji: { fontSize: 56 },
  title: { ...typography.subtitle, textAlign: 'center' },
  text: { ...typography.body, color: colors.muted, textAlign: 'center' },
  btn: { marginTop: spacing.md },
});
