'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { QuoteRequestRecord, TestDriveBooking } from '@/types';
import {
  subscribeUserQuotes,
  subscribeTestDrives,
  bookTestDrive,
  submitQuoteToFirestore,
} from '@/lib/firebase/firestore';
import { HeaderTruckLogoIcon, GoogleIcon } from '@/components/ui/Icons';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, loginAsDemo, loginWithGoogle } = useAuth();

  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'testdrive' | 'configs' | 'tco' | 'mfs'>('quotes');

  // Test drive form state
  const [tdModel, setTdModel] = useState('Mack Anthem 70" Stand-Up Sleeper');
  const [tdDate, setTdDate] = useState('2026-10-28');
  const [tdLocation, setTdLocation] = useState('Mack Regional Dealer — Chicago North Hub');
  const [tdSubmitting, setTdSubmitting] = useState(false);
  const [tdSuccess, setTdSuccess] = useState(false);

  // New quote modal / form inside dashboard
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [newQuoteEngine, setNewQuoteEngine] = useState('Mack MP8 13L — 505 HP');
  const [newQuoteTimeframe, setNewQuoteTimeframe] = useState('Within 30 Days');
  const [newQuoteMsg, setNewQuoteMsg] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  // TCO Calculator State
  const [tcoFleetSize, setTcoFleetSize] = useState(10);
  const [tcoAnnualMiles, setTcoAnnualMiles] = useState(120000);
  const [tcoFuelPrice, setTcoFuelPrice] = useState(3.85);
  const [tcoSubmitting, setTcoSubmitting] = useState(false);
  const [tcoSuccess, setTcoSuccess] = useState(false);

  // Live TCO Calculations (MP8 with Turbo Compounding saves ~1.2 MPG vs baseline 6.8 MPG)
  const baselineGal = (tcoFleetSize * tcoAnnualMiles) / 6.8;
  const anthemGal = (tcoFleetSize * tcoAnnualMiles) / 8.0;
  const annualGalSaved = Math.max(0, Math.round(baselineGal - anthemGal));
  const annualDollarsSaved = Math.round(annualGalSaved * tcoFuelPrice);
  const fiveYearSavings = annualDollarsSaved * 5;
  const co2ReductionTons = Math.round((annualGalSaved * 10.18) / 1000);

  // Mack Financial Services (MFS) State
  const [mfsUnits, setMfsUnits] = useState(5);
  const [mfsStructure, setMfsStructure] = useState<'lease' | 'loan'>('lease');
  const [mfsTerm, setMfsTerm] = useState(48); // months
  const [mfsDownPct, setMfsDownPct] = useState(15); // %
  const [mfsSubmitting, setMfsSubmitting] = useState(false);
  const [mfsSuccess, setMfsSuccess] = useState(false);

  // Unit base price ~$235,000
  const mfsTotalCapCost = mfsUnits * 235000;
  const mfsDownPayment = Math.round((mfsTotalCapCost * mfsDownPct) / 100);
  const mfsFinanced = mfsTotalCapCost - mfsDownPayment;
  // Estimated monthly payment (rate ~6.9% APR loan vs ~4.9% money factor lease)
  const mfsMonthlyRate = (mfsStructure === 'lease' ? 0.049 : 0.069) / 12;
  const mfsMonthlyPayment = Math.round(
    (mfsFinanced * (mfsMonthlyRate * Math.pow(1 + mfsMonthlyRate, mfsTerm))) /
      (Math.pow(1 + mfsMonthlyRate, mfsTerm) - 1)
  );

  // Subscribe to live data for this customer
  useEffect(() => {
    if (!user) return;
    const unsubQuotes = subscribeUserQuotes(user.email, (liveQuotes) => {
      setQuotes(liveQuotes);
    });
    const unsubDrives = subscribeTestDrives((liveDrives) => {
      const userDrives = liveDrives.filter(
        (d) => d.email.toLowerCase() === user.email.toLowerCase() || user.email.includes('customer@')
      );
      setTestDrives(userDrives);
    });

    return () => {
      unsubQuotes();
      unsubDrives();
    };
  }, [user]);

  const handleBookTestDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setTdSubmitting(true);
    try {
      await bookTestDrive({
        customerName: user.displayName,
        email: user.email,
        phone: user.phone || '+1 (555) 382-9901',
        model: tdModel,
        preferredDate: tdDate,
        preferredLocation: tdLocation,
        status: 'pending',
      });
      setTdSuccess(true);
      setTimeout(() => setTdSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setTdSubmitting(false);
    }
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setQuoteSubmitting(true);
    try {
      await submitQuoteToFirestore({
        name: user.displayName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        selectedEngine: newQuoteEngine,
        estimatedPrice: '$235,000',
        zipCode: '60601',
      });
      setShowQuoteForm(false);
      setNewQuoteMsg('');
    } catch (err) {
      console.error(err);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  const handleSaveTcoQuote = async () => {
    if (!user) return;
    setTcoSubmitting(true);
    try {
      await submitQuoteToFirestore({
        name: user.displayName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        selectedEngine: `Mack MP8 13L — TCO Optimized (${tcoFleetSize} Trucks Package)`,
        estimatedPrice: `$${(tcoFleetSize * 235000).toLocaleString()}`,
        zipCode: '60601',
      });
      setTcoSuccess(true);
      setTimeout(() => setTcoSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setTcoSubmitting(false);
    }
  };

  const handleSaveMfsQuote = async () => {
    if (!user) return;
    setMfsSubmitting(true);
    try {
      await submitQuoteToFirestore({
        name: user.displayName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        selectedEngine: `MFS Commercial ${mfsStructure.toUpperCase()} Pre-Approval (${mfsUnits} Units / ${mfsTerm} Mo)`,
        estimatedPrice: `$${mfsTotalCapCost.toLocaleString()} ($${mfsMonthlyPayment.toLocaleString()}/mo)`,
        zipCode: '60601',
      });
      setMfsSuccess(true);
      setTimeout(() => setMfsSuccess(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setMfsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in gate
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between">
        <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-[32px] h-[32px] bg-white rounded-[4px] flex items-center justify-center text-black">
              <HeaderTruckLogoIcon />
            </div>
            <span className="text-[20px] font-bold">MACK</span>
          </Link>
          <Link href="/login" className="text-gray-400 hover:text-white text-[14px]">
            Sign In →
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-[460px] w-full bg-[#111827] border border-white/10 rounded-[16px] p-8 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[28px] mb-4">
              👤
            </div>
            <h1 className="text-[24px] font-bold text-white mb-2">Customer Fleet Portal</h1>
            <p className="text-[14px] text-gray-400 mb-6">
              Please sign in to view your real-time truck quotes, configured models, dealer test drives, and TCO calculations.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={async () => {
                  await loginWithGoogle();
                  router.refresh();
                }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[8px] bg-white hover:bg-gray-100 text-[#1F2937] font-semibold text-[14px] transition-all cursor-pointer shadow-md active:scale-98"
              >
                <GoogleIcon className="w-5 h-5 shrink-0" />
                <span>Continue with Google</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await loginAsDemo('customer');
                  router.refresh();
                }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-[8px] transition-all cursor-pointer shadow-lg active:scale-98 text-[14px]"
              >
                1-Click Demo Login as Customer
              </button>
              <Link
                href="/login"
                className="block w-full border border-gray-700 hover:bg-gray-800 text-gray-200 font-medium py-2.5 rounded-[8px] text-[14px] transition-colors"
              >
                Sign In with Custom Email
              </Link>
            </div>
          </div>
        </main>

        <footer className="border-t border-white/10 py-4 text-center text-gray-500 text-[12px]">
          © 2026 Mack Trucks, Inc. Connected to Live Operations.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between selection:bg-[#F59E0B] selection:text-black">
      {/* Top Navigation */}
      <header className="w-full bg-[#111827]/90 border-b border-white/10 sticky top-0 z-30 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-[32px] h-[32px] bg-white rounded-[4px] flex items-center justify-center text-black">
                <HeaderTruckLogoIcon />
              </div>
              <span className="text-[20px] font-bold tracking-wider text-white">MACK</span>
            </Link>
            <span className="hidden sm:inline-block text-[12px] bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full font-mono font-medium">
              FLEET PORTAL
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-[14px] font-semibold text-white">{user.displayName}</div>
              <div className="text-[12px] text-gray-400">{user.company || 'Enterprise Customer'}</div>
            </div>
            <Link
              href="/"
              className="text-[13px] bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-1.5 rounded-[6px] transition-colors"
            >
              Showcase Home
            </Link>
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="text-[13px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-[6px] transition-colors font-medium"
              >
                Admin Panel →
              </Link>
            )}
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push('/');
              }}
              className="text-[13px] text-red-400 hover:text-red-300 transition-colors cursor-pointer px-2 py-1"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] border border-white/10 rounded-[16px] p-6 sm:p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-amber-400 text-[12px] font-bold uppercase tracking-wider">
                  Fleet Management Dashboard
                </span>
                {(user.email.includes('gmail') || user.displayName.includes('Google') || user.uid.includes('google')) && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] bg-white/10 text-white px-2.5 py-0.5 rounded-full border border-white/20 font-medium">
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>Verified Google Fleet Partner</span>
                  </span>
                )}
              </div>
              <h1 className="text-[26px] sm:text-[32px] font-extrabold text-white mt-1">
                Welcome back, {user.displayName}
              </h1>
              <p className="text-[14px] text-gray-400 mt-1 max-w-xl">
                Track active truck orders, simulate fuel and TCO savings, schedule dealer test drives, and structure commercial Mack financing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowQuoteForm(true)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-3 rounded-[8px] transition-all shadow-lg active:scale-98 cursor-pointer shrink-0"
            >
              + Request New Truck Quote
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111827] border border-white/10 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Active Quotes</div>
            <div className="text-[28px] font-extrabold text-white mt-1">{quotes.length}</div>
            <div className="text-[12px] text-amber-400 mt-1">Real-time Firebase Synced</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Test Drives Scheduled</div>
            <div className="text-[28px] font-extrabold text-white mt-1">{testDrives.length}</div>
            <div className="text-[12px] text-blue-400 mt-1">Regional Dealer Coordination</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Registered Fleet</div>
            <div className="text-[28px] font-extrabold text-white mt-1">{user.fleetSize || '25-50 Units'}</div>
            <div className="text-[12px] text-emerald-400 mt-1">Enterprise Fleet Tier</div>
          </div>
          <div className="bg-[#111827] border border-white/10 rounded-[12px] p-5">
            <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Dedicated Dealer Hub</div>
            <div className="text-[18px] font-bold text-white mt-1 truncate">Chicago North Mack</div>
            <div className="text-[12px] text-gray-400 mt-1">24/7 Dedicated Rep Available</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-6 gap-2 sm:gap-6 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'quotes'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            My Quotes & Inquiries ({quotes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tco')}
            className={`pb-3 text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'tco'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>TCO & Fuel Savings</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">CALC</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mfs')}
            className={`pb-3 text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'mfs'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>Mack Financing (MFS)</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono font-bold">CREDIT</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('testdrive')}
            className={`pb-3 text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'testdrive'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Book a Test Drive
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('configs')}
            className={`pb-3 text-[14px] sm:text-[15px] font-semibold transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
              activeTab === 'configs'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Saved Specs
          </button>
        </div>

        {/* TAB 1: Real-time Quotes */}
        {activeTab === 'quotes' && (
          <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-bold text-white">Live Commercial Quotation Pipeline</h2>
                <p className="text-[13px] text-gray-400">
                  Submissions made on the website or dashboard appear here instantly via Firebase Realtime Database.
                </p>
              </div>
              <span className="text-[12px] bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Live Connected
              </span>
            </div>

            {quotes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-[32px] mb-2">📋</div>
                <p className="text-[15px] text-gray-300 font-medium">No quote inquiries found under your account.</p>
                <p className="text-[13px] text-gray-500 mt-1">Click the button below to submit a custom quote request.</p>
                <button
                  type="button"
                  onClick={() => setShowQuoteForm(true)}
                  className="mt-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-[6px] text-[13px]"
                >
                  Create Quote Request
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 text-[12px] uppercase">
                      <th className="py-3 px-4">Quote ID</th>
                      <th className="py-3 px-4">Model & Powertrain</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4">Estimated Value</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {quotes.map((q) => (
                      <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[13px] text-gray-300">{q.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{q.model}</div>
                          <div className="text-[12px] text-gray-400">{q.message || 'Commercial Fleet Configuration'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-gray-400 text-[13px]">
                          {new Date(q.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-amber-400">
                          {q.estimatedValue ? `$${q.estimatedValue.toLocaleString()}` : '$235,000'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                              q.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : q.status === 'reviewing'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : q.status === 'contacted'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Book Test Drive */}
        {activeTab === 'testdrive' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
              <h2 className="text-[20px] font-bold text-white mb-2">Schedule Commercial Test Drive</h2>
              <p className="text-[14px] text-gray-400 mb-6">
                Take the Mack Anthem on the highway with your drivers. A certified commercial specialist will prepare the vehicle for your route requirements.
              </p>

              {tdSuccess && (
                <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-[8px] text-[14px]">
                  ✓ Test drive request recorded! Your local dealer will contact you to confirm.
                </div>
              )}

              <form onSubmit={handleBookTestDrive} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-300 mb-1">Select Truck Model</label>
                  <select
                    value={tdModel}
                    onChange={(e) => setTdModel(e.target.value)}
                    className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white text-[14px] focus:outline-none focus:border-amber-400"
                  >
                    <option value='Mack Anthem 70" Stand-Up Sleeper'>Mack Anthem 70&quot; Stand-Up Sleeper (MP8 505HP)</option>
                    <option value="Mack Anthem Day Cab 6x4">Mack Anthem Day Cab 6x4 (MP8 445HP)</option>
                    <option value='Mack Anthem 48" Flat Top Sleeper'>Mack Anthem 48&quot; Flat Top Sleeper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-300 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={tdDate}
                    onChange={(e) => setTdDate(e.target.value)}
                    className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white text-[14px] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-gray-300 mb-1">Dealer Hub Location</label>
                  <select
                    value={tdLocation}
                    onChange={(e) => setTdLocation(e.target.value)}
                    className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white text-[14px] focus:outline-none focus:border-amber-400"
                  >
                    <option value="Mack Regional Dealer — Chicago North Hub">Mack Regional Dealer — Chicago North Hub (Illinois)</option>
                    <option value="Mack Northeast Commercial Center — Allentown">Mack Northeast Commercial Center — Allentown (PA)</option>
                    <option value="Mack Southern Logistics Fleet Center — Dallas">Mack Southern Logistics Fleet Center — Dallas (TX)</option>
                    <option value="Mack West Coast Distribution Center — Reno">Mack West Coast Distribution Center — Reno (NV)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={tdSubmitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-[8px] transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {tdSubmitting ? 'Booking Test Drive...' : 'Confirm Test Drive Request'}
                </button>
              </form>
            </div>

            {/* Test Drive History */}
            <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-[18px] font-bold text-white mb-2">My Test Drive History</h3>
                <p className="text-[13px] text-gray-400 mb-4">
                  Past and upcoming test drive bookings recorded in your account.
                </p>

                {testDrives.length === 0 ? (
                  <p className="text-[13px] text-gray-500 py-6 text-center">No test drives scheduled yet.</p>
                ) : (
                  <div className="space-y-3">
                    {testDrives.map((d) => (
                      <div key={d.id} className="p-3.5 rounded-[8px] bg-white/[0.03] border border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white text-[14px]">{d.model}</div>
                          <div className="text-[12px] text-gray-400">{d.preferredLocation}</div>
                          <div className="text-[11px] text-amber-400 mt-0.5">Date: {d.preferredDate}</div>
                        </div>
                        <span className="text-[11px] bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full font-bold uppercase">
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 rounded-[8px] bg-amber-500/10 border border-amber-500/20 text-[13px] text-amber-300">
                💡 <strong>Fleet Tip:</strong> Commercial test drives include full access to Mack Connect telematics dashboard during your highway test run.
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Saved Configurations */}
        {activeTab === 'configs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded">CONFIG-01</span>
                <span className="text-[12px] text-gray-400">Saved on 2026-10-10</span>
              </div>
              <h3 className="text-[20px] font-bold text-white">Mack Anthem 70&quot; Stand-Up Sleeper</h3>
              <ul className="mt-4 space-y-2 text-[14px] text-gray-300">
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Engine:</span>
                  <span className="font-semibold">Mack MP8 13L (505 HP / 1,860 lb.-ft.)</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Transmission:</span>
                  <span className="font-semibold">mDRIVE 12-Speed Automated Manual</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Axle Configuration:</span>
                  <span className="font-semibold">6x4 Tandem Axle</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Sleeper Interior:</span>
                  <span className="font-semibold">Premium Driver Comfort Package</span>
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => alert('Downloading official Mack Anthem Technical Spec Sheet PDF...')}
                  className="flex-1 bg-white hover:bg-gray-100 text-black font-semibold py-2.5 rounded-[8px] text-[13px] transition-colors"
                >
                  Download Spec Sheet (PDF)
                </button>
              </div>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] bg-blue-500/20 text-blue-400 font-mono px-2 py-0.5 rounded">CONFIG-02</span>
                <span className="text-[12px] text-gray-400">Saved on 2026-10-12</span>
              </div>
              <h3 className="text-[20px] font-bold text-white">Mack Anthem Day Cab Regional Hauler</h3>
              <ul className="mt-4 space-y-2 text-[14px] text-gray-300">
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Engine:</span>
                  <span className="font-semibold">Mack MP8 13L (445 HP / 1,750 lb.-ft.)</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Transmission:</span>
                  <span className="font-semibold">mDRIVE HD 13-Speed with Creeper</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Fuel Capacity:</span>
                  <span className="font-semibold">Up to 300 Gallons Dual Aluminum</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Telematics:</span>
                  <span className="font-semibold">Mack Connect Active Fleet Analytics</span>
                </li>
              </ul>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => alert('Downloading official Mack Anthem Day Cab Spec Sheet PDF...')}
                  className="flex-1 bg-white hover:bg-gray-100 text-black font-semibold py-2.5 rounded-[8px] text-[13px] transition-colors"
                >
                  Download Spec Sheet (PDF)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Total Cost of Ownership (TCO) & Fuel Savings Calculator */}
        {activeTab === 'tco' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-bold text-white">Mack Anthem Total Cost of Ownership (TCO) Calculator</h2>
                    <span className="text-[11px] bg-amber-500/20 text-amber-400 font-mono px-2 py-0.5 rounded font-bold">MP8 HE ENGINE</span>
                  </div>
                  <p className="text-[13px] text-gray-400 mt-1">
                    Calculate real-world diesel fuel and operational savings across your commercial fleet based on Mack MP8 Turbo Compounding aerodynamic efficiency.
                  </p>
                </div>
                {tcoSuccess && (
                  <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-[8px] text-[13px] font-medium flex items-center gap-2">
                    <span>✓</span>
                    <span>TCO Calculation saved to your live quotation pipeline!</span>
                  </div>
                )}
              </div>

              {/* Input Sliders & Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mb-8">
                {/* 1. Fleet Size */}
                <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[13px] text-gray-300 font-medium">Fleet Size (Class 8 Units)</label>
                    <span className="text-[16px] font-bold text-amber-400 font-mono">{tcoFleetSize} Trucks</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={tcoFleetSize}
                    onChange={(e) => setTcoFleetSize(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>1 Unit</span>
                    <span>50 Units</span>
                    <span>100 Units</span>
                  </div>
                </div>

                {/* 2. Annual Mileage */}
                <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[13px] text-gray-300 font-medium">Annual Miles Per Truck</label>
                    <span className="text-[16px] font-bold text-blue-400 font-mono">{tcoAnnualMiles.toLocaleString()} mi</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={200000}
                    step={5000}
                    value={tcoAnnualMiles}
                    onChange={(e) => setTcoAnnualMiles(Number(e.target.value))}
                    className="w-full accent-blue-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>50k mi (Regional)</span>
                    <span>120k mi (Long-Haul)</span>
                    <span>200k mi</span>
                  </div>
                </div>

                {/* 3. Diesel Price */}
                <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[13px] text-gray-300 font-medium">Average Diesel Fuel Price</label>
                    <span className="text-[16px] font-bold text-emerald-400 font-mono">${tcoFuelPrice.toFixed(2)}/gal</span>
                  </div>
                  <input
                    type="range"
                    min={3.00}
                    max={6.00}
                    step={0.05}
                    value={tcoFuelPrice}
                    onChange={(e) => setTcoFuelPrice(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                    <span>$3.00/gal</span>
                    <span>$4.50/gal</span>
                    <span>$6.00/gal</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Live TCO Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-[12px] p-5">
                  <div className="text-[12px] uppercase text-amber-300 font-semibold tracking-wider">Annual Fleet Fuel Savings</div>
                  <div className="text-[30px] font-black text-amber-400 mt-1">${annualDollarsSaved.toLocaleString()}</div>
                  <div className="text-[12px] text-gray-400 mt-1 font-mono">+{annualGalSaved.toLocaleString()} gal diesel saved/yr</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-[12px] p-5">
                  <div className="text-[12px] uppercase text-emerald-300 font-semibold tracking-wider">5-Year TCO Advantage</div>
                  <div className="text-[30px] font-black text-emerald-400 mt-1">${fiveYearSavings.toLocaleString()}</div>
                  <div className="text-[12px] text-gray-400 mt-1 font-mono">Compared to 6.8 MPG industry baseline</div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-[12px] p-5">
                  <div className="text-[12px] uppercase text-blue-300 font-semibold tracking-wider">CO2 Carbon Reduced</div>
                  <div className="text-[30px] font-black text-blue-400 mt-1">{co2ReductionTons.toLocaleString()} Tons</div>
                  <div className="text-[12px] text-gray-400 mt-1 font-mono">EPA SmartWay Certified Reduction</div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-[12px] p-5">
                  <div className="text-[12px] uppercase text-purple-300 font-semibold tracking-wider">Estimated Fleet Value</div>
                  <div className="text-[30px] font-black text-white mt-1">${(tcoFleetSize * 235000).toLocaleString()}</div>
                  <div className="text-[12px] text-gray-400 mt-1 font-mono">Based on $235,000 MSRP per Anthem</div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-[12px] bg-white/[0.03] border border-white/10">
                <div className="text-[13px] text-gray-300 text-center sm:text-left">
                  💡 <strong>Fleet Manager Notice:</strong> Mack Anthem achieves up to <strong>8.0+ MPG</strong> highway fuel economy with Mack MP8-TC (Turbo Compounding), Wave Piston technology, and factory roof fairings.
                </div>
                <button
                  type="button"
                  disabled={tcoSubmitting}
                  onClick={handleSaveTcoQuote}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-[8px] text-[13px] transition-all shadow-md active:scale-98 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {tcoSubmitting ? 'Saving Analysis...' : `Request Quote for ${tcoFleetSize} Trucks →`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Mack Financial Services (MFS) Financing & Commercial Leasing */}
        {activeTab === 'mfs' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-white/10 rounded-[16px] p-6 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[20px] font-bold text-white">Mack Financial Services (MFS) Fleet Financing</h2>
                    <span className="text-[11px] bg-blue-500/20 text-blue-400 font-mono px-2 py-0.5 rounded font-bold">OEM DIRECT FINANCING</span>
                  </div>
                  <p className="text-[13px] text-gray-400 mt-1">
                    Structured commercial equipment financing, TRAC leasing, and capital loans tailored for owner-operators and enterprise carriers.
                  </p>
                </div>
                {mfsSuccess && (
                  <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-[8px] text-[13px] font-medium flex items-center gap-2">
                    <span>✓</span>
                    <span>MFS Credit Pre-Approval inquiry submitted to your Mack Commercial Representative!</span>
                  </div>
                )}
              </div>

              {/* Finance Controls */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 mb-6">
                {/* 1. Structure Type */}
                <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
                  <label className="block text-[13px] text-gray-300 font-medium mb-2">Financing Structure</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMfsStructure('lease')}
                      className={`py-2 px-3 rounded-[6px] text-[13px] font-semibold transition-all cursor-pointer ${
                        mfsStructure === 'lease'
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      TRAC Lease
                    </button>
                    <button
                      type="button"
                      onClick={() => setMfsStructure('loan')}
                      className={`py-2 px-3 rounded-[6px] text-[13px] font-semibold transition-all cursor-pointer ${
                        mfsStructure === 'loan'
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      Retail Loan
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2">
                    {mfsStructure === 'lease' ? 'Lower monthly payments with end-of-term buyout.' : 'Traditional ownership with depreciation benefits.'}
                  </div>
                </div>

                {/* 2. Units */}
                <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[13px] text-gray-300 font-medium">Trucks in Package</label>
                    <span className="text-[15px] font-bold text-white font-mono">{mfsUnits} Units</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={mfsUnits}
                    onChange={(e) => setMfsUnits(Number(e.target.value))}
                    className="w-full accent-blue-400 cursor-pointer mt-2"
                  />
                  <div className="text-[11px] text-gray-400 mt-2">Total Value: ${(mfsUnits * 235000).toLocaleString()}</div>
                </div>

                {/* 3. Term */}
                <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
                  <label className="block text-[13px] text-gray-300 font-medium mb-1">Term Length</label>
                  <select
                    value={mfsTerm}
                    onChange={(e) => setMfsTerm(Number(e.target.value))}
                    className="w-full bg-[#111827] border border-gray-700 rounded-[8px] px-3 py-2 text-white text-[14px] mt-1"
                  >
                    <option value={36}>36 Months (3 Years)</option>
                    <option value={48}>48 Months (4 Years)</option>
                    <option value={60}>60 Months (5 Years)</option>
                    <option value={72}>72 Months (6 Years)</option>
                  </select>
                  <div className="text-[11px] text-gray-400 mt-2">Optimized for truck lifecycle warranty</div>
                </div>

                {/* 4. Down Payment */}
                <div className="bg-[#1F2937]/60 border border-white/5 p-4 rounded-[12px]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[13px] text-gray-300 font-medium">Down Payment</label>
                    <span className="text-[15px] font-bold text-emerald-400 font-mono">{mfsDownPct}% (${mfsDownPayment.toLocaleString()})</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={5}
                    value={mfsDownPct}
                    onChange={(e) => setMfsDownPct(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer mt-2"
                  />
                  <div className="text-[11px] text-gray-400 mt-2">Financed: ${mfsFinanced.toLocaleString()}</div>
                </div>
              </div>

              {/* Monthly Estimate Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-600/20 to-blue-900/10 border border-blue-500/40 rounded-[12px] p-5">
                  <div className="text-[12px] uppercase text-blue-300 font-semibold tracking-wider">Estimated Fleet Monthly Payment</div>
                  <div className="text-[30px] font-black text-white mt-1">${mfsMonthlyPayment.toLocaleString()}<span className="text-[14px] text-gray-400 font-normal"> / mo</span></div>
                  <div className="text-[12px] text-blue-300 mt-1">For all {mfsUnits} Anthem units ({mfsTerm} mo term)</div>
                </div>

                <div className="bg-[#1F2937]/80 border border-white/10 rounded-[12px] p-5">
                  <div className="text-[12px] uppercase text-gray-400 font-semibold tracking-wider">Monthly Payment Per Single Unit</div>
                  <div className="text-[30px] font-black text-amber-400 mt-1">${Math.round(mfsMonthlyPayment / mfsUnits).toLocaleString()}<span className="text-[14px] text-gray-400 font-normal"> / unit</span></div>
                  <div className="text-[12px] text-gray-400 mt-1">Includes standard Mack powertrain warranty</div>
                </div>

                <div className="bg-[#1F2937]/80 border border-white/10 rounded-[12px] p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-[12px] uppercase text-emerald-400 font-semibold tracking-wider">OEM Direct Benefits</div>
                    <div className="text-[13px] text-gray-300 mt-1.5 space-y-1">
                      <div>✓ No prepayment penalty</div>
                      <div>✓ Seasonal payment flexibility</div>
                      <div>✓ Bundled insurance & telematics</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={mfsSubmitting}
                    onClick={handleSaveMfsQuote}
                    className="mt-3 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-[8px] text-[13px] transition-all cursor-pointer shadow active:scale-98 disabled:opacity-50"
                  >
                    {mfsSubmitting ? 'Submitting Application...' : 'Apply for MFS Fleet Pre-Approval →'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: New Custom Quote inside Dashboard */}
        {showQuoteForm && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111827] border border-white/20 rounded-[16px] max-w-[500px] w-full p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[18px] font-bold text-white">Request Direct Fleet Quote</h3>
                <button
                  type="button"
                  onClick={() => setShowQuoteForm(false)}
                  className="text-gray-400 hover:text-white text-[20px]"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateQuote} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-gray-300 mb-1">Engine Configuration</label>
                  <select
                    value={newQuoteEngine}
                    onChange={(e) => setNewQuoteEngine(e.target.value)}
                    className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2 text-white text-[14px]"
                  >
                    <option value="Mack MP8 13L — 505 HP">Mack MP8 13L — 505 HP (High Performance)</option>
                    <option value="Mack MP8 13L — 445 HP">Mack MP8 13L — 445 HP (Fuel Optimizer)</option>
                    <option value="Mack MP8 13L — 415 HP">Mack MP8 13L — 415 HP (Regional Carrier)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-300 mb-1">Expected Delivery Timeframe</label>
                  <select
                    value={newQuoteTimeframe}
                    onChange={(e) => setNewQuoteTimeframe(e.target.value)}
                    className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2 text-white text-[14px]"
                  >
                    <option value="Immediate">Immediate (Stock Inventory)</option>
                    <option value="Within 30 Days">Within 30 Days</option>
                    <option value="1-3 Months">1 - 3 Months</option>
                    <option value="Custom Build Schedule">Custom Build Schedule</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-gray-300 mb-1">Optional Fleet Notes</label>
                  <textarea
                    rows={3}
                    value={newQuoteMsg}
                    onChange={(e) => setNewQuoteMsg(e.target.value)}
                    placeholder="Specify trailer requirements, aerodynamic fairings, or warranty options..."
                    className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2 text-white text-[14px] placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowQuoteForm(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 rounded-[8px] text-[13px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 rounded-[8px] text-[13px] disabled:opacity-50"
                  >
                    {quoteSubmitting ? 'Submitting...' : 'Submit to Firebase'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 py-6 px-4 sm:px-8 text-center text-gray-500 text-[12px]">
        Mack Customer Fleet Operations Center • Real-time synchronization active with Firebase project <code className="text-gray-400">mack-anthem-prod</code>
      </footer>
    </div>
  );
}
