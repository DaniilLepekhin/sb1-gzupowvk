/*
  # Course Management Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `course_days`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `day_number` (integer)
      - `title` (text)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read course data
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create course_days table
CREATE TABLE IF NOT EXISTS course_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, day_number)
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_days ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to course days"
  ON course_days
  FOR SELECT
  TO authenticated
  USING (true);