import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onLogout?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({ onLogout, onBack, showBackButton }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {showBackButton && onBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
        
        <View style={styles.titleContainer}>
          <Ionicons name="location" size={24} color="#fff" style={styles.logoIcon} />
          <Text style={styles.headerTitle}>SOS LOCALIZA</Text>
        </View>
        
        {onLogout ? (
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="log-out" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1B547D',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logoIcon: {
    marginRight: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  logoutButton: {
    padding: 8,
    width: 40,
  },
  placeholder: {
    width: 40,
  },
});


