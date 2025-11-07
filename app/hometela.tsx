import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Header from '../components/common/Header';

import GuidanceSection from '../components/home/GuidanceSection';
import MapSection from '../components/home/MapSection';
import RiskAreaSection from '../components/home/RisckAreaSection';

interface HomeScreenProps {
  onLogout: () => void;
}

export default function HomeScreen({ onLogout }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Header onLogout={onLogout} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
