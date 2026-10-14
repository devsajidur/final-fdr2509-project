import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import {
  SpecificationItem,
  FeatureItemData,
  GalleryItemData,
  QuoteRequestRecord,
  TestDriveBooking,
} from '@/types';
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
  fleetSize?: string;
  model?: string;
  timeFrame?: string;
  message?: string;
  estimatedValue?: number;
  status?: QuoteRequestRecord['status'];
  submittedAt?: unknown;
  userId?: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  submittedAt?: unknown;
  userId?: string;
}

/** Max time (ms) the UI waits for a cloud write acknowledgement */
const WRITE_TIMEOUT_MS = 5000;
const LOCAL_CHANGE_EVENT = 'mack-local-data-changed';

/** Dispatches event to refresh local listeners across tabs and components */
function notifyLocalChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(LOCAL_CHANGE_EVENT));
  }
}

/** Subscribes to local storage changes */
function onLocalChange(handler: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(LOCAL_CHANGE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(LOCAL_CHANGE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

/** Strips undefined properties before writing to Firestore */
function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

/** Races a task against timeout so UI does not hang if offline */
async function settleWithin(task: () => Promise<unknown>, label: string): Promise<boolean> {
  try {
    const outcome = await Promise.race([
      task().then(() => 'ok' as const),
      new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), WRITE_TIMEOUT_MS)),
    ]);
    if (outcome === 'timeout') {
      console.warn(`[Firestore] ${label} timed out after ${WRITE_TIMEOUT_MS}ms. Cached locally.`);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`[Firestore] ${label} error:`, error instanceof Error ? error.message : error);
    return false;
  }
}

export function subscribeCollection<T extends { id: string }>(
  collectionName: string,
  defaultItems: T[],
  callback: (items: T[]) => void,
  orderField = 'id'
): Unsubscribe {
  callback(defaultItems);

  if (!isFirebaseConfigured || !db) {
    return () => {};
  }

  try {
    const q = query(collection(db, collectionName), orderBy(orderField, 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as unknown as T[];
          callback(items);
        }
      },
      (error) => {
        console.warn(`[Firestore] ${collectionName} subscription error:`, error.message);
      }
    );
  } catch (err) {
    console.warn(`[Firestore] Failed to attach listener for ${collectionName}:`, err);
    return () => {};
  }
}

export function subscribeSpecifications(
  callback: (specs: SpecificationItem[]) => void
): Unsubscribe {
  return subscribeCollection<SpecificationItem>(
    'specifications',
    specificationsContent.items,
    callback
  );
}

export function subscribeFeatures(
  callback: (features: FeatureItemData[]) => void
): Unsubscribe {
  return subscribeCollection<FeatureItemData>(
    'features',
    featuresContent.items,
    callback
  );
}

export function subscribeGallery(
  callback: (items: GalleryItemData[]) => void
): Unsubscribe {
  return subscribeCollection<GalleryItemData>(
    'gallery',
    galleryContent.items,
    callback
  );
}

function parseEstimatedPrice(price: string): number | undefined {
  const num = Number(String(price).replace(/[^0-9.]/g, '').split('.')[0]);
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

export async function submitQuoteToFirestore(
  quote: QuoteSubmission
): Promise<{ success: boolean; id: string; isRealtime: boolean; error?: string }> {
  const quoteId = quote.id || `quote_${Date.now()}`;
  const timestamp = new Date().toISOString();
  const parsedPrice = parseEstimatedPrice(quote.estimatedPrice);

  const record: QuoteRequestRecord = stripUndefined({
    ...quote,
    id: quoteId,
    model: quote.model || quote.selectedEngine,
    status: quote.status || 'pending',
    estimatedValue: quote.estimatedValue ?? parsedPrice,
    submittedAt: timestamp,
  });

  try {
    if (typeof window !== 'undefined') {
      const existing: QuoteRequestRecord[] = JSON.parse(
        localStorage.getItem('mack_local_quotes') || '[]'
      );
      existing.unshift(record);
      localStorage.setItem('mack_local_quotes', JSON.stringify(existing));
      notifyLocalChange();
    }
  } catch (err) {
    console.warn('[Cache] Could not save quote locally:', err);
  }

  let isRealtime = false;
  if (db) {
    isRealtime = await settleWithin(
      () =>
        setDoc(
          doc(db!, 'quotes', quoteId),
          stripUndefined({
            ...record,
            submittedAt: serverTimestamp(),
          })
        ),
      `Quote creation (${quoteId})`
    );
  }

  return { success: true, id: quoteId, isRealtime };
}

export async function submitContactToFirestore(
  contact: ContactSubmission
): Promise<{ success: boolean; id: string; isRealtime: boolean; error?: string }> {
  const contactId = contact.id || `lead_${Date.now()}`;
  const timestamp = new Date().toISOString();
  const record = stripUndefined({ ...contact, id: contactId, submittedAt: timestamp });

  try {
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('mack_local_leads') || '[]');
      existing.unshift(record);
      localStorage.setItem('mack_local_leads', JSON.stringify(existing));
      notifyLocalChange();
    }
  } catch (err) {
    console.warn('[Cache] Could not save lead locally:', err);
  }

  let isRealtime = false;
  if (db) {
    isRealtime = await settleWithin(
      () =>
        setDoc(
          doc(db!, 'leads', contactId),
          stripUndefined({
            ...record,
            submittedAt: serverTimestamp(),
          })
        ),
      `Lead creation (${contactId})`
    );
  }

  return { success: true, id: contactId, isRealtime };
}

