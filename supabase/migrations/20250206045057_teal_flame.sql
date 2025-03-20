/*
  # Add Telegram ID to users table

  1. Changes
    - Add telegram_id column to users table
    - Add unique constraint on telegram_id
*/

ALTER TABLE users 
ADD COLUMN telegram_id bigint UNIQUE;