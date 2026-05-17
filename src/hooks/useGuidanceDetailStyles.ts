import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../theme';

export type GuidanceDetailAccent = {
  cardTitleColor: string;
  warningBorderColor: string;
  warningBoldColor: string;
  warningIconColor: string;
};

export function useGuidanceDetailStyles(accent: GuidanceDetailAccent) {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: colors.background,
        },
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollView: {
          flex: 1,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 40,
        },
        section: {
          marginBottom: 20,
        },
        sectionHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 20,
        },
        sectionTitle: {
          fontSize: 22,
          fontWeight: 'bold',
          color: colors.text,
          marginLeft: 10,
          flex: 1,
        },
        card: {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 18,
          marginBottom: 15,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        cardTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: accent.cardTitleColor,
          marginBottom: 12,
        },
        cardText: {
          fontSize: 15,
          color: colors.textSecondary,
          lineHeight: 24,
        },
        warningCard: {
          backgroundColor: colors.warningBackground,
          borderRadius: 12,
          padding: 20,
          marginTop: 10,
          borderLeftWidth: 4,
          borderLeftColor: accent.warningBorderColor,
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
        warningText: {
          fontSize: 15,
          color: colors.warningText,
          lineHeight: 22,
          marginLeft: 12,
          flex: 1,
        },
        warningBold: {
          fontWeight: 'bold',
          color: accent.warningBoldColor,
        },
      }),
    [colors, accent.cardTitleColor, accent.warningBorderColor, accent.warningBoldColor]
  );
}
