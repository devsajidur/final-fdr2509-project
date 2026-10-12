'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { navigationItems } from '@/data/site-content';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      id="main-header"
      className="w-full bg-[#FFFFFF] border-b border-[#F3F4F6] sticky top-0 z-50 h-[65px]"
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="w-full max-w-[1216px] mx-auto h-[64px] px-4 sm:px-6 lg:px-0 flex items-center justify-between">
        {/* Brand Group */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px]"
            aria-label="Mack Anthem Home"
          >
            {/* Logo Box: 32x32px, bg #000000, radius 4px */}
            <div className="w-[32px] h-[32px] bg-[#000000] rounded-[4px] flex items-center justify-center shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#FFFFFF]"
                aria-hidden="true"
              >
                {/* Stylized Mack Bulldog / M Emblem */}
                <path
                  d="M4 18V8L9 14L12 10L15 14L20 8V18"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Brand text: offset 40px from group origin (8px gap after 32px box) */}
            <span className="ml-[8px] text-[20px] font-bold leading-[28px] tracking-tight text-[#111827]">
              MACK
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
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

        {/* Right Actions Desktop */}
        <div className="hidden md:flex items-center">
          <Button
            variant="primary-black"
            exactWidth={153.33}
            exactHeight={40}
            href="#contact-dealer"
            className="text-[14px] font-medium"
          >
            Contact Dealer
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[4px]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <div className="md:hidden bg-[#FFFFFF] border-b border-[#F3F4F6] px-6 py-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-[16px] leading-[24px] py-1 ${
                  item.isActive
                    ? 'font-medium text-[#111827]'
                    : 'font-normal text-[#4B5563]'
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
