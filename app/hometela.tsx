import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Header from '../components/common/Header';
import { useTheme } from '../src/theme';

import GuidanceSection from '../components/home/GuidanceSection';
import MapSection from '../components/home/MapSection';
import RiskAreaSection from '../components/home/RisckAreaSection';

interface HomeScreenProps {
  onLogout?: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  const { colors } = useTheme();

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
      </ScrollView>
    </SafeAreaView>
  );
}
