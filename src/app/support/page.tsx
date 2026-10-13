'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InteractionModals } from '@/components/ui/InteractionModals';
import { MobileAppNavBar } from '@/components/layout/MobileAppNavBar';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Commercial Financing (MFS)',
    question: 'What is a Terminal Rental Adjustment Clause (TRAC) Lease?',
    answer:
      'A TRAC Lease is the most popular commercial fleet financing structure for heavy-duty trucks. It provides lower monthly payments, off-balance sheet operating expense treatment (depending on accounting standards), and allows the fleet operator to purchase the truck at an agreed residual value or retain net sale proceeds when upgrading to a new model.',
  },
  {
    category: 'Warranty Coverage',
    question: 'What does the standard 3-Year / 350,000-Mile Mack Engine Warranty cover?',
    answer:
      'The base engine warranty covers 100% parts and certified technician labor for the cylinder block, cylinder head casting, camshaft, crankshaft, connecting rods, flywheel housing, oil pump, and internal lubricated components with zero deductible at any authorized Mack dealership in the US and Canada.',
  },
  {
    category: 'Fleet Operations',
    question: 'How do I access the Mack ASIST portal for real-time repair estimates?',
    answer:
      'Mack ASIST is an online fleet communications platform. Fleet managers can register their fleet to receive instant notifications when a truck arrives at a dealership, view digital photos of damaged components, message service writers directly, and approve repair estimates electronically from any smartphone or computer.',
  },
  {
    category: 'Telematics & Software',
    question: 'How does Mack GuardDog® Connect handle over-the-air (OTA) updates?',
    answer:
      'GuardDog Connect utilizes built-in 4G cellular connectivity to push engine and transmission calibration updates directly to the vehicle. When the driver securely parks and keys off, the digital instrument cluster prompts the driver to accept the update, completing calibration without a dealership visit.',
  },
  {
    category: 'Commercial Financing (MFS)',
    question: 'Can bodybuilder equipment (dump body, mixer, reefer) be included in my MFS loan?',
    answer:
      'Yes. Mack Financial Services offers full single-invoice bundled financing. Your truck chassis, specialized dump/mixer/crane body, extended warranty contract, and maintenance agreement can all be packaged into one consolidated monthly commercial payment.',
  },
];

