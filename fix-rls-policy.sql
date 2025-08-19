-- Fix RLS policy for custom_folders table
-- Run this in your Supabase SQL Editor

-- First, drop the existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own folders" ON custom_folders;

-- Create a simpler, more permissive policy for testing
CREATE POLICY "Allow all operations for authenticated users" ON custom_folders
    FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: If the above doesn't work, try this even more permissive policy
-- DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON custom_folders;
-- CREATE POLICY "Allow all operations" ON custom_folders
--     FOR ALL USING (true);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'custom_folders';
