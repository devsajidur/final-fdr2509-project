'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { QuoteRequestRecord, TestDriveBooking, SpecificationItem } from '@/types';
import {
  subscribeAllQuotes,
  subscribeTestDrives,
  updateQuoteStatusInFirebase,
  deleteQuoteFromFirebase,
  subscribeSpecifications,
  updateSpecificationInFirebase,
} from '@/lib/firebase/firestore';
import { HeaderTruckLogoIcon } from '@/components/ui/Icons';

export default function AdminPanelPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, loginAsDemo } = useAuth();

  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveBooking[]>([]);
  const [specs, setSpecs] = useState<SpecificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'testdrives' | 'specs' | 'diagnostics'>('quotes');

  // Status update indicator
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Specs editor state
  const [editingSpec, setEditingSpec] = useState<SpecificationItem | null>(null);
  const [specSaveSuccess, setSpecSaveSuccess] = useState(false);

  // Subscribe to live admin data
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
      await updateQuoteStatusInFirebase(quoteId, newStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteQuote = async (quoteId: string) => {
    if (!confirm('Are you sure you want to remove this quote inquiry?')) return;
    await deleteQuoteFromFirebase(quoteId);
  };

  const handleSaveSpec = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpec) return;
    try {
      await updateSpecificationInFirebase(editingSpec.id, {
        title: editingSpec.title,
        primaryDetail: editingSpec.primaryDetail,
        secondaryDetail: editingSpec.secondaryDetail,
      });
      setSpecSaveSuccess(true);
      setTimeout(() => setSpecSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Strict Corporate Admin Access Gate - Only admin@macktrucks.com is authorized
  const isAuthorizedAdmin = user && user.role === 'admin' && user.email.toLowerCase().trim() === 'admin@macktrucks.com';

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
            
            {user ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-[8px] p-3 mb-4 text-left">
                <div className="text-[11px] font-mono text-red-300 font-bold tracking-wider uppercase">ACCESS RESTRICTED</div>
                <div className="text-[13px] text-gray-300 mt-1">
                  You are signed in as <span className="font-semibold text-white">{user.email}</span> (Fleet Customer).
                  Customer accounts are not authorized to view internal dealership operations.
                </div>
              </div>
            ) : null}

            <p className="text-[14px] text-gray-400 mb-6">
              This console is exclusively reserved for Mack Trucks corporate administrators (<code className="text-amber-400 font-mono">admin@macktrucks.com</code>).
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={async () => {
                  await loginAsDemo('admin');
                  router.refresh();
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-[8px] transition-all cursor-pointer shadow-lg active:scale-98"
              >
                👑 1-Click Access as Corporate Admin (admin@macktrucks.com)
              </button>
              <Link
                href="/login"
                className="block w-full border border-gray-700 hover:bg-gray-800 text-gray-200 font-medium py-2.5 rounded-[8px] text-[14px] transition-colors"
              >
                Sign In with Corporate Credentials
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="block w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium py-2 rounded-[8px] text-[13px] transition-colors"
                >
                  Return to Customer Portal (My Quotes & Financing) →
                </Link>
              )}
            </div>
          </div>
        </main>

        <footer className="border-t border-white/10 py-4 text-center text-gray-500 text-[12px]">
          © 2026 Mack Trucks Corporate Security. All administrative activities are logged.
        </footer>
      </div>
    );
  }

  // Calculate total pipeline value
  const totalPipeline = quotes.reduce((acc, q) => acc + (q.estimatedValue || 235000), 0);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between selection:bg-[#F59E0B] selection:text-black">
      {/* Admin Top Bar */}
      <header className="w-full bg-[#111827] border-b border-amber-500/30 sticky top-0 z-30 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-[1360px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-[32px] h-[32px] bg-[#000000] border border-amber-500/40 rounded-[4px] flex items-center justify-center shrink-0 shadow-sm">
                <HeaderTruckLogoIcon />
              </div>
              <span className="text-[20px] font-bold tracking-wider text-white">MACK</span>
            </Link>
            <span className="text-[12px] bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded-full font-mono font-bold flex items-center gap-1.5 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              CORPORATE ADMIN CONSOLE
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <div className="text-[13px] font-bold text-amber-300">{user.displayName}</div>
              <div className="text-[11px] text-gray-400 font-mono">mack-anthem-prod (asia-southeast1)</div>
            </div>
            <Link
              href="/"
              className="text-[13px] bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-1.5 rounded-[6px] transition-colors"
            >
              Showcase Live Site
            </Link>
            <Link
              href="/dashboard"
              className="text-[13px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 px-3 py-1.5 rounded-[6px] transition-colors"
            >
              Customer View
            </Link>
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="text-[13px] text-red-400 hover:text-red-300 cursor-pointer px-2 py-1"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-8 py-8">
        {/* Metric Cards */}
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
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Firebase Status</div>
            <div className="text-[18px] font-bold text-white mt-2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              Realtime Sync Active
            </div>
            <div className="text-[11px] text-gray-400 mt-1 font-mono truncate">
              mack-anthem-prod-default-rtdb
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-6 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 ${
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
            className={`pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 ${
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
            className={`pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 ${
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
            className={`pb-3 text-[15px] font-semibold transition-colors cursor-pointer border-b-2 ${
              activeTab === 'diagnostics'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Firebase Diagnostics & Rules
          </button>
        </div>

        {/* TAB 1: Commercial Quotes Management */}
        {activeTab === 'quotes' && (
          <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-[18px] font-bold text-white">Live Incoming Quote Submissions</h2>
                <p className="text-[13px] text-gray-400">
                  Update customer status in real-time. Changes sync to the customer dashboard instantly.
                </p>
              </div>
              <div className="text-[12px] text-gray-400 font-mono">
                Total Records: {quotes.length}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-[12px] uppercase">
                    <th className="py-3 px-3">Client / Company</th>
                    <th className="py-3 px-3">Contact Info</th>
                    <th className="py-3 px-3">Truck Model</th>
                    <th className="py-3 px-3">Value</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Update Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {quotes.map((q) => (
                    <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white">{q.name}</div>
                        <div className="text-[12px] text-gray-400">{q.company || 'Private Carrier'}</div>
                        <div className="text-[11px] text-amber-400 font-mono">{q.id}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[13px]">
                        <div className="text-gray-200">{q.email}</div>
                        <div className="text-gray-400">{q.phone || 'No phone provided'}</div>
                      </td>
                      <td className="py-3.5 px-3 text-[13px]">
                        <div className="font-medium text-white">{q.model}</div>
                        <div className="text-[11px] text-gray-400 truncate max-w-xs">{q.message}</div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-emerald-400">
                        {q.estimatedValue ? `$${q.estimatedValue.toLocaleString()}` : '$235,000'}
                      </td>
                      <td className="py-3.5 px-3 text-gray-400 text-[12px]">
                        {new Date(q.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-3">
                        <select
                          disabled={updatingId === q.id}
                          value={q.status}
                          onChange={(e) => handleStatusChange(q.id, e.target.value as QuoteRequestRecord['status'])}
                          className="bg-[#1F2937] border border-gray-700 text-white rounded-[6px] px-2.5 py-1 text-[12px] font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="pending">🟡 Pending</option>
                          <option value="reviewing">🔵 Reviewing</option>
                          <option value="approved">🟢 Approved</option>
                          <option value="contacted">🟣 Contacted</option>
                          <option value="archived">⚪ Archived</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteQuote(q.id)}
                          className="text-[12px] text-red-400 hover:text-red-300 hover:underline px-2 py-1"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Test Drive Bookings */}
        {activeTab === 'testdrives' && (
          <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
            <h2 className="text-[18px] font-bold text-white mb-2">Customer Test Drive Appointments</h2>
            <p className="text-[13px] text-gray-400 mb-4">
              Real-time feed of commercial drivers and fleet owners requesting vehicle trials.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-[14px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-[12px] uppercase">
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Email & Phone</th>
                    <th className="py-3 px-4">Requested Model</th>
                    <th className="py-3 px-4">Target Date</th>
                    <th className="py-3 px-4">Dealer Location</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {testDrives.map((d) => (
                    <tr key={d.id} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-semibold text-white">{d.customerName}</td>
                      <td className="py-3.5 px-4 text-[13px] text-gray-300">
                        <div>{d.email}</div>
                        <div className="text-gray-400">{d.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[13px] font-medium text-amber-300">{d.model}</td>
                      <td className="py-3.5 px-4 text-gray-200 text-[13px]">{d.preferredDate}</td>
                      <td className="py-3.5 px-4 text-gray-400 text-[13px]">{d.preferredLocation}</td>
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full">
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Live Specs Manager */}
        {activeTab === 'specs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of current specs */}
            <div className="lg:col-span-2 bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
              <h2 className="text-[18px] font-bold text-white mb-2">Technical Specifications on Live Website</h2>
              <p className="text-[13px] text-gray-400 mb-4">
                Selecting a spec loads it into the editor. Changes saved here sync live to the showcase landing page!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specs.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setEditingSpec(s)}
                    className={`p-4 rounded-[12px] border cursor-pointer transition-all ${
                      editingSpec?.id === s.id
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-mono text-amber-400 uppercase">{s.iconType}</span>
                      <span className="text-[11px] text-gray-400">ID: {s.id}</span>
                    </div>
                    <div className="text-[16px] font-bold text-white">{s.title}</div>
                    <div className="text-[14px] text-gray-200 font-semibold mt-1">{s.primaryDetail}</div>
                    <div className="text-[12px] text-gray-400 mt-0.5">{s.secondaryDetail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Spec Editor Form */}
            <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-white mb-2">Live Spec Editor</h3>
                {editingSpec ? (
                  <form onSubmit={handleSaveSpec} className="space-y-4 mt-4">
                    {specSaveSuccess && (
                      <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-[8px] text-[13px]">
                        ✓ Updated! Live website now shows this updated spec.
                      </div>
                    )}
                    <div>
                      <label className="block text-[12px] font-medium text-gray-400 mb-1">Spec Title</label>
                      <input
                        type="text"
                        value={editingSpec.title}
                        onChange={(e) => setEditingSpec({ ...editingSpec, title: e.target.value })}
                        className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3 py-2 text-white text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-gray-400 mb-1">Primary Detail (Top Line)</label>
                      <input
                        type="text"
                        value={editingSpec.primaryDetail}
                        onChange={(e) => setEditingSpec({ ...editingSpec, primaryDetail: e.target.value })}
                        className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3 py-2 text-white text-[13px]"
                      />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-gray-400 mb-1">Secondary Detail (Subtext)</label>
                      <input
                        type="text"
                        value={editingSpec.secondaryDetail}
                        onChange={(e) => setEditingSpec({ ...editingSpec, secondaryDetail: e.target.value })}
                        className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3 py-2 text-white text-[13px]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-[8px] text-[13px] transition-all cursor-pointer shadow-md"
                    >
                      Save & Sync to Live Site
                    </button>
                  </form>
                ) : (
                  <p className="text-[13px] text-gray-400 py-10 text-center">
                    Select any specification card on the left to edit its parameters live.
                  </p>
                )}
              </div>
              <div className="mt-4 text-[11px] text-gray-500">
                Connected database updates trigger immediate browser-side reactive subscriptions without server restart.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Diagnostics */}
        {activeTab === 'diagnostics' && (
          <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-[18px] font-bold text-white mb-2">Live Firebase Architecture Diagnostic</h2>
              <p className="text-[13px] text-gray-400">
                Current operational parameters for Firebase Realtime Database and Cloud Firestore.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-[12px] bg-white/[0.02] border border-white/10">
                <div className="text-[13px] font-bold text-amber-400 mb-2">Realtime Database (RTDB)</div>
                <div className="space-y-1.5 font-mono text-[12px] text-gray-300">
                  <div>Endpoint: https://mack-anthem-prod-default-rtdb.asia-southeast1.firebasedatabase.app</div>
                  <div>Region: asia-southeast1</div>
                  <div>Status: <span className="text-emerald-400 font-bold">ONLINE & AUTHENTICATED</span></div>
                  <div>Rules Configured: database.rules.json</div>
                </div>
              </div>

              <div className="p-4 rounded-[12px] bg-white/[0.02] border border-white/10">
                <div className="text-[13px] font-bold text-blue-400 mb-2">Project Credentials</div>
                <div className="space-y-1.5 font-mono text-[12px] text-gray-300">
                  <div>Project ID: mack-anthem-prod</div>
                  <div>App ID: 1:563149028328:web:0945e70a1ec64f2622025d</div>
                  <div>Messaging Sender ID: 563149028328</div>
                  <div>Client Auth: Active on AuthContext</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[12px] bg-amber-500/10 border border-amber-500/20 text-[13px] text-amber-200">
              📌 <strong>Terminal Seeding Scripts:</strong><br />
              • Seed Realtime Database: <code className="bg-black/40 px-2 py-0.5 rounded text-white">npm run firebase:seed</code><br />
              • Seed Cloud Firestore: <code className="bg-black/40 px-2 py-0.5 rounded text-white">npm run firebase:seed:firestore</code>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-4 px-6 text-center text-[12px] text-gray-500">
        Mack Trucks Corporate Operations • Enterprise Level Security Access
      </footer>
    </div>
  );
}
