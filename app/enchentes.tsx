import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import { useGuidanceDetailStyles } from '../src/hooks/useGuidanceDetailStyles';

const ACCENT = {
  cardTitleColor: '#1E90FF',
  warningBorderColor: '#FF6B6B',
  warningBoldColor: '#FF6B6B',
  warningIconColor: '#FF6B6B',
} as const;

export default function EnchentesTela() {
  const styles = useGuidanceDetailStyles(ACCENT);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header showBackButton onBack={() => router.back()} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="water" size={24} color={ACCENT.cardTitleColor} />
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
              <Ionicons name="warning" size={28} color={ACCENT.warningIconColor} />
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>IMPORTANTE:</Text> Nunca subestime o poder da água.
                Apenas 30 cm de água corrente podem derrubar uma pessoa adulta. Em caso de emergência,
                procure sempre ajuda profissional.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
