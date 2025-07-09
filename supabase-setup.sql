-- SaveIt Database Setup SQL
-- Run this in your Supabase SQL Editor

-- Create User Profiles Table
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read/write their own profile
CREATE POLICY "Users can manage their own profile" ON user_profiles
    FOR ALL USING (clerk_user_id = auth.jwt() ->> 'sub');

-- Create Saved Items Table
CREATE TABLE saved_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    category TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('link', 'text')),
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX idx_saved_items_category ON saved_items(category);
CREATE INDEX idx_saved_items_created_at ON saved_items(created_at DESC);
CREATE INDEX idx_saved_items_is_pinned ON saved_items(is_pinned);

-- Enable RLS for saved_items
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own items
CREATE POLICY "Users can manage their own items" ON saved_items
    FOR ALL USING (user_id IN (
        SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_items_updated_at BEFORE UPDATE ON saved_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
