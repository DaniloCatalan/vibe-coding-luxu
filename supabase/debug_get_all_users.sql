CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id UUID,
  email VARCHAR,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  _is_admin boolean;
  _uid uuid;
BEGIN
  _uid := auth.uid();

  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _uid AND public.user_roles.role = 'admin'
  ) INTO _is_admin;

  IF NOT _is_admin THEN
    RAISE EXCEPTION 'Access denied: User % is not an admin', _uid;
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::VARCHAR,
    COALESCE(ur.role, 'user')::TEXT as role,
    u.created_at
  FROM auth.users u
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
