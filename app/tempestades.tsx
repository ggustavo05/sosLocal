import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import { useGuidanceDetailStyles } from '../src/hooks/useGuidanceDetailStyles';

const ACCENT = {
  cardTitleColor: '#FFD700',
  warningBorderColor: '#FFD700',
  warningBoldColor: '#DAA520',
  warningIconColor: '#FFD700',
} as const;

export default function TempestadesTela() {
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
              <Ionicons name="thunderstorm" size={24} color={ACCENT.cardTitleColor} />
              <Text style={styles.sectionTitle}>Orientações para Tempestades</Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚠️ ANTES DA TEMPESTADE</Text>
              <Text style={styles.cardText}>
                • Acompanhe as previsões meteorológicas e alertas da Defesa Civil{'\n'}
                • Verifique se há objetos soltos no quintal que possam voar com o vento{'\n'}
                • Feche bem portas e janelas{'\n'}
                • Desligue aparelhos eletrônicos da tomada{'\n'}
                • Evite usar telefones com fio durante a tempestade{'\n'}
                • Tenha lanternas e pilhas à mão em caso de queda de energia{'\n'}
                • Mantenha um kit de emergência preparado
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚨 DURANTE A TEMPESTADE</Text>
              <Text style={styles.cardText}>
                • Procure abrigo imediatamente em local seguro{'\n'}
                • Evite áreas abertas, campos e topos de morros{'\n'}
                • Não fique embaixo de árvores isoladas{'\n'}
                • Afaste-se de objetos metálicos e cercas{'\n'}
                • Se estiver em veículo, pare em local seguro longe de árvores{'\n'}
                • Não use chuveiro ou torneiras durante tempestades com raios{'\n'}
                • Mantenha-se longe de janelas e portas{'\n'}
                • Se estiver ao ar livre e sentir os pelos se arrepiarem, agache-se imediatamente
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚡ PROTEÇÃO CONTRA RAIOS</Text>
              <Text style={styles.cardText}>
                • Raios procuram o caminho mais curto até o solo{'\n'}
                • Evite ser o ponto mais alto em áreas abertas{'\n'}
                • Se estiver em grupo ao ar livre, dispersem-se{'\n'}
                • Não segure objetos metálicos como guarda-chuvas ou tacos de golfe{'\n'}
                • Dentro de casa, evite usar aparelhos conectados à tomada{'\n'}
                • Não tome banho durante tempestades elétricas{'\n'}
                • Conte os segundos entre o raio e o trovão: cada 3 segundos = 1 km de distância{'\n'}
                • Se o intervalo for menor que 30 segundos, procure abrigo imediatamente
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🧊 PROTEÇÃO CONTRA GRANIZO</Text>
              <Text style={styles.cardText}>
                • Procure abrigo imediatamente sob estrutura sólida{'\n'}
                • Se estiver dirigindo, pare em local coberto se possível{'\n'}
                • Não pare embaixo de árvores ou estruturas frágeis{'\n'}
                • Proteja a cabeça e o corpo com objetos resistentes{'\n'}
                • Afaste-se de janelas de vidro{'\n'}
                • Após o granizo, verifique danos no telhado e estruturas{'\n'}
                • Documente danos com fotos para seguro
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏠 APÓS A TEMPESTADE</Text>
              <Text style={styles.cardText}>
                • Verifique se há danos estruturais antes de circular pela casa{'\n'}
                • Cuidado com fios elétricos caídos - nunca toque neles{'\n'}
                • Relate fios caídos à companhia elétrica imediatamente{'\n'}
                • Verifique se há vazamentos de gás{'\n'}
                • Inspecione o telhado e calhas para detectar danos{'\n'}
                • Limpe detritos com cuidado, usando luvas e botas{'\n'}
                • Documente todos os danos para fins de seguro{'\n'}
                • Não use aparelhos elétricos molhados
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚗 SE ESTIVER EM VEÍCULO</Text>
              <Text style={styles.cardText}>
                • Reduza a velocidade e acenda os faróis{'\n'}
                • Se a visibilidade estiver muito baixa, pare em local seguro{'\n'}
                • Mantenha distância segura de outros veículos{'\n'}
                • Evite passar por poças d'água profundas{'\n'}
                • Não estacione embaixo de árvores ou postes{'\n'}
                • Feche todas as janelas completamente{'\n'}
                • O interior do carro é relativamente seguro contra raios{'\n'}
                • Não toque em partes metálicas do veículo durante tempestade elétrica
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📞 NÚMEROS DE EMERGÊNCIA</Text>
              <Text style={styles.cardText}>
                • Defesa Civil: 199{'\n'}
                • Bombeiros: 193{'\n'}
                • SAMU: 192{'\n'}
                • Polícia Militar: 190{'\n'}
                • Companhia Elétrica (fios caídos): 0800 (varia por região)
              </Text>
            </View>

            <View style={styles.warningCard}>
              <Ionicons name="warning" size={28} color={ACCENT.warningIconColor} />
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>IMPORTANTE:</Text> Raios podem atingir até 16 km de distância 
                da tempestade. Se você pode ouvir trovões, está em área de risco. 
                A regra 30-30: procure abrigo quando o tempo entre raio e trovão for menor que 30 segundos, 
                e espere 30 minutos após o último trovão antes de sair.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

