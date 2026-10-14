'use client';

import React, { useState, useEffect } from 'react';
import { specificationsContent } from '@/data/site-content';
import { SpecificationCard } from '@/components/ui/SpecificationCard';
import { subscribeSpecifications } from '@/lib/firebase/firestore';
import { SpecificationItem } from '@/types';

export function SpecificationsSection() {
  const [specs, setSpecs] = useState<SpecificationItem[]>(specificationsContent.items);

  useEffect(() => {
    const unsubscribe = subscribeSpecifications((liveSpecs) => {
      if (liveSpecs && liveSpecs.length > 0) {
        setSpecs(liveSpecs);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section
      id="specifications-section"
      className="w-full bg-[#F9FAFB] min-h-[452px] pt-[64px] pb-16 relative"
    >
      <span id="parts" className="sr-only" />
      <span id="engines" className="sr-only" />
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0 flex flex-col items-center">
        <h2 className="text-[26px] sm:text-[30px] font-bold leading-[36px] text-[#111827] text-center">
          {specificationsContent.title}
        </h2>

        <p className="text-[16px] sm:text-[18px] font-normal leading-[28px] text-[#4B5563] text-center mt-[16px] mb-[48px]">
          {specificationsContent.subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] lg:gap-[32px] w-full max-w-[1216px] justify-items-center">
          {specs.map((spec) => (
            <SpecificationCard key={spec.id} spec={spec} />
          ))}
        </div>
      </div>
    </section>
  );
}
