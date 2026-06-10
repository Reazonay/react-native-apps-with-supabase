import { Pressable, View } from 'react-native';

import type { WorkoutDifficulty } from '@workout/shared-types';
import { formatWorkoutDuration } from '@workout/shared-utils';

import { KineticBadge, KineticCard, KineticText } from './atoms';
import { useTheme } from './themeContext';

export interface WorkoutCardProps {
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
  onPress?: () => void;
}

export function WorkoutCard({ title, durationInMinutes, difficulty, onPress }: WorkoutCardProps) {
  const theme = useTheme();

  // Pick a character icon and color based on title
  const getIconAndColor = () => {
    const lower = title.toLowerCase();
    const isDark = theme.colors.background === '#141408';
    
    if (lower.includes('lower') || lower.includes('strength') || lower.includes('power')) {
      return { symbol: '🏋', color: isDark ? theme.colors.accent : theme.colors.textPrimary };
    }
    if (lower.includes('core') || lower.includes('hiit') || lower.includes('sprint') || lower.includes('stability')) {
      return { symbol: '⚡', color: isDark ? theme.colors.accent : '#d97706' };
    }
    if (lower.includes('yoga') || lower.includes('stretch') || lower.includes('flow')) {
      return { symbol: '🧘', color: isDark ? theme.colors.accent : '#0284c7' };
    }
    return { symbol: '💪', color: isDark ? theme.colors.accent : theme.colors.textPrimary };
  };

  const { symbol, color } = getIconAndColor();
  const isDark = theme.colors.background === '#141408';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
      <KineticCard variant="outline" gap={0}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, flex: 1 }}>
            {/* Icon Container (w-12 h-12, bg-surface-container-highest) */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDark ? '#363527' : '#e5e7eb',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <KineticText style={{ fontSize: 20, color: color, fontWeight: 'bold' }}>
                {symbol}
              </KineticText>
            </View>

            {/* Details Column */}
            <View style={{ flex: 1, gap: 6 }}>
              <KineticText variant="title" style={{ fontWeight: '700' }}>{title}</KineticText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
                <KineticBadge label={difficulty} tone="success" />
                <KineticText variant="body" color="textSecondary" style={{ fontSize: 12, fontWeight: '600' }}>
                  ⏱️ {formatWorkoutDuration(durationInMinutes)}
                </KineticText>
              </View>
            </View>
          </View>

          {/* Chevron */}
          <View>
            <KineticText variant="title" color="textSecondary" style={{ fontSize: 18, marginRight: 4 }}>
              ➔
            </KineticText>
          </View>
        </View>
      </KineticCard>
    </Pressable>
  );
}