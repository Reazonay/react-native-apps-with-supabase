import { StyleSheet, View } from 'react-native';

import { KineticInput, KineticText } from '../atoms';
import { uiSpacing } from '../uiTokens';

export interface FormFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  helperText?: string;
  hasError?: boolean;
  onChangeText: (value: string) => void;
}

export function FormField({ label, value, placeholder, helperText, hasError = false, onChangeText }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <KineticText variant="labelCaps" color="textMuted">
        {label}
      </KineticText>
      <KineticInput value={value} placeholder={placeholder} hasError={hasError} onChangeText={onChangeText} />
      {helperText ? (
        <KineticText variant="body" color={hasError ? 'statusErrorText' : 'textSecondary'}>
          {helperText}
        </KineticText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: uiSpacing.xs
  }
});
