import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'client' | 'professional';
  created_at: string;
};

export type Professional = {
  id: string;
  user_id: string;
  specialty: string;
  bio: string;
  hourly_rate: number;
  created_at: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  created_at: string;
};

export type ProfessionalService = {
  id: string;
  professional_id: string;
  service_id: string;
  price: number;
  created_at: string;
};

export type TimeSlot = {
  id: string;
  professional_id: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
};

export type Booking = {
  id: string;
  client_id: string;
  professional_id: string;
  service_id: string;
  time_slot_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  created_at: string;
  updated_at: string;
};
