import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import Header from '../components/common/Header';
import { useTheme } from '../src/theme';
import {
  BUILD_GENERATED_AT,
  GIT_COMMIT_HASH,
  GIT_COMMIT_SHORT,
} from '../src/constants/buildInfo';

const appVersion = Constants.expoConfig?.version ?? '1.0.0';

function formatBuildDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export default function SobreAppScreen() {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: colors.background,
        },
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollView: {
          flex: 1,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 40,
        },
        headerSection: {
          alignItems: 'center',
          marginBottom: 24,
          marginTop: 8,
        },
        logo: {
          width: 200,
          height: 88,
          marginBottom: 12,
        },
        mainTitle: {
          fontSize: 26,
          fontWeight: 'bold',
          color: colors.primary,
          textAlign: 'center',
          marginBottom: 8,
        },
        tagline: {
          fontSize: 15,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 22,
          paddingHorizontal: 12,
        },
        card: {
          backgroundColor: colors.surface,
          borderRadius: 15,
          padding: 22,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        row: {
          marginBottom: 20,
        },
        rowLast: {
          marginBottom: 0,
        },
        label: {
          fontSize: 13,
          fontWeight: '700',
          color: colors.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 6,
        },
        value: {
          fontSize: 17,
          fontWeight: '600',
          color: colors.text,
        },
        hashBlock: {
          marginTop: 4,
          padding: 14,
          borderRadius: 10,
          backgroundColor: colors.surfaceSecondary,
          borderWidth: 1,
          borderColor: colors.border,
        },
        hashFull: {
          fontSize: 14,
          fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
          color: colors.primary,
          lineHeight: 22,
        },
        hashShort: {
          fontSize: 13,
          color: colors.textMuted,
          marginTop: 8,
        },
        meta: {
          fontSize: 12,
          color: colors.textMuted,
          marginTop: 16,
          lineHeight: 18,
        },
        purpose: {
          fontSize: 15,
          color: colors.text,
          lineHeight: 22,
          marginBottom: 20,
        },
      }),
    [colors]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header showBackButton onBack={() => router.back()} showThemeToggle />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo SOS Localiza"
            />
            <Text style={styles.mainTitle}>Sobre o App</Text>
            <Text style={styles.tagline}>
              Aplicativo de alertas, mapa de áreas de risco e orientações de segurança em eventos adversos.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.purpose}>
              O SOS Localiza conecta cidadãos a informações de risco, orientações de emergência e envio de SMS
              quando necessário, integrado à API do projeto acadêmico.
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>Versão do aplicativo</Text>
              <Text style={styles.value}>{appVersion}</Text>
            </View>

            <View style={[styles.row, styles.rowLast]}>
              <Text style={styles.label}>Commit de referência (versão publicada)</Text>
              <View style={styles.hashBlock}>
                <Text style={styles.hashFull} selectable>
                  {GIT_COMMIT_HASH}
                </Text>
                <Text style={styles.hashShort} selectable>
                  Resumo: {GIT_COMMIT_SHORT}
                </Text>
              </View>
              <Text style={styles.meta}>
                Build gerado em {formatBuildDate(BUILD_GENERATED_AT)}. O hash identifica o commit Git usado nesta
                compilação.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
