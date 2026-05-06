import { Pressable, StyleSheet, View } from 'react-native';

import type { WorkoutDifficulty } from '@workout/shared-types';
import { formatWorkoutDuration } from '@workout/shared-utils';

import { KineticBadge, KineticCard, KineticText } from './atoms';
import { uiSpacing } from './uiTokens';

export interface WorkoutCardProps {
  title: string;
  durationInMinutes: number;
  difficulty: WorkoutDifficulty;
  onPress?: () => void;
}

export function WorkoutCard({ title, durationInMinutes, difficulty, onPress }: WorkoutCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <KineticCard>
        <View style={styles.header}>
          <KineticText variant="title">{title}</KineticText>
          <KineticBadge label={difficulty} tone="success" />
        </View>
        <KineticText variant="body" color="textSecondary">
          {formatWorkoutDuration(durationInMinutes)}
        </KineticText>
      </KineticCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: uiSpacing.md
  }
});