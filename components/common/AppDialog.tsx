import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';

export type AppDialogTone = 'success' | 'error' | 'info' | 'neutral';

export interface AppDialogProps {
  visible: boolean;
  tone: AppDialogTone;
  title: string;
  message: string;
  /** Botão principal (ex.: OK, Enviar) */
  primaryLabel: string;
  onPrimary: () => void;
  /** Se definido, exibe segundo botão (ex.: Cancelar) */
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const TONE_ICON: Record<AppDialogTone, React.ComponentProps<typeof Ionicons>['name']> = {
  success: 'checkmark-circle',
  error: 'close-circle',
  info: 'information-circle',
  neutral: 'help-circle',
};

export default function AppDialog({
  visible,
  tone,
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: AppDialogProps) {
  const { colors } = useTheme();
  const icon = TONE_ICON[tone];

  const headerBg = useMemo(() => {
    if (tone === 'error') return colors.error;
    return colors.primary;
  }, [tone, colors.error, colors.primary]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        },
        card: {
          width: '100%',
          maxWidth: 400,
          backgroundColor: colors.dialogCard,
          borderRadius: 16,
          overflow: 'hidden',
          elevation: 8,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 18,
          gap: 12,
        },
        headerIcon: {
          flexShrink: 0,
        },
        title: {
          flex: 1,
          color: colors.onPrimary,
          fontSize: 18,
          fontWeight: '700',
        },
        bodyScroll: {
          maxHeight: 280,
        },
        bodyContent: {
          paddingHorizontal: 20,
          paddingVertical: 18,
        },
        message: {
          fontSize: 15,
          color: colors.dialogMessage,
          lineHeight: 22,
        },
        footer: {
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 4,
        },
        row: {
          flexDirection: 'row',
          gap: 10,
        },
        btnPrimary: {
          flex: 1,
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: 'center',
        },
        btnPrimaryFull: {
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: 'center',
        },
        btnPrimaryText: {
          color: colors.onPrimary,
          fontSize: 16,
          fontWeight: '700',
        },
        btnSecondary: {
          flex: 1,
          backgroundColor: colors.secondaryButtonBg,
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: 'center',
          borderWidth: 2,
          borderColor: colors.secondaryButtonBorder,
        },
        btnSecondaryText: {
          color: colors.secondaryButtonText,
          fontSize: 16,
          fontWeight: '600',
        },
      }),
    [colors]
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSecondary ?? onPrimary}>
      <Pressable style={styles.overlay} onPress={onSecondary ?? onPrimary}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation?.()}>
          <View style={[styles.header, { backgroundColor: headerBg }]}>
            <Ionicons name={icon} size={28} color={colors.onPrimary} style={styles.headerIcon} />
            <Text style={styles.title} numberOfLines={3}>
              {title}
            </Text>
          </View>
          <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
            <Text style={styles.message}>{message}</Text>
          </ScrollView>
          <View style={styles.footer}>
            {secondaryLabel != null && onSecondary != null ? (
              <View style={styles.row}>
                <TouchableOpacity style={styles.btnSecondary} onPress={onSecondary} activeOpacity={0.85}>
                  <Text style={styles.btnSecondaryText}>{secondaryLabel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={onPrimary} activeOpacity={0.85}>
                  <Text style={styles.btnPrimaryText}>{primaryLabel}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.btnPrimaryFull} onPress={onPrimary} activeOpacity={0.85}>
                <Text style={styles.btnPrimaryText}>{primaryLabel}</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
