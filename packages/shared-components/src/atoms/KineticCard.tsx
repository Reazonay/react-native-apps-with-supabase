import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { uiColors, uiRadius, uiSpacing } from '../uiTokens';

export type KineticCardVariant = 'default' | 'outline';

export interface KineticCardProps {
  children: ReactNode;
  variant?: KineticCardVariant;
  gap?: number;
}

export function KineticCard({ children, variant = 'default', gap = uiSpacing.cardGap }: KineticCardProps) {
  return (
    <View style={[styles.base, styles[variant], { gap }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: uiColors.surface,
    borderRadius: uiRadius.lg,
    padding: uiSpacing.cardPadding
  },
  default: {
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8
    },
    elevation: 3
  },
  outline: {
    borderWidth: 1,
    borderColor: uiColors.surfaceBorder
  }
});
