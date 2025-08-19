-- Temporarily disable RLS to test authentication
-- Run this in your Supabase SQL Editor

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can manage their own folders" ON custom_folders;
DROP POLICY IF EXISTS "Allow all operations" ON custom_folders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON custom_folders;

-- Temporarily disable RLS on custom_folders table
ALTER TABLE custom_folders DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'custom_folders';

-- Check if any policies remain
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'custom_folders';
