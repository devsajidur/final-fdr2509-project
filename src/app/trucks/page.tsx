'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InteractionModals, triggerMackModal } from '@/components/ui/InteractionModals';
import { MobileAppNavBar } from '@/components/layout/MobileAppNavBar';

interface TruckModel {
  id: string;
  name: string;
  tagline: string;
  category: 'Highway Long-Haul' | 'Regional Haul' | 'Vocational' | 'Medium-Duty';
  cabType: string;
  engine: string;
  horsepower: string;
  torque: string;
  transmission: string;
  gvwr: string;
  gcwr: string;
  keyFeatures: string[];
  recommendedUse: string;
  badge: string;
}

const TRUCK_MODELS: TruckModel[] = [
  {
    id: 'anthem-70-sleeper',
    name: 'Mack Anthem® 70" Stand-Up Sleeper',
    tagline: 'The Ultimate Long-Haul Commercial Highway Flagship',
    category: 'Highway Long-Haul',
    cabType: '70-Inch High-Roof Stand-Up Sleeper',
    engine: 'Mack MP8® 13L / MP8HE Turbo Compounding',
    horsepower: '415 – 505 HP',
    torque: '1,560 – 1,860 lb.-ft.',
    transmission: 'mDRIVE™ 12-Speed Automated Manual with Predictive Cruise',
    gvwr: '52,000 – 66,000 lbs.',
    gcwr: '80,000+ lbs. (Interstate Freight)',
    keyFeatures: [
      'Aerodynamically sculpted roof & side fairings delivering up to 12.5% fuel efficiency improvement',
      'Spacious 7-foot interior ceiling height with 35-inch pocket coil mattress and full sleeper wardrobe',
      'Mack GuardDog® Connect 24/7 telematics with automatic DTC fault detection and repair pre-scheduling',
      'Bendix® Wingman Fusion 2.0 active radar collision mitigation and lane departure safety',
    ],
    recommendedUse: 'Cross-country interstate dry van freight, refrigerated transport, and dedicated logistics fleets.',
    badge: 'FLAGSHIP HIGHWAY',
  },
  {
    id: 'anthem-48-sleeper',
    name: 'Mack Anthem® 48" Flat Top Sleeper',
    tagline: 'Streamlined Efficiency for Regional & Low-Clearance Routes',
    category: 'Regional Haul',
    cabType: '48-Inch Flat-Top Sleeper',
    engine: 'Mack MP7® 11L or MP8® 13L Clean Diesel',
    horsepower: '325 – 505 HP',
    torque: '1,260 – 1,860 lb.-ft.',
    transmission: 'mDRIVE™ 12-Speed / mDRIVE™ HD 13-Speed',
    gvwr: '50,000 – 60,000 lbs.',
    gcwr: '80,000 lbs.',
    keyFeatures: [
      'Low profile cab roof height specifically engineered for auto car-haulers, flatbeds, and bulk tankers',
      'Weight-optimized steel-reinforced cab preserving payload capacity for heavy materials',
      'Comfortable 35-inch resting bunk for regional layovers and mandated driver rest cycles',
      'Integrated LED headlights with internal heating elements that melt ice and snow',
    ],
    recommendedUse: 'Regional distribution, steel and machinery flatbed haulage, automobile transport, and liquid bulk tankers.',
    badge: 'REGIONAL SPECIALIST',
  },
  {
    id: 'anthem-day-cab',
    name: 'Mack Anthem® Day Cab',
    tagline: 'Maximum Payload & Maneuverability for Metro & Intermodal Transport',
    category: 'Regional Haul',
    cabType: 'Non-Sleeper Day Cab',
    engine: 'Mack MP7® 11L (Lightweight & Responsive)',
    horsepower: '325 – 455 HP',
    torque: '1,260 – 1,660 lb.-ft.',
    transmission: 'mDRIVE™ 12-Speed / Allison 4000 6-Speed Automatic',
    gvwr: '35,000 – 52,000 lbs.',
    gcwr: '80,000 lbs.',
    keyFeatures: [
      'Up to 2,000 lbs. tare weight savings compared to sleeper models, maximizing revenue freight per haul',
      'Extreme 50-degree wheel cut offering class-leading turning radius for crowded shipping docks',
      'Galvanized steel cab with dual E-coat primer resisting harsh coastal and winter road salt environments',
      'Breakaway hood-mounted rearview mirrors with wide-angle spotters minimizing side blindspots',
    ],
    recommendedUse: 'Port container drayage, rail intermodal transfer, local grocery and retail store replenishment.',
    badge: 'LOCAL & DRAYAGE',
  },
  {
    id: 'pinnacle-axle-forward',
    name: 'Mack Pinnacle™ Axle-Forward',
    tagline: 'Classic American Highway Power with Modern Aerodynamics',
    category: 'Highway Long-Haul',
    cabType: 'Day Cab / 48" Sleeper / 70" Sleeper',
    engine: 'Mack MP8® 13L Heavy-Duty Diesel',
    horsepower: '415 – 505 HP',
    torque: '1,560 – 1,860 lb.-ft.',
    transmission: 'mDRIVE™ 12-Speed / Fuller Manual 10/13/18-Speed',
    gvwr: '52,000 – 66,000 lbs.',
    gcwr: '80,000 – 110,000+ lbs.',
    keyFeatures: [
      'Axle-Forward front axle placement optimizing weight distribution across state bridge formula regulations',
      'Commanding chrome grille and stainless steel sun visor with iconic classic American long-hood styling',
      'Heavy-duty chassis crossmembers designed for rugged long-haul, grain, and heavy livestock transport',
      'Full digital Co-Pilot driver display with real-time fuel economy coaching and axle load readouts',
    ],
    recommendedUse: 'Bulk commodity hauling, heavy agricultural transport, and traditional owner-operator long-haul.',
    badge: 'CLASSIC HIGHWAY',
  },
  {
    id: 'granite-vocational',
    name: 'Mack Granite® Vocational Workhorse',
    tagline: 'The Undisputed Industry Benchmark for Severe-Duty Construction',
    category: 'Vocational',
    cabType: 'Day Cab / Extended Cab / Axle-Back or Axle-Forward',
    engine: 'Mack MP7® 11L / MP8® 13L / Cummins L9',
    horsepower: '325 – 505 HP',
    torque: '1,260 – 1,860 lb.-ft.',
    transmission: 'mDRIVE™ HD with Creeper Gears (13 or 14-Speed) / Allison Automatic',
    gvwr: '35,000 – 92,000+ lbs.',
    gcwr: 'Up to 140,000 lbs. (Severe Permit)',
    keyFeatures: [
      'Cornerstone™ chassis frame rails engineered with high-strength alloy steel (up to 3.2M RBM)',
      'mDRIVE™ HD automated manual transmission with ultra-low deep crawler gears for steep grade job sites',
      'Factory-installed bodybuilder connectors with clear-rail routing for effortless dump, mixer, or crane mounting',
      'UniMax™ front steer axle with sealed maintenance-free hub assemblies rated up to 23,000 lbs.',
    ],
    recommendedUse: 'Construction aggregate dumps, ready-mix concrete, heavy equipment lowboy haulers, and municipal snow plowing.',
    badge: 'SEVERE VOCATIONAL',
  },
  {
    id: 'md-series-straight',
    name: 'Mack MD Series (MD6 & MD7)',
    tagline: 'Urban Delivery Toughness with True Mack Heavy-Duty DNA',
    category: 'Medium-Duty',
    cabType: 'BBC 103" Medium-Duty Day Cab',
    engine: 'Cummins B6.7L Turbo Clean Diesel',
    horsepower: '240 – 300 HP',
    torque: '560 – 660 lb.-ft.',
    transmission: 'Allison 2500 RDS / 3000 RDS 6-Speed Automatic',
    gvwr: 'Class 6: 25,995 lbs. (No CDL Required) | Class 7: 33,000 lbs.',
    gcwr: 'Up to 45,000 lbs.',
    keyFeatures: [
      'Available in non-CDL 25,995 lbs. configuration to help fleets overcome commercial driver shortages',
      'Air-ride cab suspension paired with tilt/telescoping steering wheel for superior delivery driver ergonomics',
      'Tight 49-degree wheel cut designed specifically for maneuvering through narrow city streets and loading alleys',
      'Industry-standard 34-inch wide chassis frame accepting standard 10 to 26-foot dry freight and refrigerated bodies',
    ],
    recommendedUse: 'Final-mile urban freight, beverage distribution, refrigerated perishable delivery, and commercial flatbed towing.',
    badge: 'MEDIUM-DUTY',
  },
];

