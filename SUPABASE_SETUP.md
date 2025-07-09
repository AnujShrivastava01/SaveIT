# Supabase Database Setup Guide

## 1. Create Your Supabase Project

1. Go to [https://supabase.com/](https://supabase.com/)
2. Sign up/Sign in and create a new project
3. Choose a project name (e.g., "saveit-app")
4. Select a region closest to you
5. Set a database password
6. Wait for the project to be created

## 2. Get Your Environment Variables

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the **Project URL** and **Project API Key (anon/public)**
3. Update your `.env.local` file with these values

## 3. Create Database Tables

Go to **SQL Editor** in your Supabase dashboard and run these SQL commands:

### Create User Profiles Table

```sql
CREATE TABLE user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read/write their own profile
CREATE POLICY "Users can manage their own profile" ON user_profiles
    FOR ALL USING (clerk_user_id = auth.jwt() ->> 'sub');
```

### Create Saved Items Table

```sql
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

-- Enable RLS
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage their own items
CREATE POLICY "Users can manage their own items" ON saved_items
    FOR ALL USING (user_id IN (
        SELECT id FROM user_profiles WHERE clerk_user_id = auth.jwt() ->> 'sub'
    ));
```

### Create Functions for Better Performance

```sql
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
```

## 4. Configure Authentication (Optional)

If you want to use Supabase Auth instead of Clerk:

1. Go to **Authentication** → **Settings**
2. Enable your preferred providers (Google, GitHub, etc.)
3. Update your site URL to `http://localhost:8081` for development

## 5. Test Your Setup

1. Update your `.env.local` with the correct Supabase credentials
2. Restart your development server
3. Sign in to your app
4. Try adding a new item
5. Check the Supabase dashboard to see if data is being saved

## 6. Database Schema Summary

### user_profiles

- `id` - Primary key
- `clerk_user_id` - Unique identifier from Clerk
- `email` - User's email
- `name` - User's display name
- `avatar_url` - Profile picture URL
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### saved_items

- `id` - Primary key
- `user_id` - Foreign key to user_profiles
- `title` - Item title
- `content` - URL or text content
- `description` - Optional description
- `tags` - Array of tags
- `category` - Item category (Coding, Study, etc.)
- `type` - Either 'link' or 'text'
- `is_pinned` - Whether item is pinned
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 7. Production Deployment

When deploying to production:

1. Update your environment variables in your hosting platform
2. Update the site URL in Supabase settings
3. Consider upgrading to a paid plan for better performance
4. Set up proper backup strategies

## Troubleshooting

- **Connection issues**: Check your environment variables
- **Permission errors**: Verify RLS policies are correctly set
- **Data not saving**: Check browser console for errors
- **Performance issues**: Ensure indexes are created properly
