import React from 'react';
import { featuresContent } from '@/data/site-content';
import { FeatureItem } from '@/components/ui/FeatureItem';

export function FeaturesSection() {
  return (
    <section
      id="features-section"
      className="w-full bg-[#FFFFFF] lg:h-[420px] pt-[64px] pb-12 lg:pb-0 overflow-hidden relative"
    >
      <span id="service" className="sr-only" />
      <span id="warranty" className="sr-only" />
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0 flex flex-col items-center">
        {/* Title: 30px, 700, 36px line-height, center */}
        <h2 className="text-[26px] sm:text-[30px] font-bold leading-[36px] text-[#111827] text-center">
          {featuresContent.title}
        </h2>

        {/* Subtitle: 18px, 400, 28px line-height, center, #4B5563 (Figma top: 52px, gap 16px) */}
        <p className="text-[16px] sm:text-[18px] font-normal leading-[28px] text-[#4B5563] text-center mt-[16px] mb-[48px]">
          {featuresContent.subtitle}
        </p>

        {/* 3 Columns Grid: 384px each, gap 32px, total 1216px */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px] w-full max-w-[1216px] justify-items-center">
          {featuresContent.items.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
