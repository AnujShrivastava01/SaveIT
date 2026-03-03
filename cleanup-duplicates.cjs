/**
 * Cleanup Script: Remove duplicate user profiles
 * Keeps the profile with the most items/folders and merges data
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc 
} = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTIONS = {
  USER_PROFILES: 'user_profiles',
  SAVED_ITEMS: 'saved_items',
  CUSTOM_FOLDERS: 'custom_folders',
};

async function cleanupDuplicates() {
  console.log('========================================');
  console.log('  Duplicate User Cleanup');
  console.log('========================================\n');

  // Get all user profiles
  const profilesSnapshot = await getDocs(collection(db, COLLECTIONS.USER_PROFILES));
  const profiles = profilesSnapshot.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));

  console.log(`Found ${profiles.length} total profiles\n`);

  // Group by email
  const byEmail = {};
  profiles.forEach(profile => {
    const email = profile.email?.toLowerCase() || '';
    if (!email) return;
    
    if (!byEmail[email]) {
      byEmail[email] = [];
    }
    byEmail[email].push(profile);
  });

  // Find duplicates
  const duplicates = Object.entries(byEmail).filter(([email, profiles]) => profiles.length > 1);
  
  if (duplicates.length === 0) {
    console.log('✅ No duplicate profiles found!');
    process.exit(0);
  }

  console.log(`Found ${duplicates.length} emails with duplicate profiles:\n`);

  for (const [email, emailProfiles] of duplicates) {
    console.log(`\n📧 ${email} (${emailProfiles.length} profiles)`);
    
    // Get item and folder counts for each profile
    const profilesWithCounts = await Promise.all(emailProfiles.map(async (profile) => {
      const itemsQ = query(collection(db, COLLECTIONS.SAVED_ITEMS), where('user_id', '==', profile.id));
      const itemsSnap = await getDocs(itemsQ);
      
      const foldersQ = query(collection(db, COLLECTIONS.CUSTOM_FOLDERS), where('user_id', '==', profile.id));
      const foldersSnap = await getDocs(foldersQ);
      
      return {
        ...profile,
        itemCount: itemsSnap.size,
        folderCount: foldersSnap.size,
      };
    }));

    // Sort by items + folders (most data first)
    profilesWithCounts.sort((a, b) => (b.itemCount + b.folderCount) - (a.itemCount + a.folderCount));

    console.log('  Profiles:');
    profilesWithCounts.forEach((p, i) => {
      console.log(`    ${i === 0 ? '✓ KEEP' : '✗ DELETE'}: ${p.id} | items: ${p.itemCount}, folders: ${p.folderCount}`);
    });

    const keepProfile = profilesWithCounts[0];
    const deleteProfiles = profilesWithCounts.slice(1);

    // Merge data: Update items and folders from delete profiles to keep profile
    for (const deleteProfile of deleteProfiles) {
      // Update saved_items user_id
      const itemsQ = query(collection(db, COLLECTIONS.SAVED_ITEMS), where('user_id', '==', deleteProfile.id));
      const itemsToUpdate = await getDocs(itemsQ);
      
      for (const itemDoc of itemsToUpdate.docs) {
        await updateDoc(doc(db, COLLECTIONS.SAVED_ITEMS, itemDoc.id), { user_id: keepProfile.id });
      }
      console.log(`    Moved ${itemsToUpdate.size} items from ${deleteProfile.id}`);

      // Update custom_folders user_id
      const foldersQ = query(collection(db, COLLECTIONS.CUSTOM_FOLDERS), where('user_id', '==', deleteProfile.id));
      const foldersToUpdate = await getDocs(foldersQ);
      
      for (const folderDoc of foldersToUpdate.docs) {
        await updateDoc(doc(db, COLLECTIONS.CUSTOM_FOLDERS, folderDoc.id), { user_id: keepProfile.id });
      }
      console.log(`    Moved ${foldersToUpdate.size} folders from ${deleteProfile.id}`);

      // Delete the duplicate profile
      await deleteDoc(doc(db, COLLECTIONS.USER_PROFILES, deleteProfile.id));
      console.log(`    Deleted profile ${deleteProfile.id}`);
    }

    // Update keep profile with latest clerk_user_id if available
    const latestClerkId = profilesWithCounts.find(p => p.clerk_user_id?.startsWith('user_'))?.clerk_user_id;
    if (latestClerkId && keepProfile.clerk_user_id !== latestClerkId) {
      await updateDoc(doc(db, COLLECTIONS.USER_PROFILES, keepProfile.id), {
        clerk_user_id: latestClerkId,
        updated_at: new Date().toISOString(),
      });
      console.log(`    Updated clerk_user_id to ${latestClerkId}`);
    }
  }

  console.log('\n✅ Cleanup complete!');
  
  // Final count
  const finalSnapshot = await getDocs(collection(db, COLLECTIONS.USER_PROFILES));
  console.log(`\nFinal profile count: ${finalSnapshot.size}`);
  
  process.exit(0);
}

cleanupDuplicates().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
