import type { TextInputProps } from 'react-native';
import { TextInput } from 'react-native';

import { useTheme } from '../themeContext';

export interface KineticInputProps extends TextInputProps {
  hasError?: boolean;
}

export function KineticInput({ style, hasError = false, ...props }: KineticInputProps) {
  const theme = useTheme();

  const inputStyle = {
    borderWidth: 1,
    borderColor: hasError ? theme.colors.errorBg : theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    ...theme.typography.body,
  };

  return (
    <TextInput
      {...props}
      placeholderTextColor={theme.colors.textMuted}
      style={[inputStyle, style]}
    />
  );
}
