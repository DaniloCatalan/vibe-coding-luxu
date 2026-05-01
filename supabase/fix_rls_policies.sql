-- ============================================================
-- FIX: Infinite recursion in user_roles RLS policies
-- ============================================================
-- The previous policies used EXISTS (SELECT FROM user_roles) inside
-- a policy ON user_roles — causing infinite recursion.
-- The fix is to use a SECURITY DEFINER function that bypasses RLS
-- to safely check if the current user is an admin.
-- ============================================================

-- 1. Create a helper function that checks admin status WITHOUT triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. Drop all old broken policies
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

-- 3. Recreate policies using the helper function (no more recursion)

-- Users can always read their own role
CREATE POLICY "Users can read own role"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read ALL roles (uses helper function, not recursive query)
CREATE POLICY "Admins can read all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.is_admin());

-- Admins can update any role
CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.is_admin());

-- Trigger function can insert (SECURITY DEFINER bypasses RLS already)
-- But we also allow service role inserts. Keep this permissive for the trigger:
DROP POLICY IF EXISTS "Allow trigger to insert roles" ON public.user_roles;
CREATE POLICY "Allow trigger to insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- FIX: Ambiguous column "role" in get_all_users function
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::VARCHAR,
    COALESCE(ur.role, 'user')::TEXT as role,  -- explicitly qualify ur.role
    u.created_at
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FIX: set_user_role also uses the helper function now
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id UUID, new_role TEXT)
RETURNS void AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: User is not an admin';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Verify: Check your current user's role (should be 'admin')
-- Replace the email below with your own!
-- ============================================================
-- SELECT ur.role FROM public.user_roles ur
-- JOIN auth.users u ON u.id = ur.user_id
-- WHERE u.email = 'tu_correo@ejemplo.com';
