import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';

export default function CepSection() {
  const { colors } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.surface,
          paddingHorizontal: 20,
          paddingVertical: 20,
          marginHorizontal: 20,
          marginVertical: 10,
          borderRadius: 15,
          shadowColor: colors.shadow,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5,
        },
        content: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        textContainer: {
          flex: 1,
          marginRight: 15,
        },
        text: {
          fontSize: 16,
          color: colors.text,
          lineHeight: 22,
        },
        highlight: {
          color: colors.accent,
          fontWeight: 'bold',
        },
        button: {
          backgroundColor: colors.primary,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 10,
          minWidth: 140,
          shadowColor: colors.primary,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        },
        buttonText: {
          color: colors.onPrimary,
          fontSize: 16,
          fontWeight: '600',
        },
        buttonIcon: {
          marginLeft: 8,
        },
      }),
    [colors]
  );

  const handleAddArea = () => {
    console.log('Adicionar área clicado');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Cadastre o <Text style={styles.highlight}>CEP</Text> de sua residência para receber alertas sobre eventos
            adversos em São Paulo.
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddArea}>
          <Text style={styles.buttonText}>Adicionar área</Text>
          <Ionicons name="add-circle" size={20} color={colors.onPrimary} style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
