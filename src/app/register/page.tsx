'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HeaderTruckLogoIcon, GoogleIcon } from '@/components/ui/Icons';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    fleetSize: '6-20 Trucks',
    email: '',
    phone: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(res.error || 'Google sign-up failed.');
      }
    } catch {
      setErrorMessage('Google sign-up encountered an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await register(formData);
      if (res.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(res.error || 'Registration failed. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during account creation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between selection:bg-[#F59E0B] selection:text-black">
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-[32px] h-[32px] bg-[#000000] border border-white/20 rounded-[4px] flex items-center justify-center shrink-0 shadow-sm">
            <HeaderTruckLogoIcon />
          </div>
          <span className="text-[20px] font-bold tracking-wider text-white">MACK</span>
          <span className="text-[12px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-mono">REGISTRATION</span>
        </Link>
        <Link
          href="/login"
          className="text-[14px] text-gray-400 hover:text-white transition-colors"
        >
          Already have an account? <span className="text-white font-semibold underline">Sign In</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[540px] bg-[#111827]/90 border border-white/10 rounded-[16px] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <h1 className="text-[26px] sm:text-[28px] font-bold text-white tracking-tight">
              Create Fleet Customer Account
            </h1>
            <p className="text-[14px] text-gray-400 mt-1">
              Access real-time quotation tracking, test drive booking, and custom specs.
            </p>
          </div>

          <div className="mb-5">
            <button
              id="google-signup-btn"
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[10px] bg-white hover:bg-gray-100 text-[#1F2937] font-semibold text-[15px] border border-gray-300 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <GoogleIcon className="w-5 h-5 shrink-0" />
              <span>Sign Up with Google</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="shrink mx-4 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Or Register with Commercial Details</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-[8px] bg-red-500/20 border border-red-500/40 text-red-300 text-[13px] flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-300 mb-1" htmlFor="name">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Marcus Vance"
                  className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white placeholder-gray-500 text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-300 mb-1" htmlFor="company">
                  Company / Fleet Name
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Atlas Freight Logistics"
                  className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white placeholder-gray-500 text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-300 mb-1" htmlFor="fleetSize">
                  Current Fleet Size
                </label>
                <select
                  id="fleetSize"
                  name="fleetSize"
                  value={formData.fleetSize}
                  onChange={handleChange}
                  className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="1-5 Trucks">1 - 5 Trucks (Owner Operator)</option>
                  <option value="6-20 Trucks">6 - 20 Trucks (Regional Carrier)</option>
                  <option value="21-50 Trucks">21 - 50 Trucks (National Carrier)</option>
                  <option value="50+ Trucks">50+ Trucks (Enterprise Enterprise)</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-gray-300 mb-1" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white placeholder-gray-500 text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-300 mb-1" htmlFor="email">
                Commercial Work Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white placeholder-gray-500 text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-gray-300 mb-1" htmlFor="password">
                Create Secure Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white placeholder-gray-500 text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold text-[15px] py-3 rounded-[8px] transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register & Access Dashboard</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[13px] text-gray-400">
              Looking for corporate operations?{' '}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 font-semibold">
                Sign in with Corporate Admin ID
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-white/10 py-4 px-6 text-center text-[12px] text-gray-500">
        © 2026 Mack Trucks, Inc. All rights reserved.
      </footer>
    </div>
  );
}
