-- Add custom_image column to saved_items table
-- Run this in your Supabase SQL Editor

ALTER TABLE saved_items 
ADD COLUMN custom_image TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN saved_items.custom_image IS 'Optional custom image URL for card display';
