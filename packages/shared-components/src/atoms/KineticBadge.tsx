import { View } from 'react-native';

import { useTheme } from '../themeContext';
import { KineticText } from './KineticText';

export type KineticBadgeTone = 'success' | 'neutral' | 'warning' | 'error';

export interface KineticBadgeProps {
  label: string;
  tone?: KineticBadgeTone;
}

export function KineticBadge({ label, tone = 'neutral' }: KineticBadgeProps) {
  const theme = useTheme();

  const getBadgeColors = () => {
    switch (tone) {
      case 'success':
        return {
          bg: theme.colors.successBg,
          text: theme.colors.successText,
        };
      case 'warning':
        return {
          bg: theme.colors.warningBg,
          text: theme.colors.warningText,
        };
      case 'error':
        return {
          bg: theme.colors.errorBg,
          text: theme.colors.errorText,
        };
      default: // neutral
        return {
          bg: theme.colors.border,
          text: theme.colors.textSecondary,
        };
    }
  };

  const colors = getBadgeColors();

  return (
    <View
      style={{
        borderRadius: theme.radius.pill,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 6,
        backgroundColor: colors.bg,
        alignSelf: 'flex-start', // prevent stretching
      }}
    >
      <KineticText
        variant="body"
        style={{
          color: colors.text,
          fontWeight: '700',
        }}
      >
        {label}
      </KineticText>
    </View>
  );
}
