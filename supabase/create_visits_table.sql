-- ============================================================
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ribyjdpwthkdulcxfxcw/sql/new
-- ============================================================

-- Create visits table
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id TEXT NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can insert a visit (to capture visitor leads/requests)
DROP POLICY IF EXISTS "Anyone can insert a visit" ON public.visits;
CREATE POLICY "Anyone can insert a visit"
  ON public.visits
  FOR INSERT
  WITH CHECK (true);

-- 2. Users can read their own scheduled visits
DROP POLICY IF EXISTS "Users can read own visits" ON public.visits;
CREATE POLICY "Users can read own visits"
  ON public.visits
  FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Admins and Agents can view all scheduled visits
DROP POLICY IF EXISTS "Admins and agents can view all visits" ON public.visits;
CREATE POLICY "Admins and agents can view all visits"
  ON public.visits
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role IN ('admin', 'agent')
    )
  );
