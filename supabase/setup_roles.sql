-- 1. Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'agent', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can read their own role
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Users can read own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all roles
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
CREATE POLICY "Admins can read all roles"
  ON public.user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update roles
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert roles (if needed)
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Trigger to automatically create a user role when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_role();

-- 5. Secure Function to fetch all users (only accessible to admins)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::VARCHAR,
    COALESCE(ur.role, 'user') as role,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Secure Function to update a user's role
CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id UUID, new_role TEXT)
RETURNS void AS $$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;

  -- Update or insert the role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Backfill existing users with the default role 'user'
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
