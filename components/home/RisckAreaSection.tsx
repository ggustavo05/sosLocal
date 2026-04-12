import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import smsService from '../../src/services/smsService';

// Mensagem padrão de emergência
const DEFAULT_EMERGENCY_MESSAGE = 'EMERGÊNCIA! Preciso de ajuda urgente. Estou em situação de risco. Por favor, envie socorro imediatamente!';

// Número de emergência padrão (pode ser configurado)
const DEFAULT_EMERGENCY_NUMBER = {
  ddd: '11',
  phone: '999999999'
};

// Tipos de emergência pré-definidos (sem usar API de eventos)
const EMERGENCY_TYPES = [
  { id: 1, name: 'Enchente', description: 'Alagamento ou inundação' },
  { id: 2, name: 'Deslizamento', description: 'Deslizamento de terra' },
  { id: 3, name: 'Tempestade', description: 'Tempestade severa' },
  { id: 4, name: 'Incêndio', description: 'Incêndio ou fogo' },
  { id: 5, name: 'Outro', description: 'Outra emergência' },
];

export default function RiskAreaSection() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<number>(1); // Pré-seleciona o primeiro tipo
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_EMERGENCY_NUMBER.phone);
  const [ddd, setDdd] = useState(DEFAULT_EMERGENCY_NUMBER.ddd);
  const [message, setMessage] = useState(DEFAULT_EMERGENCY_MESSAGE);

  const handleSendSMS = () => {
    // Reseta campos com valores padrão e abre o modal
    setPhoneNumber(DEFAULT_EMERGENCY_NUMBER.phone);
    setDdd(DEFAULT_EMERGENCY_NUMBER.ddd);
    setMessage(DEFAULT_EMERGENCY_MESSAGE);
    setSelectedType(1); // Pré-seleciona o primeiro tipo
    setModalVisible(true);
  };

  const handleConfirmSMS = async () => {
    // Validações
    if (!selectedType) {
      Alert.alert('Erro', 'Por favor, selecione um tipo de emergência');
      return;
    }

    if (!ddd.trim() || ddd.length !== 2) {
      Alert.alert('Erro', 'DDD deve ter exatamente 2 dígitos');
      return;
    }

    if (!phoneNumber.trim() || phoneNumber.length < 8 || phoneNumber.length > 9) {
      Alert.alert('Erro', 'Número de telefone deve ter 8 ou 9 dígitos');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Erro', 'A mensagem não pode estar vazia');
      return;
    }

    // Log antes de enviar
    const selectedTypeName = EMERGENCY_TYPES.find(t => t.id === selectedType)?.name || 'Desconhecido';
    console.log('=== INICIANDO ENVIO DE SMS DE EMERGÊNCIA ===');
    console.log('Tipo de Emergência:', selectedTypeName);
    console.log('Número de Destino:', `+55 ${ddd} ${phoneNumber}`);
    console.log('Mensagem:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('==========================================');

    // Confirmação antes de enviar
    Alert.alert(
      'Confirmar Envio',
      `Deseja enviar SMS de emergência para +55 ${ddd} ${phoneNumber}?\n\nTipo: ${selectedTypeName}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
          onPress: () => {
            console.log('❌ Envio de SMS cancelado pelo usuário');
          }
        },
        {
          text: 'Enviar',
          onPress: async () => {
            // Fecha o modal ANTES de iniciar o envio
            setModalVisible(false);
            
            setLoading(true);
            console.log('📤 Enviando SMS para o servidor...');

            try {
              const startTime = Date.now();
              const response = await smsService.enviarSms({
                remetente: 'SOS Localiza - Emergência',
                ddd: ddd.trim(),
                numeroTelefone: phoneNumber.trim(),
                mensagem: message.trim(),
                idEvento: selectedType,
              });
              const endTime = Date.now();
              const duration = endTime - startTime;

              if (response.success) {
                console.log('✅ SMS ENVIADO COM SUCESSO!');
                console.log('Tempo de resposta:', `${duration}ms`);
                console.log('Dados da resposta:', JSON.stringify(response.data, null, 2));
                console.log('==========================================');
                
                Alert.alert(
                  '✅ SMS Enviado!',
                  `Sua mensagem de emergência foi enviada com sucesso!\n\n📱 Destino: +55 ${ddd} ${phoneNumber}\n⚠️ Tipo: ${selectedTypeName}\n⏱️ Tempo: ${duration}ms\n\nAjuda está a caminho!`,
                  [{
                    text: 'OK',
                    onPress: () => {
                      console.log('Popup de confirmação fechado');
                    }
                  }]
                );
              } else {
                console.error('❌ ERRO AO ENVIAR SMS');
                console.error('Mensagem de erro:', response.message);
                console.error('Tempo de resposta:', `${duration}ms`);
                console.error('==========================================');
                
                Alert.alert(
                  '❌ Erro ao Enviar',
                  response.message || 'Não foi possível enviar o SMS. Tente novamente.'
                );
              }
            } catch (error) {
              console.error('❌ EXCEÇÃO AO ENVIAR SMS');
              console.error('Tipo de erro:', error instanceof Error ? error.name : 'Unknown');
              console.error('Mensagem:', error instanceof Error ? error.message : String(error));
              console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
              console.error('==========================================');
              
              Alert.alert(
                '❌ Erro de Conexão',
                'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
              );
            } finally {
              setLoading(false);
              console.log('🔄 Processo de envio finalizado');
            }
          }
        }
      ]
    );
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>
            Está em uma área de risco? Estamos aqui para ajudar.
          </Text>
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSendSMS}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Enviar SMS</Text>
                <Ionicons name="chatbubble" size={20} color="#fff" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal para envio de SMS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Ionicons name="warning" size={32} color="#8B0000" />
                  <Text style={styles.modalTitle}>Emergência</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#333" />
                </TouchableOpacity>
              </View>

              <Text style={styles.emergencyInfo}>
                Preencha os dados abaixo para enviar um SMS de emergência
              </Text>

              {/* Seleção de Tipo de Emergência */}
              <Text style={styles.label}>
                <Ionicons name="alert-circle" size={16} color="#8B0000" /> Tipo de Emergência *
              </Text>
              <View style={styles.eventosContainer}>
                {EMERGENCY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.eventoCard,
                      selectedType === type.id && styles.eventoCardSelected,
                    ]}
                    onPress={() => setSelectedType(type.id)}
                  >
                    <View style={styles.eventoCardContent}>
                      <Ionicons 
                        name={selectedType === type.id ? "radio-button-on" : "radio-button-off"} 
                        size={24} 
                        color={selectedType === type.id ? "#fff" : "#1B547D"} 
                      />
                      <Text style={[
                        styles.eventoText,
                        selectedType === type.id && styles.eventoTextSelected,
                      ]}>
                        {type.name}
                      </Text>
                    </View>
                    {type.description && (
                      <Text style={[
                        styles.eventoDescription,
                        selectedType === type.id && styles.eventoDescriptionSelected,
                      ]}>
                        {type.description}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Número de Contato */}
              <Text style={styles.label}>
                <Ionicons name="call" size={16} color="#1B547D" /> Número de Contato de Emergência *
              </Text>
              <View style={styles.phoneContainer}>
                <TextInput
                  style={[styles.input, styles.dddInput]}
                  placeholder="DDD"
                  placeholderTextColor="#999"
                  value={ddd}
                  onChangeText={setDdd}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="Número (ex: 999999999)"
                  placeholderTextColor="#999"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={9}
                />
              </View>
              <Text style={styles.helperText}>
                Número para onde será enviado o SMS de emergência
              </Text>

              {/* Mensagem de Emergência */}
              <Text style={styles.label}>
                <Ionicons name="chatbubble-ellipses" size={16} color="#1B547D" /> Mensagem de Emergência *
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite ou edite a mensagem de emergência"
                placeholderTextColor="#999"
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                maxLength={1000}
              />
              <Text style={styles.helperText}>
                {message.length}/1000 caracteres
              </Text>

              {/* Botões */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendButton, loading && styles.buttonDisabled]}
                  onPress={handleConfirmSMS}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.sendButtonText}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

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
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#8B0000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#8B0000',
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
  buttonDisabled: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8B0000',
  },
  emergencyInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  eventosContainer: {
    marginBottom: 15,
  },
  eventoCard: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  eventoCardSelected: {
    backgroundColor: '#1B547D',
    borderColor: '#1B547D',
    shadowColor: '#1B547D',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  eventoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  eventoTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventoDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    marginLeft: 36,
    lineHeight: 18,
  },
  eventoDescriptionSelected: {
    color: '#e0e0e0',
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dddInput: {
    flex: 0.3,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  phoneInput: {
    flex: 0.7,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#8B0000',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


