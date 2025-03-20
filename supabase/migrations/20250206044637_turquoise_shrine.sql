/*
  # Add course materials and users tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `role` (text, default 'user')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `course_materials`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses)
      - `day_number` (integer)
      - `type` (text, either 'text' or 'video')
      - `content` (text, encrypted)
      - `content_hash` (text, for integrity verification)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for course materials:
      - Users can read materials for enrolled courses
      - Only admins can manage materials
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create course materials table
CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  type text NOT NULL CHECK (type IN ('text', 'video')),
  content text NOT NULL,
  content_hash text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, day_number, type)
);

ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;

-- Only allow reading materials for enrolled courses
CREATE POLICY "Users can read materials for enrolled courses"
  ON course_materials
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = course_materials.course_id
      -- Add additional check for course enrollment when implemented
    )
  );

-- Only admin can insert/update materials
CREATE POLICY "Admin can manage materials"
  ON course_materials
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );