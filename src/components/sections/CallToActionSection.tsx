import React from 'react';
import { callToActionContent } from '@/data/site-content';
import { Button } from '@/components/ui/Button';

export function CallToActionSection() {
  return (
    <section
      id="cta-section"
      className="w-full bg-[#000000] lg:h-[290px] pt-[64px] pb-12 lg:pb-0 overflow-hidden flex flex-col items-center justify-start text-center relative"
    >
      <span id="contact" className="sr-only" />
      <div className="w-full max-w-[896px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        {/* Heading: 30px, 700, 36px line-height, #FFFFFF */}
        <h2 className="text-[26px] sm:text-[30px] font-bold leading-[36px] text-[#FFFFFF]">
          {callToActionContent.title}
        </h2>

        {/* Description: 18px, 400, 28px line-height, #D1D5DB (Figma top: 52px, gap 16px) */}
        <p className="text-[16px] sm:text-[18px] font-normal leading-[28px] text-[#D1D5DB] mt-[16px] mb-[32px] max-w-[700px]">
          {callToActionContent.description}
        </p>

        {/* Buttons: Gap 16px, center aligned */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] w-full sm:w-auto">
          <Button
            variant="primary-white"
            exactWidth={171.77}
            exactHeight={50}
            href={callToActionContent.primaryCta.href}
            className="text-[16px] font-semibold"
          >
            {callToActionContent.primaryCta.label}
          </Button>
          <Button
            variant="cta-outline"
            exactWidth={188.47}
            exactHeight={50}
            href={callToActionContent.secondaryCta.href}
            className="text-[16px] font-semibold"
          >
            {callToActionContent.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
