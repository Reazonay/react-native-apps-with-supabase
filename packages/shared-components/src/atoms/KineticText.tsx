import type { TextProps } from 'react-native';
import { StyleSheet, Text } from 'react-native';

import { uiColors, uiTypography } from '../uiTokens';

export type KineticTextVariant = keyof typeof uiTypography;
export type KineticTextColor = keyof typeof uiColors;

export interface KineticTextProps extends TextProps {
  variant?: KineticTextVariant;
  color?: KineticTextColor;
  align?: 'left' | 'center' | 'right';
}

export function KineticText({ variant = 'body', color = 'textPrimary', align = 'left', style, ...props }: KineticTextProps) {
  return (
    <Text
      {...props}
      style={[styles.base, styles[variant], { color: uiColors[color], textAlign: align }, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: uiColors.textPrimary
  },
  headingXL: uiTypography.headingXL,
  headingLG: uiTypography.headingLG,
  subheading: uiTypography.subheading,
  title: uiTypography.title,
  body: uiTypography.body,
  labelCaps: uiTypography.labelCaps
});
