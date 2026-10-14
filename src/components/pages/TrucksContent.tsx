'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero, SectionHeading, HeroStat } from '@/components/ui/PageBlocks';
import { SpecificationCard } from '@/components/ui/SpecificationCard';
import { triggerMackModal } from '@/components/ui/InteractionModals';
import { subscribeSpecifications } from '@/lib/firebase/firestore';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { specificationsContent } from '@/data/site-content';
import { TRUCK_VARIANTS, MP8_ENGINES } from '@/data/catalog';
import { SpecificationItem } from '@/types';

export function TrucksContent() {
  const [specs, setSpecs] = useState<SpecificationItem[]>(specificationsContent.items);

  useEffect(() => {
    const unsubscribe = subscribeSpecifications((liveSpecs) => {
      if (liveSpecs && liveSpecs.length > 0) setSpecs(liveSpecs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <PageShell>
      <PageHero
        icon="🚚"
        eyebrow="Mack Anthem® Lineup"
        title="Choose Your Mack Anthem"
        description={
          <>
            Three purpose-built cabs, one proven <strong>Mack MP8®</strong> powertrain. Compare the
            Anthem Day Cab, 48&quot; Flat Top and 70&quot; Stand-Up Sleeper, then price it, quote it
            or put it on the road with a test drive.
          </>
        }
      >
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1000px] mx-auto">
          <HeroStat value="3" label="Anthem Variants" note="Day Cab · 48&quot; · 70&quot;" />
          <HeroStat value="505 HP" label="Max MP8® Power" note="1,860 lb.-ft. torque" tone="text-blue-400" />
          <HeroStat value="12.5%" label="Fuel Savings" note="MP8HE turbo-compound" tone="text-emerald-400" />
          <HeroStat value="80,000+" label="lbs GCWR" note="Interstate freight rated" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => triggerMackModal('configure')}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-6 rounded-[8px] transition-all shadow-lg active:scale-[0.98] text-[14px] cursor-pointer"
          >
            ⚙️ Configure &amp; Price
          </button>
          <button
            type="button"
            onClick={() => triggerMackModal('test-drive')}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-[8px] border border-white/20 transition-all text-[14px] cursor-pointer"
          >
            🚛 Book Test Drive
          </button>
          <button
            type="button"
            onClick={() => triggerMackModal('quote')}
            className="bg-transparent hover:bg-white/10 text-gray-200 hover:text-white font-medium py-2.5 px-5 rounded-[8px] border border-white/10 transition-all text-[14px] cursor-pointer"
          >
            Request Fleet Quote
          </button>
        </div>
      </PageHero>

      <section id="anthem" className="scroll-mt-[80px] py-16 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
        <SectionHeading
          eyebrow="Mack Anthem® Variants"
          title="One Platform, Three Cabs"
          description="Pick the cab that matches your route, trailer and driver. Every variant is built on the same integrated Mack powertrain."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TRUCK_VARIANTS.map((truck) => (
            <article
              key={truck.id}
              className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-6 pb-4 border-b border-gray-100">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {truck.badge}
                </span>
                <h3 className="text-[20px] font-bold text-gray-900 leading-snug mt-3">{truck.name}</h3>
                <p className="text-[13px] text-amber-700 font-medium mt-1">{truck.tagline}</p>
              </div>

              <dl className="px-6 py-4 space-y-2 text-[13px] bg-gray-50/60">
                {truck.stats.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-1 border-b border-gray-100 last:border-b-0">
                    <dt className="text-gray-500 font-medium shrink-0">{row.label}</dt>
                    <dd className="font-semibold text-gray-800 text-right">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="p-6 pt-4 flex-1">
                <div className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-2">Highlights</div>
                <ul className="space-y-1.5 text-[13px] text-gray-600">
                  {truck.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="text-emerald-500 shrink-0" aria-hidden="true">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-2.5 rounded bg-amber-50 border border-amber-200 text-[12px] text-amber-900">
                  <strong>Best for:</strong> {truck.bestFor}
                </div>
              </div>

              <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => triggerMackModal('quote', { subject: truck.name })}
                  className="bg-[#111827] hover:bg-black text-white font-semibold py-2.5 px-3 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                >
                  Request Quote
                </button>
                <button
                  type="button"
                  onClick={() => triggerMackModal('test-drive', { subject: truck.name })}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-semibold py-2.5 px-3 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                >
                  Book Test Drive
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triggerMackModal('configure', {
                      cab: truck.configureCab,
                      axle: truck.configureAxle,
                      hp: truck.configureHp,
                    })
                  }
                  className="col-span-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-3 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                >
                  Configure &amp; Price this truck
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="specifications"
        className="scroll-mt-[80px] bg-white border-y border-gray-200 py-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-[1216px] mx-auto">
          <SectionHeading
            eyebrow="Technical Specifications"
            title="Anthem Platform Specs"
            description="Select any card for the full technical breakdown."
          />
          <div className="flex justify-center -mt-6 mb-8">
            <span
              className={`inline-flex items-center gap-2 text-[12px] font-mono px-3 py-1 rounded-full border ${
                isFirebaseConfigured
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-gray-600 bg-gray-50 border-gray-200'
              }`}
            >
              <span
                aria-hidden="true"
                className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-gray-400'}`}
              />
              {isFirebaseConfigured ? 'Live from Cloud Firestore' : 'Showing bundled defaults (Firebase not configured)'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] lg:gap-[32px] justify-items-center">
            {specs.map((spec) => (
              <SpecificationCard key={spec.id} spec={spec} />
            ))}
          </div>
        </div>
      </section>

      <section id="engines" className="scroll-mt-[80px] bg-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1216px] mx-auto">
          <SectionHeading
            dark
            eyebrow="Mack MP8® Engine Lineup"
            title="The 13-Liter Heart of Every Anthem"
            description="Wave Piston combustion, an integrated mDRIVE™ transmission and GPS-based Predictive Cruise keep the engine in its efficiency sweet spot."
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
            <div className="lg:col-span-2 relative min-h-[260px] rounded-[14px] overflow-hidden border border-white/10">
              <Image
                src="/images/mack-engine.png"
                alt="Mack MP8 13L engine compartment"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/85 to-transparent">
                <div className="text-[12px] font-mono text-amber-400 uppercase tracking-wider font-bold">Wave Piston technology</div>
                <p className="text-[13px] text-gray-200 mt-1">
                  Patented piston bowl contours redirect unburned fuel into the combustion chamber for cleaner,
                  more efficient burn.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {MP8_ENGINES.map((engine) => (
                <article
                  key={engine.id}
                  className="bg-white/5 border border-white/10 rounded-[12px] p-5 flex flex-col hover:border-amber-400/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      {engine.badge}
                    </span>
                    <span className="text-[12px] font-mono text-gray-400">13L inline-6</span>
                  </div>
                  <h3 className="text-[18px] font-bold mt-3">{engine.name}</h3>
                  <div className="mt-2 flex items-baseline gap-4 font-mono">
                    <span className="text-[22px] font-black text-amber-400">{engine.hp}</span>
                    <span className="text-[13px] text-gray-300">{engine.torque}</span>
                  </div>
                  <p className="text-[13px] text-gray-300 mt-2">{engine.summary}</p>
                  <ul className="mt-3 space-y-1 text-[12px] text-gray-400 flex-1">
                    {engine.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-emerald-400" aria-hidden="true">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-[12px] text-gray-300 mt-3">
                    <strong className="text-white">Best for:</strong> {engine.bestFor}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => triggerMackModal('quote', { subject: `${engine.name} (${engine.hp})` })}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-3 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                    >
                      Request Quote
                    </button>
                    {engine.configureHp && (
                      <button
                        type="button"
                        onClick={() => triggerMackModal('configure', { hp: engine.configureHp })}
                        className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                      >
                        Configure
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 bg-white/5 border border-white/10 rounded-[16px] p-6 lg:p-8">
            <h3 className="text-[18px] font-bold">Fleet Fuel Cost Comparison</h3>
            <p className="text-[13px] text-gray-300 mt-1 mb-6">
              120,000 miles per truck per year at $3.85/gal diesel.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Standard Class 8 highway truck (6.8 MPG)', cost: '$67,941 / yr', width: 'w-full', bar: 'bg-red-500', text: 'text-red-400' },
                { label: 'Mack Anthem MP8 (7.4 MPG)', cost: '$62,432 / yr', width: 'w-[91.8%]', bar: 'bg-amber-400', text: 'text-amber-400' },
                { label: 'Mack Anthem MP8HE turbo-compound (8.2 MPG)', cost: '$56,341 / yr', width: 'w-[82.9%]', bar: 'bg-emerald-400', text: 'text-emerald-400' },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between gap-4 text-[13px] font-semibold">
                    <span className="text-gray-200">{row.label}</span>
                    <span className={`font-mono shrink-0 ${row.text}`}>{row.cost}</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                    <div className={`${row.bar} ${row.width} h-2 rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[14px] font-bold text-emerald-400">Up to $11,600 saved per truck, per year</span>
              <Link href="/dashboard" className="text-[13px] text-amber-400 hover:text-amber-300 font-semibold">
                Open the fleet TCO calculator →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center max-w-[800px] mx-auto">
        <h2 className="text-[28px] font-bold text-gray-900">Ready to Put an Anthem to Work?</h2>
        <p className="mt-3 text-[15px] text-gray-600">
          Talk to an authorized Mack dealer about pricing, financing and a live demonstration on your own routes.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => triggerMackModal('test-drive')}
            className="bg-[#111827] hover:bg-black text-white font-bold py-3 px-8 rounded-[8px] transition-all shadow-md active:scale-[0.98] text-[14px] cursor-pointer"
          >
            Book Test Drive
          </button>
          <button
            type="button"
            onClick={() => triggerMackModal('find-dealer')}
            className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-6 rounded-[8px] border border-gray-300 transition-colors text-[14px] cursor-pointer"
          >
            Find a Dealer
          </button>
          <Link
            href="/parts"
            className="text-gray-600 hover:text-black font-medium text-[14px] underline underline-offset-4 px-2"
          >
            Browse Genuine Parts
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
