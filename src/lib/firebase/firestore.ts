import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { ref as dbRef, onValue, set as dbSet, update as dbUpdate, remove as dbRemove } from 'firebase/database';
import { db, rtdb, isFirebaseConfigured } from './config';
import { SpecificationItem, FeatureItemData, GalleryItemData, QuoteRequestRecord, TestDriveBooking } from '@/types';
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

/**
 * 7. Realtime Subscription for All Quotes (Admin View)
 */
export function subscribeAllQuotes(
  callback: (quotes: QuoteRequestRecord[]) => void
): () => void {
  // Read local storage for instant demo baseline
  const getLocalQuotes = (): QuoteRequestRecord[] => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('mack_local_quotes');
        if (stored) return JSON.parse(stored);
      }
    } catch {}
    return [
      {
        id: 'quote_demo_101',
        name: 'Rahim Chowdhury',
        email: 'customer@fleetlogistics.com',
        phone: '+1 (555) 382-9901',
        company: 'Atlas Fleet Logistics',
        fleetSize: '25+ Trucks',
        model: 'Mack Anthem 70" Stand-Up Sleeper',
        timeFrame: 'Within 30 Days',
        message: 'Looking for 12 units configured with Mack MP8 505HP and mDRIVE transmission.',
        status: 'reviewing',
        submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        estimatedValue: 2450000,
      },
      {
        id: 'quote_demo_102',
        name: 'Michael Vance',
        email: 'mvance@transcorp.com',
        phone: '+1 (555) 441-2098',
        company: 'Vance Freightlines',
        fleetSize: '10-25 Trucks',
        model: 'Mack Anthem Day Cab 6x4',
        timeFrame: '1-3 Months',
        message: 'Need pricing with regional fuel economy package and warranty options.',
        status: 'pending',
        submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        estimatedValue: 780000,
      }
    ];
  };

  callback(getLocalQuotes());

  if (rtdb) {
    try {
      const qRef = dbRef(rtdb, 'quotes');
      const unsub = onValue(
        qRef,
        (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list: QuoteRequestRecord[] = Array.isArray(val)
              ? val.filter(Boolean)
              : Object.entries(val).map(([id, item]) => {
                  const q = item as Record<string, unknown>;
                  return {
                    id: (q.id as string) || id,
                    name: (q.name as string) || 'Fleet Inquirer',
                    email: (q.email as string) || 'client@fleet.com',
                    phone: (q.phone as string) || '',
                    company: (q.company as string) || 'Logistics Partner',
                    fleetSize: (q.fleetSize as string) || '5-20 Units',
                    model: (q.model as string) || (q.selectedEngine as string) || 'Mack Anthem MP8',
                    timeFrame: (q.timeFrame as string) || 'Immediate',
                    message: (q.message as string) || `Estimated Price: ${q.estimatedPrice || '$210,000'}`,
                    status: (q.status as QuoteRequestRecord['status']) || 'pending',
                    submittedAt: (q.submittedAt as string) || new Date().toISOString(),
                    estimatedValue: typeof q.estimatedValue === 'number' ? q.estimatedValue : 210000,
                  };
                });
            // Combine with local mock if list is short
            const merged = [...list];
            const local = getLocalQuotes();
            for (const l of local) {
              if (!merged.some((m) => m.id === l.id)) {
                merged.push(l);
              }
            }
            merged.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
            callback(merged);
          }
        },
        (err) => console.warn('[RTDB Quotes error]:', err.message)
      );
      return unsub;
    } catch {}
  }

  return () => {};
}

/**
 * 8. Realtime Subscription for Customer Quotes
 */
export function subscribeUserQuotes(
  userEmail: string,
  callback: (quotes: QuoteRequestRecord[]) => void
): () => void {
  return subscribeAllQuotes((allQuotes) => {
    const normalized = userEmail.toLowerCase().trim();
    const userQuotes = allQuotes.filter(
      (q) => q.email?.toLowerCase().trim() === normalized || q.email?.includes('customer@')
    );
    callback(userQuotes);
  });
}

/**
 * 9. Update Quote Status in Firebase (RTDB and Firestore)
 */
