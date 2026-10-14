import React from 'react';
import Link from 'next/link';
import { footerContent } from '@/data/site-content';
import {
  FooterTruckLogoIcon,
  TwitterIcon,
  LinkedInIcon,
  FacebookIcon,
} from '@/components/ui/Icons';

export function Footer() {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#111827] min-h-[313px] pt-[48px] pb-8 text-[#9CA3AF] relative"
    >
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px] justify-between">
          <div className="w-full max-w-[280px] flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start">
              <div className="w-[32px] h-[32px] bg-[#FFFFFF] rounded-[4px] flex items-center justify-center shrink-0">
                <FooterTruckLogoIcon />
              </div>
              <span className="ml-[8px] text-[20px] font-bold leading-[28px] text-[#FFFFFF]">
                MACK
              </span>
            </div>
            <p className="text-[16px] leading-[24px] text-[#9CA3AF] mt-[16px]">
              {footerContent.brandTagline}
            </p>
          </div>

          <div className="w-full lg:w-[280px] flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF] mb-[16px]">
              Products
            </h4>
            <ul className="space-y-[8px] flex flex-col items-center sm:items-start">
              {footerContent.columns[0].links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[16px] leading-[24px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-[2px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-[280px] flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF] mb-[16px]">
              Support
            </h4>
            <ul className="space-y-[8px] flex flex-col items-center sm:items-start">
              {footerContent.columns[1].links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[16px] leading-[24px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-[2px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-[280px] flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF] mb-[16px]">
              Connect
            </h4>
            <div className="flex items-center justify-center sm:justify-start space-x-[16px] text-[#9CA3AF] pt-[3px]">
              <a
                href="#twitter"
                aria-label="Mack Trucks on Twitter"
                className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[2px]"
              >
                <TwitterIcon />
              </a>

              <a
                href="#linkedin"
                aria-label="Mack Trucks on LinkedIn"
                className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[2px]"
              >
                <LinkedInIcon />
              </a>

              <a
                href="#facebook"
                aria-label="Mack Trucks on Facebook"
                className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[2px]"
              >
                <FacebookIcon />
              </a>
            </div>

            <div className="mt-[16px] flex flex-col items-center sm:items-start space-y-[6px] text-[13px]">
              <Link href="/dashboard" className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors">
                Customer Fleet Portal →
              </Link>
              <Link href="/admin" className="text-[#9CA3AF] hover:text-amber-400 transition-colors">
                Corporate Admin Panel →
              </Link>
              <Link href="/login" className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors">
                Sign In / Demo Access
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-[48px] pt-[24px] pb-[88px] lg:pb-[24px] flex items-center justify-center">
          <p className="text-[14px] sm:text-[16px] leading-[24px] text-[#9CA3AF] text-center px-4">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
