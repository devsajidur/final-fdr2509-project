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
import { DashboardQuotesTab } from '@/components/dashboard/DashboardQuotesTab';
import { DashboardTestDrivesTab } from '@/components/dashboard/DashboardTestDrivesTab';
import { DashboardConfigurationsTab } from '@/components/dashboard/DashboardConfigurationsTab';
import { DashboardTcoTab } from '@/components/dashboard/DashboardTcoTab';
import { DashboardFinancingTab } from '@/components/dashboard/DashboardFinancingTab';
import { DashboardQuoteModal } from '@/components/dashboard/DashboardQuoteModal';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, loginWithGoogle } = useAuth();

  const [quotes, setQuotes] = useState<QuoteRequestRecord[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'testdrive' | 'configs' | 'tco' | 'mfs'>('quotes');

  const [tdModel, setTdModel] = useState('Mack Anthem 70" Stand-Up Sleeper');
  const [tdDate, setTdDate] = useState('2026-10-28');
  const [tdLocation, setTdLocation] = useState('Mack Regional Dealer — Chicago North Hub');
  const [tdSubmitting, setTdSubmitting] = useState(false);
  const [tdSuccess, setTdSuccess] = useState(false);

  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [newQuoteEngine, setNewQuoteEngine] = useState('Mack MP8 13L — 505 HP');
  const [newQuoteTimeframe, setNewQuoteTimeframe] = useState('Within 30 Days');
  const [newQuoteMsg, setNewQuoteMsg] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteToast, setQuoteToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [tcoFleetSize, setTcoFleetSize] = useState(10);
  const [tcoAnnualMiles, setTcoAnnualMiles] = useState(120000);
  const [tcoFuelPrice, setTcoFuelPrice] = useState(3.85);
  const [tcoSubmitting, setTcoSubmitting] = useState(false);
  const [tcoSuccess, setTcoSuccess] = useState(false);

  const baselineGal = (tcoFleetSize * tcoAnnualMiles) / 6.8;
  const anthemGal = (tcoFleetSize * tcoAnnualMiles) / 8.0;
  const annualGalSaved = Math.max(0, Math.round(baselineGal - anthemGal));
  const annualDollarsSaved = Math.round(annualGalSaved * tcoFuelPrice);
  const fiveYearSavings = annualDollarsSaved * 5;
  const co2ReductionTons = Math.round((annualGalSaved * 10.18) / 1000);

  const [mfsUnits, setMfsUnits] = useState(5);
  const [mfsStructure, setMfsStructure] = useState<'lease' | 'loan'>('lease');
  const [mfsTerm, setMfsTerm] = useState(48); // months
  const [mfsDownPct, setMfsDownPct] = useState(15); // %
  const [mfsSubmitting, setMfsSubmitting] = useState(false);
  const [mfsSuccess, setMfsSuccess] = useState(false);

  const mfsTotalCapCost = mfsUnits * 235000;
  const mfsDownPayment = Math.round((mfsTotalCapCost * mfsDownPct) / 100);
  const mfsFinanced = mfsTotalCapCost - mfsDownPayment;
  const mfsMonthlyRate = (mfsStructure === 'lease' ? 0.049 : 0.069) / 12;
  const mfsMonthlyPayment = Math.round(
    (mfsFinanced * (mfsMonthlyRate * Math.pow(1 + mfsMonthlyRate, mfsTerm))) /
      (Math.pow(1 + mfsMonthlyRate, mfsTerm) - 1)
  );

  useEffect(() => {
    if (!user) return;
    const unsubQuotes = subscribeUserQuotes(user.email, (liveQuotes) => {
      setQuotes(liveQuotes);
    });
    const unsubDrives = subscribeTestDrives((liveDrives) => {
      const userDrives = liveDrives.filter(
        (d) => d.email.toLowerCase() === user.email.toLowerCase()
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
      setQuoteToast({
        type: 'success',
        text: 'Dealer test drive reservation submitted. A Mack specialist will contact you.',
      });
      setTimeout(() => setTdSuccess(false), 4000);
    } catch (err) {
      setQuoteToast({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not schedule test drive. Please try again.',
      });
    } finally {
      setTdSubmitting(false);
      setTimeout(() => setQuoteToast(null), 5000);
    }
  };

  const handleCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || quoteSubmitting) return;
    setQuoteSubmitting(true);
    try {
      const res = await submitQuoteToFirestore({
        name: user.displayName,
        email: user.email,
        phone: user.phone,
        company: user.company,
        fleetSize: user.fleetSize,
        selectedEngine: newQuoteEngine,
        estimatedPrice: '$235,000',
        timeFrame: newQuoteTimeframe,
        message: newQuoteMsg.trim() || undefined,
        zipCode: '60601',
      });
      setShowQuoteForm(false);
      setNewQuoteMsg('');
      setQuoteToast({
        type: 'success',
        text: res.isRealtime
          ? 'Quote request submitted and synced to Firebase.'
          : 'Quote request saved. It will sync to Firebase when the connection allows.',
      });
    } catch (err) {
      console.error(err);
      setQuoteToast({ type: 'error', text: 'Could not submit your quote. Please try again.' });
    } finally {
      setQuoteSubmitting(false);
      setTimeout(() => setQuoteToast(null), 5000);
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
      setQuoteToast({
        type: 'success',
        text: `TCO package quote for ${tcoFleetSize} units submitted to Mack Fleet Operations.`,
      });
      setTimeout(() => setTcoSuccess(false), 4000);
    } catch (err) {
      setQuoteToast({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not save TCO quote. Please try again.',
      });
    } finally {
      setTcoSubmitting(false);
      setTimeout(() => setQuoteToast(null), 5000);
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
      setQuoteToast({
        type: 'success',
        text: `MFS financing request for ${mfsUnits} units submitted successfully.`,
      });
      setTimeout(() => setMfsSuccess(false), 4000);
    } catch (err) {
      setQuoteToast({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not submit MFS application. Please try again.',
      });
    } finally {
      setMfsSubmitting(false);
      setTimeout(() => setQuoteToast(null), 5000);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between">
        <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-[32px] h-[32px] bg-[#000000] border border-white/20 rounded-[4px] flex items-center justify-center shrink-0 shadow-sm">
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

              <Link
                href="/login"
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-[8px] transition-all cursor-pointer shadow-lg active:scale-98 text-[14px]"
              >
                Sign In with Email
              </Link>
              <Link
                href="/register"
                className="block w-full border border-gray-700 hover:bg-gray-800 text-gray-200 font-medium py-2.5 rounded-[8px] text-[14px] transition-colors"
              >
                Create a Fleet Account
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
      <header className="w-full bg-[#111827]/90 border-b border-white/10 sticky top-0 z-30 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-[32px] h-[32px] bg-[#000000] border border-blue-500/30 rounded-[4px] flex items-center justify-center shrink-0 shadow-sm">
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

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 py-8">
        {quoteToast && (
          <div
            className={`mb-6 p-4 rounded-[12px] border text-[14px] flex items-center justify-between gap-3 shadow-lg ${
              quoteToast.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                : 'bg-red-500/20 border-red-500/40 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span>{quoteToast.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{quoteToast.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setQuoteToast(null)}
              className="text-gray-400 hover:text-white text-[16px] cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

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
                    <span>Signed in with Google</span>
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

        {activeTab === 'quotes' && (
          <DashboardQuotesTab
            quotes={quotes}
            onRequestNewQuote={() => setShowQuoteForm(true)}
          />
        )}

        {activeTab === 'testdrive' && (
          <DashboardTestDrivesTab
            testDrives={testDrives}
            tdModel={tdModel}
            setTdModel={setTdModel}
            tdDate={tdDate}
            setTdDate={setTdDate}
            tdLocation={tdLocation}
            setTdLocation={setTdLocation}
            tdSubmitting={tdSubmitting}
            tdSuccess={tdSuccess}
            onBookTestDrive={handleBookTestDrive}
          />
        )}

        {activeTab === 'configs' && <DashboardConfigurationsTab />}

        {activeTab === 'tco' && (
          <DashboardTcoTab
            tcoFleetSize={tcoFleetSize}
            setTcoFleetSize={setTcoFleetSize}
            tcoAnnualMiles={tcoAnnualMiles}
            setTcoAnnualMiles={setTcoAnnualMiles}
            tcoFuelPrice={tcoFuelPrice}
            setTcoFuelPrice={setTcoFuelPrice}
            annualDollarsSaved={annualDollarsSaved}
            annualGalSaved={annualGalSaved}
            fiveYearSavings={fiveYearSavings}
            co2ReductionTons={co2ReductionTons}
            tcoSubmitting={tcoSubmitting}
            tcoSuccess={tcoSuccess}
            onSaveTcoQuote={handleSaveTcoQuote}
          />
        )}

        {activeTab === 'mfs' && (
          <DashboardFinancingTab
            mfsUnits={mfsUnits}
            setMfsUnits={setMfsUnits}
            mfsStructure={mfsStructure}
            setMfsStructure={setMfsStructure}
            mfsTerm={mfsTerm}
            setMfsTerm={setMfsTerm}
            mfsDownPct={mfsDownPct}
            setMfsDownPct={setMfsDownPct}
            mfsDownPayment={mfsDownPayment}
            mfsFinanced={mfsFinanced}
            mfsTotalCapCost={mfsTotalCapCost}
            mfsMonthlyPayment={mfsMonthlyPayment}
            mfsSubmitting={mfsSubmitting}
            mfsSuccess={mfsSuccess}
            onSaveMfsQuote={handleSaveMfsQuote}
          />
        )}

        <DashboardQuoteModal
          isOpen={showQuoteForm}
          onClose={() => setShowQuoteForm(false)}
          engine={newQuoteEngine}
          setEngine={setNewQuoteEngine}
          timeframe={newQuoteTimeframe}
          setTimeframe={setNewQuoteTimeframe}
          message={newQuoteMsg}
          setMessage={setNewQuoteMsg}
          submitting={quoteSubmitting}
          onSubmit={handleCreateQuote}
        />
      </main>

      <footer className="w-full border-t border-white/10 py-6 px-4 sm:px-8 text-center text-gray-500 text-[12px]">
        Mack Customer Fleet Operations Center • Real-time synchronization active with Firebase project <code className="text-gray-400">{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not configured'}</code>
      </footer>
    </div>
  );
}
