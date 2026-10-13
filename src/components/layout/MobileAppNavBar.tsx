'use client';

import React, { useState, useEffect } from 'react';
import { triggerMackModal } from '@/components/ui/InteractionModals';
import { smoothScrollTo } from '@/lib/smoothScroll';

export function MobileAppNavBar() {
  const [activeTab, setActiveTab] = useState<'home' | 'specs' | 'build' | 'gallery' | 'search'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const specsEl = document.getElementById('specifications-section');
      const galleryEl = document.getElementById('gallery-section');

      if (galleryEl && scrollPos >= galleryEl.offsetTop) {
        setActiveTab('gallery');
      } else if (specsEl && scrollPos >= specsEl.offsetTop) {
        setActiveTab('specs');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string, tab: 'home' | 'specs' | 'gallery') => {
    setActiveTab(tab);
    smoothScrollTo(`#${id}`, 65);
  };

  return (
    <nav
      aria-label="Mobile App Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden pb-[env(safe-area-inset-bottom,0px)] transition-all duration-200"
    >
      <div className="flex items-center justify-around h-[60px] px-2 max-w-lg mx-auto">
        {/* 1. Home / Overview */}
        <button
          type="button"
          onClick={() => scrollToSection('hero-section', 'home')}
          aria-label="Mack Anthem Home"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-150 active:scale-90 ${
            activeTab === 'home' ? 'text-[#111827] font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'home' ? '2.5' : '1.8'}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-[10px] mt-0.5 tracking-tight">Overview</span>
        </button>

        {/* 2. Specs */}
        <button
          type="button"
          onClick={() => scrollToSection('specifications-section', 'specs')}
          aria-label="Technical Specifications"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-150 active:scale-90 ${
            activeTab === 'specs' ? 'text-[#111827] font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'specs' ? '2.5' : '1.8'}>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="text-[10px] mt-0.5 tracking-tight">Specs</span>
        </button>

        {/* 3. Center Highlight: Build & Price */}
        <button
          type="button"
          onClick={() => triggerMackModal('configure')}
          aria-label="Configure and Build Mack Anthem"
          className="flex flex-col items-center justify-center -mt-3.5 group active:scale-95 transition-transform"
        >
          <div className="w-[46px] h-[46px] rounded-full bg-[#000000] text-white flex items-center justify-center shadow-lg group-hover:bg-[#2563EB] transition-colors border-2 border-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span className="text-[10px] font-bold text-[#111827] mt-0.5">Build</span>
        </button>

        {/* 4. Gallery */}
        <button
          type="button"
          onClick={() => scrollToSection('gallery-section', 'gallery')}
          aria-label="Mack Gallery"
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all duration-150 active:scale-90 ${
            activeTab === 'gallery' ? 'text-[#111827] font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'gallery' ? '2.5' : '1.8'}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-[10px] mt-0.5 tracking-tight">Gallery</span>
        </button>

        {/* 5. Search */}
        <button
          type="button"
          onClick={() => triggerMackModal('search')}
          aria-label="Search Models and Specs"
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center text-gray-500 hover:text-gray-900 transition-all duration-150 active:scale-90"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[10px] mt-0.5 tracking-tight">Search</span>
        </button>
      </div>
    </nav>
  );
}
