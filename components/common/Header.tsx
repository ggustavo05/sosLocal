import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';

interface HeaderProps {
  onLogout?: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  /** Ícone lua/sol para alternar tema (persistente). */
  showThemeToggle?: boolean;
}

export default function Header({
  onLogout,
  onBack,
  showBackButton,
  showThemeToggle = true,
}: HeaderProps) {
  const { colors, isDark, preference, toggleTheme, useSystemTheme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          backgroundColor: colors.primary,
          paddingTop: 20,
          paddingBottom: 20,
          paddingHorizontal: 16,
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
          marginRight: 8,
        },
        headerTitle: {
          color: colors.onPrimary,
          fontSize: 18,
          fontWeight: 'bold',
          letterSpacing: 0.5,
        },
        backButton: {
          padding: 8,
          width: 40,
        },
        rightCluster: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexShrink: 0,
          maxWidth: 120,
        },
        rightClusterSolo: {
          minWidth: 40,
        },
        iconBtn: {
          padding: 8,
          width: 40,
          alignItems: 'center',
          justifyContent: 'center',
        },
        systemLink: {
          paddingHorizontal: 4,
          paddingVertical: 6,
        },
        systemLinkText: {
          color: colors.onPrimary,
          fontSize: 11,
          opacity: 0.95,
          textDecorationLine: 'underline',
        },
        placeholder: {
          width: 40,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        {showBackButton && onBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color={colors.onPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.titleContainer}>
          <Ionicons name="location" size={24} color={colors.onPrimary} style={styles.logoIcon} />
          <Text style={styles.headerTitle} numberOfLines={1}>
            SOS LOCALIZA
          </Text>
        </View>

        <View style={[styles.rightCluster, !onLogout && styles.rightClusterSolo]}>
          {showThemeToggle ? (
            <>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => void toggleTheme()}
                accessibilityLabel={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
                accessibilityRole="button"
              >
                <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={colors.onPrimary} />
              </TouchableOpacity>
              {preference !== 'system' ? (
                <TouchableOpacity
                  style={styles.systemLink}
                  onPress={() => void useSystemTheme()}
                  accessibilityLabel="Seguir tema do sistema"
                  accessibilityRole="button"
                >
                  <Text style={styles.systemLinkText}>SO</Text>
                </TouchableOpacity>
              ) : null}
            </>
          ) : null}
          {onLogout ? (
            <TouchableOpacity style={styles.iconBtn} onPress={onLogout}>
              <Ionicons name="log-out" size={20} color={colors.onPrimary} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
