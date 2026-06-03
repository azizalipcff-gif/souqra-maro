-- Add role field to profiles table for admin access control
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' CHECK (role IN ('client', 'business_owner', 'admin'));

-- Add index for role queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
