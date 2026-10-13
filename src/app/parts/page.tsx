'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InteractionModals, triggerMackModal } from '@/components/ui/InteractionModals';
import { MobileAppNavBar } from '@/components/layout/MobileAppNavBar';

interface PartItem {
  partNumber: string;
  category: string;
  name: string;
  description: string;
  fitsModels: string;
  availability: 'In Stock - Ready to Ship' | 'Dealer Network Available' | 'Factory Reman Built to Order';
  warranty: string;
  listPrice: string;
}

const GENUINE_PARTS: PartItem[] = [
  {
    partNumber: 'MK-85137299',
    category: 'Filtration & Fluids',
    name: 'Mack Genuine Ultra-Efficiency Fuel/Water Separator',
    description: '10-micron multi-layered media filter removes 99.8% of emulsified water and microscopic particulate to safeguard high-pressure common rail injectors.',
    fitsModels: 'Mack Anthem, Pinnacle, Granite (MP7 & MP8 Engines)',
    availability: 'In Stock - Ready to Ship',
    warranty: '1-Year / 100,000-Mile OEM Warranty',
    listPrice: '$48.50',
  },
  {
    partNumber: 'MK-22340912',
    category: 'Powertrain & Reman',
    name: 'Mack Reman MP8® Variable Geometry Turbocharger (VGT)',
    description: 'Factory-remanufactured with new electronic actuators, precision dynamically balanced turbine wheels, and upgraded titanium-aluminide shaft seals.',
    fitsModels: 'Mack Anthem & Pinnacle 13L MP8 Engines (415-505 HP)',
    availability: 'Dealer Network Available',
    warranty: '2-Year / 250,000-Mile Mack Reman Warranty',
    listPrice: '$2,150.00 (Core Exchange)',
  },
  {
    partNumber: 'MK-21045678',
    category: 'Powertrain & Reman',
    name: 'mDRIVE™ Dual-Plate Automated Clutch Replacement Kit',
    description: 'Complete heavy-duty clutch pack including self-adjusting pressure plate, ceramic friction discs, pilot bearing, and electronic alignment guide.',
    fitsModels: 'Mack Anthem, Pinnacle, Granite with mDRIVE 12/13/14-Speed',
    availability: 'In Stock - Ready to Ship',
    warranty: '1-Year / 100,000-Mile OEM Warranty',
    listPrice: '$1,420.00',
  },
  {
    partNumber: 'MK-85141022',
    category: 'Braking & Safety',
    name: 'Bendix® ADB22X Heavy-Duty Air Disc Brake Caliper & Rotor Kit',
    description: 'Lightweight monobloc disc caliper with severe-duty vented rotors delivering 40% shorter highway stopping distances and extended pad life.',
    fitsModels: 'Mack Anthem Class 8 Front Steer & Rear Drive Axles',
    availability: 'In Stock - Ready to Ship',
    warranty: '1-Year Nationwide Dealership Warranty',
    listPrice: '$680.00 / Wheel End',
  },
  {
    partNumber: 'MK-23194011',
    category: 'Lighting & Body',
    name: 'Mack Anthem Aerodynamic Heated LED Headlamp Assembly (Right)',
    description: 'DOT/SAE compliant LED projector housing featuring internal thermostatically controlled heating elements to melt blizzard road ice automatically.',
    fitsModels: 'Mack Anthem 70" Sleeper, 48" Sleeper, Day Cab',
    availability: 'In Stock - Ready to Ship',
    warranty: '1-Year / 100,000-Mile OEM Warranty',
    listPrice: '$540.00',
  },
  {
    partNumber: 'MK-20412890',
    category: 'Filtration & Fluids',
    name: 'Mack EOS-4.5 Premium Extended Drain 10W-30 Diesel Engine Oil (55 Gal)',
    description: 'API CK-4 certified heavy-duty diesel engine oil formulated with shear-stable viscosity index improvers. Enables up to 60,000-mile drain intervals.',
    fitsModels: 'All Mack MP7, MP8, and MP8HE Powertrains',
    availability: 'In Stock - Ready to Ship',
    warranty: 'Guaranteed OEM Fluid Specification Compliance',
    listPrice: '$985.00 / Drum',
  },
  {
    partNumber: 'MK-85150992',
    category: 'Electrical & Sensors',
    name: 'Mack GuardDog® Connect 4G LTE Telematics Gateway Module',
    description: 'Factory telematics gateway for real-time remote diagnostics, cellular DTC transmission, and over-the-air parameter programming.',
    fitsModels: 'Mack Anthem, Pinnacle, Granite, TerraPro',
    availability: 'Dealer Network Available',
    warranty: 'Included with 2-Year GuardDog Connect Subscription',
    listPrice: '$750.00',
  },
  {
    partNumber: 'MK-22941033',
    category: 'Powertrain & Reman',
    name: 'Mack Genuine High-Pressure Common Rail Fuel Injector',
    description: 'Remanufactured to zero-tolerance factory specs with micro-honed nozzles ensuring precise fuel atomization and maximum combustion efficiency.',
    fitsModels: 'Mack MP8 13L Diesel Engines (2018 - 2026)',
    availability: 'In Stock - Ready to Ship',
    warranty: '1-Year / 100,000-Mile OEM Warranty',
    listPrice: '$385.00 / Each',
  },
];

