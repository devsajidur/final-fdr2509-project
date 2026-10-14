// Seeds specifications, features and gallery into Firestore.
// Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/seed-firestore.js

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const fs = require('fs');

function loadEnv() {
  const envPath = fs.existsSync('.env.local') ? '.env.local' : fs.existsSync('.env') ? '.env' : null;
  if (!envPath) {
    console.error('Error: No .env.local or .env file found. Please create .env.local with your Firebase credentials.');
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

const env = loadEnv();

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Error: NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID missing in .env.local');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const specifications = [
  {
    id: 'spec-1',
    title: 'Engine',
    primaryDetail: 'Mack MP8 13L Engine',
    secondaryDetail: 'Up to 505 HP',
    iconType: 'engine'
  },
  {
    id: 'spec-2',
    title: 'Fuel Economy',
    primaryDetail: 'Up to 8.5 MPG',
    secondaryDetail: 'Highway driving',
    iconType: 'fuel'
  },
  {
    id: 'spec-3',
    title: 'GVWR',
    primaryDetail: '80,000 lbs',
    secondaryDetail: 'Maximum capacity',
    iconType: 'gvwr'
  },
  {
    id: 'spec-4',
    title: 'Wheelbase',
    primaryDetail: 'Multiple Options',
    secondaryDetail: '189" - 280"',
    iconType: 'wheelbase'
  }
];

const features = [
  {
    id: 'feature-1',
    title: 'Safety First',
    description: 'Advanced safety systems including collision mitigation and lane departure warning',
    iconType: 'safety'
  },
  {
    id: 'feature-2',
    title: 'Connected',
    description: 'GuardDog Connect telematics for real-time monitoring and diagnostics',
    iconType: 'connected'
  },
  {
    id: 'feature-3',
    title: 'Driver Comfort',
    description: 'Spacious cab with premium seating and intuitive controls',
    iconType: 'comfort'
  }
];

const gallery = [
  {
    id: 'gallery-interior',
    title: 'Cabin Interior',
    alt: 'Mack Anthem modern truck cabin interior with dashboard and steering wheel',
    src: '/images/mack-interior.png',
    width: 389.33,
    height: 218.98,
    aspectClass: 'aspect-[389.33/218.98]'
  },
  {
    id: 'gallery-engine',
    title: 'Engine Compartment',
    alt: 'Mack MP8 13L engine compartment showing high-performance mechanical powertrain',
    src: '/images/mack-engine.png',
    width: 389.33,
    height: 218.98,
    aspectClass: 'aspect-[389.33/218.98]'
  },
  {
    id: 'gallery-rear',
    title: 'Rear Exterior',
    alt: 'Rear view of Mack truck showing dual rear axles, taillights, and trailer linkage on highway',
    src: '/images/mack-rear.png',
    width: 389.34,
    height: 219.0,
    aspectClass: 'aspect-[389.34/219]'
  }
];

async function authenticateAdmin() {
  const adminEmail = env.ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.warn('ADMIN_EMAIL / ADMIN_PASSWORD not set; seeding without admin sign-in.');
    return null;
  }

  console.log(`Signing in as ${adminEmail}...`);
  try {
    const cred = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    return cred.user;
  } catch (err) {
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        console.log(`Admin user does not exist yet. Creating account for ${adminEmail}...`);
        const cred = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
        return cred.user;
      } catch (createErr) {
        console.warn(`Could not create admin via client auth: ${createErr.message}`);
      }
    } else {
      console.warn(`Admin sign-in returned: ${err.message}`);
    }
  }
  return null;
}

async function seed() {
  console.log(`Connecting to Firebase project "${firebaseConfig.projectId}"...`);

  const adminUser = await authenticateAdmin();
  if (adminUser) {
    await setDoc(
      doc(db, 'users', adminUser.uid),
      {
        uid: adminUser.uid,
        email: adminUser.email,
        displayName: 'Mack Corporate Operations',
        role: 'admin',
        company: 'Mack Trucks North America Inc.',
        phone: '+1 (800) 866-1177',
        fleetSize: 'OEM Operations',
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`  ✓ Admin role verified for ${adminUser.email}`);
  }

  for (const s of specifications) {
    await setDoc(doc(db, 'specifications', s.id), s);
    console.log(`  ✓ Seeded specification: ${s.title}`);
  }

  for (const f of features) {
    await setDoc(doc(db, 'features', f.id), f);
    console.log(`  ✓ Seeded feature: ${f.title}`);
  }

  for (const g of gallery) {
    await setDoc(doc(db, 'gallery', g.id), g);
    console.log(`  ✓ Seeded gallery item: ${g.title}`);
  }

  console.log('\nFirestore seeded.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
