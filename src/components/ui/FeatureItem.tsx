'use client';

import React from 'react';
import { FeatureItemData } from '@/types';
import { triggerMackModal } from '@/components/ui/InteractionModals';

interface FeatureItemProps {
  feature: FeatureItemData;
}

import {
  SafetyFirstIcon,
  ConnectedIcon,
  DriverComfortIcon,
} from '@/components/ui/Icons';

function FeatureIcon({ type }: { type: FeatureItemData['iconType'] }) {
  switch (type) {
    case 'safety':
      return <SafetyFirstIcon />;
    case 'connected':
      return <ConnectedIcon />;
    case 'comfort':
      return <DriverComfortIcon />;
  }
}

export function FeatureItem({ feature }: FeatureItemProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => triggerMackModal('feature-detail', { selectedFeature: feature.iconType })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerMackModal('feature-detail', { selectedFeature: feature.iconType });
        }
      }}
      aria-label={`Explore feature details: ${feature.title}`}
      className="flex flex-col items-center text-center w-full lg:w-[384px] lg:h-[164px] cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-black rounded-[8px] p-2 transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
    >
      {/* 64x64 Circular Icon Background */}
      <div className="w-[64px] h-[64px] rounded-full bg-[#F3F4F6] text-[#374151] flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-colors duration-200">
        <FeatureIcon type={feature.iconType} />
      </div>

      {/* Feature Title (20px, 600, line-height 28px, color #111827) */}
      <h3 className="text-[20px] font-semibold leading-[28px] text-[#111827] mt-[16px]">
        {feature.title}
      </h3>

      {/* Description (16px, line-height 24px, color #4B5563) */}
      <p className="text-[16px] font-normal leading-[24px] text-[#4B5563] mt-[8px]">
        {feature.description}
      </p>
    </div>
  );
}
