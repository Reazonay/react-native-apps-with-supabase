import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';

import { uiColors, uiRadius, uiSpacing, uiTypography } from '../uiTokens';

export interface KineticInputProps extends TextInputProps {
  hasError?: boolean;
}

export function KineticInput({ style, hasError = false, ...props }: KineticInputProps) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={uiColors.textMuted}
      style={[styles.base, hasError && styles.error, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: uiColors.surfaceBorderStrong,
    borderRadius: uiRadius.md,
    paddingHorizontal: uiSpacing.md,
    paddingVertical: uiSpacing.sm,
    color: uiColors.textPrimary,
    ...uiTypography.body
  },
  error: {
    borderColor: uiColors.statusErrorText
  }
});
