/**
 * Migration Script: Import CSV data from Supabase to Firebase Firestore
 * 
 * Run with: node migrate-to-firebase.js
 * 
 * Prerequisites:
 * 1. Download your Firebase service account key from Firebase Console
 * 2. Save it as 'firebase-service-account.json' in the project root
 * 3. Or set GOOGLE_APPLICATION_CREDENTIALS environment variable
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// Option 1: Using service account file
let serviceAccount;
try {
  serviceAccount = require('./firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  // Option 2: Using environment credentials or emulator
  console.log('No service account file found. Using default credentials...');
  console.log('Create firebase-service-account.json with your Firebase Admin credentials.');
  console.log('\nTo get the service account file:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Click "Generate new private key"');
  console.log('3. Save as firebase-service-account.json in this directory\n');
  process.exit(1);
}

const db = admin.firestore();

// Collection names matching the app
const COLLECTIONS = {
  USER_PROFILES: 'user_profiles',
  SAVED_ITEMS: 'saved_items',
  CUSTOM_FOLDERS: 'custom_folders'
};

// Parse CSV content into array of objects
function parseCSV(content) {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = parseCSVLine(lines[0]);
  const records = [];
  
  let currentRecord = '';
  for (let i = 1; i < lines.length; i++) {
    currentRecord += (currentRecord ? '\n' : '') + lines[i];
    
    // Check if we have a complete record (balanced quotes)
    const quoteCount = (currentRecord.match(/"/g) || []).length;
    if (quoteCount % 2 === 0) {
      try {
        const values = parseCSVLine(currentRecord);
        if (values.length === headers.length) {
          const record = {};
          headers.forEach((header, index) => {
            record[header.trim()] = values[index];
          });
          records.push(record);
        }
      } catch (e) {
        console.warn('Skipping malformed record:', currentRecord.substring(0, 100));
      }
      currentRecord = '';
    }
  }
  
  return records;
}

// Parse a single CSV line, handling quoted values
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
}

// Read and parse CSV file
function readCSV(filename) {
  const filepath = path.join(__dirname, filename);
  if (!fs.existsSync(filepath)) {
    console.error(`File not found: ${filepath}`);
    return [];
  }
  const content = fs.readFileSync(filepath, 'utf-8');
  return parseCSV(content);
}

// Parse tags from string format
function parseTags(tagsStr) {
  if (!tagsStr || tagsStr === '[]') return [];
  try {
    // Try JSON parse first
    const parsed = JSON.parse(tagsStr.replace(/'/g, '"'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Fallback: extract strings from array-like format
    const matches = tagsStr.match(/"([^"]+)"/g);
    return matches ? matches.map(m => m.replace(/"/g, '')) : [];
  }
}

// Main migration function
async function migrate() {
  console.log('========================================');
  console.log('  SaveIT Data Migration to Firebase');
  console.log('========================================\n');

  // Step 1: Read all CSV files
  console.log('📖 Reading CSV files...\n');
  
  const userProfiles = readCSV('user_profiles_rows.csv');
  const savedItems = readCSV('saved_items_rows.csv');
  const customFolders = readCSV('custom_folders_rows.csv');
  
  console.log(`  Found ${userProfiles.length} user profiles`);
  console.log(`  Found ${savedItems.length} saved items`);
  console.log(`  Found ${customFolders.length} custom folders\n`);

  // Create mapping from Supabase user ID to Clerk user ID
  const userIdMapping = {};
  userProfiles.forEach(profile => {
    userIdMapping[profile.id] = profile.clerk_user_id;
  });

  // Step 2: Clear existing data first
  console.log('🗑️  Clearing existing data...');
  const collections = [COLLECTIONS.USER_PROFILES, COLLECTIONS.SAVED_ITEMS, COLLECTIONS.CUSTOM_FOLDERS];
  for (const col of collections) {
    const snapshot = await db.collection(col).get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    if (!snapshot.empty) await batch.commit();
  }
  console.log('  ✅ Cleared existing data\n');

  // Step 3: Migrate User Profiles and track document IDs
  console.log('👤 Migrating user profiles...');
  let profileCount = 0;
  const profileDocIds = {}; // Map: supabase user_id -> firebase doc ID
  
  for (const profile of userProfiles) {
    if (!profile.clerk_user_id) continue;
    
    const docRef = await db.collection(COLLECTIONS.USER_PROFILES).add({
      clerk_user_id: profile.clerk_user_id,
      email: profile.email || '',
      name: profile.name || '',
      avatar_url: profile.avatar_url || '',
      created_at: profile.created_at || new Date().toISOString(),
      updated_at: profile.updated_at || new Date().toISOString()
    });
    
    // Store mapping: supabase UUID -> firebase doc ID
    profileDocIds[profile.id] = docRef.id;
    // Also map clerk_user_id -> firebase doc ID (for items that use clerk_user_id directly)
    profileDocIds[profile.clerk_user_id] = docRef.id;
    
    profileCount++;
    if (profileCount % 10 === 0) {
      process.stdout.write(`  Migrated ${profileCount} profiles...\r`);
    }
  }
  console.log(`  ✅ Migrated ${profileCount} user profiles\n`);

  // Step 4: Migrate Custom Folders
  console.log('📁 Migrating custom folders...');
  let folderCount = 0;
  
  for (const folder of customFolders) {
    const profileDocId = profileDocIds[folder.user_id];
    if (!profileDocId) {
      console.warn(`  ⚠️ Skipping folder ${folder.id}: no matching user found`);
      continue;
    }
    
    await db.collection(COLLECTIONS.CUSTOM_FOLDERS).add({
      user_id: profileDocId,
      name: folder.name || 'Untitled',
      icon: folder.icon || 'Folder',
      color: folder.color || 'bg-blue-500',
      created_at: folder.created_at || new Date().toISOString(),
      updated_at: folder.updated_at || new Date().toISOString()
    });
    
    folderCount++;
    if (folderCount % 10 === 0) {
      process.stdout.write(`  Migrated ${folderCount} folders...\r`);
    }
  }
  console.log(`  ✅ Migrated ${folderCount} custom folders\n`);

  // Step 5: Migrate Saved Items
  console.log('📝 Migrating saved items...');
  let itemCount = 0;
  let skippedCount = 0;
  
  for (const item of savedItems) {
    const profileDocId = profileDocIds[item.user_id];
    if (!profileDocId) {
      skippedCount++;
      continue;
    }
    
    // Handle custom_image - skip if too large (base64)
    let customImage = item.custom_image || '';
    if (customImage.length > 1000000) {
      // Skip images larger than 1MB
      customImage = '';
    }
    
    await db.collection(COLLECTIONS.SAVED_ITEMS).add({
      user_id: profileDocId,
      title: item.title || '',
      content: item.content || '',
      description: item.description || '',
      tags: parseTags(item.tags),
      category: item.category || '',
      type: item.type || 'link',
      is_pinned: item.is_pinned === 'true',
      custom_image: customImage,
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString()
    });
    
    itemCount++;
    if (itemCount % 50 === 0) {
      process.stdout.write(`  Migrated ${itemCount} items...\r`);
    }
  }
  console.log(`  ✅ Migrated ${itemCount} saved items`);
  if (skippedCount > 0) {
    console.log(`  ⚠️ Skipped ${skippedCount} items (no matching user)`);
  }

  console.log('\n========================================');
  console.log('  Migration Complete!');
  console.log('========================================');
  console.log(`\nSummary:`);
  console.log(`  • User Profiles: ${profileCount}`);
  console.log(`  • Custom Folders: ${folderCount}`);
  console.log(`  • Saved Items: ${itemCount}`);
  console.log('\nYour data has been successfully migrated to Firebase Firestore.');
}

// Run migration
migrate()
  .then(() => {
    console.log('\n✨ Migration finished successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
