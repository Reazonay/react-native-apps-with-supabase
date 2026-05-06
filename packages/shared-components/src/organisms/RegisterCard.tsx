import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { KineticButton, KineticCard, KineticText } from '../atoms';
import { FormField } from '../molecules';
import { uiSpacing } from '../uiTokens';

export interface RegisterCardProps {
  title: string;
  description: string;
  submitLabel: string;
  onSubmit: (payload: { fullName: string; email: string }) => void;
}

export function RegisterCard({ title, description, submitLabel, onSubmit }: RegisterCardProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const isEmailInvalid = email.length > 0 && !email.includes('@');

  return (
    <KineticCard variant="outline" gap={uiSpacing.md}>
      <KineticText variant="headingXL">{title}</KineticText>
      <KineticText variant="subheading" color="textSecondary">
        {description}
      </KineticText>
      <View style={styles.form}>
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
      </View>
      <KineticButton
        label={submitLabel}
        variant="primary"
        onPress={() => onSubmit({ fullName, email })}
      />
    </KineticCard>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: uiSpacing.sm
  }
});
