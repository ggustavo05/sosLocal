import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CepSection() {
  const handleAddArea = () => {
    // Implementar lógica para adicionar área
    console.log('Adicionar área clicado');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Cadastre o <Text style={styles.highlight}>CEP</Text> de sua residência para receber alertas sobre eventos adversos em São Paulo.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddArea}>
          <Text style={styles.buttonText}>Adicionar área</Text>
          <Ionicons name="add-circle" size={20} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
