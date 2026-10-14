'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { QuoteRequestRecord, TestDriveBooking, SpecificationItem } from '@/types';
import {
  subscribeAllQuotes,
  subscribeTestDrives,
  subscribeSpecifications,
  updateQuoteStatusInFirebase,
  deleteQuoteFromFirebase,
  updateSpecificationInFirebase,
} from '@/lib/firebase/firestore';
import { HeaderTruckLogoIcon } from '@/components/ui/Icons';
import { DemoAdminButton } from '@/components/ui/DemoAdminButton';
import { AdminQuotesTab } from '@/components/admin/AdminQuotesTab';
import { AdminTestDrivesTab } from '@/components/admin/AdminTestDrivesTab';
import { AdminSpecsTab } from '@/components/admin/AdminSpecsTab';
import { AdminDiagnosticsTab } from '@/components/admin/AdminDiagnosticsTab';

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveBooking[]>([]);
  const [specs, setSpecs] = useState<SpecificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'testdrives' | 'specs' | 'diagnostics'>('quotes');

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingSpec, setEditingSpec] = useState<SpecificationItem | null>(null);
  const [specSaveSuccess, setSpecSaveSuccess] = useState(false);
  const [actionToast, setActionToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const unsubQuotes = subscribeAllQuotes((liveQuotes) => {
      setQuotes(liveQuotes);
    });

    const unsubDrives = subscribeTestDrives((liveDrives) => {
      setTestDrives(liveDrives);
    });

    const unsubSpecs = subscribeSpecifications((liveSpecs) => {
      if (liveSpecs && liveSpecs.length > 0) {
        setSpecs(liveSpecs);
      }
    });

    return () => {
      unsubQuotes();
      unsubDrives();
      unsubSpecs();
    };
  }, [user]);

  const handleStatusChange = async (quoteId: string, newStatus: QuoteRequestRecord['status']) => {
    setUpdatingId(quoteId);
    try {
      const ok = await updateQuoteStatusInFirebase(quoteId, newStatus);
      if (ok) {
        setActionToast({ type: 'success', text: `Quote status updated to "${newStatus}".` });
      } else {
        setActionToast({ type: 'error', text: 'Could not sync quote update to Firebase.' });
      }
    } catch (e) {
      setActionToast({ type: 'error', text: e instanceof Error ? e.message : 'Error updating status.' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setActionToast(null), 4000);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to remove this quote inquiry?')) return;
    try {
      const ok = await deleteQuoteFromFirebase(quoteId);
      if (ok) {
        setActionToast({ type: 'success', text: 'Quote inquiry removed successfully.' });
      } else {
        setActionToast({ type: 'error', text: 'Failed to delete quote from Firebase.' });
      }
    } catch (err) {
      setActionToast({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete quote.' });
    } finally {
      setTimeout(() => setActionToast(null), 4000);
    }
  };

  const handleSaveSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpec) return;
    try {
      const ok = await updateSpecificationInFirebase(editingSpec.id, {
        title: editingSpec.title,
        primaryDetail: editingSpec.primaryDetail,
        secondaryDetail: editingSpec.secondaryDetail,
      });
      if (ok) {
        setSpecSaveSuccess(true);
        setActionToast({
          type: 'success',
          text: `Specification "${editingSpec.title}" updated in live Firestore.`,
        });
      } else {
        setActionToast({ type: 'error', text: 'Specification update not acknowledged.' });
      }
      setTimeout(() => setSpecSaveSuccess(false), 3000);
    } catch (err) {
      setActionToast({ type: 'error', text: err instanceof Error ? err.message : 'Error saving specification.' });
    } finally {
      setTimeout(() => setActionToast(null), 4000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isAuthorizedAdmin = user && user.role === 'admin';

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between">
        <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-[32px] h-[32px] bg-[#000000] border border-white/20 rounded-[4px] flex items-center justify-center shrink-0 shadow-sm">
              <HeaderTruckLogoIcon />
            </div>
            <span className="text-[20px] font-bold">MACK</span>
          </Link>
          <Link href="/" className="text-gray-400 hover:text-white text-[14px]">
            ← Return to Showcase
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-[480px] w-full bg-[#111827] border border-amber-500/30 rounded-[16px] p-8 text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[30px] mb-4">
              🛡️
            </div>
            <h1 className="text-[24px] font-bold text-white mb-2">Corporate Admin Access Required</h1>
            <p className="text-[14px] text-gray-400 mb-6 leading-relaxed">
              This terminal is reserved exclusively for authorized Mack Corporate Operations personnel.
            </p>
            <div className="space-y-3">
              <DemoAdminButton />
              <Link
                href="/login"
                className="w-full inline-block bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-[8px] transition-all text-[14px]"
              >
                Sign In with Corporate Admin Credentials
              </Link>
              <Link
                href="/"
                className="w-full inline-block bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-[8px] transition-all text-[14px]"
              >
                Return to Public Website
              </Link>
            </div>
          </div>
        </main>

        <footer className="w-full border-t border-white/10 py-4 px-6 text-center text-[12px] text-gray-500">
          Mack Trucks North America Inc. • Corporate Operations Security Gate
        </footer>
      </div>
    );
  }

  // Pipeline value only counts quotes that carry a real estimated value
  const totalPipeline = quotes.reduce((acc, q) => acc + (q.estimatedValue || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between selection:bg-[#F59E0B] selection:text-black">
      <header className="border-b border-white/10 bg-[#0F131C] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-[34px] h-[34px] bg-[#000000] border border-amber-400/40 rounded-[6px] flex items-center justify-center shrink-0 shadow-sm">
                <HeaderTruckLogoIcon />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-extrabold tracking-wider text-white">MACK</span>
                  <span className="text-[11px] bg-amber-400 text-black px-2 py-0.5 rounded font-mono font-bold">
                    OPERATIONS
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 font-mono">Anthem Enterprise Console</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[13px] font-semibold text-white">{user.displayName}</span>
              <span className="text-[11px] text-amber-400 font-mono">Master Administrator</span>
            </div>
            <Link
              href="/"
              className="text-[13px] text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-[6px] transition-colors"
            >
              Public Site ↗
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="text-[13px] text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-[6px] transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-8 py-8">
        {actionToast && (
          <div
            className={`mb-6 p-4 rounded-[12px] border text-[14px] flex items-center justify-between gap-3 shadow-lg ${
              actionToast.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                : 'bg-red-500/20 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>{actionToast.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{actionToast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionToast(null)}
              className="text-gray-400 hover:text-white text-[16px] cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] border border-white/10 rounded-[12px] p-5 shadow-lg">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Total Quotes Received</div>
            <div className="text-[32px] font-extrabold text-white mt-1">{quotes.length}</div>
            <div className="text-[12px] text-amber-400 mt-1">Live Submissions Synced</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-[12px] p-5 shadow-lg">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Pipeline Deal Value</div>
            <div className="text-[32px] font-extrabold text-emerald-400 mt-1">
              ${(totalPipeline / 1000000).toFixed(2)}M
            </div>
            <div className="text-[12px] text-gray-400 mt-1">Commercial Fleet Estimates</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-[12px] p-5 shadow-lg">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Test Drive Inquiries</div>
            <div className="text-[32px] font-extrabold text-blue-400 mt-1">{testDrives.length}</div>
            <div className="text-[12px] text-gray-400 mt-1">Regional Hub Requests</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-[12px] p-5 shadow-lg">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Cloud Firestore</div>
            <div className="text-[18px] font-bold text-white mt-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              Realtime Synced
            </div>
            <div className="text-[11px] text-gray-400 mt-1 font-mono truncate">
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not configured'}
            </div>
          </div>
        </div>

        <div className="flex border-b border-white/10 mb-6 gap-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Commercial Quotes ({quotes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('testdrives')}
            className={`pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'testdrives'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Test Drive Bookings ({testDrives.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Live Site Specs Manager
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('diagnostics')}
            className={`pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'diagnostics'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Firebase Diagnostics & Rules
          </button>
        </div>

        {activeTab === 'quotes' && (
          <AdminQuotesTab
            quotes={quotes}
            updatingId={updatingId}
            onStatusChange={handleStatusChange}
            onDeleteQuote={handleDeleteQuote}
          />
        )}

        {activeTab === 'testdrives' && (
          <AdminTestDrivesTab testDrives={testDrives} />
        )}

        {activeTab === 'specs' && (
          <AdminSpecsTab
            specs={specs}
            editingSpec={editingSpec}
            setEditingSpec={setEditingSpec}
            onSaveSpec={handleSaveSpec}
            specSaveSuccess={specSaveSuccess}
          />
        )}

        {activeTab === 'diagnostics' && (
          <AdminDiagnosticsTab />
        )}
      </main>

      <footer className="w-full border-t border-white/10 py-4 px-6 text-center text-[12px] text-gray-500">
        Mack Trucks Corporate Operations • Enterprise Level Security Access
      </footer>
    </div>
  );
}
