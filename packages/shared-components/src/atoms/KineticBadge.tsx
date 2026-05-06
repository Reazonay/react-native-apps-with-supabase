import { StyleSheet, View } from 'react-native';

import { uiColors, uiRadius, uiSpacing, uiTypography } from '../uiTokens';
import { KineticText } from './KineticText';

export type KineticBadgeTone = 'success' | 'neutral' | 'warning' | 'error';

export interface KineticBadgeProps {
  label: string;
  tone?: KineticBadgeTone;
}

export function KineticBadge({ label, tone = 'neutral' }: KineticBadgeProps) {
  return (
    <View style={[styles.base, styles[tone]]}>
      <KineticText variant="body" style={[styles.label, styles[`${tone}Label`]]}>
        {label}
      </KineticText>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: uiRadius.pill,
    paddingHorizontal: uiSpacing.sm,
    paddingVertical: 6
  },
  success: {
    backgroundColor: uiColors.badgeSuccessBg
  },
  neutral: {
    backgroundColor: uiColors.surfaceBorder
  },
  warning: {
    backgroundColor: uiColors.statusLoadingBg
  },
  error: {
    backgroundColor: uiColors.statusErrorBg
  },
  label: {
    ...uiTypography.body,
    fontWeight: '700'
  },
  successLabel: {
    color: uiColors.badgeSuccessText
  },
  neutralLabel: {
    color: uiColors.navInactive
  },
  warningLabel: {
    color: uiColors.statusLoadingText
  },
  errorLabel: {
    color: uiColors.statusErrorText
  }
});
