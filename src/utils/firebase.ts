import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is properly configured
export const isFirebaseConfigured =
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.apiKey.includes("your-") &&
  !firebaseConfig.projectId.includes("your-");

if (!isFirebaseConfigured) {
  console.warn("Firebase not configured - using demo mode");
}

// Initialize Firebase
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;

// Collection names
export const COLLECTIONS = {
  SAVED_ITEMS: "saved_items",
  USER_PROFILES: "user_profiles",
  CUSTOM_FOLDERS: "custom_folders",
};

// Types for TypeScript
export interface SavedItem {
  id?: string;
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
  id?: string;
  clerk_user_id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomFolder {
  id?: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
}
