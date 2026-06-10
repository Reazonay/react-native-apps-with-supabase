import type { ReactNode } from 'react';
import { View } from 'react-native';

import { KineticButton, KineticCard, KineticText } from '../atoms';
import { useTheme } from '../themeContext';

export interface RegisterSuccessTemplateProps {
  title: string;
  subtitle: string;
  navigation: ReactNode;
  actionLabel: string;
  onAction: () => void;
}

export function RegisterSuccessTemplate({ title, subtitle, navigation, actionLabel, onAction }: RegisterSuccessTemplateProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.lg }}>
      {navigation}
      <KineticCard variant="outline" gap={theme.spacing.sm}>
        <KineticText variant="headingXL">{title}</KineticText>
        <KineticText variant="subheading" color="textSecondary">
          {subtitle}
        </KineticText>
        <KineticButton label={actionLabel} variant="primary" onPress={onAction} />
      </KineticCard>
    </View>
  );
}
