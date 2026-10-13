'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { navigationItems } from '@/data/site-content';
import { Button } from '@/components/ui/Button';
import { HeaderTruckLogoIcon, GoogleIcon } from '@/components/ui/Icons';
import { triggerMackModal } from '@/components/ui/InteractionModals';
import { smoothScrollTo } from '@/lib/smoothScroll';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const router = useRouter();
  const { user, loginWithGoogle, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const portalDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (portalOpen) setPortalOpen(false);
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          const toggleBtn = document.getElementById('mobile-menu-toggle-btn');
          toggleBtn?.focus();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        portalDropdownRef.current &&
        !portalDropdownRef.current.contains(e.target as Node)
      ) {
        setPortalOpen(false);
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
        smoothScrollTo(href, 65);
        window.history.pushState(null, '', href);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleAnchorClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [mobileMenuOpen, portalOpen]);

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
                  smoothScrollTo(item.href, 65);
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

        {/* Right Actions Desktop: Search + Fleet Portal + Contact Dealer */}
        <div className="hidden md:flex items-center space-x-[20px] lg:space-x-[24px]">
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

          {/* Fleet Portal Account Popover Trigger */}
          <div className="relative" ref={portalDropdownRef}>
            {user ? (
              <button
                id="header-fleet-portal-btn"
                type="button"
                onClick={() => setPortalOpen(!portalOpen)}
                className="flex items-center space-x-2 py-1.5 px-3 rounded-[6px] bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] text-[14px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer"
                aria-expanded={portalOpen}
                aria-haspopup="true"
              >
                <div className="w-[22px] h-[22px] rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {user.displayName.charAt(0)}
                </div>
                <span className="max-w-[120px] truncate">{user.displayName.split(' ')[0]}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-150 ${portalOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            ) : (
              <button
                id="header-fleet-portal-btn"
                type="button"
                onClick={() => setPortalOpen(!portalOpen)}
                className="flex items-center space-x-1.5 py-1.5 px-3 rounded-[6px] bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] text-[14px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer"
                aria-expanded={portalOpen}
                aria-haspopup="true"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Fleet Portal</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={`transition-transform duration-150 ${portalOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}

            {/* Dropdown Menu */}
            {portalOpen && (
              <div
                id="header-portal-popover"
                className="absolute right-0 top-[48px] w-[310px] bg-[#111827] text-white border border-white/15 rounded-[12px] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {user ? (
                  <>
                    <div className="pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[34px] h-[34px] rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                          {user.displayName.charAt(0)}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-[14px] text-white truncate">{user.displayName}</div>
                          <div className="text-[11px] text-gray-400 truncate">{user.email}</div>
                        </div>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400 bg-white/[0.04] px-2.5 py-1 rounded">
                        <span className="truncate">{user.company || 'Commercial Partner'}</span>
                        <span className="font-mono text-amber-400 font-semibold">{user.role === 'admin' ? 'CORPORATE' : 'FLEET TIER'}</span>
                      </div>
                    </div>

                    <div className="py-2.5 space-y-1 text-[13px]">
                      <Link
                        href="/dashboard"
                        onClick={() => setPortalOpen(false)}
                        className="flex items-center justify-between px-2.5 py-2 rounded-[6px] hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>📊</span>
                          <span>My Fleet Quotes & Inquiries</span>
                        </span>
                        <span className="text-[11px] text-gray-400">View →</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setPortalOpen(false)}
                        className="flex items-center justify-between px-2.5 py-2 rounded-[6px] hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>🧮</span>
                          <span>TCO & Fuel Savings Estimator</span>
                        </span>
                        <span className="text-[11px] text-amber-400 font-mono font-semibold">TCO</span>
                      </Link>

                      <Link
                        href="/dashboard"
                        onClick={() => setPortalOpen(false)}
                        className="flex items-center justify-between px-2.5 py-2 rounded-[6px] hover:bg-white/10 text-gray-200 hover:text-white transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>🚚</span>
                          <span>Schedule Dealer Test Drive</span>
                        </span>
                        <span className="text-[11px] text-blue-400 font-mono">BOOK</span>
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setPortalOpen(false)}
                          className="flex items-center justify-between px-2.5 py-2 rounded-[6px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-medium transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span>👑</span>
                            <span>Corporate Admin Console</span>
                          </span>
                          <span className="text-[11px] text-amber-400">Manage →</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[12px]">
                      <button
                        type="button"
                        onClick={async () => {
                          setPortalOpen(false);
                          await logout();
                          router.push('/');
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors cursor-pointer py-1 font-medium"
                      >
                        Sign Out
                      </button>
                      <Link
                        href="/login"
                        onClick={() => setPortalOpen(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        Switch Account
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pb-3 border-b border-white/10">
                      <div className="text-[11px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                        Commercial Client Access
                      </div>
                      <div className="text-[15px] font-bold text-white mt-0.5">Mack Fleet Portal</div>
                      <div className="text-[12px] text-gray-400 mt-0.5">
                        Manage active quotes, test drives, and saved specifications.
                      </div>
                    </div>

                    <div className="pt-3 space-y-2.5">
                      {/* 1-Click Google Sign In */}
                      <button
                        id="header-google-signin-btn"
                        type="button"
                        onClick={async () => {
                          setPortalOpen(false);
                          const res = await loginWithGoogle();
                          if (res.success) {
                            router.push('/dashboard');
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-[8px] bg-white hover:bg-gray-100 text-[#1F2937] font-semibold text-[13px] transition-all active:scale-[0.99] cursor-pointer shadow"
                      >
                        <GoogleIcon className="w-4 h-4 shrink-0" />
                        <span>Continue with Google</span>
                      </button>

                      <Link
                        href="/login"
                        onClick={() => setPortalOpen(false)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-[8px] bg-white/10 hover:bg-white/20 text-white font-medium text-[13px] transition-colors"
                      >
                        <span>Sign In with Email</span>
                        <span className="text-gray-400">→</span>
                      </Link>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[12px]">
                        <Link
                          href="/register"
                          onClick={() => setPortalOpen(false)}
                          className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2"
                        >
                          Register Fleet Account
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setPortalOpen(false)}
                          className="text-gray-400 hover:text-white"
                        >
                          Admin Panel 👑
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

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
                    smoothScrollTo(item.href, 65);
                    window.history.pushState(null, '', item.href);
                  }, 80);
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

            {/* Multi-Page Portals (Customer & Admin) */}
            <div className="pt-3 border-t border-gray-200 flex flex-col space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">
                Enterprise & Customer Fleet Access
              </div>

              {/* 1-Click Google Sign-In on mobile */}
              {!user && (
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    const res = await loginWithGoogle();
                    if (res.success) {
                      router.push('/dashboard');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-[8px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold text-[13px] shadow-sm transition-all active:scale-98 cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <span>Continue with Google</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-[6px] bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[13px] border border-blue-200 transition-colors active:scale-98"
                >
                  <span>👤</span>
                  <span>{user ? 'My Portal' : 'Customer'}</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-[6px] bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[13px] border border-amber-200 transition-colors active:scale-98"
                >
                  <span>👑</span>
                  <span>Admin</span>
                </Link>
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    router.push('/');
                  }}
                  className="w-full text-center py-1.5 text-[13px] font-medium text-red-500 hover:text-red-700 cursor-pointer"
                >
                  Sign Out ({user.displayName})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-1.5 text-[13px] font-medium text-gray-600 hover:text-black"
                >
                  Sign In / Switch Accounts →
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
