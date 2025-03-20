/*
  # Add Telegram favorites support
  
  1. Changes
    - Add telegram_favorites table to store favorites by Telegram ID
    - Add RLS policies for secure access
    
  2. Security
    - Enable RLS
    - Add policy for users to manage their own favorites
*/

CREATE TABLE IF NOT EXISTS telegram_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id bigint NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(telegram_id, course_id)
);

ALTER TABLE telegram_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their telegram favorites"
  ON telegram_favorites
  FOR ALL
  TO authenticated
  USING (telegram_id::text = current_setting('app.current_telegram_id', true))
  WITH CHECK (telegram_id::text = current_setting('app.current_telegram_id', true));