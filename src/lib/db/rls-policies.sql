-- SOUQORA Row Level Security (RLS) Policies
-- Production-grade security policies for businesses and related tables

-- Enable RLS on all business-related tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES TABLE RLS POLICIES
-- ============================================

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Allow users to insert their own profile (on signup)
CREATE POLICY "Users can create own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update all profiles
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- ============================================
-- PRODUCTS TABLE RLS POLICIES
-- ============================================

-- Allow users to view their own products
CREATE POLICY "Users can view own products"
ON products FOR SELECT
USING (auth.uid() = seller_id);

-- Allow users to insert their own products
CREATE POLICY "Users can create own products"
ON products FOR INSERT
WITH CHECK (auth.uid() = seller_id);

-- Allow users to update their own products
CREATE POLICY "Users can update own products"
ON products FOR UPDATE
USING (auth.uid() = seller_id);

-- Allow users to delete their own products
CREATE POLICY "Users can delete own products"
ON products FOR DELETE
USING (auth.uid() = seller_id);

-- Allow admins to view all products
CREATE POLICY "Admins can view all products"
ON products FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to update all products
CREATE POLICY "Admins can update all products"
ON products FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow admins to delete all products
CREATE POLICY "Admins can delete all products"
ON products FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow public to view all active products
CREATE POLICY "Public can view all products"
ON products FOR SELECT
USING (true);

-- ============================================
-- BUSINESSES TABLE RLS POLICIES
-- ============================================

-- Allow users to read their own businesses
CREATE POLICY "Users can view own businesses"
ON businesses FOR SELECT
USING (auth.uid() = owner_id);

-- Allow users to insert their own businesses
CREATE POLICY "Users can create own businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own businesses
CREATE POLICY "Users can update own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = owner_id);

-- Allow users to delete their own businesses
CREATE POLICY "Users can delete own businesses"
ON businesses FOR DELETE
USING (auth.uid() = owner_id);

-- Allow admins to view all businesses
CREATE POLICY "Admins can view all businesses"
ON businesses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to update all businesses
CREATE POLICY "Admins can update all businesses"
ON businesses FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow admins to delete all businesses
CREATE POLICY "Admins can delete all businesses"
ON businesses FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow public to view approved and active businesses
CREATE POLICY "Public can view approved businesses"
ON businesses FOR SELECT
USING (approved = true AND status = 'active');

-- ============================================
-- BUSINESS_IMAGES TABLE RLS POLICIES
-- ============================================

-- Allow users to view images of their own businesses
CREATE POLICY "Users can view own business images"
ON business_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_images.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to insert images for their own businesses
CREATE POLICY "Users can create images for own businesses"
ON business_images FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_images.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to update images of their own businesses
CREATE POLICY "Users can update own business images"
ON business_images FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_images.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to delete images of their own businesses
CREATE POLICY "Users can delete own business images"
ON business_images FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_images.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow admins to view all business images
CREATE POLICY "Admins can view all business images"
ON business_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow public to view images of approved businesses
CREATE POLICY "Public can view approved business images"
ON business_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_images.business_id
    AND businesses.approved = true
    AND businesses.status = 'active'
  )
);

-- ============================================
-- BUSINESS_SERVICES TABLE RLS POLICIES
-- ============================================

-- Allow users to view services of their own businesses
CREATE POLICY "Users can view own business services"
ON business_services FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_services.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to insert services for their own businesses
CREATE POLICY "Users can create services for own businesses"
ON business_services FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_services.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to update services of their own businesses
CREATE POLICY "Users can update own business services"
ON business_services FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_services.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to delete services of their own businesses
CREATE POLICY "Users can delete own business services"
ON business_services FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_services.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow admins to view all business services
CREATE POLICY "Admins can view all business services"
ON business_services FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow public to view services of approved businesses
CREATE POLICY "Public can view approved business services"
ON business_services FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_services.business_id
    AND businesses.approved = true
    AND businesses.status = 'active'
  )
);

-- ============================================
-- BUSINESS_TAGS TABLE RLS POLICIES
-- ============================================

-- Allow users to view tags of their own businesses
CREATE POLICY "Users can view own business tags"
ON business_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_tags.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to insert tags for their own businesses
CREATE POLICY "Users can create tags for own businesses"
ON business_tags FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_tags.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to delete tags of their own businesses
CREATE POLICY "Users can delete own business tags"
ON business_tags FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_tags.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow admins to view all business tags
CREATE POLICY "Admins can view all business tags"
ON business_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow public to view tags of approved businesses
CREATE POLICY "Public can view approved business tags"
ON business_tags FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_tags.business_id
    AND businesses.approved = true
    AND businesses.status = 'active'
  )
);

-- ============================================
-- BUSINESS_HOURS TABLE RLS POLICIES
-- ============================================

-- Allow users to view hours of their own businesses
CREATE POLICY "Users can view own business hours"
ON business_hours FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_hours.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to insert hours for their own businesses
CREATE POLICY "Users can create hours for own businesses"
ON business_hours FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_hours.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to update hours of their own businesses
CREATE POLICY "Users can update own business hours"
ON business_hours FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_hours.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow users to delete hours of their own businesses
CREATE POLICY "Users can delete own business hours"
ON business_hours FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_hours.business_id
    AND businesses.owner_id = auth.uid()
  )
);

-- Allow admins to view all business hours
CREATE POLICY "Admins can view all business hours"
ON business_hours FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Allow public to view hours of approved businesses
CREATE POLICY "Public can view approved business hours"
ON business_hours FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM businesses
    WHERE businesses.id = business_hours.business_id
    AND businesses.approved = true
    AND businesses.status = 'active'
  )
);
