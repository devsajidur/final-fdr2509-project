/**
 * Firebase Realtime Database (RTDB) Seeder Script
 * Usage: node scripts/seed-rtdb.js
 */

const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set } = require('firebase/database');
const fs = require('fs');

function loadEnv() {
  const envPath = fs.existsSync('.env.local') ? '.env.local' : fs.existsSync('.env') ? '.env' : null;
  if (!envPath) {
    console.error('❌ Error: No .env.local file found.');
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
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
};

const app = initializeApp(firebaseConfig);
const rtdb = getDatabase(app);

const payload = {
  specifications: {
    'spec-1': {
      id: 'spec-1',
      title: 'Engine',
      primaryDetail: 'Mack MP8 13L Engine',
      secondaryDetail: 'Up to 505 HP',
      iconType: 'engine'
    },
    'spec-2': {
      id: 'spec-2',
      title: 'Fuel Economy',
      primaryDetail: 'Up to 8.5 MPG',
      secondaryDetail: 'Highway driving',
      iconType: 'fuel'
    },
    'spec-3': {
      id: 'spec-3',
      title: 'GVWR',
      primaryDetail: '80,000 lbs',
      secondaryDetail: 'Maximum capacity',
      iconType: 'gvwr'
    },
    'spec-4': {
      id: 'spec-4',
      title: 'Wheelbase',
      primaryDetail: 'Multiple Options',
      secondaryDetail: '189" - 280"',
      iconType: 'wheelbase'
    }
  },
  features: {
    'feature-1': {
      id: 'feature-1',
      title: 'Safety First',
      description: 'Advanced safety systems including collision mitigation and lane departure warning',
      iconType: 'safety'
    },
    'feature-2': {
      id: 'feature-2',
      title: 'Connected',
      description: 'GuardDog Connect telematics for real-time monitoring and diagnostics',
      iconType: 'connected'
    },
    'feature-3': {
      id: 'feature-3',
      title: 'Driver Comfort',
      description: 'Spacious cab with premium seating and intuitive controls',
      iconType: 'comfort'
    }
  },
  gallery: {
    'gallery-1': {
      id: 'gallery-interior',
      title: 'Cabin Interior',
      alt: 'Mack Anthem modern truck cabin interior with dashboard and steering wheel',
      src: '/images/mack-interior.png',
      width: 389.33,
      height: 218.98,
      aspectClass: 'aspect-[389.33/218.98]'
    },
    'gallery-2': {
      id: 'gallery-engine',
      title: 'Engine Compartment',
      alt: 'Mack MP8 13L engine compartment showing high-performance mechanical powertrain',
      src: '/images/mack-engine.png',
      width: 389.33,
      height: 218.98,
      aspectClass: 'aspect-[389.33/218.98]'
    },
    'gallery-3': {
      id: 'gallery-rear',
      title: 'Rear Exterior',
      alt: 'Rear view of Mack truck showing dual rear axles, taillights, and trailer linkage on highway',
      src: '/images/mack-rear.png',
      width: 389.34,
      height: 219.0,
      aspectClass: 'aspect-[389.34/219]'
    }
  }
};

async function seed() {
  console.log(`🚀 Seeding Realtime Database at: ${firebaseConfig.databaseURL}...`);
  try {
    await set(ref(rtdb, 'specifications'), payload.specifications);
    console.log('  ✓ Seeded specifications');
    await set(ref(rtdb, 'features'), payload.features);
    console.log('  ✓ Seeded features');
    await set(ref(rtdb, 'gallery'), payload.gallery);
    console.log('  ✓ Seeded gallery');
    console.log('\n✅ Realtime Database successfully seeded!');
    process.exit(0);
  } catch (err) {
    if (err.message && err.message.includes('PERMISSION_DENIED')) {
      console.error('\n⚠️  PERMISSION DENIED by Realtime Database rules.');
      console.error('👉 Please go to Firebase Console -> Realtime Database -> Rules tab, and allow read/write:');
      console.error('   Copy and paste the rules from "database.rules.json" into the Rules tab and click Publish!');
    } else {
      console.error('❌ Seeding failed:', err.message);
    }
    process.exit(1);
  }
}

seed();
