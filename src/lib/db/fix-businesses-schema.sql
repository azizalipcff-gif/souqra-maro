-- Fix businesses table schema to match app requirements
-- This migration updates the businesses table to use the simplified schema

-- Step 1: Add new columns (if they don't exist)
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 2: Migrate data from old columns to new columns
UPDATE businesses 
SET user_id = owner_id 
WHERE user_id IS NULL AND owner_id IS NOT NULL;

UPDATE businesses 
SET business_name = name 
WHERE business_name IS NULL AND name IS NOT NULL;

UPDATE businesses 
SET description = short_description 
WHERE description IS NULL AND short_description IS NOT NULL;

-- Step 3: Make new columns NOT NULL after migration
-- First, drop the old foreign key constraint
ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_owner_id_fkey;

-- Add new foreign key constraint to auth.users
ALTER TABLE businesses 
ADD CONSTRAINT businesses_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 4: Drop old columns (after verifying data migration)
ALTER TABLE businesses DROP COLUMN IF EXISTS owner_id;
ALTER TABLE businesses DROP COLUMN IF EXISTS name;
ALTER TABLE businesses DROP COLUMN IF EXISTS slug;
ALTER TABLE businesses DROP COLUMN IF EXISTS short_description;
ALTER TABLE businesses DROP COLUMN IF EXISTS full_description;
ALTER TABLE businesses DROP COLUMN IF EXISTS neighborhood;
ALTER TABLE businesses DROP COLUMN IF EXISTS address;
ALTER TABLE businesses DROP COLUMN IF EXISTS email;
ALTER TABLE businesses DROP COLUMN IF EXISTS whatsapp;
ALTER TABLE businesses DROP COLUMN IF EXISTS website;
ALTER TABLE businesses DROP COLUMN IF EXISTS instagram;
ALTER TABLE businesses DROP COLUMN IF EXISTS facebook;
ALTER TABLE businesses DROP COLUMN IF EXISTS status;
ALTER TABLE businesses DROP COLUMN IF EXISTS verified;
ALTER TABLE businesses DROP COLUMN IF EXISTS featured;
ALTER TABLE businesses DROP COLUMN IF EXISTS rating;
ALTER TABLE businesses DROP COLUMN IF EXISTS views;

-- Step 5: Set new columns as NOT NULL
ALTER TABLE businesses ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE businesses ALTER COLUMN business_name SET NOT NULL;
ALTER TABLE businesses ALTER COLUMN category SET NOT NULL;
ALTER TABLE businesses ALTER COLUMN city SET NOT NULL;
ALTER TABLE businesses ALTER COLUMN phone SET NOT NULL;

-- Step 6: Add logo_url and cover_url columns if they don't exist
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Step 7: Recreate RLS policies for the updated schema
DROP POLICY IF EXISTS "Users can insert own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update own businesses" ON businesses;
DROP POLICY IF EXISTS "Users can delete own businesses" ON businesses;
DROP POLICY IF EXISTS "Public can view approved businesses" ON businesses;

-- Policy: Allow public read access to approved businesses
CREATE POLICY "Public can view approved businesses"
ON businesses
FOR SELECT
USING (approved = true);

-- Policy: Allow authenticated users to insert their own businesses
CREATE POLICY "Users can insert own businesses"
ON businesses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow business owners to update their own businesses
CREATE POLICY "Users can update own businesses"
ON businesses
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow business owners to delete their own businesses
CREATE POLICY "Users can delete own businesses"
ON businesses
FOR DELETE
USING (auth.uid() = user_id);
