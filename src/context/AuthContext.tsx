'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types';
import { DEMO_ADMIN, isAllowlistedAdmin, isDemoAdminEnabled } from '@/lib/adminAccess';
import { auth, db, rtdb } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref as rtdbRef, get as rtdbGet, set as rtdbSet } from 'firebase/database';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginAsDemoAdmin: () => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    fleetSize?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Admin = Firestore role 'admin' OR an allowlisted email (mirrors isAdmin() in firestore.rules) */
function resolveRole(dbRole: unknown, email: string | undefined, emailVerified: boolean): 'admin' | 'customer' {
  return dbRole === 'admin' || isAllowlistedAdmin(email, emailVerified) ? 'admin' : 'customer';
}

/** Formats Firebase Auth error codes into clean, actionable user feedback */
function getAuthErrorMessage(err: unknown): string {
  if (!err) return 'Authentication error occurred.';
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code: string }).code)
      : err instanceof Error
      ? err.message
      : String(err);

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Invalid email address or password. Please verify your credentials.';
    case 'auth/user-not-found':
      return 'No account registered with this email address. Please create an account.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/missing-email':
      return 'Please provide your email address.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in popup request was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by browser. Please allow popups for this site.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily disabled due to multiple failed attempts. Please try again in a few minutes or reset your password.';
    default:
      if (err instanceof Error && err.message) {
        return err.message.replace(/^Firebase:\s*/, '');
      }
      return 'Authentication failed. Please verify your information.';
  }
}

