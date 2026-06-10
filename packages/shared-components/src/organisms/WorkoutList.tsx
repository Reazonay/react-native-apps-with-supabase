import { View } from 'react-native';

import type { WorkoutSummary } from '@workout/shared-types';

import { WorkoutCard } from '../WorkoutCard';
import { useTheme } from '../themeContext';

export interface WorkoutListProps {
  workouts: WorkoutSummary[];
  onWorkoutPress?: (workout: WorkoutSummary) => void;
}

export function WorkoutList({ workouts, onWorkoutPress }: WorkoutListProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.md }}>
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          title={workout.title}
          durationInMinutes={workout.durationInMinutes}
          difficulty={workout.difficulty}
          onPress={() => onWorkoutPress?.(workout)}
        />
      ))}
    </View>
  );
}
