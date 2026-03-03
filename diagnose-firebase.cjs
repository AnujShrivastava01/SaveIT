/**
 * Diagnostic Script: Check Firebase data
 */

const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function diagnose() {
  console.log('========================================');
  console.log('  Firebase Data Diagnostic');
  console.log('========================================\n');

  // Check user profiles
  console.log('📊 USER PROFILES:');
  const profiles = await db.collection('user_profiles').limit(5).get();
  console.log(`  Total count: ${profiles.size}`);
  profiles.docs.forEach(doc => {
    const data = doc.data();
    console.log(`  - Doc ID: ${doc.id}`);
    console.log(`    clerk_user_id: ${data.clerk_user_id}`);
    console.log(`    email: ${data.email}`);
    console.log(`    Fields: ${Object.keys(data).join(', ')}`);
    console.log('');
  });

  // Check if there's a specific profile for the test user
  console.log('\n🔍 Looking for user: anujshrivastava10e@gmail.com');
  const testUser = await db.collection('user_profiles')
    .where('email', '==', 'anujshrivastava10e@gmail.com')
    .get();
  
  if (!testUser.empty) {
    const profile = testUser.docs[0];
    const profileData = profile.data();
    console.log(`  Found! Doc ID: ${profile.id}`);
    console.log(`  clerk_user_id: ${profileData.clerk_user_id}`);
    
    // Now check saved items for this user
    console.log('\n📦 SAVED ITEMS for this user:');
    const items = await db.collection('saved_items')
      .where('user_id', '==', profile.id)
      .limit(5)
      .get();
    console.log(`  Items count: ${items.size}`);
    items.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.title || 'No title'} (user_id: ${data.user_id})`);
    });

    // Check custom folders
    console.log('\n📁 CUSTOM FOLDERS for this user:');
    const folders = await db.collection('custom_folders')
      .where('user_id', '==', profile.id)
      .limit(5)
      .get();
    console.log(`  Folders count: ${folders.size}`);
    folders.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.name} (user_id: ${data.user_id})`);
    });
  } else {
    console.log('  Not found!');
  }

  // Also check what user_ids are in saved_items
  console.log('\n📋 Sample saved_items user_ids:');
  const sampleItems = await db.collection('saved_items').limit(3).get();
  sampleItems.docs.forEach(doc => {
    const data = doc.data();
    console.log(`  - user_id: ${data.user_id}, title: ${data.title?.substring(0, 30)}...`);
  });

  console.log('\n✅ Diagnostic complete');
}

diagnose().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
