/*
  # Create application responses table

  1. New Tables
    - `application_responses`
      - `id` (uuid, primary key)
      - `name` (text, applicant name)
      - `email` (text, applicant email)
      - `city` (text, applicant city)
      - `profession` (text, applicant profession)
      - `past_events` (jsonb, array of attended event IDs)
      - `motivation` (text, answer to motivation question)
      - `community_meaning` (text, answer to community meaning question)
      - `collaboration_story` (text, answer to collaboration question)
      - `current_projects` (text, answer to growth/projects question)
      - `contribution_plans` (text, answer to contribution question)
      - `evaluation_score` (numeric, AI evaluation score)
      - `evaluation_feedback` (text, AI evaluation feedback)
      - `evaluation_breakdown` (jsonb, detailed score breakdown)
      - `ai_detected` (boolean, whether AI content was detected)
      - `status` (text, application status: pending, approved, rejected)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `application_responses` table
    - Add policy for public to insert applications
    - Add policy for authenticated users to view own applications
    - Add policy for admin users to view all applications
*/

CREATE TABLE IF NOT EXISTS application_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  city text,
  profession text,
  past_events jsonb DEFAULT '[]'::jsonb,
  motivation text NOT NULL,
  community_meaning text NOT NULL,
  collaboration_story text NOT NULL,
  current_projects text NOT NULL,
  contribution_plans text NOT NULL,
  evaluation_score numeric,
  evaluation_feedback text,
  evaluation_breakdown jsonb,
  ai_detected boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE application_responses ENABLE ROW LEVEL SECURITY;

-- Policy for anyone to submit applications
CREATE POLICY "Anyone can submit applications"
  ON application_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy for applicants to view their own applications (by email)
CREATE POLICY "Applicants can view own applications"
  ON application_responses
  FOR SELECT
  TO public
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy for authenticated users to view applications (for admin purposes)
CREATE POLICY "Authenticated users can view all applications"
  ON application_responses
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for authenticated users to update applications (for evaluation)
CREATE POLICY "Authenticated users can update applications"
  ON application_responses
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_application_responses_email ON application_responses(email);
CREATE INDEX IF NOT EXISTS idx_application_responses_status ON application_responses(status);
CREATE INDEX IF NOT EXISTS idx_application_responses_created_at ON application_responses(created_at);

-- Enable realtime for application responses
ALTER TABLE application_responses REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE application_responses;