// Dentro de app/orientacoes.tsx
import { View, Text, StyleSheet, Button } from 'react-native';
import React from 'react';
import { router } from 'expo-router';

export default function OrientacoesTela() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página de Orientações</Text>
      <Text style={styles.text}>
        Aqui você colocará o conteúdo sobre as orientações.
      </Text>
      <Button title="Voltar" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});