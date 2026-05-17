import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme';

const { width } = Dimensions.get('window');
const isMobile = width < 600;

export default function GuidanceSection() {
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
        contentMobile: {
          flexDirection: 'column',
          alignItems: 'stretch',
        },
        textContainer: {
          flex: 1,
          marginRight: 15,
        },
        textContainerMobile: {
          flex: 0,
          marginRight: 0,
          marginBottom: 15,
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
          backgroundColor: colors.accent,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 10,
          minWidth: 120,
          shadowColor: colors.accent,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 3,
        },
        buttonMobile: {
          alignSelf: 'stretch',
          width: undefined,
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

  const handleGuidance = () => {
    router.push('/orientacoes');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, isMobile && styles.contentMobile]}>
        <View style={[styles.textContainer, isMobile && styles.textContainerMobile]}>
          <Text style={styles.text}>
            Saiba como agir diante dos principais eventos adversos com{' '}
            <Text style={styles.highlight}>orientações</Text> e <Text style={styles.highlight}>cuidados essenciais</Text>.
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, isMobile && styles.buttonMobile]}
          onPress={handleGuidance}
        >
          <Text style={styles.buttonText}>Orientações</Text>
          <Ionicons name="heart" size={20} color={colors.onPrimary} style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
