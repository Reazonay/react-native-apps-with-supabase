import { View } from 'react-native';

import { KineticInput, KineticText } from '../atoms';
import { useTheme } from '../themeContext';

export interface FormFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  helperText?: string;
  hasError?: boolean;
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
}

export function FormField({ label, value, placeholder, helperText, hasError = false, secureTextEntry = false, onChangeText }: FormFieldProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <KineticText variant="labelCaps" color="textMuted">
        {label}
      </KineticText>
      <KineticInput value={value} placeholder={placeholder} hasError={hasError} secureTextEntry={secureTextEntry} onChangeText={onChangeText} />
      {helperText ? (
        <KineticText variant="body" color={hasError ? 'errorBg' : 'textSecondary'}>
          {helperText}
        </KineticText>
      ) : null}
    </View>
  );
}
