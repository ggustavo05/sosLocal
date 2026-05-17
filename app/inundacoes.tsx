import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/common/Header';
import { useGuidanceDetailStyles } from '../src/hooks/useGuidanceDetailStyles';

const ACCENT = {
  cardTitleColor: '#4169E1',
  warningBorderColor: '#4169E1',
  warningBoldColor: '#4169E1',
  warningIconColor: '#4169E1',
} as const;

export default function InundacoesTela() {
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
              <Text style={styles.sectionTitle}>Orientações para Inundações</Text>
            </View>
            
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⚠️ ANTES DA INUNDAÇÃO</Text>
              <Text style={styles.cardText}>
                • Conheça as áreas de risco de inundação em sua região{'\n'}
                • Mantenha-se informado sobre previsões de chuvas intensas{'\n'}
                • Prepare um kit de emergência com água, alimentos, medicamentos e documentos{'\n'}
                • Identifique rotas de evacuação e pontos de encontro seguros{'\n'}
                • Eleve móveis e objetos de valor para locais mais altos{'\n'}
                • Tenha lanternas, rádio a pilha e carregadores portáteis{'\n'}
                • Faça um plano de evacuação com sua família{'\n'}
                • Mantenha números de emergência sempre à mão
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚨 DURANTE A INUNDAÇÃO</Text>
              <Text style={styles.cardText}>
                • Siga imediatamente as ordens de evacuação das autoridades{'\n'}
                • Desligue a energia elétrica, gás e água antes de sair{'\n'}
                • Leve apenas o essencial: documentos, medicamentos, água e alimentos{'\n'}
                • Nunca tente atravessar áreas inundadas a pé ou de carro{'\n'}
                • Apenas 15 cm de água corrente podem derrubar uma pessoa{'\n'}
                • 60 cm de água podem arrastar um veículo{'\n'}
                • Procure terrenos mais altos imediatamente{'\n'}
                • Evite contato com a água da inundação (pode estar contaminada){'\n'}
                • Mantenha-se afastado de postes e fios elétricos
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏠 SE ESTIVER PRESO EM CASA</Text>
              <Text style={styles.cardText}>
                • Suba para o andar superior ou local mais alto da casa{'\n'}
                • Leve água potável, alimentos e kit de primeiros socorros{'\n'}
                • Sinalize sua presença com panos coloridos ou lanternas{'\n'}
                • Ligue para os serviços de emergência (193 ou 199){'\n'}
                • Não entre em águas de inundação dentro de casa{'\n'}
                • Aguarde o resgate em local seguro e visível{'\n'}
                • Mantenha a calma e conserve energia{'\n'}
                • Use apito ou faça barulho para chamar atenção dos socorristas
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🚗 SE ESTIVER EM VEÍCULO</Text>
              <Text style={styles.cardText}>
                • Nunca dirija através de água parada ou corrente{'\n'}
                • Se o veículo começar a flutuar, abandone-o imediatamente{'\n'}
                • Saia pela janela se as portas não abrirem{'\n'}
                • Procure terreno elevado a pé, com cuidado{'\n'}
                • Não tente resgatar o veículo durante a inundação{'\n'}
                • Evite pontes e viadutos durante inundações{'\n'}
                • Se preso no veículo, suba no teto e sinalize por ajuda{'\n'}
                • Mantenha-se visível para equipes de resgate
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏥 APÓS A INUNDAÇÃO</Text>
              <Text style={styles.cardText}>
                • Aguarde autorização oficial antes de retornar para casa{'\n'}
                • Verifique se a estrutura está segura antes de entrar{'\n'}
                • Use botas de borracha e luvas ao limpar{'\n'}
                • Não use água da torneira até que seja declarada potável{'\n'}
                • Descarte todos os alimentos que tiveram contato com água da inundação{'\n'}
                • Limpe e desinfete todas as superfícies afetadas{'\n'}
                • Documente danos com fotos para seguro{'\n'}
                • Verifique instalações elétricas antes de religar energia{'\n'}
                • Procure atendimento médico se tiver contato com água contaminada
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>💧 RISCOS DA ÁGUA CONTAMINADA</Text>
              <Text style={styles.cardText}>
                • Água de inundação pode conter esgoto, produtos químicos e bactérias{'\n'}
                • Evite contato direto com a pele{'\n'}
                • Não consuma água ou alimentos contaminados{'\n'}
                • Lave as mãos frequentemente com água limpa e sabão{'\n'}
                • Procure atendimento médico se apresentar sintomas como:{'\n'}
                  - Diarreia ou vômito{'\n'}
                  - Febre{'\n'}
                  - Feridas infectadas{'\n'}
                  - Problemas respiratórios{'\n'}
                • Vacine-se contra leptospirose se recomendado pelas autoridades
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🧹 LIMPEZA E DESINFECÇÃO</Text>
              <Text style={styles.cardText}>
                • Use equipamentos de proteção: luvas, botas, máscara{'\n'}
                • Remova toda a lama e detritos{'\n'}
                • Lave superfícies com água e sabão{'\n'}
                • Desinfete com solução de água sanitária (1 xícara para 5 litros de água){'\n'}
                • Descarte colchões, estofados e carpetes molhados{'\n'}
                • Seque completamente a casa para evitar mofo{'\n'}
                • Use ventiladores e desumidificadores{'\n'}
                • Verifique paredes e pisos para detectar danos estruturais
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📞 NÚMEROS DE EMERGÊNCIA</Text>
              <Text style={styles.cardText}>
                • Defesa Civil: 199{'\n'}
                • Bombeiros: 193{'\n'}
                • SAMU: 192{'\n'}
                • Polícia Militar: 190{'\n'}
                • Companhia de Água e Esgoto: 0800 (varia por região){'\n'}
                • Companhia Elétrica: 0800 (varia por região)
              </Text>
            </View>

            <View style={styles.warningCard}>
              <Ionicons name="warning" size={28} color={ACCENT.warningIconColor} />
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>ATENÇÃO:</Text> Inundações são a causa mais comum de mortes 
                relacionadas a desastres naturais. Nunca subestime o poder da água. 
                Apenas 15 cm de água corrente podem derrubar um adulto, e 60 cm podem arrastar um carro. 
                Quando houver ordem de evacuação, saia imediatamente!
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

