'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { navigationItems } from '@/data/site-content';
import { Button } from '@/components/ui/Button';

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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
              <svg
                width="17.5"
                height="14"
                viewBox="0 0 17.5 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFFFFF]"
                aria-hidden="true"
              >
                {/* Official Mack Truck Silhouette Vector from Figma SVG */}
                <path
                  d="M1.312 0C0.588 0 0 0.5879 0 1.3125V10.0625C0 10.7871 0.588 11.375 1.312 11.375H1.75C1.75 12.8242 2.926 14 4.375 14C5.824 14 7 12.8242 7 11.375H10.5C10.5 12.8242 11.676 14 13.125 14C14.574 14 15.75 12.8242 15.75 11.375H16.625C17.109 11.375 17.5 10.984 17.5 10.5C17.5 10.016 17.109 9.625 16.625 9.625V7.875V7V6.4887C16.625 6.0238 16.442 5.5781 16.114 5.25L14 3.1363C13.672 2.8082 13.226 2.625 12.761 2.625H11.375V1.3125C11.375 0.5879 10.787 0 10.062 0H1.312ZM11.375 4.375H12.761L14.875 6.4887V7H11.375V4.375ZM3.062 11.375C3.062 11.0269 3.201 10.6931 3.447 10.4469C3.693 10.2008 4.027 10.0625 4.375 10.0625C4.723 10.0625 5.057 10.2008 5.303 10.4469C5.549 10.6931 5.688 11.0269 5.688 11.375C5.688 11.7231 5.549 12.0569 5.303 12.3031C5.057 12.5492 4.723 12.6875 4.375 12.6875C4.027 12.6875 3.693 12.5492 3.447 12.3031C3.201 12.0569 3.062 11.7231 3.062 11.375ZM13.125 10.0625C13.473 10.0625 13.807 10.2008 14.053 10.4469C14.299 10.6931 14.438 11.0269 14.438 11.375C14.438 11.7231 14.299 12.0569 14.053 12.3031C13.807 12.5492 13.473 12.6875 13.125 12.6875C12.777 12.6875 12.443 12.5492 12.197 12.3031C11.951 12.0569 11.812 11.7231 11.812 11.375C11.812 11.0269 11.951 10.6931 12.197 10.4469C12.443 10.2008 12.777 10.0625 13.125 10.0625Z"
                  fill="#FFFFFF"
                />
              </svg>
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
                className={`text-[16px] leading-[24px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px] ${
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
            className="text-[#4B5563] hover:text-[#111827] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px]"
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
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[16px] leading-[24px] py-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px] ${
                  item.isActive
                    ? 'font-medium text-[#111827]'
                    : 'font-normal text-[#4B5563] hover:text-[#111827]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2">
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
