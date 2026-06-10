import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { View } from 'react-native';

import { useTheme } from '../themeContext';

export type KineticCardVariant = 'default' | 'outline';

export interface KineticCardProps {
  children: ReactNode;
  variant?: KineticCardVariant;
  gap?: number;
  style?: ViewStyle | ViewStyle[];
}

export function KineticCard({ children, variant = 'default', gap, style }: KineticCardProps) {
  const theme = useTheme();
  const cardGap = gap ?? theme.spacing.cardGap;

  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.cardPadding,
    gap: cardGap,
  };

  const variantStyle = variant === 'default'
    ? {
        shadowColor: theme.colors.accent,
        shadowOpacity: 0.15,
        shadowRadius: 24,
        shadowOffset: {
          width: 0,
          height: 12
        },
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(237, 233, 0, 0.05)', // Subtle neon tint border
      }
    : {
        borderWidth: 1,
        borderColor: theme.colors.border,
      };

  return (
    <View style={[cardStyle, variantStyle, style]}>
      {children}
    </View>
  );
}
