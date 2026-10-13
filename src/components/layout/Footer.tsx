import React from 'react';
import { footerContent } from '@/data/site-content';

export function Footer() {
  return (
    <footer
      id="main-footer"
      className="w-full bg-[#111827] lg:h-[313px] pt-[48px] pb-8 lg:pb-0 overflow-hidden text-[#9CA3AF] relative"
    >
      <span id="support" className="sr-only" />
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* 4 Columns Grid: 280px each, gap 32px */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[32px] justify-between">
          {/* Column 1: MACK Logo & Tagline */}
          <div className="w-full lg:w-[280px]">
            <div className="flex items-center">
              <div className="w-[32px] h-[32px] bg-[#FFFFFF] rounded-[4px] flex items-center justify-center shrink-0">
                <svg
                  width="17.5"
                  height="14"
                  viewBox="0 0 17.5 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#000000]"
                  aria-hidden="true"
                >
                  <path
                    d="M1.312 0C0.588 0 0 0.5879 0 1.3125V10.0625C0 10.7871 0.588 11.375 1.312 11.375H1.75C1.75 12.8242 2.926 14 4.375 14C5.824 14 7 12.8242 7 11.375H10.5C10.5 12.8242 11.676 14 13.125 14C14.574 14 15.75 12.8242 15.75 11.375H16.625C17.109 11.375 17.5 10.984 17.5 10.5C17.5 10.016 17.109 9.625 16.625 9.625V7.875V7V6.4887C16.625 6.0238 16.442 5.5781 16.114 5.25L14 3.1363C13.672 2.8082 13.226 2.625 12.761 2.625H11.375V1.3125C11.375 0.5879 10.787 0 10.062 0H1.312ZM11.375 4.375H12.761L14.875 6.4887V7H11.375V4.375ZM3.062 11.375C3.062 11.0269 3.201 10.6931 3.447 10.4469C3.693 10.2008 4.027 10.0625 4.375 10.0625C4.723 10.0625 5.057 10.2008 5.303 10.4469C5.549 10.6931 5.688 11.0269 5.688 11.375C5.688 11.7231 5.549 12.0569 5.303 12.3031C5.057 12.5492 4.723 12.6875 4.375 12.6875C4.027 12.6875 3.693 12.5492 3.447 12.3031C3.201 12.0569 3.062 11.7231 3.062 11.375ZM13.125 10.0625C13.473 10.0625 13.807 10.2008 14.053 10.4469C14.299 10.6931 14.438 11.0269 14.438 11.375C14.438 11.7231 14.299 12.0569 14.053 12.3031C13.807 12.5492 13.473 12.6875 13.125 12.6875C12.777 12.6875 12.443 12.5492 12.197 12.3031C11.951 12.0569 11.812 11.7231 11.812 11.375C11.812 11.0269 11.951 10.6931 12.197 10.4469C12.443 10.2008 12.777 10.0625 13.125 10.0625Z"
                    fill="#000000"
                  />
                </svg>
              </div>
              <span className="ml-[8px] text-[20px] font-bold leading-[28px] text-[#FFFFFF]">
                MACK
              </span>
            </div>
            <p className="text-[16px] leading-[24px] text-[#9CA3AF] mt-[16px]">
              {footerContent.brandTagline}
            </p>
          </div>

          {/* Column 2: Products */}
          <div className="w-full lg:w-[280px]">
            <h4 className="text-[16px] font-semibold leading-[24px] text-[#FFFFFF] mb-[16px]">
              Products
            </h4>
            <ul className="space-y-[8px]">
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
            <ul className="space-y-[8px]">
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
            <div className="flex items-center space-x-[16px] text-[#9CA3AF] pt-[3px]">
              {/* X / Twitter (Figma: width 16, height 16) */}
              <a
                href="#twitter"
                aria-label="Mack Trucks on X"
                className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[2px]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* LinkedIn (Figma: width 16, height 16) */}
              <a
                href="#linkedin"
                aria-label="Mack Trucks on LinkedIn"
                className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[2px]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Facebook (Figma: width 14, height 16) */}
              <a
                href="#facebook"
                aria-label="Mack Trucks on Facebook"
                className="text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-[2px]"
              >
                <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/10 mt-[48px] pt-[24px] pb-[24px] flex items-center justify-center">
          <p className="text-[16px] leading-[24px] text-[#9CA3AF] text-center">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
