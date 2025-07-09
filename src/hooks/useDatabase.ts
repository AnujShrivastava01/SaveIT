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
} from "../services/database";
import { SavedItem, supabase } from "../utils/supabase";
import { useToast } from "./use-toast";
import { mockDatabase } from "../services/mockDatabase";

export const useDatabase = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user profile and load items
  useEffect(() => {
    if (user) {
      initializeUser();
      loadItems();
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
        console.error("Error creating user profile:", createError);
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
      console.error("Error loading items:", err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    item: Omit<SavedItem, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    if (!user) return;

    try {
      console.log("Adding item with user ID:", user.id);
      console.log("Item data:", item);
      console.log("Supabase configured:", !!supabase);

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
      console.error("Detailed error:", err);
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      });
      console.error("Error adding item:", err);
      throw err;
    }
  };

  const updateItem = async (itemId: string, updates: Partial<SavedItem>) => {
    try {
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
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
      console.error("Error updating item:", err);
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
      console.error("Error deleting item:", err);
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
      console.error("Error toggling pin:", err);
      throw err;
    }
  };

  const searchItems = async (query: string) => {
    if (!user) return [];

    try {
      const results = await searchSavedItems(user.id, query);
      return results || [];
    } catch (err) {
      console.error("Error searching items:", err);
      return [];
    }
  };

  const getByCategory = async (category: string) => {
    if (!user) return [];

    try {
      const results = await getItemsByCategory(user.id, category);
      return results || [];
    } catch (err) {
      console.error("Error getting items by category:", err);
      return [];
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    togglePin,
    searchItems,
    getByCategory,
    refreshItems: loadItems,
    loadItems, // Export loadItems so it can be called externally
  };
};
