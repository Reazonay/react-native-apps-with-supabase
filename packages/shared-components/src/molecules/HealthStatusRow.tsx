import { View } from 'react-native';

import { KineticBadge, KineticText } from '../atoms';
import { useTheme } from '../themeContext';

export type HealthStatusTone = 'success' | 'warning' | 'error';

export interface HealthStatusRowProps {
  label?: string;
  status: string;
  tone: HealthStatusTone;
}

export function HealthStatusRow({ label = 'Status', status, tone }: HealthStatusRowProps) {
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.sm }}>
      <KineticText variant="labelCaps" color="textMuted">
        {label}
      </KineticText>
      <KineticBadge label={status} tone={tone} />
    </View>
  );
}
