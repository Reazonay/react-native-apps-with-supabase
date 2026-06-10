import { View } from 'react-native';

import type { WorkoutSummary } from '@workout/shared-types';

import { WorkoutCard } from '../WorkoutCard';
import { useTheme } from '../themeContext';

export interface AdminWorkoutGridProps {
  workouts: WorkoutSummary[];
}

export function AdminWorkoutGrid({ workouts }: AdminWorkoutGridProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.md, maxWidth: 720 }}>
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
