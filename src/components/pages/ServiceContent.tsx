'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero, SectionHeading, HeroStat, darkInputClass, darkLabelClass } from '@/components/ui/PageBlocks';
import { triggerMackModal } from '@/components/ui/InteractionModals';
import { submitContactToFirestore } from '@/lib/firebase/firestore';
import { smoothScrollTo } from '@/lib/smoothScroll';
import {
  FLEET_HOTLINE,
  GUARDDOG_FEATURES,
  PM_PLANS,
  REGIONAL_DEALERS,
  SERVICE_CENTER_CAPABILITIES,
  SERVICE_TYPES,
  WARRANTY_COVERAGE,
} from '@/data/catalog';

const SERVICE_DEALERS = REGIONAL_DEALERS.filter(
  (d) => d.services.includes('Uptime Center') || d.services.includes('Service')
).map((d) => `${d.name} (${d.city}, ${d.state})`);

interface BookingForm {
  vin: string;
  serviceType: string;
  dealer: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const EMPTY_FORM: BookingForm = {
  vin: '',
  serviceType: SERVICE_TYPES[0],
  dealer: SERVICE_DEALERS[0],
  date: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
};

export function ServiceContent() {
  const [form, setForm] = useState<BookingForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState<{ form: BookingForm; savedToCloud: boolean } | null>(null);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const update = <K extends keyof BookingForm>(key: K, value: BookingForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const choosePlan = (serviceType: string) => {
    update('serviceType', serviceType);
    setBooked(null);
    smoothScrollTo('#book-service', 65);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.vin.trim() || !form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.date) {
      setError('Please complete the VIN / unit number, preferred date and your contact details.');
      return;
    }
    setError('');
    setSubmitting(true);
    const res = await submitContactToFirestore({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      subject: `Service Appointment: ${form.serviceType}`,
      message: [
        `Unit / VIN: ${form.vin.trim()}`,
        `Service: ${form.serviceType}`,
        `Dealer: ${form.dealer}`,
        `Preferred date: ${form.date}`,
        form.notes.trim() ? `Notes: ${form.notes.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    });
    setSubmitting(false);
    setBooked({ form, savedToCloud: res.isRealtime });
  };

  return (
    <PageShell>
      <PageHero
        icon="🔧"
        eyebrow="Fleet Uptime & Roadside Network"
        title="Mack Certified Service & Uptime"
        description={
          <>
            When your trucks aren&apos;t moving, you aren&apos;t earning. Mack pairs{' '}
            <strong>GuardDog® Connect</strong> telematics with 450+ Certified Uptime Centers to diagnose
            faster and get you back on the road.
          </>
        }
      >
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[950px] mx-auto">
          <HeroStat value="< 2 hrs" label="Diagnostic Triage" note="Certified commitment" tone="text-emerald-400" />
          <HeroStat value="24/7/365" label="OneCall™ Dispatch" note={FLEET_HOTLINE.display} />
          <HeroStat value="24%" label="Faster Turnaround" note="Less fleet dwell time" tone="text-blue-400" />
          <HeroStat value="450+" label="Certified Centers" note="North America" tone="text-purple-400" />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#book-service"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2.5 px-6 rounded-[8px] text-[14px] transition-all shadow-lg active:scale-[0.98]"
          >
            📅 Book Service Appointment
          </a>
          <button
            type="button"
            onClick={() => triggerMackModal('find-dealer')}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-[8px] border border-white/20 text-[14px] transition-all cursor-pointer"
          >
            📍 Find a Service Dealer
          </button>
          <a
            href={`tel:${FLEET_HOTLINE.tel}`}
            className="bg-transparent hover:bg-white/10 text-gray-200 hover:text-white font-medium py-2.5 px-5 rounded-[8px] border border-white/10 text-[14px] transition-all"
          >
            🚨 Roadside: {FLEET_HOTLINE.display}
          </a>
        </div>
      </PageHero>

      <section id="service-center" className="scroll-mt-[80px] py-16 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
        <SectionHeading
          eyebrow="Mack Service Center"
          title="Certified Uptime Centers Built Around Your Schedule"
          description="Dealerships certified to rigorous OEM standards, with fast-track triage lanes, master technicians and genuine parts on hand."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICE_CENTER_CAPABILITIES.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-gray-200 rounded-[14px] p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-11 h-11 rounded-[10px] bg-gray-100 flex items-center justify-center text-[22px]" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="text-[17px] font-bold text-gray-900 mt-4">{item.title}</h3>
              <p className="text-[13px] text-gray-600 mt-1.5 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="guarddog" className="scroll-mt-[80px] bg-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1216px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[12px] font-mono text-amber-400 uppercase tracking-wider font-bold mb-2">
              GuardDog® Connect Telematics
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-bold leading-tight">
              Your Truck Calls the Shop Before You Do
            </h2>
            <p className="mt-4 text-[15px] text-gray-300 leading-relaxed">
              Standard on every Mack Anthem, GuardDog Connect monitors the engine, transmission and aftertreatment
              around the clock. When a fault appears, the Mack Uptime Center is notified instantly and your
              nearest dealer prepares the repair.
            </p>
            <ul className="mt-6 space-y-4">
              {GUARDDOG_FEATURES.map((feature, i) => (
                <li key={feature.title} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[14px] shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[15px] font-semibold">{feature.title}</h3>
                    <p className="text-[13px] text-gray-400">{feature.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => triggerMackModal('feature-detail', { selectedFeature: 'connected' })}
              className="mt-8 bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-6 rounded-[8px] text-[14px] transition-colors cursor-pointer"
            >
              See live telematics demo
            </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[16px] p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold">Example fault-to-fix timeline</h3>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                AUTOMATED
              </span>
            </div>
            <ol className="mt-6 space-y-5 border-l border-white/15 pl-6">
              {[
                { t: '0 min', title: 'Fault code detected', text: 'DPF differential pressure out of range.' },
                { t: '2 min', title: 'Case opened', text: 'Fleet manager notified by SMS and email.' },
                { t: '15 min', title: 'Parts & bay reserved', text: 'Nearest Uptime Center stages the sensor kit.' },
                { t: '2 hrs', title: 'Triage complete', text: 'Verified estimate approved from your phone.' },
              ].map((step) => (
                <li key={step.t} className="relative">
                  <span aria-hidden="true" className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-amber-400 ring-4 ring-[#111827]" />
                  <div className="text-[11px] font-mono text-amber-400">{step.t}</div>
                  <div className="text-[14px] font-semibold">{step.title}</div>
                  <div className="text-[12px] text-gray-400">{step.text}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="maintenance" className="scroll-mt-[80px] py-16 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
        <SectionHeading
          eyebrow="Preventive Maintenance"
          title="Factory-Prescribed PM Plans"
          description="Intervals tuned to your duty cycle. Pick a plan and we'll pre-fill your appointment."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PM_PLANS.map((plan, index) => (
            <article
              key={plan.id}
              className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <span className="text-[11px] font-mono uppercase text-purple-600 font-bold tracking-wider">{plan.interval}</span>
              <h3 className="text-[20px] font-bold text-gray-900 mt-1">{plan.name}</h3>
              <p className="text-[12px] text-gray-500 mt-0.5">{plan.duty}</p>
              <ul className="mt-4 space-y-2 text-[13px] text-gray-700 flex-1">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-purple-500 font-bold" aria-hidden="true">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-[12px] text-gray-500">⏱ {plan.downtime}</div>
              <button
                type="button"
                onClick={() => choosePlan(SERVICE_TYPES[index])}
                className="mt-4 w-full bg-[#111827] hover:bg-black text-white font-semibold py-2.5 px-4 rounded-[6px] text-[13px] transition-colors cursor-pointer"
              >
                Book {plan.name}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="warranty" className="scroll-mt-[80px] bg-white border-y border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1000px] mx-auto">
          <SectionHeading
            eyebrow="Mack Factory Warranty"
            title="Coverage You Can Count On"
            description="Honored at all 450+ authorized Mack dealers, with zero deductible on major powertrain components."
          />
          <div className="overflow-x-auto rounded-[14px] border border-gray-200">
            <table className="w-full text-left text-[14px]">
              <caption className="sr-only">Mack factory warranty coverage by component</caption>
              <thead className="bg-gray-50 text-[12px] uppercase tracking-wider text-gray-500">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Component</th>
                  <th scope="col" className="px-5 py-3 font-semibold hidden sm:table-cell">What&apos;s covered</th>
                  <th scope="col" className="px-5 py-3 font-semibold text-right">Term</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {WARRANTY_COVERAGE.map((row, i) => (
                  <tr key={row.component} className={i === WARRANTY_COVERAGE.length - 1 ? 'bg-amber-50' : ''}>
                    <th scope="row" className="px-5 py-4 font-semibold text-gray-900">{row.component}</th>
                    <td className="px-5 py-4 text-gray-600 hidden sm:table-cell">{row.detail}</td>
                    <td className="px-5 py-4 font-mono font-bold text-gray-900 text-right whitespace-nowrap">{row.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => triggerMackModal('quote', { subject: 'Premium Extended Protection warranty' })}
              className="bg-[#111827] hover:bg-black text-white font-semibold py-2.5 px-6 rounded-[8px] text-[14px] transition-colors cursor-pointer"
            >
              Quote Extended Protection
            </button>
            <Link
              href="/support#contact"
              className="text-gray-600 hover:text-black font-medium text-[14px] underline underline-offset-4 px-2"
            >
              File a warranty question
            </Link>
          </div>
        </div>
      </section>

      <section id="book-service" className="scroll-mt-[80px] bg-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto">
          <SectionHeading
            dark
            eyebrow="Dealer Appointment"
            title="Book Certified Fleet Service"
            description="Reserve a bay and let the dealer stage genuine parts ahead of your visit."
          />

          <div className="bg-[#1F2937] border border-white/10 rounded-[16px] p-6 sm:p-8 shadow-2xl">
            {booked ? (
              <div className="py-6 text-center space-y-4" role="status">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-[32px]">
                  ✓
                </div>
                <h3 className="text-[22px] font-bold">Service Request Received</h3>
                <p className="text-[14px] text-gray-300 max-w-[520px] mx-auto">
                  <strong>{booked.form.serviceType}</strong> for <strong>{booked.form.vin}</strong> at{' '}
                  <strong>{booked.form.dealer}</strong> on <strong>{booked.form.date}</strong>. A service advisor will
                  confirm your bay with <strong>{booked.form.name}</strong> at <strong>{booked.form.email}</strong>.
                </p>
                <p className="text-[12px] text-gray-400">
                  {booked.savedToCloud ? 'Saved to Firebase in real time.' : 'Saved on this device and will sync when online.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setBooked(null);
                    setForm(EMPTY_FORM);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                >
                  Schedule another vehicle
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                  <p role="alert" className="text-[13px] text-red-400 font-medium">
                    {error}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="svc-vin" className={darkLabelClass}>Vehicle VIN or unit # *</label>
                    <input
                      id="svc-vin"
                      type="text"
                      placeholder="e.g. 1M2AX10C… or UNIT-402"
                      value={form.vin}
                      onChange={(e) => update('vin', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="svc-type" className={darkLabelClass}>Service type *</label>
                    <select
                      id="svc-type"
                      value={form.serviceType}
                      onChange={(e) => update('serviceType', e.target.value)}
                      className={darkInputClass}
                    >
                      {SERVICE_TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="svc-dealer" className={darkLabelClass}>Certified Uptime Center *</label>
                    <select
                      id="svc-dealer"
                      value={form.dealer}
                      onChange={(e) => update('dealer', e.target.value)}
                      className={darkInputClass}
                    >
                      {SERVICE_DEALERS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="svc-date" className={darkLabelClass}>Preferred date *</label>
                    <input
                      id="svc-date"
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(e) => update('date', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="svc-name" className={darkLabelClass}>Fleet manager / driver *</label>
                    <input
                      id="svc-name"
                      type="text"
                      placeholder="e.g. Marcus Vance"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="svc-email" className={darkLabelClass}>Email *</label>
                    <input
                      id="svc-email"
                      type="email"
                      placeholder="you@fleet.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="svc-phone" className={darkLabelClass}>Phone *</label>
                    <input
                      id="svc-phone"
                      type="tel"
                      placeholder="(555) 742-1089"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="svc-notes" className={darkLabelClass}>Reported symptoms / notes (optional)</label>
                  <textarea
                    id="svc-notes"
                    rows={3}
                    placeholder="e.g. Yellow engine light on I-80, hesitation when reversing at low speed…"
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    className={darkInputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 px-6 rounded-[8px] transition-all cursor-pointer shadow-lg active:scale-[0.99] text-[15px] disabled:opacity-60 disabled:cursor-wait"
                >
                  {submitting ? 'Submitting…' : 'Confirm Service Request'}
                </button>
                <p className="text-[12px] text-gray-400 text-center">
                  The 2-hour triage commitment applies to Certified Uptime Centers during standard operating hours.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
