import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes("your_supabase") &&
  !supabaseAnonKey.includes("your_supabase");

if (!isSupabaseConfigured) {
  console.warn("Supabase not configured - using demo mode");
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database table names
export const TABLES = {
  SAVED_ITEMS: "saved_items",
  USER_PROFILES: "user_profiles",
  CUSTOM_FOLDERS: "custom_folders",
};

// Types for TypeScript
export interface SavedItem {
  id: string;
  user_id: string;
  title: string;
  content: string;
  description?: string;
  tags: string[];
  category: string;
  type: "link" | "text";
  is_pinned: boolean;
  custom_image?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  clerk_user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomFolder {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}
