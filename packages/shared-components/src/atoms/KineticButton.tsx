import type { PressableProps } from 'react-native';
import { Pressable, StyleSheet } from 'react-native';

import { uiColors, uiRadius, uiSpacing, uiTypography } from '../uiTokens';
import { KineticText } from './KineticText';

export type KineticButtonVariant = 'primary' | 'ghost' | 'pill';

export interface KineticButtonProps extends PressableProps {
  label: string;
  variant?: KineticButtonVariant;
}

export function KineticButton({ label, variant = 'primary', style, disabled, ...props }: KineticButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      <KineticText
        variant="body"
        style={[styles.label, styles[`${variant}Label`]]}
      >
        {label}
      </KineticText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: uiSpacing.md,
    paddingVertical: uiSpacing.sm,
    borderRadius: uiRadius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primary: {
    backgroundColor: uiColors.actionPrimary
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: uiColors.surfaceBorderStrong
  },
  pill: {
    backgroundColor: uiColors.navActive,
    borderRadius: uiRadius.pill
  },
  label: {
    ...uiTypography.body,
    fontWeight: '700'
  },
  primaryLabel: {
    color: uiColors.actionPrimaryText
  },
  ghostLabel: {
    color: uiColors.navInactive
  },
  pillLabel: {
    color: uiColors.actionPrimaryText
  },
  pressed: {
    opacity: 0.85
  },
  disabled: {
    opacity: 0.5
  }
});
