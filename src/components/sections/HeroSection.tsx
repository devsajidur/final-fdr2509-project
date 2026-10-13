import React from 'react';
import Image from 'next/image';
import { heroContent } from '@/data/site-content';
import { Button } from '@/components/ui/Button';

export function HeroSection() {
  return (
    <section
      id="hero-section"
      className="w-full bg-[#FFFFFF] lg:h-[600px] flex items-center justify-center overflow-hidden py-12 lg:py-0 relative"
    >
      <span id="trucks" className="sr-only" />
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-[584px_584px] gap-[32px] lg:gap-[48px] items-center">
          {/* Left Column: Width 584px (Centered on Mobile, Left-aligned on Desktop) */}
          <div className="flex flex-col justify-center items-center text-center lg:items-start lg:text-left w-full lg:w-[584px]">
            {/* Eyebrow: 14px, 500, line-height 20px, letter-spacing 0.35px, #6B7280 */}
            <span className="text-[14px] font-medium leading-[20px] tracking-[0.35px] text-[#6B7280] mb-[12px] text-center lg:text-left">
              {heroContent.eyebrow}
            </span>

            {/* Heading: 48px, 700, line-height 48px, #111827, 2 lines */}
            <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-bold leading-[1.1] lg:leading-[48px] text-[#111827] max-w-[480px] text-center lg:text-left mx-auto lg:mx-0">
              {heroContent.title}
            </h1>

            {/* Description: 18px, 400, line-height 30px, #4B5563 */}
            <p className="text-[16px] sm:text-[18px] font-normal leading-[26px] lg:leading-[30px] text-[#4B5563] mt-[20px] max-w-[565px] text-center lg:text-left mx-auto lg:mx-0">
              {heroContent.description}
            </p>

            {/* Hero Buttons: Centered & App-like on mobile, Exact width on desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-[16px] mt-[32px] w-full max-w-[340px] sm:max-w-none mx-auto lg:mx-0">
              <Button
                variant="primary-black"
                exactHeight={50}
                href={heroContent.primaryCta.href}
                className="text-[16px] font-semibold w-full max-w-[340px] sm:w-[188.83px]"
              >
                {heroContent.primaryCta.label}
              </Button>
              <Button
                variant="secondary-outline"
                exactHeight={50}
                href={heroContent.secondaryCta.href}
                className="text-[16px] font-semibold w-full max-w-[340px] sm:w-[213.33px]"
              >
                {heroContent.secondaryCta.label}
              </Button>
            </div>
          </div>

          {/* Right Column: Hero Image 584x384px */}
          <div className="w-full lg:w-[584px] flex justify-center lg:justify-end">
            <div
              className="relative w-full max-w-[584px] h-[260px] sm:h-[320px] lg:h-[384px] rounded-[8px] overflow-hidden shrink-0"
              style={{
                boxShadow:
                  '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Image
                src={heroContent.image.src}
                alt={heroContent.image.alt}
                title={heroContent.image.title}
                width={584}
                height={384}
                priority
                loading="eager"
                className="w-full h-full object-cover object-center rounded-[8px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
