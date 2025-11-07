import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router'; // 1. Importe o router aqui

export default function GuidanceSection() {
  const handleGuidance = () => {
    // 2. Substitua o console.log pela função de navegação
    router.push('/orientacoes'); 
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

// ... (seus estilos permanecem os mesmos)
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  highlight: {
    color: '#D2691E',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#D2691E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 120,
    shadowColor: '#D2691E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});