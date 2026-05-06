import { View } from 'react-native';

import { KineticButton, KineticCard, KineticText } from '../atoms';
import { HealthStatusRow, type HealthStatusTone } from '../molecules/HealthStatusRow';

export interface HealthCardProps {
  title: string;
  description: string;
  endpoint: string;
  statusLabel: string;
  statusTone: HealthStatusTone;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export function HealthCard({
  title,
  description,
  endpoint,
  statusLabel,
  statusTone,
  message,
  actionLabel,
  onAction
}: HealthCardProps) {
  return (
    <KineticCard variant="outline" gap={14}>
      <KineticText variant="headingXL">{title}</KineticText>
      <KineticText variant="subheading" color="textSecondary">
        {description}
      </KineticText>
      <View>
        <KineticText variant="labelCaps" color="textMuted">
          Endpoint
        </KineticText>
        <KineticText variant="body">{endpoint}</KineticText>
      </View>
      <HealthStatusRow status={statusLabel} tone={statusTone} />
      <KineticText variant="body">{message}</KineticText>
      <KineticButton label={actionLabel} variant="primary" onPress={onAction} />
    </KineticCard>
  );
}
