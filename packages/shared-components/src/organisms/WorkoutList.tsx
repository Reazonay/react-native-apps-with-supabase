import { StyleSheet, View } from 'react-native';

import type { WorkoutSummary } from '@workout/shared-types';

import { WorkoutCard } from '../WorkoutCard';
import { uiSpacing } from '../uiTokens';

export interface WorkoutListProps {
  workouts: WorkoutSummary[];
}

export function WorkoutList({ workouts }: WorkoutListProps) {
  return (
    <View style={styles.list}>
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
  list: {
    gap: uiSpacing.md
  }
});
