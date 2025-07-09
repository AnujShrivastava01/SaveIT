import { SavedItem } from "../utils/supabase";

// Mock data for when Supabase is not configured
const mockItems: SavedItem[] = [
  {
    id: "1",
    user_id: "demo",
    title: "React Documentation",
    content: "https://reactjs.org/docs",
    description: "Official React documentation and guides",
    tags: ["react", "javascript", "documentation"],
    category: "Coding",
    type: "link",
    is_pinned: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "demo",
    title: "TypeScript Tips",
    content:
      "Remember to use strict mode and enable all compiler checks for better type safety.",
    description: "Personal notes about TypeScript best practices",
    tags: ["typescript", "tips", "development"],
    category: "Study",
    type: "text",
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockDatabase = {
  items: [...mockItems],

  getUserSavedItems: async (): Promise<SavedItem[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockDatabase.items]), 500);
    });
  },

  createSavedItem: async (
    item: Omit<SavedItem, "id" | "created_at" | "updated_at">
  ): Promise<SavedItem> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem: SavedItem = {
          ...item,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockDatabase.items.push(newItem);
        resolve(newItem);
      }, 300);
    });
  },

  updateSavedItem: async (
    id: string,
    updates: Partial<SavedItem>
  ): Promise<SavedItem> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDatabase.items.findIndex((item) => item.id === id);
        if (index === -1) {
          reject(new Error("Item not found"));
          return;
        }

        mockDatabase.items[index] = {
          ...mockDatabase.items[index],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        resolve(mockDatabase.items[index]);
      }, 300);
    });
  },

  deleteSavedItem: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockDatabase.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          mockDatabase.items.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  },
};
