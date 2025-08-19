-- Add custom_folders table to store user-created folders
-- Run this in your Supabase SQL Editor

-- Create custom_folders table
CREATE TABLE custom_folders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'Folder',
    color TEXT DEFAULT 'bg-gray-500',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create indexes for better performance
CREATE INDEX idx_custom_folders_user_id ON custom_folders(user_id);
CREATE INDEX idx_custom_folders_name ON custom_folders(name);

-- Enable RLS for custom_folders
ALTER TABLE custom_folders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own folders
CREATE POLICY "Users can manage their own folders" ON custom_folders
    FOR ALL USING (user_id IN (
        SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_custom_folders_updated_at BEFORE UPDATE ON custom_folders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment to document the table
COMMENT ON TABLE custom_folders IS 'Stores user-created custom folders for organizing saved items';
COMMENT ON COLUMN custom_folders.name IS 'Folder name (unique per user)';
COMMENT ON COLUMN custom_folders.icon IS 'Icon name for the folder (e.g., Folder, Code, BookOpen)';
COMMENT ON COLUMN custom_folders.color IS 'CSS color class for the folder (e.g., bg-gray-500)';
