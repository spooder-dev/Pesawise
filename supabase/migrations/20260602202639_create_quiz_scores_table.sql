/*
  # Create Quiz Scores Table
  
  1. New Tables
    - `quiz_scores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `lesson_id` (text, lesson quiz was from)
      - `score` (integer, 0-100)
      - `total_questions` (integer, total questions in quiz)
      - `correct_answers` (integer, number of correct answers)
      - `time_taken` (integer, seconds to complete quiz)
      - `passed` (boolean, whether score meets passing threshold)
      - `taken_at` (timestamptz, when quiz was taken)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on quiz_scores
    - Users can only access their own quiz scores
    - Users can insert and view their quiz attempts
*/

CREATE TABLE IF NOT EXISTS quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  time_taken integer NOT NULL DEFAULT 0,
  passed boolean NOT NULL DEFAULT false,
  taken_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz scores"
  ON quiz_scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz scores"
  ON quiz_scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
