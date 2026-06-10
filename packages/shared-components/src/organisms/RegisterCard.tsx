import { useState } from 'react';
import { View } from 'react-native';

import { KineticButton, KineticCard, KineticText } from '../atoms';
import { FormField } from '../molecules';
import { useTheme } from '../themeContext';

export interface RegisterCardProps {
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (payload: { fullName: string; email: string; password: string }) => void;
}

export function RegisterCard({ title, description, submitLabel, onSubmit }: RegisterCardProps) {
  const theme = useTheme();
  const [fullName, setFullName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');

  const isEmailInvalid    = email.length > 0 && !email.includes('@');
  const isPasswordInvalid = password.length > 0 && password.length < 6;

  return (
    <KineticCard variant="outline" gap={theme.spacing.md}>
      <KineticText variant="headingXL">{title}</KineticText>
      <KineticText variant="subheading" color="textSecondary">
        {description}
      </KineticText>

      <View style={{ gap: theme.spacing.sm }}>
        <FormField
          label="Name"
          value={fullName}
          placeholder="Max Mustermann"
          onChangeText={setFullName}
        />
        <FormField
          label="E-Mail"
          value={email}
          placeholder="max@example.com"
          helperText={isEmailInvalid ? 'Bitte eine gueltige E-Mail eingeben.' : undefined}
          hasError={isEmailInvalid}
          onChangeText={setEmail}
        />
        <FormField
          label="Passwort"
          value={password}
          placeholder="Mindestens 6 Zeichen"
          helperText={isPasswordInvalid ? 'Passwort muss mindestens 6 Zeichen haben.' : undefined}
          hasError={isPasswordInvalid}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <KineticButton
        label={submitLabel}
        variant="primary"
        onPress={() => onSubmit({ fullName, email, password })}
      />
    </KineticCard>
  );
}