/** Reads quotes cached in browser */
function getLocalQuotes(): QuoteRequestRecord[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mack_local_quotes');
      if (stored) return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('[Cache] Could not read local quotes:', err);
  }
  return [];
}

export function subscribeAllQuotes(
  callback: (quotes: QuoteRequestRecord[]) => void
): Unsubscribe {
  let remoteQuotes: QuoteRequestRecord[] = [];

  const emit = () => {
    // With Firebase configured the admin sees only real database records; the browser cache is
    // merged in solely for offline/local mode.
    const local = db && isFirebaseConfigured ? [] : getLocalQuotes();
    const map = new Map<string, QuoteRequestRecord>();
    for (const q of remoteQuotes) map.set(q.id, q);
    for (const l of local) {
      if (!map.has(l.id)) map.set(l.id, l);
    }
    const combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    callback(combined);
  };

  emit();
  const offLocal = onLocalChange(emit);

  if (!db || !isFirebaseConfigured) {
    return () => offLocal();
  }

  try {
    const q = query(collection(db, 'quotes'), orderBy('submittedAt', 'desc'));
    const offFirestore = onSnapshot(
      q,
      (snapshot) => {
        remoteQuotes = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let submittedAt = new Date().toISOString();
          if (data.submittedAt && typeof data.submittedAt.toDate === 'function') {
            submittedAt = data.submittedAt.toDate().toISOString();
          } else if (typeof data.submittedAt === 'string') {
            submittedAt = data.submittedAt;
          }
          return {
            id: docSnap.id,
            ...data,
            submittedAt,
          } as QuoteRequestRecord;
        });
        emit();
      },
      (error) => {
        console.warn('[Firestore] Admin quotes subscription error:', error.message);
        emit();
      }
    );

    return () => {
      offLocal();
      offFirestore();
    };
  } catch (err) {
    console.warn('[Firestore] Error attaching admin quotes listener:', err);
    return () => offLocal();
  }
}

export function subscribeUserQuotes(
  userEmail: string,
  callback: (quotes: QuoteRequestRecord[]) => void
): Unsubscribe {
  if (!userEmail) {
    callback([]);
    return () => {};
  }

  const normalized = userEmail.toLowerCase().trim();

  let remoteQuotes: QuoteRequestRecord[] = [];

  const emit = () => {
    const local = getLocalQuotes().filter(
      (q) => q.email?.toLowerCase().trim() === normalized
    );
    const map = new Map<string, QuoteRequestRecord>();
    for (const q of remoteQuotes) map.set(q.id, q);
    for (const l of local) {
      if (!map.has(l.id)) map.set(l.id, l);
    }
    const combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    callback(combined);
  };

  emit();
  const offLocal = onLocalChange(emit);

  if (!db || !isFirebaseConfigured) {
    return () => offLocal();
  }

  try {
    const q = query(collection(db, 'quotes'), where('email', '==', normalized));
    const offFirestore = onSnapshot(
      q,
      (snapshot) => {
        remoteQuotes = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let submittedAt = new Date().toISOString();
          if (data.submittedAt && typeof data.submittedAt.toDate === 'function') {
            submittedAt = data.submittedAt.toDate().toISOString();
          } else if (typeof data.submittedAt === 'string') {
            submittedAt = data.submittedAt;
          }
          return {
            id: docSnap.id,
            ...data,
            submittedAt,
          } as QuoteRequestRecord;
        });
        emit();
      },
      (error) => {
        console.warn('[Firestore] User quotes subscription error:', error.message);
        emit();
      }
    );

    return () => {
      offLocal();
      offFirestore();
    };
  } catch (err) {
    console.warn('[Firestore] Error attaching user quotes listener:', err);
    return () => offLocal();
  }
}

