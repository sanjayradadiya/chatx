-- Create backup tables for user data

-- Backup table for auth.users
CREATE TABLE IF NOT EXISTS backup_users (
  id UUID PRIMARY KEY,
  instance_id UUID,
  email TEXT,
  raw_user_meta_data JSONB,
  raw_app_meta_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  phone TEXT,
  confirmation_token TEXT,
  email_confirmed_at TIMESTAMP WITH TIME ZONE,
  recovery_token TEXT,
  reauthentication_token TEXT,
  is_super_admin BOOLEAN,
  is_sso_user BOOLEAN
);

-- Create function to backup user and delete user data
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get current user ID
  current_user_id := auth.uid();
  
  -- Backup user from auth.users
  INSERT INTO backup_users (id, instance_id, email, raw_user_meta_data, raw_app_meta_data, created_at, updated_at, deleted_at, last_sign_in_at, phone, confirmation_token, email_confirmed_at, recovery_token, reauthentication_token, is_super_admin, is_sso_user)
  SELECT id, instance_id, email, raw_user_meta_data, raw_app_meta_data, created_at, updated_at, now(), last_sign_in_at, phone, confirmation_token, email_confirmed_at, recovery_token, reauthentication_token, is_super_admin, is_sso_user
  FROM auth.users
  WHERE id = current_user_id;
  
  -- Delete from daily_chat_creation
  DELETE FROM daily_chat_creation
  WHERE user_id = current_user_id;
  
  -- Delete from user_subscriptions
  DELETE FROM user_subscriptions
  WHERE user_id = current_user_id;
  
  -- Delete from chat_messages
  DELETE FROM chat_messages
  WHERE user_id = current_user_id;
  
  -- Delete from chat_sessions
  DELETE FROM chat_sessions
  WHERE user_id = current_user_id;
  
  -- Delete any files in storage associated with the user
  DELETE FROM storage.objects
  WHERE owner = current_user_id;
  
  -- Finally, delete the user from auth.users
  DELETE FROM auth.users
  WHERE id = current_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated; 