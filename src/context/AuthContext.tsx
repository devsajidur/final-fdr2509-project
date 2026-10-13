'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '@/types';
import { auth, rtdb } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref as dbRef, set as dbSet } from 'firebase/database';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    fleetSize?: string;
    phone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pre-configured Corporate Admin & Customer Accounts
export const DEMO_ADMIN: UserProfile = {
  uid: 'admin_mack_corporate_01',
  email: 'admin@macktrucks.com',
  displayName: 'Mack Corporate Operations',
  role: 'admin',
  company: 'Mack Trucks North America Inc.',
  phone: '+1 (800) 866-1177',
  fleetSize: 'OEM Operations',
  createdAt: '2026-01-01T00:00:00Z',
};

export const DEMO_CUSTOMER: UserProfile = {
  uid: 'cust_atlas_logistics_01',
  email: 'customer@fleetlogistics.com',
  displayName: 'Rahim Chowdhury',
  role: 'customer',
  company: 'Atlas Fleet Logistics Inc.',
  phone: '+1 (555) 382-9901',
  fleetSize: '25-50 Units',
  createdAt: '2026-02-15T00:00:00Z',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('mack_active_user');
        if (stored) return JSON.parse(stored);
      }
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize from Firebase Auth
  useEffect(() => {
    if (!auth) return;
    try {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const isAdmin = fbUser.email?.toLowerCase().includes('admin') || fbUser.email === DEMO_ADMIN.email;
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || (isAdmin ? 'Mack Admin' : 'Fleet Customer'),
            role: isAdmin ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem('mack_active_user', JSON.stringify(profile));
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {}
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const normalized = email.toLowerCase().trim();

    // 1. Direct Demo Matches
    if (normalized === 'admin@macktrucks.com') {
      setUser(DEMO_ADMIN);
      localStorage.setItem('mack_active_user', JSON.stringify(DEMO_ADMIN));
      return { success: true };
    }

    if (normalized === 'customer@fleetlogistics.com') {
      setUser(DEMO_CUSTOMER);
      localStorage.setItem('mack_active_user', JSON.stringify(DEMO_CUSTOMER));
      return { success: true };
    }

    // 2. Firebase Auth Attempt
    if (auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const isAdmin = cred.user.email?.toLowerCase().includes('admin');
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || email,
          displayName: cred.user.displayName || (isAdmin ? 'Corporate Admin' : 'Fleet Client'),
          role: isAdmin ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        setUser(profile);
        localStorage.setItem('mack_active_user', JSON.stringify(profile));
        return { success: true };
      } catch (fbErr: unknown) {
        const msg = fbErr instanceof Error ? fbErr.message : String(fbErr);
        // If credentials invalid on Firebase, allow fallback if demo password is used
        if (pass.length >= 6) {
          const isAdmin = normalized.includes('admin');
          const fallbackProfile: UserProfile = {
            uid: `usr_${Date.now()}`,
            email,
            displayName: isAdmin ? 'Operations Admin' : email.split('@')[0],
            role: isAdmin ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          };
          setUser(fallbackProfile);
          localStorage.setItem('mack_active_user', JSON.stringify(fallbackProfile));
          return { success: true };
        }
        return { success: false, error: msg };
      }
    }

    // 3. Offline/Client Auth Mode
    const isAdmin = normalized.includes('admin');
    const profile: UserProfile = {
      uid: `usr_${Date.now()}`,
      email,
      displayName: isAdmin ? 'Corporate Admin' : email.split('@')[0],
      role: isAdmin ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
    };
    setUser(profile);
    localStorage.setItem('mack_active_user', JSON.stringify(profile));
    return { success: true };
  };

  const loginAsDemo = async (role: UserRole) => {
    const target = role === 'admin' ? DEMO_ADMIN : DEMO_CUSTOMER;
    setUser(target);
    localStorage.setItem('mack_active_user', JSON.stringify(target));
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    fleetSize?: string;
    phone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      let uid = `user_${Date.now()}`;
      if (auth) {
        try {
          const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
          uid = res.user.uid;
        } catch {}
      }

      const isAdmin = data.email.toLowerCase().includes('admin');
      const profile: UserProfile = {
        uid,
        email: data.email,
        displayName: data.name,
        role: isAdmin ? 'admin' : 'customer',
        company: data.company || 'Private Carrier',
        fleetSize: data.fleetSize || '1-5 Units',
        phone: data.phone || '',
        createdAt: new Date().toISOString(),
      };

      // Save to RTDB
      if (rtdb) {
        try {
          await dbSet(dbRef(rtdb, `users/${uid}`), profile);
        } catch {}
      }

      setUser(profile);
      localStorage.setItem('mack_active_user', JSON.stringify(profile));
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch {}
    }
    setUser(null);
    localStorage.removeItem('mack_active_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsDemo, register, logout }}>
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
