import React from 'react';
import Link from 'next/link';
import { HeaderTruckLogoIcon } from '@/components/ui/Icons';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col justify-between selection:bg-[#F59E0B] selection:text-black">
      <header className="w-full border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-[32px] h-[32px] bg-[#000000] border border-white/20 rounded-[4px] flex items-center justify-center shrink-0 shadow-sm">
            <HeaderTruckLogoIcon />
          </div>
          <span className="text-[20px] font-bold tracking-wider text-white">MACK</span>
        </Link>
        <Link
          href="/"
          className="text-[14px] text-gray-400 hover:text-white transition-colors"
        >
          ← Return to Highway
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-[560px] w-full text-center bg-[#111827]/90 border border-white/10 rounded-[20px] p-8 sm:p-12 shadow-2xl backdrop-blur-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[36px] mb-6">
            🛑
          </div>

          <div className="text-[72px] sm:text-[84px] font-black leading-none text-white tracking-tighter">
            4<span className="text-amber-400">0</span>4
          </div>

          <h1 className="text-[24px] sm:text-[28px] font-bold text-white mt-3">
            Off The Route — Destination Not Found
          </h1>

          <p className="text-[15px] text-gray-400 mt-2 max-w-md mx-auto">
            The mile marker or highway exit you requested cannot be reached. You may have typed an invalid address or the vehicle has moved.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-[8px] transition-all shadow-lg active:scale-98 text-[14px]"
            >
              Return to Showcase Home
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-3 rounded-[8px] transition-colors text-[14px] border border-white/10"
            >
              Customer Fleet Portal
            </Link>
            <Link
              href="/admin"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-gray-300 font-medium px-4 py-3 rounded-[8px] transition-colors text-[14px]"
            >
              Corporate Admin
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-white/10 py-4 px-6 text-center text-[12px] text-gray-500">
        © 2026 Mack Trucks, Inc. Built for the road ahead.
      </footer>
    </div>
  );
}
