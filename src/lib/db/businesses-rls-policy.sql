-- Enable RLS on businesses table
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

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
