'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { navigationItems } from '@/data/site-content';
import { Button } from '@/components/ui/Button';
import { HeaderTruckLogoIcon } from '@/components/ui/Icons';
import { triggerMackModal } from '@/components/ui/InteractionModals';
import { smoothScrollTo } from '@/lib/smoothScroll';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        const toggleBtn = document.getElementById('mobile-menu-toggle-btn');
        toggleBtn?.focus();
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href === '#' || href.length <= 1) return;

      const modalHashes = [
        '#configure',
        '#brochure',
        '#contact-dealer',
        '#find-dealer',
        '#request-quote',
        '#search',
        '#twitter',
        '#linkedin',
        '#facebook',
      ];
      if (modalHashes.includes(href)) return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        smoothScrollTo(href, 65, 750);
        window.history.pushState(null, '', href);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleAnchorClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [mobileMenuOpen]);

  return (
    <header
      id="main-header"
      className="w-full bg-[#FFFFFF] border-b border-[#F3F4F6] sticky top-0 z-50 h-[65px]"
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="w-full max-w-[1216px] mx-auto h-[64px] px-4 sm:px-6 lg:px-0 flex items-center justify-between">
        {/* Left Group: Brand + Desktop Nav (Figma: left: 0, width: 451.95px, gap: 32px) */}
        <div className="flex items-center space-x-[32px]">
          <Link
            href="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px]"
            aria-label="Mack Anthem Home"
          >
            {/* Logo Box: 32x32px, bg #000000, radius 4px */}
            <div className="w-[32px] h-[32px] bg-[#000000] rounded-[4px] flex items-center justify-center shrink-0">
              <HeaderTruckLogoIcon />
            </div>

            {/* Brand text: offset 40px from group origin (8px gap after 32px box) */}
            <span className="ml-[8px] text-[20px] font-bold leading-[28px] text-[#111827]">
              MACK
            </span>
          </Link>

          {/* Desktop Navigation (grouped with Brand in Figma) */}
          <nav
            className="hidden md:flex items-center space-x-[32px]"
            aria-label="Main Navigation"
          >
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  smoothScrollTo(item.href, 65, 750);
                  window.history.pushState(null, '', item.href);
                }}
                className={`text-[16px] leading-[24px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px] cursor-pointer ${
                  item.isActive
                    ? 'font-medium text-[#111827]'
                    : 'font-normal text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Actions Desktop: Search + Contact Dealer (Figma: left: 1030.67px, width: 185.33px, gap: 32px) */}
        <div className="hidden md:flex items-center space-x-[32px]">
          <button
            type="button"
            aria-label="Search"
            onClick={() => triggerMackModal('search')}
            className="text-[#4B5563] hover:text-[#111827] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px] cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M13 6.5C13 7.9344 12.54 9.2594 11.75 10.3344L15.71 14.2937C16.1 14.6844 16.1 15.3188 15.71 15.7094C15.32 16.1 14.68 16.1 14.29 15.7094L10.34 11.75C9.26 12.5375 7.94 13 6.5 13C2.91 13 0 10.0906 0 6.5C0 2.9094 2.91 0 6.5 0C10.09 0 13 2.9094 13 6.5ZM6.5 11C7.09 11 7.68 10.8836 8.22 10.6575C8.77 10.4313 9.27 10.0998 9.68 9.682C10.1 9.2641 10.43 8.768 10.66 8.2221C10.89 7.6761 11 7.0909 11 6.5C11 5.9091 10.89 5.3239 10.66 4.7779C10.43 4.232 10.1 3.7359 9.68 3.318C9.27 2.9002 8.77 2.5687 8.22 2.3425C7.68 2.1164 7.09 2 6.5 2C5.91 2 5.33 2.1164 4.78 2.3425C4.23 2.5687 3.74 2.9002 3.32 3.318C2.9 3.7359 2.57 4.232 2.34 4.7779C2.12 5.3239 2 5.9091 2 6.5C2 7.0909 2.12 7.6761 2.34 8.2221C2.57 8.768 2.9 9.2641 3.32 9.682C3.74 10.0998 4.23 10.4313 4.78 10.6575C5.33 10.8836 5.91 11 6.5 11Z"
                fill="#4B5563"
              />
            </svg>
          </button>
          <Button
            variant="primary-black"
            exactWidth={153.33}
            exactHeight={40}
            href="#contact-dealer"
            className="text-[16px] font-medium"
          >
            Contact Dealer
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            id="mobile-menu-toggle-btn"
            aria-controls="mobile-navigation-drawer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="md:hidden bg-[#FFFFFF] border-b border-[#F3F4F6] px-6 py-4 shadow-lg transition-all duration-200 ease-in-out"
        >
          <nav className="flex flex-col space-y-4" aria-label="Mobile Navigation">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    smoothScrollTo(item.href, 65, 750);
                    window.history.pushState(null, '', item.href);
                  }, 120);
                }}
                className={`text-[16px] leading-[24px] py-2 px-3 text-center transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[8px] active:bg-gray-100 ${
                  item.isActive
                    ? 'font-semibold text-[#111827] bg-gray-50'
                    : 'font-normal text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerMackModal('search');
                }}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-[6px] border border-gray-300 text-[14px] font-medium text-[#111827] bg-[#F9FAFB] hover:bg-gray-100 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="7" cy="7" r="5" />
                  <line x1="10.5" y1="10.5" x2="15" y2="15" />
                </svg>
                <span>Search Models & Specs (Ctrl+K)</span>
              </button>
              <Button
                variant="primary-black"
                exactWidth="100%"
                exactHeight={44}
                href="#contact-dealer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[14px] font-medium"
              >
                Contact Dealer
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