export default function TrucksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      <Header />

      <main className="flex-1">
        {/* Page Hero Banner */}
        <section className="bg-gradient-to-b from-[#111827] via-[#1F2937] to-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-[1216px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[12px] uppercase tracking-wider mb-4">
              <span>🚚</span>
              <span>Official Commercial Heavy-Duty Vehicle Showcase</span>
            </div>
            <h1 className="text-[32px] sm:text-[44px] lg:text-[50px] font-black tracking-tight leading-tight max-w-[900px] mx-auto">
              Mack Commercial Trucks & Fleet Solutions
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] text-gray-300 max-w-[760px] mx-auto leading-relaxed">
              From the aerodynamic long-haul <strong>Mack Anthem®</strong> to the severe-duty <strong>Mack Granite®</strong>, discover how America’s premier commercial fleet vehicles deliver superior fuel economy, legendary durability, and maximum driver uptime.
            </p>

            {/* Quick Stats Grid */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1000px] mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
                <div className="text-[28px] font-black text-amber-400 font-mono">12.5%</div>
                <div className="text-[13px] text-gray-300 mt-1 font-medium">Anthem Fuel Savings</div>
                <div className="text-[11px] text-gray-400">MP8HE Turbo Compounding</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
                <div className="text-[28px] font-black text-blue-400 font-mono">505 HP</div>
                <div className="text-[13px] text-gray-300 mt-1 font-medium">Max Engine Power</div>
                <div className="text-[11px] text-gray-400">1,860 lb.-ft. Torque</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
                <div className="text-[28px] font-black text-emerald-400 font-mono">24/7</div>
                <div className="text-[13px] text-gray-300 mt-1 font-medium">GuardDog® Connect</div>
                <div className="text-[11px] text-gray-400">Real-Time Telematics</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
                <div className="text-[28px] font-black text-amber-400 font-mono">450+</div>
                <div className="text-[13px] text-gray-300 mt-1 font-medium">Uptime Dealerships</div>
                <div className="text-[11px] text-gray-400">Nationwide Network</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-6 rounded-[8px] transition-all shadow-lg active:scale-98 text-[14px]"
              >
                📊 Calculate Fleet TCO & Fuel Savings
              </Link>
              <button
                type="button"
                onClick={() => triggerMackModal('configure')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-[8px] border border-white/20 transition-all text-[14px] cursor-pointer"
              >
                ⚙️ Configure & Price Anthem
              </button>
              <button
                type="button"
                onClick={() => triggerMackModal('find-dealer')}
                className="bg-transparent hover:bg-white/10 text-gray-300 hover:text-white font-medium py-2.5 px-5 rounded-[8px] transition-all text-[14px] cursor-pointer"
              >
                📍 Find Local Dealer (1-800-866-1177)
              </button>
            </div>
          </div>
        </section>

        {/* What this website is (Simple Explanation Banner) */}
        <section className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1216px] mx-auto bg-[#F8FAFC] border border-blue-200 rounded-[12px] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[24px] shrink-0">
                ℹ️
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-gray-900">
                  What is the Mack Anthem Platform? (সহজ পরিচয়)
                </h2>
                <p className="text-[14px] text-gray-600 mt-1 leading-relaxed">
                  This website is the official commercial fleet showcase for <strong>Mack Trucks</strong>. Here, commercial freight carriers, fleet managers, and independent truck operators can inspect heavy-duty Class 8 semi-trucks, calculate Total Cost of Ownership (TCO), order genuine parts, schedule certified service, and request commercial leasing quotes.
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => triggerMackModal('brochure')}
                className="text-[13px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-[6px] transition-colors shadow-sm cursor-pointer"
              >
                📄 Download Lineup Brochure
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Truck Lineup Cards */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[26px] font-bold text-gray-900">Heavy-Duty & Vocational Fleet Lineup</h2>
              <p className="text-[14px] text-gray-600 mt-1">Select any commercial truck model to review specifications, powertrain combinations, and recommended freight duties.</p>
            </div>
            <span className="hidden sm:inline-block text-[13px] font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded">
              6 Commercial Chassis Options
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TRUCK_MODELS.map((truck) => (
              <div
                key={truck.id}
                className="bg-white border border-gray-200 rounded-[14px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge & Header */}
                  <div className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {truck.badge}
                      </span>
                      <span className="text-[12px] font-mono text-gray-500">
                        {truck.category}
                      </span>
                    </div>
                    <h3 className="text-[20px] font-bold text-gray-900 leading-snug">{truck.name}</h3>
                    <p className="text-[13px] text-amber-700 font-medium mt-1">{truck.tagline}</p>
                  </div>

                  {/* Spec Sheet Table */}
                  <div className="p-6 py-4 space-y-2 text-[13px] bg-gray-50/50">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Cab Style:</span>
                      <span className="font-semibold text-gray-800 text-right">{truck.cabType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Engine:</span>
                      <span className="font-semibold text-gray-800 text-right">{truck.engine}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Power & Torque:</span>
                      <span className="font-semibold text-amber-700 font-mono text-right">{truck.horsepower} | {truck.torque}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">Transmission:</span>
                      <span className="font-semibold text-gray-800 text-right truncate max-w-[200px]" title={truck.transmission}>
                        {truck.transmission}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500 font-medium">GCWR / Rating:</span>
                      <span className="font-semibold text-gray-800 font-mono text-right">{truck.gcwr}</span>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="p-6 pt-4">
                    <div className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-2">Fleet Highlights:</div>
                    <ul className="space-y-1.5 text-[12px] text-gray-600">
                      {truck.keyFeatures.slice(0, 3).map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 shrink-0">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                      <strong>Best For:</strong> {truck.recommendedUse}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-6 pt-0 border-t border-gray-100 mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => triggerMackModal('quote')}
                    className="flex-1 bg-[#111827] hover:bg-black text-white font-semibold py-2.5 px-3 rounded-[6px] text-[13px] text-center transition-colors cursor-pointer"
                  >
                    Request Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerMackModal('configure')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-3 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                  >
                    Configure
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Powertrain & Fuel Efficiency Callout */}
        <section className="bg-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-white/10">
          <div className="max-w-[1216px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[12px] font-mono text-amber-400 uppercase tracking-wider font-bold mb-2">
                Integrated Powertrain Engineering
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-bold leading-tight">
                Mack MP8® Engine with mDRIVE™: Built to Work Together
              </h2>
              <p className="mt-4 text-[15px] text-gray-300 leading-relaxed">
                Unlike assembled trucks with mismatched component manufacturers, every Mack Anthem is built with a proprietary integrated powertrain. The Mack MP8 engine communicates seamlessly with the mDRIVE automated manual transmission, adjusting shift points to roadway topography and keeping the engine in its optimal fuel efficiency sweet spot (1,050 – 1,300 RPM).
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[14px] shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">Wave Piston Technology</h3>
                    <p className="text-[13px] text-gray-400">Patented piston bowl contours redirect unburned fuel back into the center combustion chamber, slashing soot emissions and increasing fuel energy transfer.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[14px] shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">Turbo Compounding (MP8HE)</h3>
                    <p className="text-[13px] text-gray-400">Recaptures lost exhaust energy through a secondary turbine that transfers up to 50 additional horsepower directly back to the crankshaft.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[14px] shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white">Predictive Cruise Control with GPS Mapping</h3>
                    <p className="text-[13px] text-gray-400">Stores topographic maps of over 4,500 North American highway miles, anticipating upcoming hills to throttle power before ascents and coasting down descents.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href="/parts"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-5 rounded-[6px] text-[14px] transition-colors"
                >
                  Explore Genuine Parts & Components →
                </Link>
                <Link
                  href="/service"
                  className="text-gray-300 hover:text-white font-medium text-[14px] underline underline-offset-4"
                >
                  Learn About Uptime Services
                </Link>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[16px] p-6 lg:p-8 backdrop-blur-sm">
              <h3 className="text-[18px] font-bold text-white mb-4">Fleet Total Cost of Ownership Comparison</h3>
              <p className="text-[13px] text-gray-300 mb-6">
                Based on an average long-haul fleet running 120,000 miles per truck annually at $3.85 per gallon diesel:
              </p>

              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-[8px] border border-white/5">
                  <div className="flex justify-between text-[14px] font-semibold">
                    <span className="text-gray-400">Standard Class 8 Highway Truck (6.8 MPG)</span>
                    <span className="font-mono text-red-400">$67,941 / Year</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                    <div className="bg-red-500 h-2 rounded-full w-[100%]"></div>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-[8px] border border-white/5">
                  <div className="flex justify-between text-[14px] font-semibold">
                    <span className="text-white">Mack Anthem Standard (7.4 MPG)</span>
                    <span className="font-mono text-amber-400">$62,432 / Year</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                    <div className="bg-amber-400 h-2 rounded-full w-[91.8%]"></div>
                  </div>
                  <div className="text-[11px] text-amber-300 mt-1">Annual savings: $5,509 per truck</div>
                </div>

                <div className="bg-amber-500/10 p-4 rounded-[8px] border border-amber-500/30">
                  <div className="flex justify-between text-[14px] font-semibold">
                    <span className="text-amber-300">Mack Anthem MP8HE Turbo Compounding (8.2 MPG)</span>
                    <span className="font-mono text-emerald-400">$56,341 / Year</span>
                  </div>
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                    <div className="bg-emerald-400 h-2 rounded-full w-[82.9%]"></div>
                  </div>
                  <div className="text-[12px] font-bold text-emerald-400 mt-1.5 flex items-center justify-between">
                    <span>Total Annual Fuel Savings:</span>
                    <span>$11,600 / Truck / Year</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-[13px] text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <span>Open Custom Fleet Fuel & TCO Calculator</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 text-center max-w-[800px] mx-auto">
          <h2 className="text-[28px] font-bold text-gray-900">Ready to Upgrade Your Commercial Fleet?</h2>
          <p className="mt-3 text-[15px] text-gray-600">
            Connect with a certified Mack Trucks commercial dealer to schedule a live demonstration, configure custom chassis specifications, or review commercial lease financing options.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => triggerMackModal('contact')}
              className="bg-[#111827] hover:bg-black text-white font-bold py-3 px-8 rounded-[8px] transition-all shadow-md active:scale-98 text-[14px] cursor-pointer"
            >
              Contact Commercial Dealer
            </button>
            <Link
              href="/"
              className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-6 rounded-[8px] border border-gray-300 transition-colors text-[14px]"
            >
              ← Back to Interactive Showcase
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <InteractionModals />
      <MobileAppNavBar />
    </div>
  );
}
