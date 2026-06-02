/*
  # Create Lessons Progress Table
  
  1. New Tables
    - `lessons_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `lesson_id` (text, unique lesson identifier)
      - `progress` (integer, 0-100 percentage)
      - `completed` (boolean, whether lesson is complete)
      - `started_at` (timestamptz, when user started lesson)
      - `completed_at` (timestamptz, when user completed lesson)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on lessons_progress
    - Users can only access their own lesson progress
    - Unique constraint: one progress record per user per lesson
*/

CREATE TABLE IF NOT EXISTS lessons_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  progress integer NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed boolean NOT NULL DEFAULT false,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE lessons_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress"
  ON lessons_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lessons_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lessons_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
