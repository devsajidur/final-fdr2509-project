'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HeaderTruckLogoIcon, GoogleIcon } from '@/components/ui/Icons';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loginWithGoogle, loginAsDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(res.error || 'Google Sign-In was unable to complete.');
      }
    } catch {
      setErrorMessage('Google authentication encountered an error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both your email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await login(email, password);
      if (res.success) {
        // Redirection will be triggered by useEffect
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'admin' | 'customer') => {
    setLoading(true);
    setErrorMessage('');
    await loginAsDemo(role);
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between selection:bg-[#F59E0B] selection:text-black">
      {/* Top Header */}
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-[32px] h-[32px] bg-[#000000] border border-white/20 rounded-[4px] flex items-center justify-center shrink-0 shadow-sm">
            <HeaderTruckLogoIcon />
          </div>
          <span className="text-[20px] font-bold tracking-wider text-white">MACK</span>
          <span className="text-[12px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">PORTAL</span>
        </Link>
        <Link
          href="/"
          className="text-[14px] text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <span>← Back to Showcase</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-[#111827]/90 border border-white/10 rounded-[16px] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Header text */}
          <div className="text-center mb-6">
            <h1 className="text-[28px] font-bold text-white tracking-tight">Mack Enterprise Access</h1>
            <p className="text-[14px] text-gray-400 mt-1">
              Sign in to manage fleet operations, quotes, and specs.
            </p>
          </div>

          {/* Prominent Google Authentication Button */}
          <div className="mb-5">
            <button
              id="google-signin-btn"
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[10px] bg-white hover:bg-gray-100 text-[#1F2937] font-semibold text-[15px] border border-gray-300 shadow-md transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <GoogleIcon className="w-5 h-5 shrink-0" />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="shrink mx-4 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Or Use Instant Demo Access</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Quick Demo 1-Click Cards */}
          <div className="mb-5 p-4 rounded-[12px] bg-white/[0.03] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Quick Demo 1-Click Access
              </span>
              <span className="text-[11px] text-gray-400">Instant Demo Login</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                className="w-full flex items-center justify-between p-2.5 rounded-[8px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[13px] font-medium transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">👑</span>
                  <div className="text-left">
                    <div className="font-bold text-amber-200">Admin Panel</div>
                    <div className="text-[10px] text-amber-400/80">admin@macktrucks.com</div>
                  </div>
                </div>
                <span>→</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('customer')}
                disabled={loading}
                className="w-full flex items-center justify-between p-2.5 rounded-[8px] bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[13px] font-medium transition-all active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">👤</span>
                  <div className="text-left">
                    <div className="font-bold text-blue-200">Customer Portal</div>
                    <div className="text-[10px] text-blue-400/80">customer@fleetlogistics.com</div>
                  </div>
                </div>
                <span>→</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="shrink mx-4 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">Or Sign in with Credentials</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* Error Banner */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-gray-300 mb-1.5" htmlFor="email-input">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white placeholder-gray-500 text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[13px] font-medium text-gray-300" htmlFor="password-input">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[12px] text-gray-400 hover:text-white"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white placeholder-gray-500 text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-100 text-black font-semibold text-[15px] py-3 rounded-[8px] transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Portal</span>
              )}
            </button>
          </form>

          {/* Footer Register Link */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[13px] text-gray-400">
              Need a commercial customer fleet account?{' '}
              <Link href="/register" className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="w-full border-t border-white/10 py-4 px-6 text-center text-[12px] text-gray-500">
        © 2026 Mack Trucks, Inc. All rights reserved. Connected to Live Firebase Operations.
      </footer>
    </div>
  );
}