export default function PartsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [orderModalPart, setOrderModalPart] = useState<PartItem | null>(null);
  const [orderQuantity, setOrderQuantity] = useState('1');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const categories = ['All', 'Powertrain & Reman', 'Filtration & Fluids', 'Braking & Safety', 'Lighting & Body', 'Electrical & Sensors'];

  const filteredParts = GENUINE_PARTS.filter((part) => {
    const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      part.partNumber.toLowerCase().includes(query) ||
      part.name.toLowerCase().includes(query) ||
      part.description.toLowerCase().includes(query) ||
      part.fitsModels.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSubmitted(true);
    setTimeout(() => {
      setOrderSubmitted(false);
      setOrderModalPart(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#111827] via-[#1F2937] to-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-[1216px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[12px] uppercase tracking-wider mb-4">
              <span>⚙️</span>
              <span>OEM Certified Fleet Replacement Components</span>
            </div>
            <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-black tracking-tight leading-tight max-w-[850px] mx-auto">
              Genuine Mack Parts & Factory Reman
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] text-gray-300 max-w-[760px] mx-auto leading-relaxed">
              Maintain peak operating efficiency and protect your commercial truck investment with 100% factory-engineered Genuine Mack Parts. Every component is backed by our nationwide <strong>1-Year / 100,000-Mile Warranty</strong> across 450+ authorized dealership service centers.
            </p>

            {/* Quick Benefits Bar */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[900px] mx-auto text-left">
              <div className="bg-white/5 border border-white/10 rounded-[10px] p-4 flex items-start gap-3">
                <span className="text-amber-400 text-[22px]">🛡️</span>
                <div>
                  <div className="font-bold text-[14px] text-white">1-Year / 100k Mile Warranty</div>
                  <div className="text-[12px] text-gray-400">Includes both parts and certified labor at any Mack dealer.</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[10px] p-4 flex items-start gap-3">
                <span className="text-blue-400 text-[22px]">🚚</span>
                <div>
                  <div className="font-bold text-[14px] text-white">Overnight Fleet Dispatch</div>
                  <div className="text-[12px] text-gray-400">98% same-day availability across 6 regional distribution hubs.</div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[10px] p-4 flex items-start gap-3">
                <span className="text-emerald-400 text-[22px]">🔄</span>
                <div>
                  <div className="font-bold text-[14px] text-white">Mack Reman Savings</div>
                  <div className="text-[12px] text-gray-400">Save up to 40% vs new without sacrificing OEM specifications.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Parts Catalog Search & Filter */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
          {/* Search Header */}
          <div className="bg-white border border-gray-200 rounded-[14px] p-6 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full md:w-auto flex-1">
                <label htmlFor="parts-search-input" className="block text-[13px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Search by Part Number, VIN, or Description
                </label>
                <div className="relative">
                  <input
                    id="parts-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. MK-85137299, MP8 turbo, disc brake, fuel filter, clutch..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-[8px] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-[14px]"
                  />
                  <svg
                    className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Quick Contact Dealer */}
              <div className="shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => triggerMackModal('find-dealer')}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-5 rounded-[8px] text-[13px] transition-all cursor-pointer shadow"
                >
                  📍 Locate Parts Dealer
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-bold text-gray-500 uppercase mr-1">Category:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[13px] py-1.5 px-3.5 rounded-full font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#111827] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="mb-4 flex items-center justify-between text-[14px] text-gray-600">
            <div>
              Showing <strong className="text-gray-900">{filteredParts.length}</strong> Genuine Mack Parts
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:underline text-[13px]"
              >
                Clear Search
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParts.map((part) => (
              <div
                key={part.partNumber}
                className="bg-white border border-gray-200 rounded-[12px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      {part.partNumber}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      {part.category}
                    </span>
                  </div>

                  <h3 className="text-[17px] font-bold text-gray-900 leading-snug mt-1">
                    {part.name}
                  </h3>
                  <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                    {part.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-[12px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Compatibility:</span>
                      <span className="font-semibold text-gray-800 text-right truncate max-w-[170px]" title={part.fitsModels}>
                        {part.fitsModels}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="font-semibold text-emerald-600">{part.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Coverage:</span>
                      <span className="text-gray-700">{part.warranty}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-gray-400 uppercase">MSRP Est.</div>
                    <div className="text-[18px] font-bold font-mono text-gray-900">{part.listPrice}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderModalPart(part);
                      setOrderQuantity('1');
                    }}
                    className="bg-[#111827] hover:bg-black text-white font-semibold py-2 px-4 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                  >
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredParts.length === 0 && (
            <div className="bg-white border border-gray-200 rounded-[12px] p-12 text-center">
              <div className="text-[32px] mb-2">🔍</div>
              <h3 className="text-[18px] font-bold text-gray-900">No matching parts found for &ldquo;{searchQuery}&rdquo;</h3>
              <p className="text-[14px] text-gray-500 mt-1 max-w-[450px] mx-auto">
                Need a specific VIN match or uncommon part? Call our 24/7 Mack Parts Hotline directly at <strong>1-800-866-1177</strong>.
              </p>
            </div>
          )}
        </section>

        {/* Why Genuine Mack Parts Section */}
        <section className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
          <div className="max-w-[1216px] mx-auto">
            <div className="text-center max-w-[700px] mx-auto mb-12">
              <h2 className="text-[26px] font-bold text-gray-900">The Genuine Mack Advantage</h2>
              <p className="text-[14px] text-gray-600 mt-1">
                Will-fit aftermarket parts might save a few dollars upfront, but unexpected roadside breakdowns can cost over $1,200 per day in downtime and missed delivery penalties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[12px] border border-gray-200 shadow-sm">
                <div className="text-amber-500 text-[28px] mb-3">📐</div>
                <h3 className="text-[17px] font-bold text-gray-900">Precision Factory Tolerances</h3>
                <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                  Every Genuine Mack Part is manufactured using original factory blueprints and metallurgical heat treatment specs, ensuring a flawless drop-in fit with existing powertrain hardware.
                </p>
              </div>

              <div className="bg-white p-6 rounded-[12px] border border-gray-200 shadow-sm">
                <div className="text-blue-500 text-[28px] mb-3">🛠️</div>
                <h3 className="text-[17px] font-bold text-gray-900">Certified Tech Installation</h3>
                <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                  When installed at any certified Mack dealership, parts are covered by full warranty including all associated diagnostic, teardown, and replacement labor.
                </p>
              </div>

              <div className="bg-white p-6 rounded-[12px] border border-gray-200 shadow-sm">
                <div className="text-emerald-500 text-[28px] mb-3">📈</div>
                <h3 className="text-[17px] font-bold text-gray-900">Maintained Resale Value</h3>
                <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
                  Commercial fleets documenting 100% Genuine Mack maintenance records command up to 15% higher secondary market valuation at end-of-lease or trade-in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Modal */}
        {orderModalPart && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-[16px] max-w-[500px] w-full p-6 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setOrderModalPart(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-[20px] font-bold"
              >
                ✕
              </button>

              {orderSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-[24px]">
                    ✓
                  </div>
                  <h3 className="text-[20px] font-bold text-gray-900">Parts Inquiry Received</h3>
                  <p className="text-[14px] text-gray-600">
                    Your request for <strong>{orderModalPart.name}</strong> ({orderQuantity} units) has been routed to the nearest regional Mack distribution hub. An authorized parts representative will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                      {orderModalPart.partNumber}
                    </span>
                    <h3 className="text-[18px] font-bold text-gray-900 mt-1">{orderModalPart.name}</h3>
                    <div className="text-[13px] text-gray-500">{orderModalPart.fitsModels}</div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Required Quantity:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Fleet Company / Contact Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Atlas Logistics / John Doe"
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-700 mb-1">
                      Delivery Zip Code / Dealer Preference:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 60601 (Chicago Central Parts Depot)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px]"
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setOrderModalPart(null)}
                      className="px-4 py-2 text-[14px] text-gray-600 hover:text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#111827] hover:bg-black text-white font-bold py-2.5 px-5 rounded-[6px] text-[14px] transition-colors"
                    >
                      Submit Parts Inquiry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <InteractionModals />
      <MobileAppNavBar />
    </div>
  );
}
