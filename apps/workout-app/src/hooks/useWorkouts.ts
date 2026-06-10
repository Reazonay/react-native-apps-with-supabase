import { useCallback, useEffect, useState } from 'react';
import type { WorkoutSummary } from '@workout/shared-types';
import { supabase } from '../lib/supabase';

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

interface WorkoutRow {
  id: string;
  title: string;
  difficulty: string;
  duration_in_minutes: number;
  created_at: string;
}

function rowToSummary(row: WorkoutRow): WorkoutSummary {
  return {
    id: row.id,
    title: row.title,
    difficulty: row.difficulty as WorkoutSummary['difficulty'],
    durationInMinutes: row.duration_in_minutes,
  };
}

// ---------------------------------------------------------------------------
// Hook: useWorkouts – liest alle Workouts aus Supabase
// ---------------------------------------------------------------------------

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<WorkoutSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('workouts')
      .select('id, title, difficulty, duration_in_minutes, created_at')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
      setWorkouts([]);
    } else {
      setWorkouts((data ?? []).map(rowToSummary));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, loading, error, refetch: fetchWorkouts };
}

// ---------------------------------------------------------------------------
// Hook: useCreateWorkout – neues Workout in Supabase anlegen
// ---------------------------------------------------------------------------

interface CreateWorkoutInput {
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationInMinutes: number;
}

export function useCreateWorkout() {
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const createWorkout = useCallback(async (input: CreateWorkoutInput) => {
    setCreating(true);
    setCreateError(null);

    const { error: err } = await supabase
      .from('workouts')
      .insert({
        title: input.title,
        difficulty: input.difficulty,
        duration_in_minutes: input.durationInMinutes,
      });

    setCreating(false);

    if (err) {
      setCreateError(err.message);
      return false;
    }

    return true;
  }, []);

  return { createWorkout, creating, createError };
}
