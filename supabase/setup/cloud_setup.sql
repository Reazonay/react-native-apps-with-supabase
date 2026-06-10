-- ============================================================
-- Workout App – Vollständiges Cloud Setup
-- Alles in einem Script:
--   1. Schema + Tabelle anlegen
--   2. API-Funktion erstellen
--   3. RLS aktivieren + Policies setzen
--   4. Demo-Daten einfügen
-- Ausführen: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. Schema
CREATE SCHEMA IF NOT EXISTS api;

-- 2. Tabelle anlegen
CREATE TABLE IF NOT EXISTS public.workouts (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text        NOT NULL,
  difficulty          text        NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration_in_minutes integer     NOT NULL CHECK (duration_in_minutes > 0),
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- 3. API-Funktion zum Erstellen von Workouts
CREATE OR REPLACE FUNCTION api.create_workout(
  workout_title                text,
  workout_difficulty           text,
  workout_duration_in_minutes  integer
)
RETURNS public.workouts
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  created_workout public.workouts;
BEGIN
  IF workout_title IS NULL OR length(trim(workout_title)) = 0 THEN
    RAISE EXCEPTION 'Workout title must not be empty';
  END IF;

  IF workout_duration_in_minutes IS NULL OR workout_duration_in_minutes <= 0 THEN
    RAISE EXCEPTION 'Workout duration must be greater than zero';
  END IF;

  INSERT INTO public.workouts (title, difficulty, duration_in_minutes)
  VALUES (trim(workout_title), workout_difficulty, workout_duration_in_minutes)
  RETURNING * INTO created_workout;

  RETURN created_workout;
END;
$$;

-- 4. Row Level Security aktivieren
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- 5. Policies
DROP POLICY IF EXISTS "Public read workouts" ON public.workouts;
CREATE POLICY "Public read workouts"
  ON public.workouts
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated insert workouts" ON public.workouts;
CREATE POLICY "Authenticated insert workouts"
  ON public.workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. Demo-Daten einfügen (nur wenn Tabelle leer)
INSERT INTO public.workouts (title, difficulty, duration_in_minutes)
SELECT * FROM (VALUES
  ('Lower Body Strength',    'Intermediate', 45),
  ('Core Stability Circuit', 'Beginner',     20),
  ('Upper Body Power',       'Advanced',     55),
  ('Full Body HIIT',         'Intermediate', 30),
  ('Yoga Flow & Stretch',    'Beginner',     40),
  ('Sprint Intervals',       'Advanced',     25)
) AS v(title, difficulty, duration_in_minutes)
WHERE NOT EXISTS (SELECT 1 FROM public.workouts LIMIT 1);

-- Ergebnis prüfen
SELECT id, title, difficulty, duration_in_minutes FROM public.workouts ORDER BY created_at;
