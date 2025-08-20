import { supabase, TABLES, SavedItem, UserProfile, CustomFolder } from "../utils/supabase";

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
    console.error("Error creating user profile");
    throw error;
  }
  return data;
};

export const getUserProfile = async (clerkUserId: string) => {
  checkSupabaseConfig();

  const { data, error } = await supabase!
    .from(TABLES.USER_PROFILES)
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error) {
    throw error;
  }
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
    console.error("Supabase error");
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
    console.error("Error updating item");
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

// Custom Folders Functions
export const createCustomFolder = async (
  clerkUserId: string,
  folder: { name: string; icon?: string; color?: string }
) => {
  checkSupabaseConfig();

  // First, get or create the user profile
  let userProfile;
  try {
    userProfile = await getUserProfile(clerkUserId);
  } catch (error) {
    // If profile doesn't exist, create it
    userProfile = await createUserProfile(
      clerkUserId,
      `user-${clerkUserId}@clerk.app`,
      "User"
    );
  }

  const insertData = {
    user_id: userProfile.id,
    name: folder.name,
    icon: folder.icon || "Folder",
    color: folder.color || "bg-gray-500",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase!
    .from(TABLES.CUSTOM_FOLDERS)
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("Error creating custom folder");
    throw error;
  }

  return data;
};

export const getUserCustomFolders = async (clerkUserId: string) => {
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
    .from(TABLES.CUSTOM_FOLDERS)
    .select("*")
    .eq("user_id", userProfile.id)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
};

export const updateCustomFolder = async (
  folderId: string,
  updates: { name?: string; icon?: string; color?: string },
  clerkUserId?: string
) => {
  checkSupabaseConfig();

  // First, get the current folder to know the old name
  const { data: currentFolder, error: fetchError } = await supabase!
    .from(TABLES.CUSTOM_FOLDERS)
    .select("name")
    .eq("id", folderId)
    .single();

  if (fetchError) throw fetchError;

  // Update the folder
  const { data, error } = await supabase!
    .from(TABLES.CUSTOM_FOLDERS)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", folderId)
    .select()
    .single();

  if (error) throw error;

  // If the folder name is being updated and we have the user ID, update all items in that folder
  if (updates.name && currentFolder.name !== updates.name && clerkUserId) {
    try {
      // Get user profile
      const userProfile = await getUserProfile(clerkUserId);
      
      // Update all items that have the old folder name as their category
      const { error: updateItemsError } = await supabase!
        .from(TABLES.SAVED_ITEMS)
        .update({ category: updates.name })
        .eq("user_id", userProfile.id)
        .eq("category", currentFolder.name);

      if (updateItemsError) {
        console.error("Error updating items for renamed folder:", updateItemsError);
        // Don't throw here as the folder was updated successfully
      }
    } catch (profileError) {
      console.error("Error getting user profile for item updates:", profileError);
      // Don't throw here as the folder was updated successfully
    }
  }

  return data;
};

export const deleteCustomFolder = async (folderId: string) => {
  checkSupabaseConfig();

  const { error } = await supabase!
    .from(TABLES.CUSTOM_FOLDERS)
    .delete()
    .eq("id", folderId);

  if (error) throw error;
  return true;
};