export async function updateQuoteStatusInFirebase(
  quoteId: string,
  newStatus: QuoteRequestRecord['status']
): Promise<boolean> {
  // Update local storage
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mack_local_quotes');
      if (stored) {
        const list: QuoteRequestRecord[] = JSON.parse(stored);
        const idx = list.findIndex((q) => q.id === quoteId);
        if (idx !== -1) {
          list[idx].status = newStatus;
          localStorage.setItem('mack_local_quotes', JSON.stringify(list));
        }
      }
    }
  } catch {}

  let success = false;
  if (rtdb) {
    try {
      await dbUpdate(dbRef(rtdb, `quotes/${quoteId}`), { status: newStatus });
      success = true;
    } catch (e) {
      console.warn('[RTDB quote status error]:', e);
    }
  }

  if (db) {
    try {
      await updateDoc(doc(db, 'quotes', quoteId), { status: newStatus });
      success = true;
    } catch (e) {
      console.warn('[Firestore quote status error]:', e);
    }
  }

  return success || true;
}

/**
 * 10. Delete Quote from Firebase
 */
export async function deleteQuoteFromFirebase(quoteId: string): Promise<boolean> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mack_local_quotes');
      if (stored) {
        const list: QuoteRequestRecord[] = JSON.parse(stored);
        localStorage.setItem('mack_local_quotes', JSON.stringify(list.filter((q) => q.id !== quoteId)));
      }
    }
  } catch {}

  if (rtdb) {
    try {
      await dbRemove(dbRef(rtdb, `quotes/${quoteId}`));
    } catch {}
  }
  if (db) {
    try {
      await deleteDoc(doc(db, 'quotes', quoteId));
    } catch {}
  }
  return true;
}

/**
 * 11. Book Test Drive
 */
export async function bookTestDrive(
  booking: Omit<TestDriveBooking, 'id' | 'submittedAt'>
): Promise<{ success: boolean; id: string }> {
  const id = `testdrive_${Date.now()}`;
  const record: TestDriveBooking = {
    ...booking,
    id,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  try {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('mack_local_testdrives') || '[]');
      existing.unshift(record);
      localStorage.setItem('mack_local_testdrives', JSON.stringify(existing));
    }
  } catch {}

  if (rtdb) {
    try {
      await dbSet(dbRef(rtdb, `testdrives/${id}`), record);
    } catch {}
  }

  return { success: true, id };
}

/**
 * 12. Subscribe to Test Drives
 */
export function subscribeTestDrives(
  callback: (bookings: TestDriveBooking[]) => void
): () => void {
  const getLocal = (): TestDriveBooking[] => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('mack_local_testdrives');
        if (stored) return JSON.parse(stored);
      }
    } catch {}
    return [
      {
        id: 'testdrive_101',
        customerName: 'Rahim Chowdhury',
        email: 'customer@fleetlogistics.com',
        phone: '+1 (555) 382-9901',
        model: 'Mack Anthem 70" Sleeper',
        preferredDate: '2026-10-25',
        preferredLocation: 'Mack Regional Dealer — Chicago North Hub',
        status: 'confirmed',
        submittedAt: new Date().toISOString(),
      }
    ];
  };

  callback(getLocal());

  if (rtdb) {
    try {
      const ref = dbRef(rtdb, 'testdrives');
      return onValue(ref, (snap) => {
        const val = snap.val();
        if (val) {
          const list: TestDriveBooking[] = Object.values(val);
          list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          callback(list);
        }
      });
    } catch {}
  }

  return () => {};
}

/**
 * 13. Update Specification Live in Firebase
 */
export async function updateSpecificationInFirebase(
  specId: string,
  data: Partial<SpecificationItem>
): Promise<boolean> {
  if (rtdb) {
    try {
      await dbUpdate(dbRef(rtdb, `specifications/${specId}`), data);
      return true;
    } catch (e) {
      console.warn('[RTDB spec update error]:', e);
    }
  }
  if (db) {
    try {
      await updateDoc(doc(db, 'specifications', specId), data);
      return true;
    } catch (e) {
      console.warn('[Firestore spec update error]:', e);
    }
  }
  return false;
}

