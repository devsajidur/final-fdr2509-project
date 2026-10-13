'use client';

import React from 'react';
import { SpecificationItem } from '@/types';
import { triggerMackModal } from '@/components/ui/InteractionModals';

interface SpecificationCardProps {
  spec: SpecificationItem;
}

import {
  EngineSpecIcon,
  FuelEconomySpecIcon,
  GvwrSpecIcon,
  WheelbaseSpecIcon,
} from '@/components/ui/Icons';

function SpecIcon({ type }: { type: SpecificationItem['iconType'] }) {
  switch (type) {
    case 'engine':
      return <EngineSpecIcon />;
    case 'fuel':
      return <FuelEconomySpecIcon />;
    case 'gvwr':
      return <GvwrSpecIcon />;
    case 'wheelbase':
      return <WheelbaseSpecIcon />;
  }
}

export function SpecificationCard({ spec }: SpecificationCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => triggerMackModal('spec-detail', { selectedSpec: spec.iconType })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerMackModal('spec-detail', { selectedSpec: spec.iconType });
        }
      }}
      aria-label={`View full technical data for ${spec.title}`}
      className="bg-[#FFFFFF] rounded-[8px] card-shadow p-[24px] flex flex-col justify-start items-center text-center lg:items-start lg:text-left w-full max-w-[340px] sm:max-w-none lg:w-[280px] lg:h-[196px] shrink-0 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-black group mx-auto lg:mx-0"
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* 48x48 icon container */}
      <div className="w-[48px] h-[48px] rounded-[8px] bg-[#000000] text-[#FFFFFF] flex items-center justify-center shrink-0">
        <SpecIcon type={spec.iconType} />
      </div>

      {/* Card Title (18px, 600, color #111827) */}
      <h3 className="text-[18px] font-semibold leading-[24px] text-[#111827] mt-[16px]">
        {spec.title}
      </h3>

      {/* Primary Detail (16px, 400, leading 20px, color #4B5563, top: 124px, gap: 8px) */}
      <p className="text-[16px] font-normal leading-[20px] text-[#4B5563] mt-[8px]">
        {spec.primaryDetail}
      </p>

      {/* Secondary Detail (14px, 400, leading 17px, color #6B7280, top: 152px, gap: 4px) */}
      <p className="text-[14px] font-normal leading-[17px] text-[#6B7280] mt-[4px]">
        {spec.secondaryDetail}
      </p>
    </div>
  );
}
