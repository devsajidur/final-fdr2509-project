'use client';

import React, { useState } from 'react';
import { bookTestDrive } from '@/lib/firebase/firestore';
import { useAuth } from '@/context/AuthContext';

export const TEST_DRIVE_MODELS = [
  'Mack Anthem® Day Cab 6x4',
  'Mack Anthem® 48" Flat Top Sleeper',
  'Mack Anthem® 70" Stand-Up Sleeper',
];

interface TestDriveModalProps {
  /** Optional pre-selected truck (e.g. when opened from a truck card) */
  subject: string;
  /** Dealer names offered as the pickup location */
  dealerOptions: string[];
  onClose: () => void;
  onBooked: (message: string) => void;
}

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black';

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  subject,
  dealerOptions,
  onClose,
  onBooked,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [model, setModel] = useState(
    TEST_DRIVE_MODELS.includes(subject) ? subject : TEST_DRIVE_MODELS[2]
  );
  const [date, setDate] = useState('');
  const [location, setLocation] = useState(dealerOptions[0] ?? '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!name.trim() || !email.trim() || !phone.trim() || !date) {
      setError('Please provide your name, email, phone number and preferred date.');
      return;
    }
    setError('');
    setSubmitting(true);
    await bookTestDrive({
      customerName: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      model,
      preferredDate: date,
      preferredLocation: location,
      notes: notes.trim() || undefined,
      status: 'pending',
    });
    setSubmitting(false);
    setSubmitted(true);
    onBooked('✓ Test drive request submitted to your dealer.');
  };

  return (
    <div>
      <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
        Book a Test Drive
      </h2>
      <p className="text-[14px] text-[#4B5563] mt-2">
        Reserve a hands-on drive of the Mack Anthem with an authorized dealer near you.
      </p>

      {submitted ? (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-[8px] text-center">
          <div className="w-12 h-12 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center font-bold text-xl">
            ✓
          </div>
          <h3 className="text-[18px] font-bold text-gray-900 mt-3">Test Drive Requested</h3>
          <p className="text-[14px] text-gray-700 mt-2">
            Thanks, <strong>{name}</strong>. <strong>{location}</strong> will confirm your{' '}
            <strong>{model}</strong> drive on <strong>{date}</strong> at <strong>{email}</strong>.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 py-2 px-6 bg-black text-white font-semibold rounded-[6px] cursor-pointer"
          >
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          {error && (
            <p role="alert" className="text-[13px] text-red-600 font-medium">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="td-name" className="block text-[14px] font-semibold text-gray-900 mb-1">
              Full Name *
            </label>
            <input
              id="td-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="td-email" className="block text-[14px] font-semibold text-gray-900 mb-1">
                Email Address *
              </label>
              <input
                id="td-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="td-phone" className="block text-[14px] font-semibold text-gray-900 mb-1">
                Phone Number *
              </label>
              <input
                id="td-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="td-model" className="block text-[14px] font-semibold text-gray-900 mb-1">
              Truck to Drive
            </label>
            <select
              id="td-model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`${inputClass} bg-white`}
            >
              {TEST_DRIVE_MODELS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="td-date" className="block text-[14px] font-semibold text-gray-900 mb-1">
                Preferred Date *
              </label>
              <input
                id="td-date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="td-location" className="block text-[14px] font-semibold text-gray-900 mb-1">
                Dealer Location
              </label>
              <select
                id="td-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`${inputClass} bg-white`}
              >
                {dealerOptions.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="td-notes" className="block text-[14px] font-semibold text-gray-900 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="td-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Trailer type, route you'd like to try, number of drivers..."
              className={inputClass}
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {submitting ? 'Submitting…' : 'Request Test Drive'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
