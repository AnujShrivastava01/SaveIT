import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  createSavedItem,
  getUserSavedItems,
  updateSavedItem,
  deleteSavedItem,
  toggleItemPin,
  searchSavedItems,
  getItemsByCategory,
  createUserProfile,
  getUserProfile,
  createCustomFolder,
  getUserCustomFolders,
  updateCustomFolder,
  deleteCustomFolder,
} from "../services/database";
import { SavedItem, CustomFolder, supabase } from "../utils/supabase";
import { useToast } from "./use-toast";
import { mockDatabase } from "../services/mockDatabase";

export const useDatabase = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [customFolders, setCustomFolders] = useState<CustomFolder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user profile and load items
  useEffect(() => {
    if (user) {
      initializeUser();
      loadItems();
      loadCustomFolders();
    }
  }, [user]);

  const initializeUser = async () => {
    if (!user) return;

    try {
      // Try to get existing profile
      await getUserProfile(user.id);
    } catch (error) {
      // If profile doesn't exist, create it
      try {
        await createUserProfile(
          user.id,
          user.emailAddresses[0]?.emailAddress || "",
          user.fullName || user.firstName || ""
        );
      } catch (createError) {
        console.error("Error creating user profile");
      }
    }
  };

  const loadItems = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Use mock data if Supabase is not configured
      if (!supabase) {
        const data = await mockDatabase.getUserSavedItems();
        setItems(data);
        setError(null);
        toast({
          title: "Demo Mode",
          description: "Using demo data. Set up Supabase to save real data.",
        });
      } else {
        const data = await getUserSavedItems(user.id);
        setItems(data || []);
        setError(null);
      }
    } catch (err) {
      setError("Failed to load items");
      console.error("Error loading items");
    } finally {
      setLoading(false);
    }
  };

  const loadCustomFolders = async () => {
    if (!user) return;

    try {
      if (!supabase) {
        // In demo mode, return empty array for custom folders
        setCustomFolders([]);
      } else {
        const data = await getUserCustomFolders(user.id);
        setCustomFolders(data || []);
      }
    } catch (err) {
      console.error("Error loading custom folders");
      setCustomFolders([]);
    }
  };

  const addItem = async (
    item: Omit<SavedItem, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return;

    try {
      // Use mock data if Supabase is not configured
      if (!supabase) {
        const newItem = await mockDatabase.createSavedItem({
          ...item,
          user_id: user.id,
        });
        setItems((prev) => [newItem, ...prev]);
        toast({
          title: "Success",
          description: "Item saved successfully! (Demo mode)",
        });
        return newItem;
      } else {
        const newItem = await createSavedItem(user.id, item);
        setItems((prev) => [newItem, ...prev]);
        toast({
          title: "Success",
          description: "Item saved successfully!",
        });
        return newItem;
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateItem = async (itemId: string, updates: Partial<SavedItem>) => {
    try {
      // Use mock data if Supabase is not configured
      if (!supabase) {
        const updatedItem = await mockDatabase.updateSavedItem(itemId, updates);
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, ...updatedItem } : item
          )
        );
        toast({
          title: "Success",
          description: "Item updated successfully! (Demo mode)",
        });
        return updatedItem;
      } else {
        const updatedItem = await updateSavedItem(itemId, updates);
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, ...updatedItem } : item
          )
        );
        toast({
          title: "Success",
          description: "Item updated successfully!",
        });
        return updatedItem;
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      // Use mock data if Supabase is not configured
      if (!supabase) {
        await mockDatabase.deleteSavedItem(itemId);
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        toast({
          title: "Success",
          description: "Item deleted successfully! (Demo mode)",
        });
      } else {
        await deleteSavedItem(itemId);
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        toast({
          title: "Success",
          description: "Item deleted successfully!",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      console.error("Error deleting item");
      throw err;
    }
  };

  const togglePin = async (itemId: string, isPinned: boolean) => {
    try {
      // Use mock data if Supabase is not configured
      if (!supabase) {
        await mockDatabase.updateSavedItem(itemId, { is_pinned: isPinned });
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, is_pinned: isPinned } : item
          )
        );
        toast({
          title: "Success",
          description: isPinned
            ? "Item pinned! (Demo mode)"
            : "Item unpinned! (Demo mode)",
        });
      } else {
        await toggleItemPin(itemId, isPinned);
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, is_pinned: isPinned } : item
          )
        );
        toast({
          title: "Success",
          description: isPinned ? "Item pinned!" : "Item unpinned!",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update pin status",
        variant: "destructive",
      });
      console.error("Error toggling pin");
      throw err;
    }
  };

  const searchItems = async (query: string) => {
    if (!user) return [];

    try {
      const results = await searchSavedItems(user.id, query);
      return results || [];
    } catch (err) {
      console.error("Error searching items");
      return [];
    }
  };

  const getByCategory = async (category: string) => {
    if (!user) return [];

    try {
      const results = await getItemsByCategory(user.id, category);
      return results || [];
    } catch (err) {
      console.error("Error getting items by category");
      return [];
    }
  };

  // Custom Folder Functions
  const addCustomFolder = async (folder: { name: string; icon?: string; color?: string }) => {
    if (!user) return;

    try {
      if (!supabase) {
        toast({
          title: "Demo Mode",
          description: "Custom folders not available in demo mode",
          variant: "destructive",
        });
        return;
      }

      const newFolder = await createCustomFolder(user.id, folder);
      setCustomFolders((prev) => [...prev, newFolder]);
      toast({
        title: "Success",
        description: "Custom folder created successfully!",
      });
      return newFolder;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create custom folder",
        variant: "destructive",
      });
      console.error("Error creating custom folder");
      throw err;
    }
  };

  const updateCustomFolderLocal = async (folderId: string, updates: { name?: string; icon?: string; color?: string }) => {
    if (!user) return;

    try {
      if (!supabase) {
        toast({
          title: "Demo Mode",
          description: "Custom folders not available in demo mode",
          variant: "destructive",
        });
        return;
      }

      const updatedFolder = await updateCustomFolder(folderId, updates, user.id);
      
      // Update local state for folders
      setCustomFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId ? { ...folder, ...updatedFolder } : folder
        )
      );

      // If folder name was updated, reload items to get the updated categories
      if (updates.name) {
        await loadItems();
      }

      toast({
        title: "Success",
        description: "Custom folder updated successfully!",
      });
      return updatedFolder;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update custom folder",
        variant: "destructive",
      });
      console.error("Error updating custom folder");
      throw err;
    }
  };

  const deleteCustomFolderLocal = async (folderId: string) => {
    if (!user) return;

    try {
      if (!supabase) {
        toast({
          title: "Demo Mode",
          description: "Custom folders not available in demo mode",
          variant: "destructive",
        });
        return;
      }

      await deleteCustomFolder(folderId);
      setCustomFolders((prev) => prev.filter((folder) => folder.id !== folderId));
      toast({
        title: "Success",
        description: "Custom folder deleted successfully!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete custom folder",
        variant: "destructive",
      });
      console.error("Error deleting custom folder");
      throw err;
    }
  };

  return {
    items,
    customFolders,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    togglePin,
    searchItems,
    getByCategory,
    addCustomFolder,
    updateCustomFolder: updateCustomFolderLocal,
    deleteCustomFolder: deleteCustomFolderLocal,
    refreshItems: loadItems,
    loadItems, // Export loadItems so it can be called externally
  };
};
