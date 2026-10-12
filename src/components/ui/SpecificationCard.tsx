import React from 'react';
import { SpecificationItem } from '@/types';

interface SpecificationCardProps {
  spec: SpecificationItem;
}

function SpecIcon({ type }: { type: SpecificationItem['iconType'] }) {
  switch (type) {
    case 'engine':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Engine block vector */}
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <path d="M2 9v6" />
          <path d="M22 10v4" />
          <path d="M8 6V4" />
          <path d="M16 6V4" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );
    case 'fuel':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Fuel pump vector */}
          <path d="M3 22h12" />
          <path d="M4 9h10" />
          <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
          <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L19 6" />
        </svg>
      );
    case 'gvwr':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Weight / load shield vector */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      );
    case 'wheelbase':
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Truck chassis / axle ruler */}
          <circle cx="5" cy="17" r="2.5" />
          <circle cx="19" cy="17" r="2.5" />
          <path d="M7.5 17h9" />
          <path d="M5 14.5V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7.5" />
          <path d="M10 5v4" />
          <path d="M14 5v4" />
        </svg>
      );
  }
}

export function SpecificationCard({ spec }: SpecificationCardProps) {
  return (
    <div
      className="bg-[#FFFFFF] rounded-[8px] card-shadow p-[24px] flex flex-col justify-start w-full lg:w-[280px] lg:h-[196px] shrink-0"
      style={{
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* 48x48 icon container */}
      <div className="w-[48px] h-[48px] rounded-[8px] bg-[#000000] text-[#FFFFFF] flex items-center justify-center shrink-0">
        <SpecIcon type={spec.iconType} />
      </div>

      {/* Card Title (18px, 600, color #111827) */}
      <h3 className="text-[18px] font-semibold leading-[24px] text-[#111827] mt-[16px] tracking-tight">
        {spec.title}
      </h3>

      {/* Primary Detail (16px, color #111827) */}
      <p className="text-[16px] font-medium leading-[24px] text-[#111827] mt-[4px]">
        {spec.primaryDetail}
      </p>

      {/* Secondary Detail (14px, color #6B7280) */}
      <p className="text-[14px] font-normal leading-[20px] text-[#6B7280] mt-[2px]">
        {spec.secondaryDetail}
      </p>
    </div>
  );
}
