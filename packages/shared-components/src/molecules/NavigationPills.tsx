import { View } from 'react-native';

import { KineticButton } from '../atoms';
import { useTheme } from '../themeContext';

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
  const theme = useTheme();

  return (
    <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
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
