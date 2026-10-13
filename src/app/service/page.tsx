'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InteractionModals, triggerMackModal } from '@/components/ui/InteractionModals';
import { MobileAppNavBar } from '@/components/layout/MobileAppNavBar';

export default function ServicePage() {
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    vinOrUnit: '',
    serviceType: 'PM Schedule A (25,000 Miles)',
    dealershipLocation: 'Mack Chicago Metro Uptime Center',
    preferredDate: '',
    contactName: '',
    contactPhone: '',
    notes: '',
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#111827] via-[#1F2937] to-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="max-w-[1216px] mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[12px] uppercase tracking-wider mb-4">
              <span>🔧</span>
              <span>Commercial Fleet Uptime & Roadside Network</span>
            </div>
            <h1 className="text-[32px] sm:text-[44px] lg:text-[48px] font-black tracking-tight leading-tight max-w-[850px] mx-auto">
              Mack Certified Uptime & Service Solutions
            </h1>
            <p className="mt-4 text-[16px] sm:text-[18px] text-gray-300 max-w-[760px] mx-auto leading-relaxed">
              When your commercial trucks aren&apos;t moving, you aren&apos;t making money. Mack’s nationwide service network combines <strong>Mack GuardDog® Connect</strong> real-time telematics with over <strong>450+ Certified Uptime Centers</strong> to diagnose issues in under 2 hours and get your trucks back on the highway faster.
            </p>

            {/* Quick Metrics */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[950px] mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
                <div className="text-[28px] font-black text-emerald-400 font-mono">&lt; 2 Hrs</div>
                <div className="text-[13px] text-gray-300 mt-1 font-medium">Rapid Check-In Triage</div>
                <div className="text-[11px] text-gray-400">Certified Uptime Commitment</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
                <div className="text-[28px] font-black text-amber-400 font-mono">24/7/365</div>
                <div className="text-[13px] text-gray-300 mt-1 font-medium">Mack OneCall™ Dispatch</div>
                <div className="text-[11px] text-gray-400">1-800-866-1177</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
                <div className="text-[28px] font-black text-blue-400 font-mono">24%</div>
                <div className="text-[13px] text-gray-300 mt-1 font-medium">Faster Turnaround</div>
                <div className="text-[11px] text-gray-400">Reduced Fleet Dwell Time</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-[12px] p-4 text-center">
                <div className="text-[28px] font-black text-purple-400 font-mono">450+</div>
                <div className="text-[13px] text-gray-300 mt-1 font-medium">Certified Centers</div>
                <div className="text-[11px] text-gray-400">North American Network</div>
              </div>
            </div>

            {/* Emergency CTA */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => triggerMackModal('find-dealer')}
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 px-6 rounded-[8px] text-[14px] transition-all shadow-lg active:scale-98 cursor-pointer"
              >
                🚨 Emergency 24/7 Roadside: 1-800-866-1177
              </button>
              <a
                href="#book-service"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-[8px] border border-white/20 text-[14px] transition-all"
              >
                📅 Schedule Fleet Service Bay
              </a>
            </div>
          </div>
        </section>

        {/* 4 Pillars of Mack Uptime */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
          <div className="text-center max-w-[750px] mx-auto mb-12">
            <h2 className="text-[28px] font-bold text-gray-900">How Mack Minimizes Fleet Downtime</h2>
            <p className="text-[15px] text-gray-600 mt-2">
              Our holistic maintenance architecture integrates vehicle sensors, cloud artificial intelligence, and factory master technicians to resolve issues before they escalate into road delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pillar 1: GuardDog Connect */}
            <div className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[10px] bg-blue-50 text-blue-600 flex items-center justify-center text-[24px]">
                  📡
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-blue-600 font-bold tracking-wider">Pillar 01</span>
                  <h3 className="text-[20px] font-bold text-gray-900">Mack GuardDog® Connect</h3>
                </div>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                Standard on every Mack Anthem, GuardDog Connect monitors thousands of engine, transmission, and emissions sensors. When a fault code occurs, it instantly transmits telemetry to the Mack Uptime Center in Greensboro, NC.
              </p>
              <ul className="space-y-2 text-[13px] text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span><strong>Automated Case Creation:</strong> Opens service tickets and notifies fleet managers via SMS and email.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span><strong>Pre-Order Parts:</strong> Identifies needed parts and routes them to the destination dealership before the truck pulls into the lot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✓</span>
                  <span><strong>Over-The-Air (OTA) Updates:</strong> Allows wireless engine software parameter updates during routine driver stops.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Certified Uptime Centers */}
            <div className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[10px] bg-emerald-50 text-emerald-600 flex items-center justify-center text-[24px]">
                  🏥
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-emerald-600 font-bold tracking-wider">Pillar 02</span>
                  <h3 className="text-[20px] font-bold text-gray-900">Certified Uptime Centers</h3>
                </div>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                Dealerships certified to rigorous OEM standards featuring dedicated fast-track triage lanes. Instead of waiting days in a generic queue, quick repairs are isolated immediately.
              </p>
              <ul className="space-y-2 text-[13px] text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>2-Hour Diagnostic Triage:</strong> Certified master technician inspects truck and delivers verified estimate within 120 minutes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Dedicated Fast-Lane Bays:</strong> Minor repairs under 4 hours are routed to dedicated quick-turnaround bays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>ASIST Portal Transparency:</strong> Review photos of damaged components and approve work orders directly from your phone.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 3: 24/7 Roadside Assistance */}
            <div className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[10px] bg-amber-50 text-amber-600 flex items-center justify-center text-[24px]">
                  🚨
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-amber-600 font-bold tracking-wider">Pillar 03</span>
                  <h3 className="text-[20px] font-bold text-gray-900">Mack OneCall™ Roadside 24/7</h3>
                </div>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                One phone call connects your driver to a certified live Mack dispatcher who coordinates heavy-duty commercial recovery anywhere across the United States and Canada.
              </p>
              <ul className="space-y-2 text-[13px] text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong>Nationwide Heavy Towing:</strong> Contracted commercial rotator tow trucks dispatched directly to driver GPS coordinates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong>Mobile Diagnostic Units:</strong> Roadside service vans equipped with MP engine diagnostic computers and common repair parts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong>Tire & Fluid Rescue:</strong> Rapid delivery of commercial steer/drive tires, diesel exhaust fluid (DEF), and coolant.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 4: Preventative Maintenance (PM) */}
            <div className="bg-white border border-gray-200 rounded-[16px] p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[10px] bg-purple-50 text-purple-600 flex items-center justify-center text-[24px]">
                  📋
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-purple-600 font-bold tracking-wider">Pillar 04</span>
                  <h3 className="text-[20px] font-bold text-gray-900">Scheduled PM Service Plans</h3>
                </div>
              </div>
              <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                Factory-prescribed maintenance intervals tailored to your specific fleet route duty cycles (long-haul highway, regional distribution, or severe vocational).
              </p>
              <ul className="space-y-2 text-[13px] text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span><strong>Schedule A (25k Miles):</strong> Lube, oil, filter change, steering play check, and 40-point safety inspection.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span><strong>Schedule B (50k Miles):</strong> Primary/secondary fuel filter change, air dryer desiccant check, coolant refractometer analysis.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">✓</span>
                  <span><strong>Schedule C (100k Miles):</strong> Overhead valve lash calibration, DPF pressure flow analysis, driveline U-joint inspection.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interactive Service Bay Appointment Booking Form */}
        <section id="book-service" className="bg-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-b border-white/10">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-8">
              <div className="text-[12px] font-mono text-emerald-400 uppercase tracking-wider font-bold mb-1">
                Direct Dealership Reservation
              </div>
              <h2 className="text-[28px] sm:text-[32px] font-bold">
                Book Certified Fleet Service
              </h2>
              <p className="text-[14px] text-gray-300 mt-2">
                Submit your commercial service reservation to pre-assign bay space and stage required Genuine Mack Parts ahead of time.
              </p>
            </div>

            <div className="bg-[#1F2937] border border-white/10 rounded-[16px] p-6 sm:p-8 shadow-2xl">
              {bookingSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-[32px]">
                    ✓
                  </div>
                  <h3 className="text-[22px] font-bold text-white">Service Appointment Reserved!</h3>
                  <p className="text-[14px] text-gray-300 max-w-[500px] mx-auto">
                    Your appointment for <strong>{formData.vinOrUnit || 'Fleet Unit'}</strong> at <strong>{formData.dealershipLocation}</strong> has been scheduled. A service advisor will contact <strong>{formData.contactName || 'your team'}</strong> at <strong>{formData.contactPhone}</strong> with bay confirmation.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBookingSubmitted(false)}
                    className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-[6px] text-[13px] transition-colors"
                  >
                    Schedule Another Vehicle
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Vehicle VIN or Unit # <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1M2AX10C... or UNIT-402"
                        value={formData.vinOrUnit}
                        onChange={(e) => setFormData({ ...formData, vinOrUnit: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Service Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                      >
                        <option>PM Schedule A (25,000 Miles)</option>
                        <option>PM Schedule B (50,000 Miles)</option>
                        <option>PM Schedule C (100,000 Miles)</option>
                        <option>Diagnostic Trouble Code (DTC) Triage</option>
                        <option>Brake Inspection & Air System</option>
                        <option>mDRIVE Clutch / Powertrain Service</option>
                        <option>DPF Regeneration & Emissions Check</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Select Certified Uptime Center <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={formData.dealershipLocation}
                        onChange={(e) => setFormData({ ...formData, dealershipLocation: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                      >
                        <option>Mack Chicago Central Uptime Center (IL)</option>
                        <option>Mack Atlanta Regional Logistics Depot (GA)</option>
                        <option>Mack Dallas/Fort Worth Interstate Hub (TX)</option>
                        <option>Mack Los Angeles Port Corridor Center (CA)</option>
                        <option>Mack Allentown Flagship Service Center (PA)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Preferred Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Fleet Manager / Driver Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Marcus Vance"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[13px] font-medium text-gray-300 mb-1">
                        Direct Contact Phone <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +1 (555) 742-1089"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[13px] font-medium text-gray-300 mb-1">
                      Reported Symptoms / Service Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Driver reported yellow engine light on Highway 80, occasional transmission hesitation during low speed reverse..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-[8px] bg-black/40 border border-gray-700 text-white focus:outline-none focus:border-amber-400 text-[14px]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 px-6 rounded-[8px] transition-all cursor-pointer shadow-lg active:scale-98 text-[15px]"
                    >
                      Confirm Service Reservation
                    </button>
                    <div className="text-[12px] text-gray-400 text-center mt-2">
                      Immediate 2-Hour triage guarantee applies to all Certified Uptime Centers during standard operating hours.
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Back Link */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
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
