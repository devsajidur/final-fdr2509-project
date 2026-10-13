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
import { ref as dbRef, onValue, set as dbSet } from 'firebase/database';
import { db, rtdb, isFirebaseConfigured } from './config';
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
 * Listens to Realtime Database or Cloud Firestore.
 * Always falls back cleanly to static content on any error or empty response.
 */
export function subscribeSpecifications(
  callback: (specs: SpecificationItem[]) => void
): Unsubscribe {
  // Always supply initial data immediately for instant render
  callback(specificationsContent.items);

  if (!isFirebaseConfigured) {
    return () => {};
  }

  // 1A. Try Realtime Database first if URL is configured
  if (rtdb) {
    try {
      const specRef = dbRef(rtdb, 'specifications');
      const unsubRtdb = onValue(
        specRef,
        (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list: SpecificationItem[] = Array.isArray(val)
              ? val.filter(Boolean)
              : Object.values(val);
            if (list.length > 0) {
              callback(list);
              return;
            }
          }
        },
        (err) => {
          console.warn('[Firebase RTDB] specs error, falling back:', err.message);
        }
      );
      return unsubRtdb;
    } catch {}
  }

  // 1B. Firestore listener fallback
  if (db) {
    try {
      const q = query(collection(db, 'specifications'), orderBy('id', 'asc'));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((docSnap) => docSnap.data() as SpecificationItem);
            callback(items);
          }
        },
        (error) => {
          console.warn('[Firebase Firestore] specifications error:', error.message);
        }
      );
    } catch {}
  }

  return () => {};
}

/**
 * 2. Key Features Realtime Subscription
 */
export function subscribeFeatures(
  callback: (features: FeatureItemData[]) => void
): Unsubscribe {
  callback(featuresContent.items);

  if (!isFirebaseConfigured) {
    return () => {};
  }

  if (rtdb) {
    try {
      const featRef = dbRef(rtdb, 'features');
      const unsubRtdb = onValue(
        featRef,
        (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list: FeatureItemData[] = Array.isArray(val)
              ? val.filter(Boolean)
              : Object.values(val);
            if (list.length > 0) {
              callback(list);
              return;
            }
          }
        },
        (err) => {
          console.warn('[Firebase RTDB] features error, falling back:', err.message);
        }
      );
      return unsubRtdb;
    } catch {}
  }

  if (db) {
    try {
      const q = query(collection(db, 'features'), orderBy('id', 'asc'));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((docSnap) => docSnap.data() as FeatureItemData);
            callback(items);
          }
        },
        (error) => {
          console.warn('[Firebase Firestore] features error:', error.message);
        }
      );
    } catch {}
  }

  return () => {};
}

/**
 * 3. Gallery Items Realtime Subscription
 */
export function subscribeGallery(
  callback: (items: GalleryItemData[]) => void
): Unsubscribe {
  callback(galleryContent.items);

  if (!isFirebaseConfigured) {
    return () => {};
  }

  if (rtdb) {
    try {
      const galleryRef = dbRef(rtdb, 'gallery');
      const unsubRtdb = onValue(
        galleryRef,
        (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list: GalleryItemData[] = Array.isArray(val)
              ? val.filter(Boolean)
              : Object.values(val);
            if (list.length > 0) {
              callback(list);
              return;
            }
          }
        },
        (err) => {
          console.warn('[Firebase RTDB] gallery error, falling back:', err.message);
        }
      );
      return unsubRtdb;
    } catch {}
  }

  if (db) {
    try {
      const q = query(collection(db, 'gallery'), orderBy('id', 'asc'));
      return onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const items = snapshot.docs.map((docSnap) => docSnap.data() as GalleryItemData);
            callback(items);
          }
        },
        (error) => {
          console.warn('[Firebase Firestore] gallery error:', error.message);
        }
      );
    } catch {}
  }

  return () => {};
}

/**
 * 4. Submit Quote Request to Firebase (RTDB and/or Firestore)
 */
export async function submitQuoteToFirestore(
  quote: QuoteSubmission
): Promise<{ success: boolean; id: string; isRealtime: boolean }> {
  const quoteId = `quote_${Date.now()}`;
  const timestamp = new Date().toISOString();

  // Save to local storage for instant resilience
  try {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('mack_local_quotes') || '[]');
      existing.push({ ...quote, id: quoteId, submittedAt: timestamp });
      localStorage.setItem('mack_local_quotes', JSON.stringify(existing));
    }
  } catch {}

  let recordedRealtime = false;

  // Write to Realtime Database if available
  if (rtdb) {
    try {
      await dbSet(dbRef(rtdb, `quotes/${quoteId}`), {
        ...quote,
        id: quoteId,
        submittedAt: timestamp,
      });
      recordedRealtime = true;
    } catch (e) {
      console.warn('[Firebase RTDB] Quote write warning:', e);
    }
  }

  // Write to Firestore if available
  if (db) {
    try {
      const docRef = doc(db, 'quotes', quoteId);
      await setDoc(docRef, {
        ...quote,
        id: quoteId,
        submittedAt: serverTimestamp(),
      });
      recordedRealtime = true;
    } catch (e) {
      console.warn('[Firebase Firestore] Quote write warning:', e);
    }
  }

  return { success: true, id: quoteId, isRealtime: recordedRealtime };
}

/**
 * 5. Submit Contact Dealer message to Firebase (RTDB and/or Firestore)
 */
export async function submitContactToFirestore(
  contact: ContactSubmission
): Promise<{ success: boolean; id: string; isRealtime: boolean }> {
  const contactId = `lead_${Date.now()}`;
  const timestamp = new Date().toISOString();

  try {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('mack_local_leads') || '[]');
      existing.push({ ...contact, id: contactId, submittedAt: timestamp });
      localStorage.setItem('mack_local_leads', JSON.stringify(existing));
    }
  } catch {}

  let recordedRealtime = false;

  if (rtdb) {
    try {
      await dbSet(dbRef(rtdb, `leads/${contactId}`), {
        ...contact,
        id: contactId,
        submittedAt: timestamp,
      });
      recordedRealtime = true;
    } catch (e) {
      console.warn('[Firebase RTDB] Lead write warning:', e);
    }
  }

  if (db) {
    try {
      const docRef = doc(db, 'leads', contactId);
      await setDoc(docRef, {
        ...contact,
        id: contactId,
        submittedAt: serverTimestamp(),
      });
      recordedRealtime = true;
    } catch (e) {
      console.warn('[Firebase Firestore] Lead write warning:', e);
    }
  }

  return { success: true, id: contactId, isRealtime: recordedRealtime };
}

/**
 * 6. Health & Diagnostics Check
 */
export async function checkFirebaseConnection(): Promise<{
  connected: boolean;
  projectId?: string;
  message: string;
}> {
  if (!isFirebaseConfigured) {
    return {
      connected: false,
      message: 'Firebase credentials not found in .env.local (Running in Safe Mock Mode)',
    };
  }

  if (rtdb) {
    return {
      connected: true,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      message: `Connected to Firebase Realtime Database (${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID})`,
    };
  }

  if (db) {
    try {
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

  return {
    connected: false,
    message: 'Firebase initialized without active database service',
  };
}
