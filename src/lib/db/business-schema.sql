-- SOUQORA Business Database Schema
-- Moroccan Marketplace Platform - Production Ready

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('client', 'business_owner', 'admin')) DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on businesses
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Users can insert their own businesses
DROP POLICY IF EXISTS "Users can insert own businesses" ON businesses;
CREATE POLICY "Users can insert own businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own businesses
DROP POLICY IF EXISTS "Users can view own businesses" ON businesses;
CREATE POLICY "Users can view own businesses"
ON businesses FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own businesses
DROP POLICY IF EXISTS "Users can update own businesses" ON businesses;
CREATE POLICY "Users can update own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own businesses
DROP POLICY IF EXISTS "Users can delete own businesses" ON businesses;
CREATE POLICY "Users can delete own businesses"
ON businesses FOR DELETE
USING (auth.uid() = user_id);

-- Public can view approved businesses
DROP POLICY IF EXISTS "Public can view approved businesses" ON businesses;
CREATE POLICY "Public can view approved businesses"
ON businesses FOR SELECT
USING (approved = TRUE);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_approved ON businesses(approved);

-- ============================================
-- TRIGGER FOR PROFILE CREATION
-- ============================================
-- Automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
