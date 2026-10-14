'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { HeaderTruckLogoIcon, GoogleIcon } from '@/components/ui/Icons';
import { DemoAdminButton } from '@/components/ui/DemoAdminButton';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, loginWithGoogle, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

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
    setResetSuccessMessage('');
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
    setResetSuccessMessage('');

    try {
      const res = await login(email, password);
      if (res.success) {
      } else {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('পাসওয়ার্ড রিসেট করতে একটি সঠিক ইমেইল অ্যাড্রেস লিখুন (Please enter a valid email address).');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setResetSuccessMessage('');

    try {
      const res = await resetPassword(email);
      if (res.success) {
        setResetSuccessMessage(
          'আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। দয়া করে ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন। (A password reset link has been sent to your email.)'
        );
      } else {
        setErrorMessage(res.error || 'Password reset request failed.');
      }
    } catch {
      setErrorMessage('পাসওয়ার্ড রিসেট ইমেইল পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between selection:bg-[#F59E0B] selection:text-black">
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-[32px] h-[32px] bg-[#000000] border border-white/20 rounded-[4px] flex items-center justify-center shrink-0 shadow-sm">
            <HeaderTruckLogoIcon />
          </div>
          <span className="text-[20px] font-bold tracking-wider text-white">MACK</span>
        </Link>
        <Link href="/" className="text-[14px] text-gray-400 hover:text-white transition-colors">
          ← Return to Showcase
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-[#111827]/90 border border-white/10 rounded-[16px] p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-6">
            <h1 className="text-[28px] font-bold text-white tracking-tight">
              {isResetMode ? 'Reset Your Password' : 'Mack Enterprise Access'}
            </h1>
            <p className="text-[14px] text-gray-400 mt-1">
              {isResetMode
                ? 'Enter your registered email address to receive a secure password reset link.'
                : 'Sign in to manage fleet operations, quotes, and specs.'}
            </p>
          </div>

          {resetSuccessMessage && (
            <div className="mb-5 p-4 rounded-[10px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[13px] flex items-start gap-2.5">
              <span className="font-bold text-[16px] leading-none mt-0.5">✓</span>
              <span className="leading-relaxed">{resetSuccessMessage}</span>
            </div>
          )}

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

          {isResetMode ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-gray-300 mb-1.5" htmlFor="reset-email-input">
                  Registered Email Address
                </label>
                <input
                  id="reset-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-[#1F2937] border border-gray-700 rounded-[8px] px-3.5 py-2.5 text-white placeholder-gray-500 text-[14px] focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[15px] py-3 rounded-[8px] transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Password Reset Link</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setErrorMessage('');
                  setResetSuccessMessage('');
                }}
                className="w-full py-2.5 text-[13px] text-gray-400 hover:text-white transition-colors cursor-pointer text-center block"
              >
                ← Back to Sign In
              </button>
            </form>
          ) : (
            <>
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
                <span className="shrink mx-4 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
                  Or evaluator access
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <DemoAdminButton className="mb-5" />

              <div className="relative flex py-2 items-center mb-5">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="shrink mx-4 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
                  Or Sign in with Credentials
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

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
                      className="text-[12px] text-gray-400 hover:text-white cursor-pointer"
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
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setErrorMessage('');
                        setResetSuccessMessage('');
                      }}
                      className="text-[12px] text-amber-400 hover:text-amber-300 font-medium cursor-pointer transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
            </>
          )}

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[13px] text-gray-400">
              Need a commercial customer fleet account?{' '}
              <Link
                href="/register"
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-white/10 py-4 px-6 text-center text-[12px] text-gray-500">
        © 2026 Mack Trucks, Inc. All rights reserved. Connected to Live Firebase Operations.
      </footer>
    </div>
  );
}
