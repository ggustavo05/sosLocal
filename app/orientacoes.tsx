import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/common/Header';

export default function OrientacoesTela() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header showBackButton={true} onBack={() => router.back()} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.headerSection}>
              <Ionicons name="shield-checkmark" size={32} color="#1B547D" />
              <Text style={styles.mainTitle}>Orientações de Segurança</Text>
              <Text style={styles.subtitle}>Escolha o tipo de evento para ver as orientações</Text>
            </View>

            {/* Card Enchentes */}
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('/enchentes')}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="water" size={32} color="#1E90FF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Enchentes</Text>
                <Text style={styles.cardDescription}>
                  Saiba como agir antes, durante e após enchentes
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>

            {/* Card Tempestades */}
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('/tempestades')}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="thunderstorm" size={32} color="#FFD700" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Tempestades, Raios e Granizo</Text>
                <Text style={styles.cardDescription}>
                  Proteção durante tempestades elétricas e granizo
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>

            {/* Card Inundações */}
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('/inundacoes')}
              activeOpacity={0.7}
            >
              <View style={styles.cardIcon}>
                <Ionicons name="water" size={32} color="#4169E1" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Inundações</Text>
                <Text style={styles.cardDescription}>
                  Orientações para situações de inundação
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </TouchableOpacity>

            {/* Botão Voltar */}
            <TouchableOpacity 
              style={styles.backButtonBottom}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#1B547D" />
              <Text style={styles.backButtonText}>Voltar para Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B547D',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  backButtonBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#1B547D',
  },
  backButtonText: {
    fontSize: 16,
    color: '#1B547D',
    fontWeight: '600',
    marginLeft: 8,
  },
});


