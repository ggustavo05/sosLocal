import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrientacoesTela() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Orientações de Segurança</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="water" size={24} color="#1E90FF" />
              <Text style={styles.sectionTitle}>Orientações para Enchentes</Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚠️ ANTES DA ENCHENTE</Text>
              <Text style={styles.cardText}>
                • Mantenha-se informado sobre previsões meteorológicas e alertas da Defesa Civil{'\n'}
                • Tenha sempre um kit de emergência preparado com água, alimentos não perecíveis, medicamentos, documentos importantes e lanternas{'\n'}
                • Identifique rotas de fuga e locais seguros em pontos elevados{'\n'}
                • Proteja objetos de valor e documentos em locais altos{'\n'}
                • Desligue a energia elétrica e o gás se houver risco iminente
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚨 DURANTE A ENCHENTE</Text>
              <Text style={styles.cardText}>
                • Evite áreas alagadas e não tente atravessar ruas ou pontes inundadas{'\n'}
                • Se estiver em veículo, abandone-o imediatamente e procure um local elevado{'\n'}
                • Não use equipamentos elétricos em contato com água{'\n'}
                • Mantenha-se afastado de postes, árvores e estruturas que possam cair{'\n'}
                • Se estiver em casa, suba para o andar superior ou telhado se necessário{'\n'}
                • Mantenha a calma e siga as orientações das autoridades
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏠 APÓS A ENCHENTE</Text>
              <Text style={styles.cardText}>
                • Aguarde a autorização das autoridades antes de retornar à sua residência{'\n'}
                • Verifique se há danos estruturais antes de entrar{'\n'}
                • Não use água da torneira até que seja declarada potável{'\n'}
                • Descarte alimentos que entraram em contato com a água da enchente{'\n'}
                • Limpe e desinfete áreas afetadas para evitar doenças{'\n'}
                • Verifique a instalação elétrica antes de religar a energia
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📞 NÚMEROS DE EMERGÊNCIA</Text>
              <Text style={styles.cardText}>
                • Defesa Civil: 199{'\n'}
                • Bombeiros: 193{'\n'}
                • SAMU: 192{'\n'}
                • Polícia Militar: 190
              </Text>
            </View>

            <View style={styles.warningCard}>
              <Ionicons name="warning" size={28} color="#FF6B6B" />
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>IMPORTANTE:</Text> Nunca subestime o poder da água. 
                Apenas 30 cm de água corrente podem derrubar uma pessoa adulta. 
                Em caso de emergência, procure sempre ajuda profissional.
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 34,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
  },
  warningCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginLeft: 12,
    flex: 1,
  },
  warningBold: {
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
});