async function fetchUserProfileFromFirestore(
  uid: string,
  fallbackEmail?: string,
  fallbackName?: string,
  emailVerified = false
): Promise<UserProfile> {
  if (db) {
    try {
      const getDocPromise = getDoc(doc(db, 'users', uid));
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const snap = await Promise.race([getDocPromise, timeoutPromise]);
      if (snap && snap.exists()) {
        const data = snap.data();
        return {
          uid,
          email: data.email || fallbackEmail || '',
          displayName: data.displayName || fallbackName || 'Fleet Member',
          role: resolveRole(data.role, data.email || fallbackEmail, emailVerified),
          company: data.company,
          phone: data.phone,
          fleetSize: data.fleetSize,
          createdAt: data.createdAt || new Date().toISOString(),
        };
      }
    } catch (error) {
      console.warn('[AuthContext] Firestore profile fetch error:', error);
    }
  }

  if (rtdb) {
    try {
      const rtdbPromise = rtdbGet(rtdbRef(rtdb, `users/${uid}`));
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));
      const snap = await Promise.race([rtdbPromise, timeoutPromise]);
      if (snap && snap.exists()) {
        const data = snap.val();
        return {
          uid,
          email: data.email || fallbackEmail || '',
          displayName: data.displayName || fallbackName || 'Fleet Member',
          role: resolveRole(data.role, data.email || fallbackEmail, emailVerified),
          company: data.company,
          phone: data.phone,
          fleetSize: data.fleetSize,
          createdAt: data.createdAt || new Date().toISOString(),
        };
      }
    } catch (rtdbErr) {
      console.warn('[AuthContext] RTDB profile fetch error:', rtdbErr);
    }
  }

  return {
    uid,
    email: fallbackEmail || '',
    displayName: fallbackName || 'Fleet Member',
    role: resolveRole(undefined, fallbackEmail, emailVerified),
    createdAt: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with loading = true to prevent premature "Access Denied" flashes on protected routes
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!auth) {
      // Offline fallback: check localStorage only when Firebase auth instance is unavailable
      queueMicrotask(() => {
        try {
          if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('mack_active_user');
            if (stored) {
              setUser(JSON.parse(stored));
            }
          }
        } catch (err) {
          console.warn('[AuthContext] Error reading stored session:', err);
        } finally {
          setLoading(false);
        }
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          const profile = await fetchUserProfileFromFirestore(
            fbUser.uid,
            fbUser.email || '',
            fbUser.displayName || '',
            fbUser.emailVerified
          );
          setUser(profile);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mack_active_user', JSON.stringify(profile));
          }
        } else {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('mack_active_user');
          }
        }
      } catch (err) {
        console.error('[AuthContext] Auth state change handler error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not configured in this environment.' };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const profile = await fetchUserProfileFromFirestore(
        cred.user.uid,
        cred.user.email || email.trim(),
        cred.user.displayName || '',
        cred.user.emailVerified
      );
      setUser(profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mack_active_user', JSON.stringify(profile));
      }
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: getAuthErrorMessage(err) };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not configured in this environment.' };
    }

    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);

      let profile = await fetchUserProfileFromFirestore(
        cred.user.uid,
        cred.user.email || '',
        cred.user.displayName || '',
        cred.user.emailVerified
      );

      const existingRole = profile.role === 'admin' ? 'admin' : 'customer';

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || cred.user.email?.split('@')[0] || 'Fleet Member',
        role: existingRole,
        company: profile.company || undefined,
        phone: profile.phone || cred.user.phoneNumber || undefined,
        fleetSize: profile.fleetSize || undefined,
        createdAt: profile.createdAt || new Date().toISOString(),
      };

      if (db) {
        try {
          const snap = await getDoc(doc(db, 'users', cred.user.uid));
          if (!snap.exists()) {
            await setDoc(doc(db, 'users', cred.user.uid), newProfile);
            profile = newProfile;
          }
        } catch (dbErr) {
          console.warn('[AuthContext] Could not sync Google user to Firestore:', dbErr);
        }
      }

      if (rtdb) {
        try {
          await rtdbSet(rtdbRef(rtdb, `users/${cred.user.uid}`), newProfile);
        } catch (rtdbErr) {
          console.warn('[AuthContext] Could not sync Google user to RTDB:', rtdbErr);
        }
      }

      setUser(profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mack_active_user', JSON.stringify(profile));
      }
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: getAuthErrorMessage(err) };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not configured in this environment.' };
    }

    if (!email || !email.trim().includes('@')) {
      return { success: false, error: 'Please enter a valid email address to reset password.' };
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: getAuthErrorMessage(err) };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    fleetSize?: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not configured in this environment.' };
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
      const uid = res.user.uid;

      try {
        await updateProfile(res.user, {
          displayName: data.name.trim(),
        });
      } catch (profileErr) {
        console.warn('[AuthContext] Could not set displayName in Firebase Auth:', profileErr);
      }

      const profile: UserProfile = {
        uid,
        email: data.email.trim(),
        displayName: data.name.trim(),
        role: 'customer', // Self-registration can never grant admin permissions
        company: data.company || 'Private Carrier',
        fleetSize: data.fleetSize || '1-5 Units',
        phone: data.phone || '',
        createdAt: new Date().toISOString(),
      };

      if (db) {
        try {
          await setDoc(doc(db, 'users', uid), profile);
        } catch (dbErr) {
          console.warn('[AuthContext] Could not save user to Firestore:', dbErr);
        }
      }

      if (rtdb) {
        try {
          await rtdbSet(rtdbRef(rtdb, `users/${uid}`), profile);
        } catch (rtdbErr) {
          console.warn('[AuthContext] Could not save user to RTDB:', rtdbErr);
        }
      }

      setUser(profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mack_active_user', JSON.stringify(profile));
      }
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: getAuthErrorMessage(err) };
    }
  };

  const loginAsDemoAdmin = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isDemoAdminEnabled) {
      return { success: false, error: 'Demo admin login is disabled in this environment.' };
    }
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not configured in this environment.' };
    }

    let uid: string | null = null;
    try {
      const cred = await signInWithEmailAndPassword(auth, DEMO_ADMIN.email, DEMO_ADMIN.password);
      uid = cred.user.uid;
    } catch (signInErr: unknown) {
      const code =
        typeof signInErr === 'object' && signInErr !== null && 'code' in signInErr
          ? String((signInErr as { code: string }).code)
          : '';
      if (code !== 'auth/user-not-found' && code !== 'auth/invalid-credential') {
        return { success: false, error: getAuthErrorMessage(signInErr) };
      }
      try {
        const created = await createUserWithEmailAndPassword(auth, DEMO_ADMIN.email, DEMO_ADMIN.password);
        uid = created.user.uid;
        try {
          await updateProfile(created.user, { displayName: DEMO_ADMIN.displayName });
        } catch (profileErr) {
          console.warn('[AuthContext] Could not set demo admin displayName:', profileErr);
        }
        if (db) {
          try {
            // role stays 'customer' in the document: rules forbid self-promotion. Admin comes from the allowlist.
            await setDoc(doc(db, 'users', uid), {
              uid,
              email: DEMO_ADMIN.email,
              displayName: DEMO_ADMIN.displayName,
              role: 'customer',
              createdAt: new Date().toISOString(),
            });
          } catch (dbErr) {
            console.warn('[AuthContext] Could not save demo admin profile:', dbErr);
          }
        }
      } catch (createErr: unknown) {
        const createCode =
          typeof createErr === 'object' && createErr !== null && 'code' in createErr
            ? String((createErr as { code: string }).code)
            : '';
        if (createCode === 'auth/email-already-in-use') {
          return {
            success: false,
            error: 'The demo admin account exists with a different password. Reset it in Firebase Authentication.',
          };
        }
        return { success: false, error: getAuthErrorMessage(createErr) };
      }
    }

    const profile: UserProfile = {
      uid: uid as string,
      email: DEMO_ADMIN.email,
      displayName: DEMO_ADMIN.displayName,
      role: resolveRole(undefined, DEMO_ADMIN.email, false),
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mack_active_user', JSON.stringify(profile));
    }
    return { success: true };
  };

  const logout = async () => {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn('[AuthContext] Sign out error:', err);
      }
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mack_active_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        loginAsDemoAdmin,
        register,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