export async function updateQuoteStatusInFirebase(
  quoteId: string,
  newStatus: QuoteRequestRecord['status']
): Promise<boolean> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mack_local_quotes');
      if (stored) {
        const list: QuoteRequestRecord[] = JSON.parse(stored);
        const idx = list.findIndex((q) => q.id === quoteId);
        if (idx !== -1) {
          list[idx].status = newStatus;
          localStorage.setItem('mack_local_quotes', JSON.stringify(list));
          notifyLocalChange();
        }
      }
    }
  } catch (err) {
    console.warn('[Cache] Could not update quote status locally:', err);
  }

  if (db) {
    return settleWithin(
      () => updateDoc(doc(db!, 'quotes', quoteId), { status: newStatus }),
      `Quote status update (${quoteId})`
    );
  }
  return true;
}

export async function deleteQuoteFromFirebase(quoteId: string): Promise<boolean> {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mack_local_quotes');
      if (stored) {
        const list: QuoteRequestRecord[] = JSON.parse(stored);
        localStorage.setItem(
          'mack_local_quotes',
          JSON.stringify(list.filter((q) => q.id !== quoteId))
        );
        notifyLocalChange();
      }
    }
  } catch (err) {
    console.warn('[Cache] Could not delete quote locally:', err);
  }

  if (db) {
    return settleWithin(
      () => deleteDoc(doc(db!, 'quotes', quoteId)),
      `Quote deletion (${quoteId})`
    );
  }
  return true;
}

/** Reads test drives cached in browser */
function getLocalTestDrives(): TestDriveBooking[] {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mack_local_testdrives');
      if (stored) return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('[Cache] Could not read local test drives:', err);
  }
  return [];
}

export async function bookTestDrive(
  booking: Omit<TestDriveBooking, 'id' | 'submittedAt'>
): Promise<{ success: boolean; id: string; error?: string }> {
  const id = `testdrive_${Date.now()}`;
  const record: TestDriveBooking = {
    ...booking,
    id,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  try {
    if (typeof window !== 'undefined') {
      const existing = getLocalTestDrives();
      existing.unshift(record);
      localStorage.setItem('mack_local_testdrives', JSON.stringify(existing));
      notifyLocalChange();
    }
  } catch (err) {
    console.warn('[Cache] Could not save test drive locally:', err);
  }

  if (db) {
    await settleWithin(
      () =>
        setDoc(
          doc(db!, 'testdrives', id),
          stripUndefined({
            ...record,
            submittedAt: serverTimestamp(),
          })
        ),
      `Test drive booking (${id})`
    );
  }

  return { success: true, id };
}

export function subscribeTestDrives(
  callback: (bookings: TestDriveBooking[]) => void
): Unsubscribe {
  let remoteDrives: TestDriveBooking[] = [];

  const emit = () => {
    const local = db && isFirebaseConfigured ? [] : getLocalTestDrives();
    const map = new Map<string, TestDriveBooking>();
    for (const d of remoteDrives) map.set(d.id, d);
    for (const l of local) {
      if (!map.has(l.id)) map.set(l.id, l);
    }
    const combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
    callback(combined);
  };

  emit();
  const offLocal = onLocalChange(emit);

  if (!db || !isFirebaseConfigured) {
    return () => offLocal();
  }

  try {
    const q = query(collection(db, 'testdrives'), orderBy('submittedAt', 'desc'));
    const offFirestore = onSnapshot(
      q,
      (snapshot) => {
        remoteDrives = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let submittedAt = new Date().toISOString();
          if (data.submittedAt && typeof data.submittedAt.toDate === 'function') {
            submittedAt = data.submittedAt.toDate().toISOString();
          } else if (typeof data.submittedAt === 'string') {
            submittedAt = data.submittedAt;
          }
          return {
            id: docSnap.id,
            ...data,
            submittedAt,
          } as TestDriveBooking;
        });
        emit();
      },
      (error) => {
        console.warn('[Firestore] Test drives subscription error:', error.message);
        emit();
      }
    );

    return () => {
      offLocal();
      offFirestore();
    };
  } catch (err) {
    console.warn('[Firestore] Error attaching test drives listener:', err);
    return () => offLocal();
  }
}

export async function updateSpecificationInFirebase(
  specId: string,
  data: Partial<SpecificationItem>
): Promise<boolean> {
  if (db) {
    return settleWithin(
      () => updateDoc(doc(db!, 'specifications', specId), stripUndefined(data as Record<string, unknown>)),
      `Specification update (${specId})`
    );
  }
  return false;
}

export async function checkFirebaseConnection(): Promise<{
  connected: boolean;
  projectId?: string;
  message: string;
  latencyMs?: number;
}> {
  if (!isFirebaseConfigured || !db) {
    return {
      connected: false,
      message: 'Firebase credentials missing or offline mode enabled',
    };
  }

  try {
    const start = Date.now();
    await getDocs(query(collection(db, 'specifications'), limit(1)));
    const latencyMs = Date.now() - start;
    return {
      connected: true,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      message: `Connected to Cloud Firestore (${latencyMs}ms)`,
      latencyMs,
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
