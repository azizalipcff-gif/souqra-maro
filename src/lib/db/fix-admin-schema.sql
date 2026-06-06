-- Fix admin role in profiles table
-- This ensures the 'admin' role is allowed in the profiles table

-- Step 1: Update role column to include 'admin' in the check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('client', 'business_owner', 'admin'));

-- Step 2: Ensure the profiles table uses auth.users.id as the primary key
-- If the current profiles table uses user_id instead of id, we need to migrate

-- Check if profiles table has user_id column
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'user_id'
    ) THEN
        -- Migration needed: profiles table uses user_id instead of id
        -- Add id column if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'profiles' AND column_name = 'id'
        ) THEN
            ALTER TABLE profiles ADD COLUMN id UUID;
            
            -- Copy user_id to id
            UPDATE profiles SET id = user_id WHERE id IS NULL;
            
            -- Set id as primary key
            ALTER TABLE profiles ADD PRIMARY KEY (id);
            
            -- Drop old foreign key constraint
            ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
            
            -- Add new foreign key constraint
            ALTER TABLE profiles 
            ADD CONSTRAINT profiles_id_fkey 
            FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
            
            -- Drop user_id column
            ALTER TABLE profiles DROP COLUMN IF EXISTS user_id;
        END IF;
    END IF;
END $$;

-- Step 3: Update RLS policies to use id instead of user_id
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
ON profiles FOR DELETE
USING (auth.uid() = id);

-- Step 4: Add admin-specific RLS policy for profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Step 5: Verify the admin user has the correct role
-- Update the specific admin user to have admin role
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'b855cf6c-1c13-4895-9944-78cc7d068a68';

-- Step 6: Add index for role queries if it doesn't exist
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
