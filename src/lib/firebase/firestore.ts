import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { SpecificationItem, FeatureItemData, GalleryItemData } from '@/types';
import { specificationsContent, featuresContent, galleryContent } from '@/data/site-content';

export interface QuoteSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  selectedEngine: string;
  estimatedPrice: string;
  zipCode?: string;
  submittedAt?: unknown;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt?: unknown;
}

/**
 * 1. Specifications Realtime Subscription
 * If Firebase is configured, listens for real-time document updates.
 * Otherwise, immediately falls back to initial site data.
 */
export function subscribeSpecifications(
  callback: (specs: SpecificationItem[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    callback(specificationsContent.items);
    return () => {};
  }

  const q = query(collection(db, 'specifications'), orderBy('id', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => docSnap.data() as SpecificationItem);
        callback(items);
      } else {
        callback(specificationsContent.items);
      }
    },
    (error) => {
      console.warn('[Firebase] specifications listener error, using fallback:', error);
      callback(specificationsContent.items);
    }
  );
}

/**
 * 2. Key Features Realtime Subscription
 */
export function subscribeFeatures(
  callback: (features: FeatureItemData[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    callback(featuresContent.items);
    return () => {};
  }

  const q = query(collection(db, 'features'), orderBy('id', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => docSnap.data() as FeatureItemData);
        callback(items);
      } else {
        callback(featuresContent.items);
      }
    },
    (error) => {
      console.warn('[Firebase] features listener error, using fallback:', error);
      callback(featuresContent.items);
    }
  );
}

/**
 * 3. Gallery Items Realtime Subscription
 */
export function subscribeGallery(
  callback: (items: GalleryItemData[]) => void
): Unsubscribe {
  if (!isFirebaseConfigured || !db) {
    callback(galleryContent.items);
    return () => {};
  }

  const q = query(collection(db, 'gallery'), orderBy('id', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      if (!snapshot.empty) {
        const items = snapshot.docs.map((docSnap) => docSnap.data() as GalleryItemData);
        callback(items);
      } else {
        callback(galleryContent.items);
      }
    },
    (error) => {
      console.warn('[Firebase] gallery listener error, using fallback:', error);
      callback(galleryContent.items);
    }
  );
}

/**
 * 4. Submit Quote Request to Firestore 'quotes' collection
 */
export async function submitQuoteToFirestore(
  quote: QuoteSubmission
): Promise<{ success: boolean; id: string; isRealtime: boolean }> {
  const quoteId = `quote_${Date.now()}`;

  if (!isFirebaseConfigured || !db) {
    // Save to local localStorage simulation
    try {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('mack_local_quotes') || '[]');
        existing.push({ ...quote, id: quoteId, submittedAt: new Date().toISOString() });
        localStorage.setItem('mack_local_quotes', JSON.stringify(existing));
      }
    } catch {}
    return { success: true, id: quoteId, isRealtime: false };
  }

  try {
    const docRef = doc(db, 'quotes', quoteId);
    await setDoc(docRef, {
      ...quote,
      id: quoteId,
      submittedAt: serverTimestamp(),
    });
    return { success: true, id: quoteId, isRealtime: true };
  } catch (error) {
    console.error('[Firebase] Failed to submit quote to Firestore:', error);
    return { success: false, id: quoteId, isRealtime: false };
  }
}

/**
 * 5. Submit Contact Dealer message to Firestore 'leads' collection
 */
export async function submitContactToFirestore(
  contact: ContactSubmission
): Promise<{ success: boolean; id: string; isRealtime: boolean }> {
  const contactId = `lead_${Date.now()}`;

  if (!isFirebaseConfigured || !db) {
    try {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('mack_local_leads') || '[]');
        existing.push({ ...contact, id: contactId, submittedAt: new Date().toISOString() });
        localStorage.setItem('mack_local_leads', JSON.stringify(existing));
      }
    } catch {}
    return { success: true, id: contactId, isRealtime: false };
  }

  try {
    const docRef = doc(db, 'leads', contactId);
    await setDoc(docRef, {
      ...contact,
      id: contactId,
      submittedAt: serverTimestamp(),
    });
    return { success: true, id: contactId, isRealtime: true };
  } catch (error) {
    console.error('[Firebase] Failed to submit lead to Firestore:', error);
    return { success: false, id: contactId, isRealtime: false };
  }
}

/**
 * 6. Health & Diagnostics Check
 */
export async function checkFirebaseConnection(): Promise<{
  connected: boolean;
  projectId?: string;
  message: string;
}> {
  if (!isFirebaseConfigured || !db) {
    return {
      connected: false,
      message: 'Firebase credentials not found in .env.local (Running in Safe Mock Mode)',
    };
  }

  try {
    // Quick test read
    await getDocs(collection(db, 'specifications'));
    return {
      connected: true,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      message: `Successfully connected to Firestore (${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID})`,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    return {
      connected: false,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      message: `Firestore access error: ${errMessage}`,
    };
  }
}
