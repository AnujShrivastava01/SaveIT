// Script to test database connection and structure
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

console.log("🔍 Looking for Supabase configuration...");
console.log("Environment variables:");
console.log(
  "VITE_SUPABASE_URL:",
  process.env.VITE_SUPABASE_URL ? "Found" : "Not found"
);
console.log(
  "VITE_SUPABASE_ANON_KEY:",
  process.env.VITE_SUPABASE_ANON_KEY ? "Found" : "Not found"
);

// Try to use environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("\n❌ Supabase environment variables not found.");
  console.log("\n📝 To run the migration, you have two options:");
  console.log("\n1. Create a .env file with:");
  console.log("   VITE_SUPABASE_URL=your_supabase_project_url");
  console.log("   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key");
  console.log("\n2. Run the migration manually in Supabase SQL Editor:");
  console.log("   Go to your Supabase project dashboard");
  console.log("   Navigate to SQL Editor");
  console.log("   Run this SQL:");
  console.log("   ALTER TABLE saved_items ADD COLUMN custom_image TEXT;");
  console.log(
    "\n🔗 Your Supabase project dashboard: https://supabase.com/dashboard/projects"
  );
  process.exit(0);
}

console.log("✅ Found Supabase credentials");
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("Testing Supabase connection...");

  try {
    // Test connection by querying the saved_items table
    const { data, error } = await supabase
      .from("saved_items")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Database error:", error);
      return;
    }

    console.log("Connection successful!");
    console.log("Sample data structure:", data?.[0] || "No data found");

    // Check if custom_image column exists by trying to select it
    const { data: testCustomImage, error: customImageError } = await supabase
      .from("saved_items")
      .select("custom_image")
      .limit(1);

    if (customImageError) {
      if (customImageError.message.includes("custom_image")) {
        console.log("❌ custom_image column does NOT exist - migration needed");
      } else {
        console.error("Other error:", customImageError);
      }
    } else {
      console.log("✅ custom_image column exists!");
    }
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

testConnection();
