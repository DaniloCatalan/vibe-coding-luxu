-- ============================================================
-- Run this SQL in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ribyjdpwthkdulcxfxcw/sql/new
-- ============================================================

-- 1. Add missing columns to the properties table
ALTER TABLE properties 
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS year_built integer,
  ADD COLUMN IF NOT EXISTS parking integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'for-sale';

-- 2. Backfill status from type/badge for existing rows
UPDATE properties 
SET status = CASE 
  WHEN type = 'rent' THEN 'for-rent'
  WHEN badge = 'Sold' THEN 'sold'
  ELSE 'for-sale'
END
WHERE status IS NULL;

-- ============================================================
-- After running the SQL, create a Storage bucket:
-- Go to: Storage > New Bucket
-- Name: property-images
-- Make it PUBLIC (toggle on)
-- ============================================================

-- Optional: Allow authenticated uploads to the bucket
-- (Run after bucket is created)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('property-images', 'property-images', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;
