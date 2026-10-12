import React from 'react';
import { FeatureItemData } from '@/types';

interface FeatureItemProps {
  feature: FeatureItemData;
}

function FeatureIcon({ type }: { type: FeatureItemData['iconType'] }) {
  switch (type) {
    case 'safety':
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Shield check vector matching Figma */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'connected':
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Wifi telematics vector matching Figma */}
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="2.5" />
        </svg>
      );
    case 'comfort':
      return (
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          {/* User / driver silhouette matching Figma reference */}
          <circle cx="12" cy="7" r="4" />
          <path d="M12 13c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" />
        </svg>
      );
  }
}

export function FeatureItem({ feature }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-center text-center w-full lg:w-[384px] lg:h-[164px]">
      {/* 64x64 Circular Icon Background */}
      <div className="w-[64px] h-[64px] rounded-full bg-[#F3F4F6] text-[#374151] flex items-center justify-center shrink-0">
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
