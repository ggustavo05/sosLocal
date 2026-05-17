import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authService from '../src/services/authService';
import { cpfDigitsOnly as onlyCpfDigits, isValidCpfDigits } from '../src/utils/cpf';
import { useTheme } from '../src/theme';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onSwitchToRegister, onLoginSuccess }: LoginScreenProps) {
  const { colors } = useTheme();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  /** Mensagem visível na UI (Alert no web muitas vezes não aparece). */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setCpfAndClearError = useCallback((v: string) => {
    setCpf(v);
    setErrorMessage(null);
  }, []);

  const setPasswordAndClearError = useCallback((v: string) => {
    setPassword(v);
    setErrorMessage(null);
  }, []);

  const handleLogin = async () => {
    setErrorMessage(null);

    const raw = cpf.trim();
    if (!raw || !password.trim()) {
      setErrorMessage('Preencha CPF (ou usuário de teste) e senha.');
      return;
    }

    const digits = onlyCpfDigits(cpf);
    let username: string;
    if (digits.length === 11) {
      if (!isValidCpfDigits(digits)) {
        setErrorMessage('CPF inválido. Confira os dígitos.');
        return;
      }
      username = digits;
    } else {
      username = raw.toLowerCase();
    }

    setLoading(true);

    try {
      const response = await authService.login({
        username,
        password: password.trim(),
      });

      if (response.success) {
        onLoginSuccess();
      } else {
        setErrorMessage(response.message || 'Não foi possível entrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErrorMessage('Erro ao conectar com o servidor. Verifique a API e a internet.');
    } finally {
      setLoading(false);
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContainer: {
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20,
        },
        logoContainer: {
          alignItems: 'center',
          marginBottom: 40,
        },
        logo: {
          width: 280,
          height: 120,
        },
        formContainer: {
          backgroundColor: colors.surface,
          borderRadius: 15,
          padding: 30,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
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
          marginBottom: 20,
        },
        errorBanner: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          backgroundColor: colors.errorBackground,
          borderWidth: 1,
          borderColor: colors.errorBorder,
          borderRadius: 10,
          padding: 12,
          marginBottom: 16,
        },
        errorIcon: {
          marginRight: 8,
          marginTop: 1,
        },
        errorBannerText: {
          flex: 1,
          fontSize: 15,
          color: colors.error,
          lineHeight: 22,
        },
        inputContainer: {
          marginBottom: 20,
        },
        label: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.text,
          marginBottom: 8,
        },
        hint: {
          fontSize: 13,
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
        passwordRow: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        eyeBtn: {
          padding: 10,
        },
        loginButton: {
          backgroundColor: colors.primary,
          borderRadius: 10,
          padding: 18,
          alignItems: 'center',
          marginTop: 10,
        },
        loginButtonDisabled: {
          backgroundColor: colors.textSecondary,
          opacity: 0.7,
        },
        loginButtonText: {
          color: colors.onPrimary,
          fontSize: 18,
          fontWeight: 'bold',
        },
        switchContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20,
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
      }),
    [colors]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta</Text>

          {errorMessage ? (
            <View style={styles.errorBanner} accessibilityLiveRegion="polite">
              <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          ) : null}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF ou usuário</Text>
            <Text style={styles.hint}>Use seu CPF (11 dígitos) ou admin / citizen para testes.</Text>
            <TextInput
              style={styles.input}
              placeholder="00000000000 ou admin"
              placeholderTextColor={colors.textMuted}
              value={cpf}
              onChangeText={setCpfAndClearError}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="Digite sua senha"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPasswordAndClearError}
                secureTextEntry={!showSenha}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowSenha((s) => !s)}
                accessibilityLabel={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.iconMuted} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.loginButtonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={onSwitchToRegister}>
              <Text style={styles.switchLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

