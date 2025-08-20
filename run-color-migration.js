const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase configuration not found. Please check your environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runColorMigration() {
  try {
    console.log('🔄 Running folder color migration...');
    
    // Read the migration SQL
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'update-folder-colors-migration.sql'), 
      'utf8'
    );
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      return;
    }
    
    console.log('✅ Folder color migration completed successfully!');
    console.log('📝 Existing folders have been updated with appropriate colors based on their names.');
    
  } catch (error) {
    console.error('❌ Error running migration:', error);
  }
}

// Run the migration
runColorMigration();
