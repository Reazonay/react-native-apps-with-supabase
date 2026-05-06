import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { KineticButton, KineticCard, KineticText } from '../atoms';
import { uiSpacing } from '../uiTokens';

export interface RegisterSuccessTemplateProps {
  title: string;
  subtitle: string;
  navigation: ReactNode;
  actionLabel: string;
  onAction: () => void;
}

export function RegisterSuccessTemplate({ title, subtitle, navigation, actionLabel, onAction }: RegisterSuccessTemplateProps) {
  return (
    <View style={styles.container}>
      {navigation}
      <KineticCard variant="outline" gap={uiSpacing.sm}>
        <KineticText variant="headingXL">{title}</KineticText>
        <KineticText variant="subheading" color="textSecondary">
          {subtitle}
        </KineticText>
        <KineticButton label={actionLabel} variant="primary" onPress={onAction} />
      </KineticCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: uiSpacing.lg
  }
});
