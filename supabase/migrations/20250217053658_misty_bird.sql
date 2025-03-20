/*
  # Fix Telegram ID handling

  1. Changes
    - Modify telegram_id column in telegram_favorites to use text instead of bigint
    - This ensures consistent ID handling across all platforms
    - Preserves existing data by converting to text
*/

-- Temporarily disable RLS
ALTER TABLE telegram_favorites DISABLE ROW LEVEL SECURITY;

-- Create temporary column
ALTER TABLE telegram_favorites 
ADD COLUMN telegram_id_text text;

-- Copy data with conversion
UPDATE telegram_favorites 
SET telegram_id_text = telegram_id::text;

-- Drop old column and rename new one
ALTER TABLE telegram_favorites 
DROP COLUMN telegram_id;

ALTER TABLE telegram_favorites 
RENAME COLUMN telegram_id_text TO telegram_id;

-- Add NOT NULL constraint and index
ALTER TABLE telegram_favorites 
ALTER COLUMN telegram_id SET NOT NULL;

DROP INDEX IF EXISTS idx_telegram_favorites_telegram_id;
CREATE INDEX idx_telegram_favorites_telegram_id ON telegram_favorites(telegram_id);

-- Re-enable RLS
ALTER TABLE telegram_favorites ENABLE ROW LEVEL SECURITY;