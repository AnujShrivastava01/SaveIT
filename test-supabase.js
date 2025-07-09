import { supabase } from "./src/utils/supabase.ts";

// Simple test script to verify Supabase connection
async function testSupabaseConnection() {
  console.log("Testing Supabase connection...");

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from("user_profiles")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
    } else {
      console.log("Supabase connection successful!", data);
    }
  } catch (err) {
    console.error("Connection test failed:", err);
  }
}

testSupabaseConnection();