export default function SupportPage() {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketData, setTicketData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    inquiryType: 'Mack Financial Services (MFS) Financing',
    fleetSize: '10-25 Units',
    message: '',
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      <Header />

      <main className="flex-1">
        {/* Page Hero */}
        <section className="bg-gradient-to-b from-[#111827] via-[#1F2937] to-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-[1216px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-mono text-[12px] uppercase tracking-wider mb-4">
              <span>📞</span>
              <span>Commercial Fleet Operations & Customer Success</span>
            </div>
            <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-black tracking-tight leading-tight max-w-[850px] mx-auto">
              Mack Fleet Support & Financial Services
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] text-gray-300 max-w-[760px] mx-auto leading-relaxed">
              We stand behind every Mack truck with dedicated commercial financing through <strong>Mack Financial Services (MFS)</strong>, comprehensive warranty protection up to 600,000 miles, and 24/7 enterprise customer assistance.
            </p>

            {/* Support Directory Phone Cards */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1100px] mx-auto text-left">
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4">
                <div className="text-[11px] font-mono uppercase text-amber-400 font-bold">24/7 Emergency Dispatch</div>
                <div className="text-[17px] font-bold text-white mt-1">1-800-866-1177</div>
                <div className="text-[12px] text-gray-400 mt-1">Mack OneCall roadside towing, tire rescue & diagnostics.</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4">
                <div className="text-[11px] font-mono uppercase text-blue-400 font-bold">Commercial Financing</div>
                <div className="text-[17px] font-bold text-white mt-1">1-800-247-4182</div>
                <div className="text-[12px] text-gray-400 mt-1">MFS commercial leasing, TRAC lines of credit & payoff quotes.</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4">
                <div className="text-[11px] font-mono uppercase text-emerald-400 font-bold">Warranty Administration</div>
                <div className="text-[17px] font-bold text-white mt-1">1-800-866-MACK</div>
                <div className="text-[12px] text-gray-400 mt-1">Base & extended warranty claims, policy transfers & coverage checks.</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4">
                <div className="text-[11px] font-mono uppercase text-purple-400 font-bold">Telematics Operations</div>
                <div className="text-[17px] font-bold text-white mt-1">1-800-528-6857</div>
                <div className="text-[12px] text-gray-400 mt-1">GuardDog Connect gateway setup, OTA updates & ASIST fleet portal.</div>
              </div>
            </div>
          </div>
        </section>

        {/* MFS Commercial Financing Overview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-[12px] font-mono text-amber-600 uppercase font-bold tracking-wider mb-2">
                Mack Financial Services (MFS)
              </div>
              <h2 className="text-[28px] sm:text-[34px] font-bold text-gray-900 leading-tight">
                Financing Built Specifically for Commercial Trucking
              </h2>
              <p className="mt-4 text-[15px] text-gray-600 leading-relaxed">
                Commercial freight markets don&apos;t run like standard consumer banking. Mack Financial Services understands freight rate cycles, seasonal hauling demands, and commercial equipment depreciation. We design flexible leasing and loan packages tailored to cash-flow needs.
              </p>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-[10px] bg-white border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-[16px] text-gray-900">TRAC Leases (Terminal Rental Adjustment Clause)</h3>
                  <p className="text-[13px] text-gray-600 mt-1">Lower monthly payments with pre-negotiated terminal values. Flexible buy-out or trade-up options at end of lease.</p>
                </div>

                <div className="p-4 rounded-[10px] bg-white border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-[16px] text-gray-900">Seasonal Skip-Payment Plans</h3>
                  <p className="text-[13px] text-gray-600 mt-1">Tailored for agricultural, timber, and northern construction fleets with reduced payment obligations during off-peak hauling months.</p>
                </div>

                <div className="p-4 rounded-[10px] bg-white border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-[16px] text-gray-900">Single-Invoice Consolidated Bundling</h3>
                  <p className="text-[13px] text-gray-600 mt-1">Roll truck chassis, specialized bodies, extended warranty protection, and scheduled maintenance into one monthly remittance.</p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-6 rounded-[8px] text-[14px] transition-all shadow"
                >
                  Open MFS Financing Calculator →
                </Link>
              </div>
            </div>

            {/* Warranty Coverage Matrix */}
            <div className="bg-white border border-gray-200 rounded-[16px] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[20px] font-bold text-gray-900">Mack Factory Warranty Protection</h3>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded font-bold">
                  NATIONWIDE OEM
                </span>
              </div>
              <p className="text-[13px] text-gray-600 mb-6">
                Recognized at all 450+ Mack Trucks authorized dealership locations with zero deductible on major powertrain items:
              </p>

              <div className="space-y-3 text-[13px]">
                <div className="p-3 rounded-[8px] bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Base MP8 Engine & Aftertreatment</div>
                    <div className="text-[12px] text-gray-500">Cylinder block, heads, pistons, camshaft, turbo, SCR</div>
                  </div>
                  <div className="font-mono font-bold text-gray-900 text-right">3 Yrs / 350,000 Mi</div>
                </div>

                <div className="p-3 rounded-[8px] bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">mDRIVE™ Automated Transmission</div>
                    <div className="text-[12px] text-gray-500">Transmission case, gears, internal bearings, electronic actuator</div>
                  </div>
                  <div className="font-mono font-bold text-gray-900 text-right">5 Yrs / 750,000 Mi</div>
                </div>

                <div className="p-3 rounded-[8px] bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Mack Rear Axle Carriers</div>
                    <div className="text-[12px] text-gray-500">Single and tandem drive axle housings, ring/pinion gears</div>
                  </div>
                  <div className="font-mono font-bold text-gray-900 text-right">5 Yrs / 750,000 Mi</div>
                </div>

                <div className="p-3 rounded-[8px] bg-gray-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">Anthem Galvanized Steel Cab</div>
                    <div className="text-[12px] text-gray-500">Structural integrity and anti-corrosion rust perforation</div>
                  </div>
                  <div className="font-mono font-bold text-gray-900 text-right">5 Yrs / Unlimited Mi</div>
                </div>

                <div className="p-3 rounded-[8px] bg-amber-50 border border-amber-200 flex items-center justify-between text-amber-900">
                  <div>
                    <div className="font-bold">Mack Premium Extended Protection</div>
                    <div className="text-[12px] text-amber-800">Complete vehicle bumper-to-crossmember extended plan</div>
                  </div>
                  <div className="font-mono font-bold text-amber-950 text-right">Up to 6 Yrs / 600,000 Mi</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Ticket Submission Form */}
        <section className="bg-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-white/10">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-8">
              <div className="text-[12px] font-mono text-amber-400 uppercase tracking-wider font-bold mb-1">
                Commercial Operations Helpdesk
              </div>
              <h2 className="text-[28px] sm:text-[32px] font-bold">
                Submit an Enterprise Support Request
              </h2>
              <p className="text-[14px] text-gray-300 mt-2">
                Have an inquiry about fleet financing pre-approval, warranty claims assistance, or telematics fleet integration? Our corporate operations team responds within 1 business day.
              </p>
            </div>

            <div className="bg-[#1F2937] border border-white/10 rounded-[16px] p-6 sm:p-8 shadow-2xl">
              {ticketSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-[32px]">
                    ✓
                  </div>
                  <h3 className="text-[22px] font-bold text-white">Support Inquiry Submitted!</h3>
                  <p className="text-[14px] text-gray-300 max-w-[500px] mx-auto">
                    Thank you, <strong>{ticketData.name}</strong>. Your inquiry regarding <strong>{ticketData.inquiryType}</strong> has been logged into the Mack Commercial Operations ticket queue. A specialist will contact you at <strong>{ticketData.email}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTicketSubmitted(false)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-[6px] text-[13px] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Contact Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Elena Rostova"
                        value={ticketData.name}
                        onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Carrier Company Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Trans-American Freightways"
                        value={ticketData.company}
                        onChange={(e) => setTicketData({ ...ticketData, company: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Business Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. logistics@transam.com"
                        value={ticketData.email}
                        onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Direct Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +1 (555) 382-9901"
                        value={ticketData.phone}
                        onChange={(e) => setTicketData({ ...ticketData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Inquiry Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={ticketData.inquiryType}
                        onChange={(e) => setTicketData({ ...ticketData, inquiryType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                      >
                        <option>Mack Financial Services (MFS) Financing</option>
                        <option>Warranty Claim / Coverage Verification</option>
                        <option>Mack ASIST Fleet Portal Access</option>
                        <option>GuardDog Connect Telematics Setup</option>
                        <option>Driver Fuel-Economy Coaching Program</option>
                        <option>Enterprise National Fleet Account Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Active Fleet Size
                      </label>
                      <select
                        value={ticketData.fleetSize}
                        onChange={(e) => setTicketData({ ...ticketData, fleetSize: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                      >
                        <option>1 – 5 Trucks (Owner-Operator / Small Carrier)</option>
                        <option>6 – 25 Trucks (Regional Fleet)</option>
                        <option>26 – 100 Trucks (Mid-Sized Carrier)</option>
                        <option>100+ Trucks (Enterprise National Carrier)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-300 mb-1">
                      Details / Specific Questions <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please describe your fleet inquiry, vehicle VINs, or financing goals..."
                      value={ticketData.message}
                      onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 px-6 rounded-[8px] transition-all cursor-pointer shadow-lg active:scale-98 text-[15px]"
                    >
                      Submit Commercial Support Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Accordion */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[26px] font-bold text-gray-900">Commercial Fleet Operations FAQ</h2>
            <p className="text-[14px] text-gray-600 mt-1">Frequently asked questions by fleet executives, maintenance directors, and independent owner-operators.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-[10px] overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="text-[11px] font-mono text-amber-700 font-bold uppercase tracking-wider block mb-1">
                      {faq.category}
                    </span>
                    <span className="font-semibold text-gray-900 text-[15px]">{faq.question}</span>
                  </div>
                  <span className="text-gray-400 text-[18px] shrink-0 font-bold">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-[14px] text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Navigation Link */}
        <section className="py-8 px-4 text-center border-t border-gray-200 bg-white">
          <Link
            href="/"
            className="text-gray-600 hover:text-black font-medium text-[14px] underline underline-offset-4"
          >
            ← Return to Interactive Showcase
          </Link>
        </section>
      </main>

      <Footer />
      <InteractionModals />
      <MobileAppNavBar />
    </div>
  );
}
