import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db, COLLECTIONS, SavedItem, UserProfile, CustomFolder, isFirebaseConfigured } from "../utils/firebase";

// Helper function to check if Firebase is configured
const checkFirebaseConfig = () => {
  if (!db || !isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Please set up your environment variables."
    );
  }
};

// User Profile Functions
export const createUserProfile = async (
  clerkUserId: string,
  email: string,
  name?: string,
  avatarUrl?: string
): Promise<UserProfile> => {
  checkFirebaseConfig();

  const profile: Omit<UserProfile, "id"> = {
    clerk_user_id: clerkUserId,
    email,
    name,
    avatar_url: avatarUrl,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db!, COLLECTIONS.USER_PROFILES), profile);
  return { id: docRef.id, ...profile };
};

export const getUserProfile = async (clerkUserId: string): Promise<UserProfile> => {
  checkFirebaseConfig();

  const q = query(
    collection(db!, COLLECTIONS.USER_PROFILES),
    where("clerk_user_id", "==", clerkUserId)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("User profile not found");
  }

  const profileDoc = snapshot.docs[0];
  return { id: profileDoc.id, ...profileDoc.data() } as UserProfile;
};

export const getUserProfileByEmail = async (email: string): Promise<UserProfile | null> => {
  checkFirebaseConfig();

  const q = query(
    collection(db!, COLLECTIONS.USER_PROFILES),
    where("email", "==", email)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const profileDoc = snapshot.docs[0];
  return { id: profileDoc.id, ...profileDoc.data() } as UserProfile;
};

export const updateUserProfileClerkId = async (profileId: string, clerkUserId: string, avatarUrl?: string): Promise<void> => {
  checkFirebaseConfig();

  const updateData: Record<string, string> = {
    clerk_user_id: clerkUserId,
    updated_at: new Date().toISOString(),
  };
  
  if (avatarUrl) {
    updateData.avatar_url = avatarUrl;
  }

  await updateDoc(doc(db!, COLLECTIONS.USER_PROFILES, profileId), updateData);
};

export const updateUserProfileAvatar = async (clerkUserId: string, avatarUrl: string): Promise<void> => {
  checkFirebaseConfig();

  const q = query(
    collection(db!, COLLECTIONS.USER_PROFILES),
    where("clerk_user_id", "==", clerkUserId)
  );
  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const profileDoc = snapshot.docs[0];
    await updateDoc(doc(db!, COLLECTIONS.USER_PROFILES, profileDoc.id), {
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    });
  }
};

// Saved Items Functions
export const createSavedItem = async (
  clerkUserId: string,
  item: Omit<SavedItem, "id" | "user_id" | "created_at" | "updated_at">
): Promise<SavedItem> => {
  checkFirebaseConfig();

  // First, get or create the user profile
  let userProfile: UserProfile;
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

  const savedItem: Omit<SavedItem, "id"> = {
    user_id: userProfile.id!,
    ...item,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db!, COLLECTIONS.SAVED_ITEMS), savedItem);
  return { id: docRef.id, ...savedItem };
};

export const getUserSavedItems = async (clerkUserId: string): Promise<SavedItem[]> => {
  checkFirebaseConfig();

  // First, get the user profile
  let userProfile: UserProfile;
  try {
    userProfile = await getUserProfile(clerkUserId);
  } catch (error) {
    // If profile doesn't exist, return empty array
    return [];
  }

  const q = query(
    collection(db!, COLLECTIONS.SAVED_ITEMS),
    where("user_id", "==", userProfile.id)
  );
  const snapshot = await getDocs(q);

  // Sort client-side to avoid index requirements
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SavedItem));
  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const updateSavedItem = async (
  itemId: string,
  updates: Partial<SavedItem>
): Promise<SavedItem | null> => {
  checkFirebaseConfig();

  const docRef = doc(db!, COLLECTIONS.SAVED_ITEMS, itemId);
  const updateData = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await updateDoc(docRef, updateData);

  // Fetch and return the updated item
  const updatedDoc = await getDoc(docRef);
  if (!updatedDoc.exists()) return null;

  return { id: updatedDoc.id, ...updatedDoc.data() } as SavedItem;
};

export const deleteSavedItem = async (itemId: string): Promise<boolean> => {
  checkFirebaseConfig();

  const docRef = doc(db!, COLLECTIONS.SAVED_ITEMS, itemId);
  await deleteDoc(docRef);
  return true;
};

export const toggleItemPin = async (itemId: string, isPinned: boolean): Promise<SavedItem | null> => {
  return updateSavedItem(itemId, { is_pinned: isPinned });
};

