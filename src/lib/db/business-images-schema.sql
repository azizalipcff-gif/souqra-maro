-- Add logo_url and cover_url fields to businesses table
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Add indexes for image URL queries
CREATE INDEX IF NOT EXISTS businesses_logo_url_idx ON businesses(logo_url);
CREATE INDEX IF NOT EXISTS businesses_cover_url_idx ON businesses(cover_url);
