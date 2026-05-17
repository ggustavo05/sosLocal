import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import smsService, { Evento } from '../../src/services/smsService';
import authService from '../../src/services/authService';
import AppDialog, { AppDialogTone } from '../common/AppDialog';
import {
  formatGpsSuffixForSms,
  getCurrentDeviceCoordinates,
} from '../../src/services/currentLocationService';
import { fetchReverseGeocodeLine } from '../../src/services/reverseGeocodeService';
import { useTheme } from '../../src/theme';

const DEFAULT_EMERGENCY_MESSAGE =
  'EMERGÊNCIA! Preciso de ajuda urgente. Estou em situação de risco. Por favor, envie socorro imediatamente!';

const DEFAULT_EMERGENCY_NUMBER = {
  ddd: '11',
  phone: '999999999',
};

type SmsMutationPayload = {
  idEvento: number;
  nomeEvento: string;
  ddd: string;
  numeroTelefone: string;
  mensagem: string;
};

type AppDialogState = {
  tone: AppDialogTone;
  title: string;
  message: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
};

export default function RiskAreaSection() {
  const { colors } = useTheme();
  const [appDialog, setAppDialog] = useState<AppDialogState | null>(null);

  const showMessage = (tone: AppDialogTone, title: string, message: string) => {
    setAppDialog({
      tone,
      title,
      message,
      primaryLabel: 'OK',
      onPrimary: () => setAppDialog(null),
    });
  };

  const showConfirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setAppDialog({
        tone: 'neutral',
        title,
        message,
        primaryLabel: 'Enviar',
        secondaryLabel: 'Cancelar',
        onPrimary: () => {
          setAppDialog(null);
          resolve(true);
        },
        onSecondary: () => {
          setAppDialog(null);
          resolve(false);
        },
      });
    });
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEventoId, setSelectedEventoId] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_EMERGENCY_NUMBER.phone);
  const [ddd, setDdd] = useState(DEFAULT_EMERGENCY_NUMBER.ddd);
  const [message, setMessage] = useState(DEFAULT_EMERGENCY_MESSAGE);

  const queryClient = useQueryClient();

  const {
    data: eventosRes,
    isLoading: eventosLoading,
    refetch: refetchEventos,
  } = useQuery({
    queryKey: ['eventosAtivos'],
    queryFn: () => smsService.buscarEventosAtivos(),
  });

  const eventos: Evento[] =
    eventosRes?.success && Array.isArray(eventosRes.data)
      ? eventosRes.data.filter((e) => e.ativo !== false)
      : [];

  useEffect(() => {
    if (!modalVisible || eventos.length === 0) {
      return;
    }
    if (selectedEventoId == null || !eventos.some((e) => e.idEvento === selectedEventoId)) {
      setSelectedEventoId(eventos[0].idEvento);
    }
  }, [modalVisible, eventos, selectedEventoId]);

  const smsMutation = useMutation({
    mutationFn: async (data: SmsMutationPayload) => {
      const remetente = await authService.getRemetenteParaSms();
      const startTime = Date.now();
      const response = await smsService.enviarSmsEmergencia(data.idEvento, {
        remetente,
        ddd: data.ddd,
        numeroTelefone: data.numeroTelefone,
        mensagem: data.mensagem,
      });
      const duration = Date.now() - startTime;
      return { ...response, duration };
    },
    onSuccess: (data, variables) => {
      console.log('✅ SMS ENVIADO COM SUCESSO!');
      queryClient.invalidateQueries({ queryKey: ['riskAreas'] });
      queryClient.invalidateQueries({ queryKey: ['sms'] });

      showMessage(
        'success',
        'SMS enviado!',
        `Sua mensagem de emergência foi enviada com sucesso.\n\n📱 Destino: +55 ${variables.ddd} ${variables.numeroTelefone}\n⚠️ Evento: ${variables.nomeEvento}\n⏱️ Tempo: ${data.duration} ms\n\nAjuda está a caminho!`
      );
    },
    onError: (error: unknown) => {
      console.error('❌ EXCEÇÃO AO ENVIAR SMS', error);
      showMessage(
        'error',
        'Erro de conexão',
        'Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.'
      );
    },
  });

  const handleSendSMS = async () => {
    const { data: fresh } = await refetchEventos();
    const lista =
      fresh?.success && Array.isArray(fresh.data) ? fresh.data.filter((e) => e.ativo !== false) : [];

    if (!lista.length) {
      showMessage(
        'info',
        'Aviso',
        'Não há eventos de emergência ativos no momento. Entre em contato com o suporte ou tente mais tarde.'
      );
      return;
    }

    await authService.syncPerfilFromBackend();
    const telPadrao = await authService.getTelefoneEmergenciaPadrao();
    setDdd(telPadrao.ddd);
    setPhoneNumber(telPadrao.numero);
    setMessage(DEFAULT_EMERGENCY_MESSAGE);
    setSelectedEventoId(lista[0].idEvento);
    setModalVisible(true);
  };

  const handleConfirmSMS = async () => {
    if (selectedEventoId == null) {
      showMessage('info', 'Atenção', 'Selecione um evento de emergência');
      return;
    }

    const dddDigits = ddd.replace(/\D/g, '').slice(0, 2);
    if (dddDigits.length !== 2) {
      showMessage('error', 'DDD inválido', 'O DDD deve ter exatamente 2 dígitos.');
      return;
    }

    const phoneDigits = phoneNumber.replace(/\D/g, '').slice(0, 9);
    if (phoneDigits.length < 8 || phoneDigits.length > 9) {
      showMessage(
        'error',
        'Telefone inválido',
        'O número deve ter 8 ou 9 dígitos (apenas números).'
      );
      return;
    }

    if (!message.trim()) {
      showMessage('error', 'Mensagem', 'A mensagem não pode estar vazia.');
      return;
    }

    const ev = eventos.find((e) => e.idEvento === selectedEventoId);
    const nomeEvento = ev?.nomeEvento || `Evento #${selectedEventoId}`;

    // Fecha o formulário antes de GPS/envio (evita outro Modal tapando o AppDialog do GPS, se aparecer).
    setModalVisible(false);
    await new Promise<void>((resolve) => setTimeout(resolve, 120));

    const coords = await getCurrentDeviceCoordinates({ onlyWhenLoggedIn: true });
    let mensagemFinal = message.trim();
    if (coords) {
      const enderecoLinha = await fetchReverseGeocodeLine(coords.latitude, coords.longitude);
      const geo = formatGpsSuffixForSms(coords);
      mensagemFinal += enderecoLinha
        ? `\n\nEndereço (envio): ${enderecoLinha}${geo}`
        : geo;
    } else {
      const sendWithoutGps = await showConfirm(
        'GPS indisponível',
        'Não foi possível obter sua localização atual. Permita o acesso à localização no navegador ou nas configurações do app.\n\nDeseja enviar mesmo assim? (O SMS não incluirá coordenadas GPS.)'
      );
      if (!sendWithoutGps) {
        setModalVisible(true);
        return;
      }
    }

    const SMS_MAX = 1000;
    if (mensagemFinal.length > SMS_MAX) {
      mensagemFinal = mensagemFinal.slice(0, SMS_MAX - 1) + '…';
    }

    smsMutation.mutate({
      idEvento: selectedEventoId,
      nomeEvento,
      ddd: dddDigits,
      numeroTelefone: phoneDigits,
      mensagem: mensagemFinal,
    });
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.surface,
          paddingHorizontal: 20,
          paddingVertical: 20,
          marginHorizontal: 20,
          marginVertical: 10,
          borderRadius: 15,
          shadowColor: colors.shadow,
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
          color: colors.text,
          textAlign: 'center',
          marginBottom: 20,
          lineHeight: 22,
        },
        button: {
          backgroundColor: colors.emergency,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 30,
          paddingVertical: 15,
          borderRadius: 10,
          shadowColor: colors.emergency,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        },
        buttonText: {
          color: colors.onPrimary,
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
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
        },
        modalContent: {
          backgroundColor: colors.surface,
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
          color: colors.emergency,
        },
        emergencyInfo: {
          fontSize: 14,
          color: colors.textSecondary,
          marginBottom: 20,
          textAlign: 'center',
          lineHeight: 20,
        },
        label: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.text,
          marginTop: 15,
          marginBottom: 8,
        },
        input: {
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: 10,
          padding: 12,
          fontSize: 16,
          backgroundColor: colors.inputBackground,
          color: colors.text,
        },
        textArea: {
          height: 120,
          textAlignVertical: 'top',
        },
        eventosContainer: {
          marginBottom: 15,
        },
        eventoCard: {
          backgroundColor: colors.surfaceSecondary,
          borderWidth: 2,
          borderColor: colors.border,
          borderRadius: 12,
          padding: 15,
          marginBottom: 12,
        },
        eventoCardSelected: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          shadowColor: colors.primary,
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
          color: colors.text,
          flex: 1,
        },
        eventoTextSelected: {
          color: colors.onPrimary,
          fontWeight: 'bold',
        },
        eventoDescription: {
          fontSize: 13,
          color: colors.textSecondary,
          marginTop: 8,
          marginLeft: 36,
          lineHeight: 18,
        },
        eventoDescriptionSelected: {
          color: 'rgba(255,255,255,0.88)',
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
          color: colors.textMuted,
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
          backgroundColor: colors.surfaceSecondary,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          padding: 15,
          alignItems: 'center',
        },
        cancelButtonText: {
          color: colors.text,
          fontSize: 16,
          fontWeight: '600',
        },
        sendButton: {
          flex: 1,
          backgroundColor: colors.emergency,
          borderRadius: 10,
          padding: 15,
          alignItems: 'center',
        },
        sendButtonText: {
          color: colors.onPrimary,
          fontSize: 16,
          fontWeight: '600',
        },
      }),
    [colors]
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>Está em uma área de risco? Estamos aqui para ajudar.</Text>
          <TouchableOpacity
            style={[styles.button, (smsMutation.isPending || eventosLoading) && styles.buttonDisabled]}
            onPress={handleSendSMS}
            disabled={smsMutation.isPending || eventosLoading}
          >
            {smsMutation.isPending || eventosLoading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <>
                <Text style={styles.buttonText}>Enviar SMS</Text>
                <Ionicons name="chatbubble" size={20} color={colors.onPrimary} style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleContainer}>
                  <Ionicons name="warning" size={32} color={colors.emergency} />
                  <Text style={styles.modalTitle}>Emergência</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={styles.emergencyInfo}>
                Escolha o evento ativo no sistema e preencha os dados para enviar um SMS de emergência.
              </Text>

              <Text style={styles.label}>
                <Ionicons name="alert-circle" size={16} color={colors.emergency} /> Evento ativo *
              </Text>
              {eventosLoading ? (
                <ActivityIndicator style={{ marginVertical: 16 }} color={colors.primary} />
              ) : eventos.length === 0 ? (
                <Text style={styles.helperText}>Nenhum evento ativo disponível.</Text>
              ) : (
                <View style={styles.eventosContainer}>
                  {eventos.map((ev) => (
                    <TouchableOpacity
                      key={ev.idEvento}
                      style={[
                        styles.eventoCard,
                        selectedEventoId === ev.idEvento && styles.eventoCardSelected,
                      ]}
                      onPress={() => setSelectedEventoId(ev.idEvento)}
                    >
                      <View style={styles.eventoCardContent}>
                        <Ionicons
                          name={selectedEventoId === ev.idEvento ? 'radio-button-on' : 'radio-button-off'}
                          size={24}
                          color={selectedEventoId === ev.idEvento ? colors.onPrimary : colors.primary}
                        />
                        <Text
                          style={[
                            styles.eventoText,
                            selectedEventoId === ev.idEvento && styles.eventoTextSelected,
                          ]}
                        >
                          {ev.nomeEvento}
                        </Text>
                      </View>
                      {ev.descricaoEvento ? (
                        <Text
                          style={[
                            styles.eventoDescription,
                            selectedEventoId === ev.idEvento && styles.eventoDescriptionSelected,
                          ]}
                        >
                          {ev.descricaoEvento}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={styles.label}>
                <Ionicons name="call" size={16} color={colors.primary} /> Número de Contato de Emergência *
              </Text>
              <View style={styles.phoneContainer}>
                <TextInput
                  style={[styles.input, styles.dddInput]}
                  placeholder="DDD"
                  placeholderTextColor={colors.textMuted}
                  value={ddd}
                  onChangeText={setDdd}
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="Número (ex: 999999999)"
                  placeholderTextColor={colors.textMuted}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  maxLength={9}
                />
              </View>
              <Text style={styles.helperText}>Número para onde será enviado o SMS de emergência</Text>

              <Text style={styles.label}>
                <Ionicons name="chatbubble-ellipses" size={16} color={colors.primary} /> Mensagem de Emergência *
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Digite ou edite a mensagem de emergência"
                placeholderTextColor={colors.textMuted}
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                maxLength={1000}
              />
              <Text style={styles.helperText}>{message.length}/1000 caracteres</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sendButton, smsMutation.isPending && styles.buttonDisabled]}
                  onPress={handleConfirmSMS}
                  disabled={smsMutation.isPending || !eventos.length}
                >
                  {smsMutation.isPending ? (
                    <ActivityIndicator color={colors.onPrimary} />
                  ) : (
                    <Text style={styles.sendButtonText}>Enviar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <AppDialog
        visible={appDialog != null}
        tone={appDialog?.tone ?? 'info'}
        title={appDialog?.title ?? ''}
        message={appDialog?.message ?? ''}
        primaryLabel={appDialog?.primaryLabel ?? 'OK'}
        onPrimary={appDialog?.onPrimary ?? (() => {})}
        secondaryLabel={appDialog?.secondaryLabel}
        onSecondary={appDialog?.onSecondary}
      />
    </>
  );
}
