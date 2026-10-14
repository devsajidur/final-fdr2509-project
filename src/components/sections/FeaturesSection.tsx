'use client';

import React, { useState, useEffect } from 'react';
import { featuresContent } from '@/data/site-content';
import { FeatureItem } from '@/components/ui/FeatureItem';
import { subscribeFeatures } from '@/lib/firebase/firestore';
import { FeatureItemData } from '@/types';

export function FeaturesSection() {
  const [features, setFeatures] = useState<FeatureItemData[]>(featuresContent.items);

  useEffect(() => {
    const unsubscribe = subscribeFeatures((liveFeatures) => {
      if (liveFeatures && liveFeatures.length > 0) {
        setFeatures(liveFeatures);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <section
      id="features-section"
      className="w-full bg-[#FFFFFF] min-h-[420px] pt-[64px] pb-16 relative"
    >
      <span id="service" className="sr-only" />
      <span id="warranty" className="sr-only" />
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0 flex flex-col items-center">
        <h2 className="text-[26px] sm:text-[30px] font-bold leading-[36px] text-[#111827] text-center">
          {featuresContent.title}
        </h2>

        <p className="text-[16px] sm:text-[18px] font-normal leading-[28px] text-[#4B5563] text-center mt-[16px] mb-[48px]">
          {featuresContent.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px] w-full max-w-[1216px] justify-items-center">
          {features.map((feature) => (
            <FeatureItem key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
