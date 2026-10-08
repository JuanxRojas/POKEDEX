import { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function PokemonImage({ uri, size = 120, style }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
        <Text style={{ fontSize: size / 2 }}>❓</Text>
      </View>
    );
  }
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Image
        source={{ uri }}
        style={{ width: size, height: size }}
        resizeMode="contain"
        onLoadEnd={() => setLoading(false)}
        onError={() => setError(true)}
      />
      {loading && <ActivityIndicator style={StyleSheet.absoluteFill} color={colors.primary} />}
    </View>
  );
}
