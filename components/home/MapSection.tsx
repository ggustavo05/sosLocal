import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapSection() {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>mapa</Text>
      </View>
    </View>
  );
}
