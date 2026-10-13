/**
 * Firestore Database Seeder Script
 * Usage: node scripts/seed-firestore.js
 * Automatically seeds specifications, features, and gallery collections into Firestore.
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');

// Read environment from .env.local or .env
function loadEnv() {
  const envPath = fs.existsSync('.env.local') ? '.env.local' : fs.existsSync('.env') ? '.env' : null;
  if (!envPath) {
    console.error('❌ Error: No .env.local or .env file found. Please create .env.local with your Firebase credentials.');
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
  console.error('❌ Error: NEXT_PUBLIC_FIREBASE_API_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID missing in .env.local');
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Data payloads
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

async function seed() {
  console.log(`🚀 Connecting to Firebase project "${firebaseConfig.projectId}"...`);

  // Seed specs
  for (const s of specifications) {
    await setDoc(doc(db, 'specifications', s.id), s);
    console.log(`  ✓ Seeded specification: ${s.title}`);
  }

  // Seed features
  for (const f of features) {
    await setDoc(doc(db, 'features', f.id), f);
    console.log(`  ✓ Seeded feature: ${f.title}`);
  }

  // Seed gallery
  for (const g of gallery) {
    await setDoc(doc(db, 'gallery', g.id), g);
    console.log(`  ✓ Seeded gallery item: ${g.title}`);
  }

  console.log('\n✅ Firestore database successfully seeded with all live data!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