// Search Functions (basic implementation - Firestore doesn't have full-text search)
export const searchSavedItems = async (userId: string, searchQuery: string): Promise<SavedItem[]> => {
  checkFirebaseConfig();

  // Get user profile first
  let userProfile: UserProfile;
  try {
    userProfile = await getUserProfile(userId);
  } catch (error) {
    return [];
  }

  // Get all user items and filter client-side (Firestore limitation)
  const items = await getUserSavedItems(userId);
  const lowerQuery = searchQuery.toLowerCase();

  return items.filter(
    (item) =>
      item.title?.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.content?.toLowerCase().includes(lowerQuery)
  );
};

export const getItemsByCategory = async (userId: string, category: string): Promise<SavedItem[]> => {
  checkFirebaseConfig();

  // Get user profile first
  let userProfile: UserProfile;
  try {
    userProfile = await getUserProfile(userId);
  } catch (error) {
    return [];
  }

  const q = query(
    collection(db!, COLLECTIONS.SAVED_ITEMS),
    where("user_id", "==", userProfile.id),
    where("category", "==", category)
  );
  const snapshot = await getDocs(q);

  // Sort client-side to avoid index requirements
  const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SavedItem));
  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

// Custom Folders Functions
export const createCustomFolder = async (
  clerkUserId: string,
  folder: { name: string; icon?: string; color?: string }
): Promise<CustomFolder> => {
  checkFirebaseConfig();

  // First, get or create the user profile
  let userProfile: UserProfile;
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

  const customFolder: Omit<CustomFolder, "id"> = {
    user_id: userProfile.id!,
    name: folder.name,
    icon: folder.icon || "Folder",
    color: folder.color || "bg-gray-500",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db!, COLLECTIONS.CUSTOM_FOLDERS), customFolder);
  return { id: docRef.id, ...customFolder };
};

export const getUserCustomFolders = async (clerkUserId: string): Promise<CustomFolder[]> => {
  checkFirebaseConfig();

  // First, get the user profile
  let userProfile: UserProfile;
  try {
    userProfile = await getUserProfile(clerkUserId);
  } catch (error) {
    // If profile doesn't exist, return empty array
    return [];
  }

  const q = query(
    collection(db!, COLLECTIONS.CUSTOM_FOLDERS),
    where("user_id", "==", userProfile.id)
  );
  const snapshot = await getDocs(q);

  // Sort client-side to avoid index requirements
  const folders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CustomFolder));
  return folders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
};

export const updateCustomFolder = async (
  folderId: string,
  updates: { name?: string; icon?: string; color?: string },
  clerkUserId?: string
): Promise<CustomFolder | null> => {
  checkFirebaseConfig();

  const docRef = doc(db!, COLLECTIONS.CUSTOM_FOLDERS, folderId);

  // First, get the current folder to know the old name
  const currentDoc = await getDoc(docRef);
  if (!currentDoc.exists()) {
    throw new Error("Folder not found");
  }

  const currentFolder = { id: currentDoc.id, ...currentDoc.data() } as CustomFolder;

  const updateData = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  await updateDoc(docRef, updateData);

  // If the folder name is being updated and we have the user ID, update all items in that folder
  if (updates.name && currentFolder.name !== updates.name && clerkUserId) {
    try {
      // Get user profile
      const userProfile = await getUserProfile(clerkUserId);

      // Find all items with the old category name
      const itemsQuery = query(
        collection(db!, COLLECTIONS.SAVED_ITEMS),
        where("user_id", "==", userProfile.id),
        where("category", "==", currentFolder.name)
      );
      const itemsSnapshot = await getDocs(itemsQuery);

      // Batch update all items
      const batch = writeBatch(db!);
      itemsSnapshot.docs.forEach((itemDoc) => {
        batch.update(itemDoc.ref, { category: updates.name });
      });
      await batch.commit();
    } catch (profileError) {
      console.error("Error getting user profile for item updates:", profileError);
      // Don't throw here as the folder was updated successfully
    }
  }

  // Fetch and return the updated folder
  const updatedDoc = await getDoc(docRef);
  if (!updatedDoc.exists()) return null;

  return { id: updatedDoc.id, ...updatedDoc.data() } as CustomFolder;
};

export const deleteCustomFolder = async (folderId: string): Promise<boolean> => {
  checkFirebaseConfig();

  const docRef = doc(db!, COLLECTIONS.CUSTOM_FOLDERS, folderId);
  await deleteDoc(docRef);
  return true;
};

// Re-export types for convenience
export type { SavedItem, UserProfile, CustomFolder } from "../utils/firebase";
