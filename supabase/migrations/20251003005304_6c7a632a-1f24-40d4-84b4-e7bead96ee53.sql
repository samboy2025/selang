-- Fix search_path for follower count functions
CREATE OR REPLACE FUNCTION public.get_follower_count(_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.followers
  WHERE following_id = _user_id
$$;

CREATE OR REPLACE FUNCTION public.get_following_count(_user_id UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.followers
  WHERE follower_id = _user_id
$$;