import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GuidanceSection() {
  const handleGuidance = () => {
    // Implementar lógica para orientações
    console.log('Orientações clicado');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Saiba como agir diante dos principais eventos adversos com <Text style={styles.highlight}>orientações</Text> e <Text style={styles.highlight}>cuidados essenciais</Text>.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleGuidance}>
          <Text style={styles.buttonText}>Orientações</Text>
          <Ionicons name="heart" size={20} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}