import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cadastrarUsuario } from '../src/services/registerService';
import {
  setLocationPreference,
  requestForegroundLocationIfNeeded,
} from '../src/services/userPreferencesService';
import { cpfDigitsOnly, formatCpfMask, isValidCpfDigits } from '../src/utils/cpf';
import { useTheme } from '../src/theme';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

interface RegisterData {
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  cep: string;
  senha: string;
  confirmarSenha: string;
}

type FormFieldKey = keyof RegisterData;

function formatPhoneDigits(text: string): string {
  return text.replace(/\D/g, '').slice(0, 11);
}

/** Exibição (XX) XXXXX-XXXX — armazenamento continua só com dígitos em `digits`. */
function formatPhoneDisplay(digits: string): string {
  if (!digits) return '';
  const d = digits.replace(/\D/g, '');
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
}

function formatCepDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

type Strength = 'empty' | 'weak' | 'medium' | 'strong';

function getPasswordStrength(password: string): { level: Strength; label: string; color: string } {
  if (!password) {
    return { level: 'empty', label: '', color: '#999' };
  }
  const hasLetter = /[a-zA-ZÀ-ÿ]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-ZÀ-ÿ0-9]/.test(password);
  const len = password.length;

  if (len < 6 || (!hasLetter && !hasNumber)) {
    return { level: 'weak', label: 'Senha fraca', color: '#c0392b' };
  }
  if (len >= 8 && hasLetter && hasNumber && hasSpecial) {
    return { level: 'strong', label: 'Senha forte', color: '#1e8449' };
  }
  if (len >= 6 && hasLetter && hasNumber) {
    return { level: 'medium', label: 'Senha média', color: '#d68910' };
  }
  return { level: 'weak', label: 'Senha fraca — use letras e números', color: '#c0392b' };
}

function validateAll(formData: RegisterData): {
  valid: boolean;
  errors: Partial<Record<FormFieldKey, string>>;
  firstKey?: FormFieldKey;
} {
  const errors: Partial<Record<FormFieldKey, string>> = {};

  if (!formData.nomeCompleto.trim()) {
    errors.nomeCompleto = 'Digite seu nome completo.';
  }

  const cpfD = cpfDigitsOnly(formData.cpf);
  if (!formData.cpf.trim()) {
    errors.cpf = 'Digite seu CPF.';
  } else if (cpfD.length !== 11) {
    errors.cpf = 'CPF deve ter 11 dígitos.';
  } else if (!isValidCpfDigits(cpfD)) {
    errors.cpf = 'CPF inválido.';
  }

  const telDigits = formatPhoneDigits(formData.telefone);
  if (telDigits.length === 0) {
    errors.telefone = 'Digite seu telefone (DDD + número).';
  } else if (telDigits.length < 10) {
    errors.telefone = 'Telefone incompleto (10 ou 11 dígitos com DDD).';
  }

  const cepDigits = formData.cep.replace(/\D/g, '');
  if (cepDigits.length === 0) {
    errors.cep = 'Digite seu CEP.';
  } else if (cepDigits.length < 8) {
    errors.cep = 'CEP deve ter 8 dígitos.';
  }

  if (!formData.senha.trim()) {
    errors.senha = 'Digite uma senha.';
  } else if (formData.senha.length < 6) {
    errors.senha = 'A senha deve ter pelo menos 6 caracteres.';
  }

  if (!formData.confirmarSenha.trim()) {
    errors.confirmarSenha = 'Confirme sua senha.';
  } else if (formData.senha !== formData.confirmarSenha) {
    errors.confirmarSenha = 'As senhas não coincidem.';
  }

  const order: FormFieldKey[] = [
    'nomeCompleto',
    'cpf',
    'telefone',
    'cep',
    'senha',
    'confirmarSenha',
  ];
  const firstKey = order.find((k) => errors[k]);

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    firstKey,
  };
}

