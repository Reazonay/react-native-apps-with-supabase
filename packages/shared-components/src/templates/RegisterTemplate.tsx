import type { ReactNode } from 'react';
import { View } from 'react-native';

import { KineticText } from '../atoms';
import { useTheme } from '../themeContext';

export interface RegisterTemplateProps {
  title: string;
  subtitle: string;
  navigation: ReactNode;
  card: ReactNode;
}

export function RegisterTemplate({ title, subtitle, navigation, card }: RegisterTemplateProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.lg }}>
      {navigation}
      <View style={{ gap: theme.spacing.sm }}>
        <KineticText variant="headingXL">{title}</KineticText>
        <KineticText variant="subheading" color="textSecondary">
          {subtitle}
        </KineticText>
      </View>
      {card}
    </View>
  );
}
