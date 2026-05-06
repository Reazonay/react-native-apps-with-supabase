import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { KineticText } from '../atoms';
import { uiSpacing } from '../uiTokens';

export interface DashboardTemplateProps {
  title: string;
  subtitle: string;
  navigation: ReactNode;
  children: ReactNode;
  spacing?: number;
}

export function DashboardTemplate({ title, subtitle, navigation, children, spacing = uiSpacing.lg }: DashboardTemplateProps) {
  return (
    <View style={[styles.container, { gap: spacing }]}>
      {navigation}
      <View style={styles.header}>
        <KineticText variant="headingXL">{title}</KineticText>
        <KineticText variant="subheading" color="textSecondary">
          {subtitle}
        </KineticText>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: uiSpacing.lg
  },
  header: {
    gap: uiSpacing.sm
  }
});
