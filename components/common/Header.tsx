import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Ionicons name="location" size={24} color="#fff" style={styles.logoIcon} />
        <Text style={styles.headerTitle}>SOS LOCALIZA</Text>
        {onLogout && (
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="log-out" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

