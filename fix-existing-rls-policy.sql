-- Fix existing RLS policy for custom_folders table
-- Run this in your Supabase SQL Editor

-- First, drop the existing policy that's causing issues
DROP POLICY IF EXISTS "Users can manage their own folders" ON custom_folders;

-- Also drop any other policies that might exist
DROP POLICY IF EXISTS "Allow all operations" ON custom_folders;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON custom_folders;

-- Create a secure policy that only allows users to manage their own folders
CREATE POLICY "Users can manage their own folders" ON custom_folders
    FOR ALL USING (
        user_id IN (
            SELECT id FROM user_profiles 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'custom_folders';

-- Also check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'custom_folders';
