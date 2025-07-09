import { supabase, TABLES, SavedItem, UserProfile } from "../utils/supabase";

// Helper function to check if Supabase is configured
const checkSupabaseConfig = () => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Please set up your environment variables."
    );
  }
};

// User Profile Functions
export const createUserProfile = async (
  clerkUserId: string,
  email: string,
  name?: string
) => {
  checkSupabaseConfig();

  const { data, error } = await supabase!
    .from(TABLES.USER_PROFILES)
    .insert([
      {
        clerk_user_id: clerkUserId,
        email,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
  return data;
};

export const getUserProfile = async (clerkUserId: string) => {
  checkSupabaseConfig();

  console.log("Getting profile for clerk user:", clerkUserId);

  const { data, error } = await supabase!
    .from(TABLES.USER_PROFILES)
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) {
    console.log("Get profile error:", error);
    throw error;
  }
  console.log("Profile found:", data);
  return data;
};

// Saved Items Functions
export const createSavedItem = async (
  clerkUserId: string,
  item: Omit<SavedItem, "id" | "user_id" | "created_at" | "updated_at">
) => {
  checkSupabaseConfig();

  // First, get or create the user profile
  let userProfile;
  try {
    userProfile = await getUserProfile(clerkUserId);
  } catch (error) {
    // If profile doesn't exist, create it with a proper email
    userProfile = await createUserProfile(
      clerkUserId,
      `user-${clerkUserId}@clerk.app`,
      "User"
    );
  }

  const { data, error } = await supabase!
    .from(TABLES.SAVED_ITEMS)
    .insert([
      {
        user_id: userProfile.id,
        ...item,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }
  return data;
};

export const getUserSavedItems = async (clerkUserId: string) => {
  checkSupabaseConfig();

  // First, get the user profile
  let userProfile;
  try {
    userProfile = await getUserProfile(clerkUserId);
  } catch (error) {
    // If profile doesn't exist, return empty array
    return [];
  }

  const { data, error } = await supabase!
    .from(TABLES.SAVED_ITEMS)
    .select("*")
    .eq("user_id", userProfile.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const updateSavedItem = async (
  itemId: string,
  updates: Partial<SavedItem>
) => {
  checkSupabaseConfig();

  const { data, error } = await supabase!
    .from(TABLES.SAVED_ITEMS)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
  return data;
};

export const deleteSavedItem = async (itemId: string) => {
  checkSupabaseConfig();

  const { error } = await supabase!
    .from(TABLES.SAVED_ITEMS)
    .delete()
    .eq("id", itemId);

  if (error) throw error;
  return true;
};

export const toggleItemPin = async (itemId: string, isPinned: boolean) => {
  return updateSavedItem(itemId, { is_pinned: isPinned });
};

// Search Functions
export const searchSavedItems = async (userId: string, query: string) => {
  const { data, error } = await supabase
    .from(TABLES.SAVED_ITEMS)
    .select("*")
    .eq("user_id", userId)
    .or(
      `title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getItemsByCategory = async (userId: string, category: string) => {
  const { data, error } = await supabase
    .from(TABLES.SAVED_ITEMS)
    .select("*")
    .eq("user_id", userId)
    .eq("category", category)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
