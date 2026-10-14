'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { DEMO_ADMIN, isDemoAdminEnabled } from '@/lib/adminAccess';

export function DemoAdminButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const { loginAsDemoAdmin } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!isDemoAdminEnabled) return null;

  const handleClick = async () => {
    setBusy(true);
    setError('');
    const res = await loginAsDemoAdmin();
    setBusy(false);
    if (res.success) {
      router.push('/admin');
    } else {
      setError(res.error || 'Demo admin login failed.');
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="w-full flex items-center justify-between p-3 rounded-[8px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[13px] font-medium transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        <span className="flex items-center gap-2 text-left">
          <span className="text-[18px]" aria-hidden="true">🛡️</span>
          <span>
            <span className="block font-bold text-amber-200">
              {busy ? 'Signing in…' : 'Demo Admin Login'}
            </span>
            <span className="block text-[11px] text-amber-300/80">{DEMO_ADMIN.email}</span>
          </span>
        </span>
        <span aria-hidden="true">→</span>
      </button>
      {error && (
        <p role="alert" className="mt-2 text-[12px] text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
