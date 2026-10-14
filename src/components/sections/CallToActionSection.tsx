import React from 'react';
import { callToActionContent } from '@/data/site-content';
import { Button } from '@/components/ui/Button';

export function CallToActionSection() {
  return (
    <section
      id="cta-section"
      className="w-full bg-[#000000] min-h-[290px] pt-[64px] pb-16 flex flex-col items-center justify-start text-center relative"
    >
      <span id="contact" className="sr-only" />
      <div className="w-full max-w-[896px] mx-auto px-4 sm:px-6 flex flex-col items-center">
        <h2 className="text-[26px] sm:text-[30px] font-bold leading-[36px] text-[#FFFFFF]">
          {callToActionContent.title}
        </h2>

        <p className="text-[16px] sm:text-[18px] font-normal leading-[28px] text-[#D1D5DB] mt-[16px] mb-[32px] max-w-[700px]">
          {callToActionContent.description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] w-full max-w-[340px] sm:max-w-none mx-auto">
          <Button
            variant="primary-white"
            exactHeight={50}
            href={callToActionContent.primaryCta.href}
            className="text-[16px] font-semibold w-full max-w-[340px] sm:w-[171.77px]"
          >
            {callToActionContent.primaryCta.label}
          </Button>
          <Button
            variant="cta-outline"
            exactHeight={50}
            href={callToActionContent.secondaryCta.href}
            className="text-[16px] font-semibold w-full max-w-[340px] sm:w-[188.47px]"
          >
            {callToActionContent.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
