-- Disable all RLS for testing
-- Run this in Supabase SQL Editor

ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items DISABLE ROW LEVEL SECURITY;

-- Test if tables exist and are accessible
SELECT COUNT(*) FROM user_profiles;
SELECT COUNT(*) FROM saved_items;

-- Also check if there are any existing records
SELECT * FROM user_profiles LIMIT 5;
SELECT * FROM saved_items LIMIT 5;
