import React from 'react';
import { footerContent } from '@/data/site-content';

export function Footer() {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#111827] lg:h-[313px] pt-[48px] pb-8 lg:pb-0 overflow-hidden text-[#9CA3AF]"
    >
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* 4 Columns Grid: 280px each, gap 32px */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px] justify-between">
          {/* Column 1: MACK Logo & Tagline */}
          <div className="w-full lg:w-[280px]">
            <div className="flex items-center">
              <div className="w-[32px] h-[32px] bg-[#FFFFFF] rounded-[4px] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#111827]"
                  aria-hidden="true"
                >
                  <path
                    d="M4 18V8L9 14L12 10L15 14L20 8V18"
                    stroke="#111827"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="ml-[8px] text-[20px] font-bold leading-[28px] tracking-tight text-[#FFFFFF]">
                MACK
              </span>
            </div>
            <p className="text-[14px] leading-[20px] text-[#9CA3AF] mt-[12px]">
              {footerContent.brandTagline}
            </p>
          </div>

          {/* Column 2: Products */}
          <div className="w-full lg:w-[280px]">
            <h4 className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF] mb-[16px]">
              Products
            </h4>
            <ul className="space-y-[12px]">
              {footerContent.columns[0].links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[16px] leading-[24px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-[2px]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="w-full lg:w-[280px]">
            <h4 className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF] mb-[16px]">
              Support
            </h4>
            <ul className="space-y-[12px]">
              {footerContent.columns[1].links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[16px] leading-[24px] text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-[2px]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect & Social Icons */}
          <div className="w-full lg:w-[280px]">
            <h4 className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF] mb-[16px]">
              Connect
            </h4>
            <div className="flex items-center space-x-[16px]">
              {/* X / Twitter */}
              <a
                href="#twitter"
                aria-label="Mack Trucks on X"
                className="w-[36px] h-[36px] rounded-full bg-[#1F2937] flex items-center justify-center text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-[#374151] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#linkedin"
                aria-label="Mack Trucks on LinkedIn"
                className="w-[36px] h-[36px] rounded-full bg-[#1F2937] flex items-center justify-center text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-[#374151] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Mack Trucks on Facebook"
                className="w-[36px] h-[36px] rounded-full bg-[#1F2937] flex items-center justify-center text-[#9CA3AF] hover:text-[#FFFFFF] hover:bg-[#374151] transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/10 mt-[48px] pt-[24px] pb-[24px] flex items-center justify-center">
          <p className="text-[14px] leading-[20px] text-[#9CA3AF] text-center">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
