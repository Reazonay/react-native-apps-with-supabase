import { StyleSheet, View } from 'react-native';

import { KineticButton } from '../atoms';
import { uiSpacing } from '../uiTokens';

export interface NavigationPillsItem {
  key: string;
  label: string;
  onPress: () => void;
  active?: boolean;
}

export interface NavigationPillsProps {
  items: NavigationPillsItem[];
}

export function NavigationPills({ items }: NavigationPillsProps) {
  return (
    <View style={styles.row}>
      {items.map((item) => (
        <KineticButton
          key={item.key}
          label={item.label}
          variant={item.active ? 'pill' : 'ghost'}
          onPress={item.onPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: uiSpacing.sm
  }
});
