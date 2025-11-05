import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RiskAreaSection() {
  const handleSendSMS = () => {
    // Implementar lógica para enviar SMS
    console.log('Enviar SMS clicado');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>
          Está em uma área de risco? Estamos aqui para ajudar.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleSendSMS}>
          <Text style={styles.buttonText}>Enviar SMS</Text>
          <Ionicons name="chatbubble" size={20} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
