import { StyleSheet, View } from 'react-native';

import { KineticBadge, KineticText } from '../atoms';
import { uiSpacing } from '../uiTokens';

export type HealthStatusTone = 'success' | 'warning' | 'error';

export interface HealthStatusRowProps {
  label?: string;
  status: string;
  tone: HealthStatusTone;
}

export function HealthStatusRow({ label = 'Status', status, tone }: HealthStatusRowProps) {
  return (
    <View style={styles.row}>
      <KineticText variant="labelCaps" color="textMuted">
        {label}
      </KineticText>
      <KineticBadge label={status} tone={tone} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: uiSpacing.sm
  }
});
