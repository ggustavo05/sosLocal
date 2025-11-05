import React, { useState } from 'react';
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
} from 'react-native';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

interface RegisterData {
  nomeCompleto: string;
  email: string;
  dataNascimento: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
}

export default function RegisterScreen({ onSwitchToLogin, onRegisterSuccess }: RegisterScreenProps) {
  const [formData, setFormData] = useState<RegisterData>({
    nomeCompleto: '',
    email: '',
    dataNascimento: '',
    cpf: '',
    senha: '',
    confirmarSenha: '',
  });

  const formatCPF = (text: string) => {
    // Remove tudo que não é dígito
    const numbers = text.replace(/\D/g, '');
    
    // Aplica a máscara do CPF
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    return text;
  };

  const formatDate = (text: string) => {
    // Remove tudo que não é dígito
    const numbers = text.replace(/\D/g, '');
    
    // Aplica a máscara da data
    if (numbers.length <= 8) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    return text;
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    if (field === 'cpf') {
      value = formatCPF(value);
    } else if (field === 'dataNascimento') {
      value = formatDate(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nomeCompleto.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu nome completo');
      return false;
    }

    if (!formData.email.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu email');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Erro', 'Por favor, digite um email válido');
      return false;
    }

    if (!formData.dataNascimento.trim()) {
      Alert.alert('Erro', 'Por favor, digite sua data de nascimento');
      return false;
    }

    if (formData.dataNascimento.length !== 10) {
      Alert.alert('Erro', 'Por favor, digite uma data válida (DD/MM/AAAA)');
      return false;
    }

    if (!formData.cpf.trim()) {
      Alert.alert('Erro', 'Por favor, digite seu CPF');
      return false;
    }

    if (formData.cpf.length !== 14) {
      Alert.alert('Erro', 'Por favor, digite um CPF válido');
      return false;
    }

    if (!formData.senha.trim()) {
      Alert.alert('Erro', 'Por favor, digite uma senha');
      return false;
    }

    if (formData.senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleRegister = () => {
    if (!validateForm()) {
      return;
    }

    // Aqui você implementará a lógica de cadastro
    const registerData = {
      nomeCompleto: formData.nomeCompleto,
      email: formData.email,
      dataNascimento: formData.dataNascimento,
      cpf: formData.cpf,
    };

    console.log('Dados de cadastro:', registerData);
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
    onRegisterSuccess();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Cadastro</Text>
          <Text style={styles.subtitle}>Crie sua conta</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome completo"
              placeholderTextColor="#999"
              value={formData.nomeCompleto}
              onChangeText={(value) => handleInputChange('nomeCompleto', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de Nascimento</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
              value={formData.dataNascimento}
              onChangeText={(value) => handleInputChange('dataNascimento', value)}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>CPF</Text>
            <TextInput
              style={styles.input}
              placeholder="000.000.000-00"
              placeholderTextColor="#999"
              value={formData.cpf}
              onChangeText={(value) => handleInputChange('cpf', value)}
              keyboardType="numeric"
              maxLength={14}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              value={formData.senha}
              onChangeText={(value) => handleInputChange('senha', value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua senha"
              placeholderTextColor="#999"
              value={formData.confirmarSenha}
              onChangeText={(value) => handleInputChange('confirmarSenha', value)}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={onSwitchToLogin}>
              <Text style={styles.switchLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

