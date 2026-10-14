'use client';

import React, { useMemo, useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { PageHero, SectionHeading, HeroStat, darkInputClass, darkLabelClass } from '@/components/ui/PageBlocks';
import { triggerMackModal } from '@/components/ui/InteractionModals';
import { submitContactToFirestore } from '@/lib/firebase/firestore';
import {
  DEALER_REGIONS,
  FAQ_CATEGORIES,
  FAQS,
  FLEET_HOTLINE,
  REGIONAL_DEALERS,
} from '@/data/catalog';

const INQUIRY_CATEGORIES = [
  'General Inquiry',
  'Warranty Question',
  'Parts Inquiry',
  'Service & Roadside',
  'Fleet Financing & Leasing',
  'Dealer Feedback',
];

const FLEET_SIZES = ['Owner-operator (1 truck)', '2–10 trucks', '11–50 trucks', '51–250 trucks', '250+ trucks'];

interface ContactForm {
  name: string;
  company: string;
  email: string;
  phone: string;
  category: string;
  fleetSize: string;
  message: string;
}

const EMPTY_FORM: ContactForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  category: INQUIRY_CATEGORIES[0],
  fleetSize: FLEET_SIZES[0],
  message: '',
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SupportContent() {
  const [region, setRegion] = useState<string>('All');
  const [dealerQuery, setDealerQuery] = useState('');

  const [faqCategory, setFaqCategory] = useState<string>('All');
  const [faqQuery, setFaqQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(FAQS[0]?.id ?? null);

  const [form, setForm] = useState<ContactForm>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ name: string; email: string; savedToCloud: boolean } | null>(null);

  const dealers = useMemo(() => {
    const q = dealerQuery.trim().toLowerCase();
    return REGIONAL_DEALERS.filter((d) => {
      if (region !== 'All' && d.region !== region) return false;
      if (!q) return true;
      return `${d.name} ${d.city} ${d.state} ${d.address}`.toLowerCase().includes(q);
    });
  }, [region, dealerQuery]);

  const faqs = useMemo(() => {
    const q = faqQuery.trim().toLowerCase();
    return FAQS.filter((f) => {
      if (faqCategory !== 'All' && f.category !== faqCategory) return false;
      if (!q) return true;
      return `${f.question} ${f.answer}`.toLowerCase().includes(q);
    });
  }, [faqCategory, faqQuery]);

  const update = <K extends keyof ContactForm>(key: K, value: ContactForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please enter your name, email and a message.');
      return;
    }
    if (!EMAIL_PATTERN.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    const res = await submitContactToFirestore({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || undefined,
      subject: `Support: ${form.category}`,
      message: [
        form.company.trim() ? `Company: ${form.company.trim()}` : null,
        `Fleet size: ${form.fleetSize}`,
        `\n${form.message.trim()}`,
      ]
        .filter((line): line is string => line !== null)
        .join('\n'),
    });
    setSubmitting(false);
    setSent({ name: form.name.trim(), email: form.email.trim(), savedToCloud: res.isRealtime });
  };

  return (
    <PageShell>
      <PageHero
        icon="🛟"
        eyebrow="Dealer Network & Fleet Support"
        title="Support That Never Clocks Out"
        description={
          <>
            Find your nearest authorized Mack dealer, talk to a live dispatcher around the clock, or send our
            team a message. Real people, real answers.
          </>
        }
      >
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[950px] mx-auto">
          <HeroStat value="24/7/365" label="Fleet Support Line" note={FLEET_HOTLINE.display} />
          <HeroStat value="450+" label="Authorized Dealers" note="US & Canada" tone="text-blue-400" />
          <HeroStat value="< 15 min" label="Avg. Dispatch Answer" note="Mack OneCall" tone="text-emerald-400" />
          <HeroStat value="1 business day" label="Message Response" note="Support team" tone="text-purple-400" />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`tel:${FLEET_HOTLINE.tel}`}
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold py-2.5 px-6 rounded-[8px] text-[14px] transition-all shadow-lg active:scale-[0.98]"
          >
            📞 Call {FLEET_HOTLINE.display}
          </a>
          <a
            href="#dealers"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-[8px] border border-white/20 text-[14px] transition-all"
          >
            📍 Browse Dealers
          </a>
          <a
            href="#contact"
            className="bg-transparent hover:bg-white/10 text-gray-200 hover:text-white font-medium py-2.5 px-5 rounded-[8px] border border-white/10 text-[14px] transition-all"
          >
            ✉️ Send a Message
          </a>
        </div>
      </PageHero>

      <section id="hotline" className="scroll-mt-[80px] py-16 px-4 sm:px-6 lg:px-8 max-w-[1216px] mx-auto">
        <SectionHeading
          eyebrow="24/7 Fleet Support Hotline"
          title="Breakdown? Question? Call Anytime"
          description="Dispatchers see your GuardDog® Connect data and can send help to your GPS position."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#111827] text-white rounded-[16px] p-8 flex flex-col sm:flex-row sm:items-center gap-6 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[30px] shrink-0" aria-hidden="true">
              📞
            </div>
            <div className="flex-1">
              <div className="text-[12px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Mack OneCall™ Dispatch
              </div>
              <a
                href={`tel:${FLEET_HOTLINE.tel}`}
                className="block text-[32px] sm:text-[40px] font-black font-mono tracking-tight hover:text-amber-300 transition-colors"
              >
                {FLEET_HOTLINE.display}
              </a>
              <p className="text-[13px] text-gray-400 mt-1">
                Towing, mobile repair, tire rescue and case status. US and Canada, every day of the year.
              </p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-[16px] p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-gray-900">Have this ready</h3>
            <ul className="mt-3 space-y-2 text-[13px] text-gray-600">
              <li className="flex gap-2"><span className="text-amber-600 font-bold" aria-hidden="true">✓</span> Truck VIN or unit number</li>
              <li className="flex gap-2"><span className="text-amber-600 font-bold" aria-hidden="true">✓</span> Current location or mile marker</li>
              <li className="flex gap-2"><span className="text-amber-600 font-bold" aria-hidden="true">✓</span> Dash fault code or symptom</li>
              <li className="flex gap-2"><span className="text-amber-600 font-bold" aria-hidden="true">✓</span> Trailer type and load status</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="dealers" className="scroll-mt-[80px] bg-white border-y border-gray-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1216px] mx-auto">
          <SectionHeading
            eyebrow="Regional Dealer Hub"
            title="Find an Authorized Mack Dealer"
            description="Filter by region or search by city, state or dealership name."
          />

          <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2 flex-1" role="group" aria-label="Filter dealers by region">
              {['All', ...DEALER_REGIONS].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  aria-pressed={region === r}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border transition-colors cursor-pointer ${
                    region === r
                      ? 'bg-[#111827] text-white border-[#111827]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="lg:w-[300px]">
              <label htmlFor="dealer-search" className="sr-only">Search dealers</label>
              <input
                id="dealer-search"
                type="search"
                placeholder="Search city, state or name…"
                value={dealerQuery}
                onChange={(e) => setDealerQuery(e.target.value)}
                className="w-full px-3.5 py-2 rounded-[8px] border border-gray-300 text-[14px] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {dealers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-[14px]" role="status">
              No dealers match your search.{' '}
              <button
                type="button"
                onClick={() => {
                  setRegion('All');
                  setDealerQuery('');
                }}
                className="underline text-gray-800 font-medium cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {dealers.map((d) => (
                <article
                  key={d.id}
                  className="bg-gray-50 border border-gray-200 rounded-[14px] p-5 flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[16px] font-bold text-gray-900 leading-snug">{d.name}</h3>
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-gray-200 text-gray-700 px-2 py-0.5 rounded shrink-0">
                      {d.region}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-600 mt-2">{d.address}</p>
                  <p className="text-[12px] text-gray-500 mt-1">🕒 {d.hours}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {d.services.map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2 mt-auto">
                    <a
                      href={`tel:${d.phone.replace(/[^\d+]/g, '')}`}
                      className="flex-1 min-w-[110px] text-center bg-[#111827] hover:bg-black text-white font-semibold py-2 px-3 rounded-[6px] text-[12px] transition-colors"
                    >
                      📞 {d.phone}
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        triggerMackModal('contact', {
                          topic: 'Maintenance & Engine Service',
                          subject: `Appointment at ${d.name}`,
                        })
                      }
                      className="flex-1 min-w-[110px] bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 rounded-[6px] border border-gray-300 text-[12px] transition-colors cursor-pointer"
                    >
                      Request Appointment
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => triggerMackModal('test-drive')}
              className="text-gray-700 hover:text-black font-medium text-[14px] underline underline-offset-4 cursor-pointer"
            >
              Want to try an Anthem? Book a test drive →
            </button>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-[80px] py-16 px-4 sm:px-6 lg:px-8 max-w-[900px] mx-auto">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Quick Answers for Fleet Managers"
          description="Can't find what you need? Send us a message below."
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2 flex-1" role="group" aria-label="Filter FAQs by topic">
            {FAQ_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFaqCategory(c)}
                aria-pressed={faqCategory === c}
                className={`px-3.5 py-1 rounded-full text-[12px] font-semibold border transition-colors cursor-pointer ${
                  faqCategory === c
                    ? 'bg-amber-500 text-black border-amber-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="sm:w-[220px]">
            <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
            <input
              id="faq-search"
              type="search"
              placeholder="Search questions…"
              value={faqQuery}
              onChange={(e) => setFaqQuery(e.target.value)}
              className="w-full px-3.5 py-2 rounded-[8px] border border-gray-300 text-[14px] focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {faqs.length === 0 ? (
          <p className="text-center py-10 text-[14px] text-gray-500" role="status">
            No questions match your search.
          </p>
        ) : (
          <div className="space-y-3">
            {faqs.map((f) => {
              const isOpen = openFaq === f.id;
              return (
                <div key={f.id} className="bg-white border border-gray-200 rounded-[12px] overflow-hidden">
                  <h3>
                    <button
                      type="button"
                      id={`${f.id}-btn`}
                      aria-expanded={isOpen}
                      aria-controls={`${f.id}-panel`}
                      onClick={() => setOpenFaq(isOpen ? null : f.id)}
                      className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[15px] font-semibold text-gray-900">{f.question}</span>
                      <span
                        aria-hidden="true"
                        className={`text-amber-600 text-[20px] font-bold transition-transform shrink-0 ${isOpen ? 'rotate-45' : ''}`}
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  {isOpen && (
                    <div
                      id={`${f.id}-panel`}
                      role="region"
                      aria-labelledby={`${f.id}-btn`}
                      className="px-5 pb-5 text-[14px] text-gray-600 leading-relaxed"
                    >
                      <span className="inline-block text-[10px] font-mono uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded mb-2">
                        {f.category}
                      </span>
                      <p>{f.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section id="contact" className="scroll-mt-[80px] bg-[#111827] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto">
          <SectionHeading
            dark
            eyebrow="Contact Mack Support"
            title="Send Us a Message"
            description="Warranty, parts, service or anything else. We reply within one business day."
          />

          <div className="bg-[#1F2937] border border-white/10 rounded-[16px] p-6 sm:p-8 shadow-2xl">
            {sent ? (
              <div className="py-6 text-center space-y-4" role="status">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-[32px]">
                  ✓
                </div>
                <h3 className="text-[22px] font-bold">Message Received</h3>
                <p className="text-[14px] text-gray-300 max-w-[520px] mx-auto">
                  Thanks, <strong>{sent.name}</strong>. A Mack support specialist will reply to{' '}
                  <strong>{sent.email}</strong> within one business day.
                </p>
                <p className="text-[12px] text-gray-400">
                  {sent.savedToCloud ? 'Saved to Firebase in real time.' : 'Saved on this device and will sync when online.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(null);
                    setForm(EMPTY_FORM);
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-[6px] text-[13px] transition-colors cursor-pointer"
                >
                  Send another message
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
                    <label htmlFor="ct-name" className={darkLabelClass}>Full name *</label>
                    <input
                      id="ct-name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Marcus Vance"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-company" className={darkLabelClass}>Company (optional)</label>
                    <input
                      id="ct-company"
                      type="text"
                      autoComplete="organization"
                      placeholder="e.g. Vance Freight LLC"
                      value={form.company}
                      onChange={(e) => update('company', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ct-email" className={darkLabelClass}>Email *</label>
                    <input
                      id="ct-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@fleet.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="ct-phone" className={darkLabelClass}>Phone (optional)</label>
                    <input
                      id="ct-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(555) 742-1089"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={darkInputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ct-category" className={darkLabelClass}>Inquiry type</label>
                    <select
                      id="ct-category"
                      value={form.category}
                      onChange={(e) => update('category', e.target.value)}
                      className={darkInputClass}
                    >
                      {INQUIRY_CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="ct-fleet" className={darkLabelClass}>Fleet size</label>
                    <select
                      id="ct-fleet"
                      value={form.fleetSize}
                      onChange={(e) => update('fleetSize', e.target.value)}
                      className={darkInputClass}
                    >
                      {FLEET_SIZES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="ct-message" className={darkLabelClass}>How can we help? *</label>
                  <textarea
                    id="ct-message"
                    rows={5}
                    placeholder="Tell us about your truck, VIN, or question…"
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    className={darkInputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3.5 px-6 rounded-[8px] transition-all cursor-pointer shadow-lg active:scale-[0.99] text-[15px] disabled:opacity-60 disabled:cursor-wait"
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
                <p className="text-[12px] text-gray-400 text-center">
                  Urgent breakdown? Call <a href={`tel:${FLEET_HOTLINE.tel}`} className="underline text-gray-200">{FLEET_HOTLINE.display}</a> instead.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
