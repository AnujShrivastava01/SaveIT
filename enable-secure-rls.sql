-- Enable secure RLS for all tables
-- Run this in your Supabase SQL Editor

-- Enable RLS on all tables
ALTER TABLE custom_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create secure policy for custom_folders
CREATE POLICY "Users can manage their own folders" ON custom_folders
    FOR ALL USING (
        user_id IN (
            SELECT id FROM user_profiles 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Create secure policy for saved_items
CREATE POLICY "Users can manage their own items" ON saved_items
    FOR ALL USING (
        user_id IN (
            SELECT id FROM user_profiles 
            WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Create secure policy for user_profiles
CREATE POLICY "Users can manage their own profile" ON user_profiles
    FOR ALL USING (
        clerk_user_id = auth.jwt() ->> 'sub'
    );

-- Verify RLS is enabled and policies are created
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('custom_folders', 'saved_items', 'user_profiles');

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('custom_folders', 'saved_items', 'user_profiles')
ORDER BY tablename, policyname;
