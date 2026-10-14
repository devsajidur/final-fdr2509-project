'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero, SectionHeading, HeroStat } from '@/components/ui/PageBlocks';
import { triggerMackModal } from '@/components/ui/InteractionModals';
import { MACK_PARTS, PART_CATEGORIES, STOCK_LABELS, StockStatus } from '@/data/catalog';

const STOCK_STYLES: Record<StockStatus, { dot: string; text: string; chip: string }> = {
  'in-stock': { dot: 'bg-emerald-500', text: 'text-emerald-700', chip: 'bg-emerald-50 border-emerald-200' },
  'low-stock': { dot: 'bg-amber-500', text: 'text-amber-700', chip: 'bg-amber-50 border-amber-200' },
  'special-order': { dot: 'bg-blue-500', text: 'text-blue-700', chip: 'bg-blue-50 border-blue-200' },
};

type CategoryFilter = 'All' | (typeof PART_CATEGORIES)[number];

export function PartsContent() {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [query, setQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  const counts = useMemo(() => {
    const map = new Map<string, number>([['All', MACK_PARTS.length]]);
    for (const part of MACK_PARTS) map.set(part.category, (map.get(part.category) ?? 0) + 1);
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MACK_PARTS.filter((part) => {
      if (category !== 'All' && part.category !== category) return false;
      if (inStockOnly && part.stock !== 'in-stock') return false;
      if (!q) return true;
      return (
        part.partNumber.toLowerCase().includes(q) ||
        part.name.toLowerCase().includes(q) ||
        part.description.toLowerCase().includes(q) ||
        part.fits.toLowerCase().includes(q)
      );
    });
  }, [category, query, inStockOnly]);

  const resetFilters = () => {
    setCategory('All');
    setQuery('');
    setInStockOnly(false);
  };

  return (
    <PageShell>
      <PageHero
        icon="⚙️"
        eyebrow="OEM-Certified Replacement Components"
        title="Genuine Mack Parts Catalog"
        description={
          <>
            Factory-engineered parts and Mack Reman components, backed by a nationwide{' '}
            <strong>1-year / 100,000-mile warranty</strong> and 450+ authorized dealers.
          </>
        }
      >
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[900px] mx-auto">
          <HeroStat value="1 yr / 100k" label="Parts & Labor Warranty" note="At any Mack dealer" tone="text-emerald-400" />
          <HeroStat value="98%" label="Same-Day Availability" note="6 regional hubs" />
          <HeroStat value="Up to 40%" label="Reman Savings" note="vs. new, same OEM spec" tone="text-blue-400" />
        </div>
      </PageHero>

      <section id="catalog" className="scroll-mt-[80px] py-12 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
        <SectionHeading
          eyebrow="Parts Catalog"
          title="Find the Right Part"
          description="Filter by system, search by part number or description, then request a quote."
        />

        <div className="bg-white border border-gray-200 rounded-[14px] p-5 sm:p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label htmlFor="parts-search-input" className="block text-[12px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Search by part number, name or fitment
              </label>
              <div className="relative">
                <input
                  id="parts-search-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. MK-85137299, turbocharger, disc brake, MP8…"
                  className="w-full pl-10 pr-4 py-2.5 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-[14px]"
                />
                <svg
                  aria-hidden="true"
                  className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <label className="flex items-center gap-2 text-[13px] font-medium text-gray-700 cursor-pointer select-none md:pb-2.5">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              In-stock only
            </label>

            <button
              type="button"
              onClick={() => triggerMackModal('find-dealer')}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-5 rounded-[8px] text-[13px] transition-all cursor-pointer shadow-sm"
            >
              📍 Locate Parts Dealer
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="Filter parts by category">
            <span className="text-[12px] font-bold text-gray-500 uppercase mr-1">Category</span>
            {(['All', ...PART_CATEGORIES] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
                className={`text-[13px] py-1.5 px-3.5 rounded-full font-medium transition-colors cursor-pointer ${
                  category === cat ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-[11px] ${category === cat ? 'text-gray-300' : 'text-gray-500'}`}>
                  {counts.get(cat) ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between text-[14px] text-gray-600" aria-live="polite">
          <div>
            Showing <strong className="text-gray-900">{filtered.length}</strong> of {MACK_PARTS.length} genuine parts
          </div>
          {(query || category !== 'All' || inStockOnly) && (
            <button type="button" onClick={resetFilters} className="text-blue-600 hover:underline text-[13px] cursor-pointer">
              Reset filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((part) => {
            const style = STOCK_STYLES[part.stock];
            return (
              <article
                key={part.partNumber}
                className="bg-white border border-gray-200 rounded-[12px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {part.partNumber}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium text-right">{part.category}</span>
                </div>

                <h3 className="text-[17px] font-bold text-gray-900 leading-snug mt-1">{part.name}</h3>
                <p className="text-[13px] text-gray-600 mt-2 leading-relaxed flex-1">{part.description}</p>

                <dl className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-[12px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-gray-500 shrink-0">Fits</dt>
                    <dd className="font-semibold text-gray-800 text-right">{part.fits}</dd>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <dt className="text-gray-500 shrink-0">Stock</dt>
                    <dd>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border font-semibold ${style.chip} ${style.text}`}
                      >
                        <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {STOCK_LABELS[part.stock]}
                      </span>
                    </dd>
                  </div>
                  <div className="text-right text-gray-500">{part.stockDetail}</div>
                </dl>

                <button
                  type="button"
                  onClick={() => triggerMackModal('quote', { subject: `Part ${part.partNumber} — ${part.name}` })}
                  className="mt-5 w-full bg-[#111827] hover:bg-black text-white font-semibold py-2.5 px-4 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                >
                  Request Part Quote
                </button>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-[12px] p-12 text-center">
            <div className="text-[32px] mb-2" aria-hidden="true">🔍</div>
            <h3 className="text-[18px] font-bold text-gray-900">No parts match your filters</h3>
            <p className="text-[14px] text-gray-500 mt-1 max-w-[460px] mx-auto">
              Need a VIN-specific or uncommon part? Our parts desk can find it for you.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-[6px] text-[13px] cursor-pointer"
              >
                Reset filters
              </button>
              <button
                type="button"
                onClick={() => triggerMackModal('contact', { topic: 'Mack Genuine Parts Inquiry', subject: query ? `Part search: ${query}` : undefined })}
                className="bg-[#111827] hover:bg-black text-white font-semibold py-2 px-4 rounded-[6px] text-[13px] cursor-pointer"
              >
                Contact the Parts Desk
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-[1216px] mx-auto">
          <SectionHeading
            title="The Genuine Mack Advantage"
            description="Will-fit parts can save a few dollars up front, but a single roadside breakdown can cost over $1,200 a day in downtime and late-delivery penalties."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📐', title: 'Precision factory tolerances', text: 'Built to the original blueprints and heat-treat specs for a flawless drop-in fit.' },
              { icon: '🛠️', title: 'Certified installation', text: 'Install at any Mack dealer and parts plus diagnostic and replacement labor are covered.' },
              { icon: '📈', title: 'Maintained resale value', text: 'Fleets with documented Genuine Mack maintenance command higher trade-in values.' },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-[12px] border border-gray-200 shadow-sm">
                <div className="text-[28px] mb-3" aria-hidden="true">{item.icon}</div>
                <h3 className="text-[17px] font-bold text-gray-900">{item.title}</h3>
                <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/service#book-service"
              className="inline-block bg-[#111827] hover:bg-black text-white font-semibold py-3 px-6 rounded-[8px] text-[14px] transition-colors"
            >
              Have it installed — book certified service
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
