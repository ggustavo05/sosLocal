import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../app/logintela';
import RegisterScreen from '../app/cadastrotela';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme';

export default function AuthScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const { colors, isDark, preference, toggleTheme, useSystemTheme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        themeBar: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 6,
        },
        themeButton: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 20,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
        themeButtonText: {
          fontSize: 14,
          fontWeight: '600',
          color: colors.text,
        },
        tabContainer: {
          flexDirection: 'row',
          backgroundColor: colors.surface,
          marginHorizontal: 20,
          marginTop: 4,
          borderRadius: 15,
          padding: 5,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        },
        tab: {
          flex: 1,
          paddingVertical: 15,
          alignItems: 'center',
          borderRadius: 10,
        },
        activeTab: {
          backgroundColor: colors.primary,
        },
        tabText: {
          fontSize: 16,
          fontWeight: '600',
          color: colors.tabInactiveText,
        },
        activeTabText: {
          color: colors.onPrimary,
        },
        contentContainer: {
          flex: 1,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.container}>
      <View style={styles.themeBar}>
        <TouchableOpacity
          style={styles.themeButton}
          onPress={() => void toggleTheme()}
          onLongPress={() => void useSystemTheme()}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={
            isDark ? 'Tema escuro. Toque para claro. Mantenha pressionado para seguir o aparelho.' : 'Tema claro. Toque para escuro. Mantenha pressionado para seguir o aparelho.'
          }
          accessibilityHint={
            preference === 'system'
              ? 'A seguir o tema do sistema.'
              : 'Toque longo para voltar a seguir o tema do aparelho.'
          }
        >
          <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={colors.primary} />
          <Text style={styles.themeButtonText}>{isDark ? 'Escuro' : 'Claro'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'login' && styles.activeTab]}
          onPress={() => setActiveTab('login')}
        >
          <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'register' && styles.activeTab]}
          onPress={() => setActiveTab('register')}
        >
          <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'login' ? (
          <LoginScreen
            onSwitchToRegister={() => setActiveTab('register')}
            onLoginSuccess={() => router.replace('/hometela')}
          />
        ) : (
          <RegisterScreen
            onSwitchToLogin={() => setActiveTab('login')}
            onRegisterSuccess={() => router.replace('/hometela')}
          />
        )}
      </View>
    </View>
  );
}
