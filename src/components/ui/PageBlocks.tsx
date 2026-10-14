import React from 'react';

/** Dark gradient hero used at the top of every content page (exactly one <h1> per page) */
export function PageHero({
  eyebrow,
  icon,
  title,
  description,
  children,
}: {
  eyebrow: string;
  icon: string;
  title: string;
  description: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-gradient-to-b from-[#111827] via-[#1F2937] to-[#111827] text-white py-14 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      <div className="max-w-[1216px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[12px] uppercase tracking-wider mb-4">
          <span aria-hidden="true">{icon}</span>
          <span>{eyebrow}</span>
        </div>
        <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-black tracking-tight leading-tight max-w-[900px] mx-auto">
          {title}
        </h1>
        <p className="mt-4 text-[16px] sm:text-[18px] text-gray-300 max-w-[780px] mx-auto leading-relaxed">
          {description}
        </p>
        {children}
      </div>
    </section>
  );
}

/** Centered section heading with optional eyebrow + description */
export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center max-w-[760px] mx-auto mb-10">
      {eyebrow && (
        <div
          className={`text-[12px] font-mono uppercase tracking-wider font-bold mb-2 ${
            dark ? 'text-amber-400' : 'text-amber-600'
          }`}
        >
          {eyebrow}
        </div>
      )}
      <h2 className={`text-[26px] sm:text-[32px] font-bold leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-3 text-[15px] leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </div>
  );
}

/** Small stat tile used inside page heroes */
export function HeroStat({
  value,
  label,
  note,
  tone = 'text-amber-400',
}: {
  value: string;
  label: string;
  note?: string;
  tone?: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
      <div className={`text-[26px] sm:text-[28px] font-black font-mono ${tone}`}>{value}</div>
      <div className="text-[13px] text-gray-300 mt-1 font-medium">{label}</div>
      {note && <div className="text-[11px] text-gray-400">{note}</div>}
    </div>
  );
}

/** Shared form-field styling for dark form panels */
export const darkInputClass =
  'w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-[14px]';

export const darkLabelClass = 'block text-[13px] font-medium text-gray-300 mb-1';
