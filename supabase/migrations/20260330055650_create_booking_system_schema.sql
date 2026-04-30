/*
  # Appointment Booking System Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `role` (text) - either 'client' or 'professional'
      - `created_at` (timestamp)
      
    - `professionals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `specialty` (text) - e.g., 'doctor', 'tutor', 'consultant'
      - `bio` (text)
      - `hourly_rate` (numeric)
      - `created_at` (timestamp)
      
    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `duration_minutes` (integer)
      - `created_at` (timestamp)
      
    - `professional_services`
      - `id` (uuid, primary key)
      - `professional_id` (uuid, references professionals)
      - `service_id` (uuid, references services)
      - `price` (numeric)
      - `created_at` (timestamp)
      
    - `time_slots`
      - `id` (uuid, primary key)
      - `professional_id` (uuid, references professionals)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `is_available` (boolean)
      - `created_at` (timestamp)
      
    - `bookings`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `professional_id` (uuid, references professionals)
      - `service_id` (uuid, references services)
      - `time_slot_id` (uuid, references time_slots)
      - `status` (text) - 'pending', 'confirmed', 'cancelled', 'completed'
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for professionals to manage their availability and bookings
    - Add policies for clients to view professionals and create bookings
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('client', 'professional')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create professionals table
CREATE TABLE IF NOT EXISTS professionals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  specialty text NOT NULL,
  bio text DEFAULT '',
  hourly_rate numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view professionals"
  ON professionals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Professionals can update own profile"
  ON professionals FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Professionals can insert own profile"
  ON professionals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  duration_minutes integer NOT NULL DEFAULT 60,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only system can manage services"
  ON services FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Create professional_services table
CREATE TABLE IF NOT EXISTS professional_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(professional_id, service_id)
);

ALTER TABLE professional_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view professional services"
  ON professional_services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Professionals can manage own services"
  ON professional_services FOR ALL
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

-- Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available time slots"
  ON time_slots FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Professionals can manage own time slots"
  ON time_slots FOR ALL
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  professional_id uuid REFERENCES professionals(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  time_slot_id uuid REFERENCES time_slots(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings as client"
  ON bookings FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

CREATE POLICY "Professionals can view bookings for their services"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Professionals can update bookings for their services"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    professional_id IN (
      SELECT id FROM professionals WHERE user_id = auth.uid()
    )
  );

-- Insert default services
INSERT INTO services (name, description, duration_minutes) VALUES
  ('Medical Consultation', 'General medical consultation with a healthcare professional', 30),
  ('Tutoring Session', 'One-on-one educational tutoring session', 60),
  ('Business Consultation', 'Professional business consulting and advisory services', 45),
  ('Legal Consultation', 'Legal advice and consultation services', 60),
  ('Career Counseling', 'Professional career guidance and planning', 45)
ON CONFLICT DO NOTHING;
