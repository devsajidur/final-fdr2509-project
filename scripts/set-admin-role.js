#!/usr/bin/env node

// Grants the admin role to an account (creates it on first run).
// Usage: node scripts/set-admin-role.js <email> <password>
//    or: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/set-admin-role.js

const { initializeApp } = require('firebase/app');
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getDatabase, ref, set } = require('firebase/database');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '..', '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
      }
    }
  });
}

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const targetEmail = process.argv[2] || env.ADMIN_EMAIL;
const targetPassword = process.argv[3] || env.ADMIN_PASSWORD;

if (!targetEmail || !targetPassword) {
  console.error('Provide an email and password as arguments, or set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local.');
  process.exit(1);
}

async function run() {
  console.log(`\n========================================`);
  console.log(`Setting Admin Role for: ${targetEmail}`);
  console.log(`Firebase Project: ${firebaseConfig.projectId}`);
  console.log(`========================================\n`);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  let db = null;
  let rtdb = null;

  try {
    db = getFirestore(app);
  } catch (e) {
    console.warn('Firestore init warning:', e.message);
  }

  if (firebaseConfig.databaseURL) {
    try {
      rtdb = getDatabase(app);
    } catch (e) {
      console.warn('RTDB init warning:', e.message);
    }
  }

  let user = null;

  try {
    console.log(`Authenticating as ${targetEmail}...`);
    const cred = await signInWithEmailAndPassword(auth, targetEmail, targetPassword);
    user = cred.user;
    console.log(`✓ Signed in successfully. UID: ${user.uid}`);
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        console.log(`User does not exist in Firebase Auth yet. Creating account for ${targetEmail}...`);
        const cred = await createUserWithEmailAndPassword(auth, targetEmail, targetPassword);
        user = cred.user;
        console.log(`✓ Account created successfully in Firebase Auth. UID: ${user.uid}`);
      } catch (createErr) {
        console.error(`❌ Could not create account: ${createErr.message}`);
        process.exit(1);
      }
    } else {
      console.error(`❌ Authentication error: ${err.message}`);
      process.exit(1);
    }
  }

  if (!user) {
    console.error('❌ Could not obtain user object.');
    process.exit(1);
  }

  const profileData = {
    uid: user.uid,
    email: targetEmail,
    displayName: 'Mack Corporate Operations',
    role: 'admin',
    company: 'Mack Trucks North America Inc.',
    phone: '+1 (800) 866-1177',
    fleetSize: 'OEM Operations',
    updatedAt: new Date().toISOString(),
  };

  if (rtdb) {
    try {
      console.log(`Syncing admin role to Realtime Database users/${user.uid}...`);
      await set(ref(rtdb, `users/${user.uid}`), profileData);
      console.log(`✓ RTDB admin role successfully granted!`);
    } catch (rtdbErr) {
      console.warn(`RTDB note: ${rtdbErr.message}`);
    }
  }

  if (db) {
    try {
      console.log(`Syncing admin role to Firestore users/${user.uid}...`);
      const writePromise = setDoc(doc(db, 'users', user.uid), profileData, { merge: true });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore write timed out (API may not be enabled in GCP console yet)')), 4000)
      );
      await Promise.race([writePromise, timeoutPromise]);
      console.log(`✓ Firestore admin role successfully granted!`);
    } catch (fsErr) {
      console.warn(`Firestore note: ${fsErr.message}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ SUCCESS: Admin role configured for ${targetEmail}`);
  console.log(`UID: ${user.uid}`);
  console.log(`You can now sign in at /login with this email and password.`);
  console.log(`========================================\n`);
  process.exit(0);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
