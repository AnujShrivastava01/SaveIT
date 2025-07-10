// Script to test database operations
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log("❌ Supabase environment variables not found.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseOperations() {
  console.log("🧪 Testing database operations...");

  try {
    // First, let's see if we can read data
    console.log("\n1. Testing READ operation...");
    const { data: items, error: readError } = await supabase
      .from("saved_items")
      .select("*")
      .limit(1);

    if (readError) {
      console.error("❌ Read error:", readError);
      return;
    }

    console.log("✅ Read successful");

    if (items && items.length > 0) {
      const testItem = items[0];
      console.log("Found test item:", testItem.id, testItem.title);

      // Now test UPDATE operation
      console.log("\n2. Testing UPDATE operation...");
      const { data: updatedData, error: updateError } = await supabase
        .from("saved_items")
        .update({
          custom_image: "https://example.com/test.png",
          updated_at: new Date().toISOString(),
        })
        .eq("id", testItem.id)
        .select()
        .single();

      if (updateError) {
        console.error("❌ Update error:", updateError);
        console.error("Error details:", JSON.stringify(updateError, null, 2));
      } else {
        console.log("✅ Update successful");
        console.log("Updated item:", updatedData);

        // Revert the change
        console.log("\n3. Reverting test change...");
        const { error: revertError } = await supabase
          .from("saved_items")
          .update({
            custom_image: testItem.custom_image,
            updated_at: testItem.updated_at,
          })
          .eq("id", testItem.id);

        if (revertError) {
          console.error("❌ Revert error:", revertError);
        } else {
          console.log("✅ Test completed and reverted");
        }
      }
    } else {
      console.log("No items found to test with");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

testDatabaseOperations();
