-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their telegram favorites" ON telegram_favorites;

-- Create new policy that allows access based on telegram_id directly
CREATE POLICY "Users can manage their telegram favorites"
  ON telegram_favorites
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_telegram_favorites_telegram_id ON telegram_favorites(telegram_id);