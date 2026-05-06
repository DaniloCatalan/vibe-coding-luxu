-- ============================================================
-- Fix: Add RLS policies to allow admins to manage properties
-- ============================================================

-- First, ensure RLS is enabled on the properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Everyone can read properties
CREATE POLICY "Anyone can read properties"
  ON public.properties
  FOR SELECT
  USING (true);

-- Only admins can insert properties
CREATE POLICY "Admins can insert properties"
  ON public.properties
  FOR INSERT
  WITH CHECK (public.is_admin());

-- Only admins can update properties
CREATE POLICY "Admins can update properties"
  ON public.properties
  FOR UPDATE
  USING (public.is_admin());

-- Only admins can delete properties
CREATE POLICY "Admins can delete properties"
  ON public.properties
  FOR DELETE
  USING (public.is_admin());
