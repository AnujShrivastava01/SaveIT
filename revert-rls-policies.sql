-- Revert RLS policies to restore data access
-- Run this in your Supabase SQL Editor

-- Drop all restrictive policies
DROP POLICY IF EXISTS "Users can manage their own folders" ON custom_folders;
DROP POLICY IF EXISTS "Users can manage their own items" ON saved_items;
DROP POLICY IF EXISTS "Users can manage their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow all operations" ON custom_folders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON custom_folders;

-- Temporarily disable RLS to restore access
ALTER TABLE custom_folders DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('custom_folders', 'saved_items', 'user_profiles');

-- Check that no policies remain
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('custom_folders', 'saved_items', 'user_profiles')
ORDER BY tablename, policyname;