export default function RegisterScreen({ onSwitchToLogin, onRegisterSuccess }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();

  const inputRefs = useRef<Partial<Record<keyof RegisterData, TextInput | null>>>({});

  const [formData, setFormData] = useState<RegisterData>({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    cep: '',
    senha: '',
    confirmarSenha: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FormFieldKey, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [permitirLocalizacao, setPermitirLocalizacao] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmSenha, setShowConfirmSenha] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const strength = useMemo(() => getPasswordStrength(formData.senha), [formData.senha]);
  const { colors } = useTheme();

  const clearError = useCallback((key: FormFieldKey) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    let v = value;
    if (field === 'cpf') v = formatCpfMask(value);
    else if (field === 'telefone') v = formatPhoneDigits(value);
    else if (field === 'cep') v = value.replace(/\D/g, '').slice(0, 8);

    setFormData((prev) => ({ ...prev, [field]: v }));
    clearError(field);
  };

  const focusField = (key: FormFieldKey) => {
    inputRefs.current[key]?.focus();
  };

  const runRegister = async () => {
    const { valid, errors: nextErrors, firstKey } = validateAll(formData);
    setErrors(nextErrors);
    if (!valid) {
      if (firstKey) focusField(firstKey);
      return;
    }

    setSubmitting(true);
    try {
      const telefoneDigits = formatPhoneDigits(formData.telefone);
      const cepDigits = formData.cep.replace(/\D/g, '').slice(0, 9);

      const result = await cadastrarUsuario({
        nomeCompleto: formData.nomeCompleto,
        cpf: formData.cpf,
        senha: formData.senha,
        telefone: telefoneDigits,
        cep: cepDigits,
      });

      if (result.ok) {
        await setLocationPreference(permitirLocalizacao);
        if (permitirLocalizacao) {
          const status = await requestForegroundLocationIfNeeded();
          if (status === 'denied') {
            Alert.alert(
              'Localização',
              'Permissão negada. Você pode ativar depois nas configurações do aparelho quando usar o mapa.'
            );
          }
        }

        Alert.alert('Sucesso', result.message || 'Cadastro realizado. Faça login com seu CPF e senha.');
        onRegisterSuccess();
      } else {
        Alert.alert('Cadastro', result.message);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erro de conexão', 'Não foi possível conectar ao servidor. Verifique a URL da API.', [
        { text: 'OK', style: 'cancel' },
        { text: 'Tentar novamente', onPress: () => void runRegister() },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmMismatch =
    confirmTouched &&
    formData.confirmarSenha.length > 0 &&
    formData.senha !== formData.confirmarSenha;

  const setRef = (key: keyof RegisterData) => (el: TextInput | null) => {
    inputRefs.current[key] = el;
  };

  const inputDisabled = submitting;

  const errorText = (key: FormFieldKey) => errors[key];

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        flex: {
          flex: 1,
        },
        scrollContent: {
          flexGrow: 1,
          padding: 20,
        },
        logoContainer: {
          alignItems: 'center',
          marginBottom: 20,
        },
        logo: {
          width: 280,
          height: 120,
        },
        formContainer: {
          backgroundColor: colors.surface,
          borderRadius: 15,
          padding: 24,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        title: {
          fontSize: 28,
          fontWeight: 'bold',
          color: colors.primary,
          textAlign: 'center',
          marginBottom: 5,
        },
        subtitle: {
          fontSize: 16,
          color: colors.textSecondary,
          textAlign: 'center',
          marginBottom: 16,
        },
        sectionTitle: {
          fontSize: 15,
          fontWeight: '700',
          color: colors.primary,
          marginTop: 8,
          marginBottom: 12,
        },
        fieldBlock: {
          marginBottom: 16,
        },
        label: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 6,
        },
        ruleHint: {
          fontSize: 12,
          color: colors.textSecondary,
          marginBottom: 8,
        },
        input: {
          borderWidth: 1,
          borderColor: colors.inputBorder,
          borderRadius: 10,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 16,
          backgroundColor: colors.inputBackground,
          color: colors.text,
        },
        inputFlex: {
          flex: 1,
        },
        inputError: {
          borderColor: colors.error,
          backgroundColor: colors.errorBackground,
        },
        passwordRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        eyeBtn: {
          padding: 10,
        },
        strengthLabel: {
          fontSize: 13,
          marginTop: 6,
          fontWeight: '600',
        },
        strengthBar: {
          height: 4,
          borderRadius: 2,
          marginTop: 6,
          overflow: 'hidden',
        },
        strengthFill: {
          height: '100%',
          borderRadius: 2,
        },
        errorInline: {
          color: colors.error,
          fontSize: 13,
          marginTop: 6,
        },
        locationRow: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          marginBottom: 8,
        },
        locationText: {
          flex: 1,
          fontSize: 14,
          color: colors.text,
          lineHeight: 20,
        },
        lgpdHint: {
          fontSize: 12,
          color: colors.textSecondary,
          marginBottom: 8,
          lineHeight: 17,
        },
        switchContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 8,
          flexWrap: 'wrap',
        },
        switchText: {
          fontSize: 16,
          color: colors.textSecondary,
        },
        switchLink: {
          fontSize: 16,
          color: colors.primary,
          fontWeight: 'bold',
        },
        footer: {
          paddingHorizontal: 20,
          paddingTop: 10,
          backgroundColor: colors.background,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.borderStrong,
        },
        registerButton: {
          backgroundColor: colors.primary,
          borderRadius: 10,
          paddingVertical: 16,
          alignItems: 'center',
        },
        registerButtonDisabled: {
          opacity: 0.7,
        },
        registerButtonText: {
          color: colors.onPrimary,
          fontSize: 18,
          fontWeight: 'bold',
        },
      }),
    [colors]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      <View style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 24 + insets.bottom + 72 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo SOS Localiza"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title} accessibilityRole="header">
              Cadastro
            </Text>
            <Text style={styles.subtitle}>Crie sua conta</Text>

            <Text style={styles.sectionTitle}>Dados pessoais</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label} accessibilityLabel="Nome completo">
                Nome completo *
              </Text>
              <TextInput
                ref={setRef('nomeCompleto')}
                style={[styles.input, errorText('nomeCompleto') ? styles.inputError : null]}
                placeholder="Digite seu nome completo"
                placeholderTextColor={colors.textMuted}
                value={formData.nomeCompleto}
                onChangeText={(v) => handleInputChange('nomeCompleto', v)}
                autoCapitalize="words"
                returnKeyType="next"
                editable={!inputDisabled}
                onSubmitEditing={() => inputRefs.current.cpf?.focus()}
                accessibilityLabel="Campo nome completo"
              />
              {errorText('nomeCompleto') ? (
                <Text style={styles.errorInline}>{errorText('nomeCompleto')}</Text>
              ) : null}
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label} accessibilityLabel="CPF">
                CPF *
              </Text>
              <TextInput
                ref={setRef('cpf')}
                style={[styles.input, errorText('cpf') ? styles.inputError : null]}
                placeholder="000.000.000-00"
                placeholderTextColor={colors.textMuted}
                value={formData.cpf}
                onChangeText={(v) => handleInputChange('cpf', v)}
                keyboardType="numeric"
                maxLength={14}
                returnKeyType="next"
                editable={!inputDisabled}
                onSubmitEditing={() => inputRefs.current.telefone?.focus()}
                accessibilityLabel="Campo CPF"
              />
              {errorText('cpf') ? <Text style={styles.errorInline}>{errorText('cpf')}</Text> : null}
            </View>

            <Text style={styles.sectionTitle}>Contato</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label} accessibilityLabel="Telefone">
                Telefone *
              </Text>
              <TextInput
                ref={setRef('telefone')}
                style={[styles.input, errorText('telefone') ? styles.inputError : null]}
                placeholder="(11) 99999-9999"
                placeholderTextColor={colors.textMuted}
                value={formatPhoneDisplay(formData.telefone)}
                onChangeText={(v) => handleInputChange('telefone', formatPhoneDigits(v))}
                keyboardType="phone-pad"
                returnKeyType="next"
                editable={!inputDisabled}
                onSubmitEditing={() => inputRefs.current.cep?.focus()}
                accessibilityLabel="Campo telefone"
              />
              {errorText('telefone') ? <Text style={styles.errorInline}>{errorText('telefone')}</Text> : null}
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label} accessibilityLabel="CEP">
                CEP *
              </Text>
              <TextInput
                ref={setRef('cep')}
                style={[styles.input, errorText('cep') ? styles.inputError : null]}
                placeholder="00000-000"
                placeholderTextColor={colors.textMuted}
                value={formatCepDisplay(formData.cep)}
                onChangeText={(v) => handleInputChange('cep', v)}
                keyboardType="numeric"
                maxLength={9}
                returnKeyType="next"
                editable={!inputDisabled}
                onSubmitEditing={() => inputRefs.current.senha?.focus()}
                accessibilityLabel="Campo CEP"
              />
              {errorText('cep') ? <Text style={styles.errorInline}>{errorText('cep')}</Text> : null}
            </View>

            <Text style={styles.sectionTitle}>Preferências</Text>

            <View style={styles.locationRow}>
              <Switch
                value={permitirLocalizacao}
                onValueChange={setPermitirLocalizacao}
                trackColor={{ false: colors.switchTrackOff, true: colors.switchTrackOn }}
                thumbColor={permitirLocalizacao ? colors.primary : colors.switchThumb}
                disabled={inputDisabled}
                accessibilityLabel="Permitir uso da localização para mapa e alertas"
              />
              <Text style={styles.locationText}>
                Permitir que o app acesse minha localização para mostrar mapa e alertas na minha região. Você
                pode mudar isso depois nas configurações do aparelho.
              </Text>
            </View>
            <Text style={styles.lgpdHint}>
              Usamos localização apenas quando fizer sentido para o app; não vendemos seus dados.
            </Text>

            <Text style={styles.sectionTitle}>Acesso</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label} accessibilityLabel="Senha">
                Senha *
              </Text>
              <Text style={styles.ruleHint}>
                Mínimo 6 caracteres. Combine letras, números e símbolos para mais segurança.
              </Text>
              <View style={styles.passwordRow}>
                <TextInput
                  ref={setRef('senha')}
                  style={[
                    styles.input,
                    styles.inputFlex,
                    errorText('senha') ? styles.inputError : null,
                  ]}
                  placeholder="Digite sua senha"
                  placeholderTextColor={colors.textMuted}
                  value={formData.senha}
                  onChangeText={(v) => handleInputChange('senha', v)}
                  secureTextEntry={!showSenha}
                  autoCapitalize="none"
                  returnKeyType="next"
                  editable={!inputDisabled}
                  onSubmitEditing={() => inputRefs.current.confirmarSenha?.focus()}
                  accessibilityLabel="Campo senha"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowSenha((s) => !s)}
                  accessibilityLabel={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.iconMuted} />
                </TouchableOpacity>
              </View>
              {strength.level !== 'empty' ? (
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              ) : null}
              <View style={[styles.strengthBar, { backgroundColor: colors.strengthTrack }]}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width:
                        strength.level === 'empty'
                          ? '0%'
                          : strength.level === 'weak'
                            ? '33%'
                            : strength.level === 'medium'
                              ? '66%'
                              : '100%',
                      backgroundColor: strength.color,
                    },
                  ]}
                />
              </View>
              {errorText('senha') ? <Text style={styles.errorInline}>{errorText('senha')}</Text> : null}
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label} accessibilityLabel="Confirmar senha">
                Confirmar senha *
              </Text>
              <View style={styles.passwordRow}>
                <TextInput
                  ref={setRef('confirmarSenha')}
                  style={[
                    styles.input,
                    styles.inputFlex,
                    errorText('confirmarSenha') || confirmMismatch ? styles.inputError : null,
                  ]}
                  placeholder="Confirme sua senha"
                  placeholderTextColor={colors.textMuted}
                  value={formData.confirmarSenha}
                  onChangeText={(v) => handleInputChange('confirmarSenha', v)}
                  secureTextEntry={!showConfirmSenha}
                  autoCapitalize="none"
                  returnKeyType="done"
                  editable={!inputDisabled}
                  onBlur={() => setConfirmTouched(true)}
                  accessibilityLabel="Campo confirmar senha"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirmSenha((s) => !s)}
                  accessibilityLabel={
                    showConfirmSenha ? 'Ocultar confirmação de senha' : 'Mostrar confirmação de senha'
                  }
                >
                  <Ionicons name={showConfirmSenha ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.iconMuted} />
                </TouchableOpacity>
              </View>
              {confirmMismatch ? (
                <Text style={styles.errorInline}>As senhas não coincidem.</Text>
              ) : null}
              {errorText('confirmarSenha') ? (
                <Text style={styles.errorInline}>{errorText('confirmarSenha')}</Text>
              ) : null}
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>Já tem uma conta? </Text>
              <TouchableOpacity onPress={onSwitchToLogin} disabled={inputDisabled} accessibilityRole="link">
                <Text style={styles.switchLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TouchableOpacity
            style={[styles.registerButton, submitting && styles.registerButtonDisabled]}
            onPress={() => void runRegister()}
            disabled={submitting}
            accessibilityLabel="Enviar cadastro"
          >
            {submitting ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.registerButtonText}>Cadastrar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
