'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App-level runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-[#0A0D14] text-white">
      <div className="max-w-[480px] w-full bg-[#111827] border border-white/10 rounded-[16px] p-8 text-center shadow-2xl">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[24px] mb-4">
          ⚠️
        </div>
        <h2 className="text-[22px] font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-[14px] text-gray-400 mb-6 leading-relaxed">
          An unexpected issue interrupted your Mack Trucks portal experience. You can retry the operation or return to the main showcase.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-[8px] bg-amber-500 hover:bg-amber-400 text-black font-bold text-[14px] transition-all cursor-pointer shadow-md active:scale-98"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-[8px] bg-white/10 hover:bg-white/20 text-white font-medium text-[14px] transition-all text-center"
          >
            Return to Showcase
          </Link>
        </div>
      </div>
    </div>
  );
}
