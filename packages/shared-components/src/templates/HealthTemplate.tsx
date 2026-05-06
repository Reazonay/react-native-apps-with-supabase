import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { KineticText } from '../atoms';
import { uiSpacing } from '../uiTokens';

export interface HealthTemplateProps {
  title: string;
  subtitle: string;
  navigation: ReactNode;
  card: ReactNode;
}

export function HealthTemplate({ title, subtitle, navigation, card }: HealthTemplateProps) {
  return (
    <View style={styles.container}>
      {navigation}
      <View style={styles.header}>
        <KineticText variant="headingXL">{title}</KineticText>
        <KineticText variant="subheading" color="textSecondary">
          {subtitle}
        </KineticText>
      </View>
      {card}
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
