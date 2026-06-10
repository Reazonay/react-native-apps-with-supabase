import type { TextProps } from 'react-native';
import { Text } from 'react-native';

import { useTheme } from '../themeContext';
import type { ThemeColors, ThemeTypography } from '../themeContext';

export type KineticTextVariant = keyof ThemeTypography;
export type KineticTextColor = keyof ThemeColors;

export interface KineticTextProps extends TextProps {
  variant?: KineticTextVariant;
  color?: KineticTextColor;
  align?: 'left' | 'center' | 'right';
}

export function KineticText({ variant = 'body', color = 'textPrimary', align = 'left', style, ...props }: KineticTextProps) {
  const theme = useTheme();
  const textColor = theme.colors[color] || theme.colors.textPrimary;
  
  return (
    <Text
      {...props}
      style={[
        { color: textColor, textAlign: align },
        theme.typography[variant],
        style
      ]}
    />
  );
}

