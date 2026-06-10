import type { ReactNode } from 'react';
import { View } from 'react-native';

import { KineticText } from '../atoms';
import { useTheme } from '../themeContext';

export interface DashboardTemplateProps {
  title: string;
  subtitle: string;
  navigation: ReactNode;
  children: ReactNode;
  spacing?: number;
}

export function DashboardTemplate({ title, subtitle, navigation, children, spacing }: DashboardTemplateProps) {
  const theme = useTheme();
  const gapSpacing = spacing ?? theme.spacing.lg;

  return (
    <View style={{ gap: gapSpacing }}>
      {navigation}
      {title ? (
        <View style={{ gap: theme.spacing.sm }}>
          <KineticText variant="headingXL">{title}</KineticText>
          <KineticText variant="subheading" color="textSecondary">
            {subtitle}
          </KineticText>
        </View>
      ) : null}
      {children}
    </View>
  );
}
