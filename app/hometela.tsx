import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Header from '../components/common/Header';
import { useTheme } from '../src/theme';
import { requestNotificationPermissions } from '../src/services/notificationService';

import GuidanceSection from '../components/home/GuidanceSection';
import MapSection from '../components/home/MapSection';
import RiskAreaSection from '../components/home/RisckAreaSection';

interface HomeScreenProps {
  onLogout?: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  const { colors } = useTheme();

  useEffect(() => {
    void requestNotificationPermissions();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollView: {
          flex: 1,
        },
        scrollContent: {
          paddingBottom: 20,
        },
        aboutCard: {
          backgroundColor: colors.surface,
          marginHorizontal: 20,
          marginVertical: 10,
          borderRadius: 15,
          padding: 18,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        aboutIconWrap: {
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.surfaceSecondary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14,
        },
        aboutTextBlock: {
          flex: 1,
        },
        aboutTitle: {
          fontSize: 17,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 4,
        },
        aboutSubtitle: {
          fontSize: 14,
          color: colors.textSecondary,
        },
      }),
    [colors]
  );

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onLogout={handleLogout} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GuidanceSection />
        <MapSection />
        <RiskAreaSection />

        <TouchableOpacity
          style={styles.aboutCard}
          onPress={() => router.push('/sobre')}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Abrir Sobre o App"
        >
          <View style={styles.aboutIconWrap}>
            <Ionicons name="information-circle-outline" size={28} color={colors.primary} />
          </View>
          <View style={styles.aboutTextBlock}>
            <Text style={styles.aboutTitle}>Sobre o App</Text>
            <Text style={styles.aboutSubtitle}>Versão e commit de referência</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
