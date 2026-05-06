import { StyleSheet, View } from 'react-native';

import type { WorkoutSummary } from '@workout/shared-types';

import { WorkoutCard } from '../WorkoutCard';
import { uiSpacing } from '../uiTokens';

export interface AdminWorkoutGridProps {
  workouts: WorkoutSummary[];
}

export function AdminWorkoutGrid({ workouts }: AdminWorkoutGridProps) {
  return (
    <View style={styles.grid}>
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          title={workout.title}
          durationInMinutes={workout.durationInMinutes}
          difficulty={workout.difficulty}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: uiSpacing.md,
    maxWidth: 720
  }
});
