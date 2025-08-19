-- Final RLS policy fix for custom_folders table
-- Run this in your Supabase SQL Editor

-- Drop all existing policies on custom_folders
DROP POLICY IF EXISTS "Users can manage their own folders" ON custom_folders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON custom_folders;
DROP POLICY IF EXISTS "Allow all operations" ON custom_folders;

-- Create a completely permissive policy for testing
CREATE POLICY "Allow all operations" ON custom_folders
    FOR ALL USING (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'custom_folders';

-- Also check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'custom_folders';
