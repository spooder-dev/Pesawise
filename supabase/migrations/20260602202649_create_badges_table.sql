/*
  # Create Badges Table
  
  1. New Tables
    - `badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `badge_key` (text, badge identifier)
      - `badge_name` (text, display name)
      - `emoji` (text, badge emoji)
      - `description` (text, badge description)
      - `earned_at` (timestamptz, when badge was earned)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on badges
    - Users can only view their own badges
    - Unique constraint: one badge per user per badge_key
*/

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_key text NOT NULL,
  badge_name text NOT NULL,
  emoji text NOT NULL,
  description text,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_key)
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
