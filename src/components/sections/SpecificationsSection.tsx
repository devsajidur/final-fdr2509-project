import React from 'react';
import { specificationsContent } from '@/data/site-content';
import { SpecificationCard } from '@/components/ui/SpecificationCard';

export function SpecificationsSection() {
  return (
    <section
      id="specifications-section"
      className="w-full bg-[#F9FAFB] lg:h-[452px] pt-[64px] pb-12 lg:pb-0 overflow-hidden relative"
    >
      <span id="parts" className="sr-only" />
      <span id="engines" className="sr-only" />
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0 flex flex-col items-center">
        {/* Section Heading: 30px, 700, 36px line-height, center */}
        <h2 className="text-[26px] sm:text-[30px] font-bold leading-[36px] text-[#111827] text-center">
          {specificationsContent.title}
        </h2>

        {/* Subtitle: 18px, 400, 28px line-height, center, #4B5563 (Figma top: 52px, gap 16px) */}
        <p className="text-[16px] sm:text-[18px] font-normal leading-[28px] text-[#4B5563] text-center mt-[16px] mb-[48px]">
          {specificationsContent.subtitle}
        </p>

        {/* 4 Cards Grid: 280px each, gap 32px, total 1216px */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] lg:gap-[32px] w-full max-w-[1216px] justify-items-center">
          {specificationsContent.items.map((spec) => (
            <SpecificationCard key={spec.id} spec={spec} />
          ))}
        </div>
      </div>
    </section>
  );
}
