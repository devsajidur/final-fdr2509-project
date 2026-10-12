'use client';

import React, { useState, useEffect, useRef } from 'react';

export type ModalType = 'configure' | 'brochure' | 'contact' | 'find-dealer' | 'quote' | null;

export function InteractionModals() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Configure modal state
  const [selectedHp, setSelectedHp] = useState('505 HP');
  const [selectedCab, setSelectedCab] = useState('70" Stand Up Sleeper');
  const [selectedAxle, setSelectedAxle] = useState('6x4 Heavy Duty');
  const [configSaved, setConfigSaved] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactType, setContactType] = useState('New Truck Purchase');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  // Dealer search state
  const [dealerZip, setDealerZip] = useState('');
  const [dealerSearchResult, setDealerSearchResult] = useState<string | null>(null);

  // Quote form state
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteFleetSize, setQuoteFleetSize] = useState('1–5 Units');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = React.useCallback(() => {
    setActiveModal(null);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // Listen for custom trigger events from any button or hash changes
  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<ModalType>;
      setActiveModal(customEvent.detail);
      setConfigSaved(false);
      setContactSubmitted(false);
      setQuoteSubmitted(false);
      setDealerSearchResult(null);
    };

    window.addEventListener('open-mack-modal', handleOpenModal);

    // Also listen to hash changes for direct URL compatibility
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#configure') setActiveModal('configure');
      else if (hash === '#brochure') setActiveModal('brochure');
      else if (hash === '#contact-dealer') setActiveModal('contact');
      else if (hash === '#find-dealer') setActiveModal('find-dealer');
      else if (hash === '#request-quote') setActiveModal('quote');
    };

    window.addEventListener('hashchange', handleHash);

    // Escape key listener to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-mack-modal', handleOpenModal);
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal, closeModal]);

  const handleDownloadSpecSheet = () => {
    const specContent = `=====================================================
MACK ANTHEM® TECHNICAL SPECIFICATION SUMMARY
Built for the Road Ahead
=====================================================

POWERTRAIN & ENGINE:
- Engine: Mack MP8 13-Liter Turbocharged Diesel
- Horsepower Ratings: 415 HP / 445 HP / 505 HP
- Peak Torque: Up to 1,860 lb-ft
- Transmission: mDRIVE™ 12-speed automated manual

EFFICIENCY & CAPACITIES:
- Fuel Economy: Up to 8.5 MPG (Highway line-haul)
- Gross Vehicle Weight Rating (GVWR): 80,000 lbs (Max highway capacity)
- Wheelbase Range: 189" to 280" configurable

DRIVER COMFORT & SAFETY:
- Cab Options: Day Cab, 48" Flat Top Sleeper, 70" Stand Up Sleeper
- Active Safety: Mack Co-Pilot™ Collision Mitigation, Lane Departure Warning
- Telematics: GuardDog® Connect 24/7 predictive diagnostics

SUPPORT & SERVICE:
- Mack OneCall: 1-800-866-1177 (24/7 Roadside Assistance)
- Dealer Network: Over 430 authorized facilities in North America

© 2026 Mack Trucks. All rights reserved.
=====================================================`;

    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mack-Anthem-Specifications-Summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!activeModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        ref={modalRef}
        className="bg-[#FFFFFF] text-[#111827] rounded-[8px] shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black rounded-[4px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          aria-label="Close dialog"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* 1. Configure & Price Modal */}
        {activeModal === 'configure' && (
          <div>
            <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
              Configure & Price — Mack Anthem®
            </h2>
            <p className="text-[14px] text-[#4B5563] mt-2">
              Select your powertrain rating, cab dimensions, and axle configuration.
            </p>

            <div className="space-y-4 mt-6">
              {/* Engine */}
              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-1">
                  Engine Rating (Mack MP8 13L)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['415 HP', '445 HP', '505 HP'].map((hp) => (
                    <button
                      key={hp}
                      type="button"
                      onClick={() => setSelectedHp(hp)}
                      className={`py-2 px-3 text-[14px] font-medium rounded-[6px] border transition-colors ${
                        selectedHp === hp
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {hp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cab Sleeper */}
              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-1">
                  Cab Configuration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Day Cab', '48" Flat Top', '70" Stand Up Sleeper'].map((cab) => (
                    <button
                      key={cab}
                      type="button"
                      onClick={() => setSelectedCab(cab)}
                      className={`py-2 px-3 text-[13px] font-medium rounded-[6px] border transition-colors ${
                        selectedCab === cab
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Axle */}
              <div>
                <label className="block text-[14px] font-semibold text-[#111827] mb-1">
                  Axle Setup
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['6x2 Fuel Efficient', '6x4 Heavy Duty'].map((axle) => (
                    <button
                      key={axle}
                      type="button"
                      onClick={() => setSelectedAxle(axle)}
                      className={`py-2 px-3 text-[13px] font-medium rounded-[6px] border transition-colors ${
                        selectedAxle === axle
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {axle}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected Summary */}
            <div className="mt-6 p-4 bg-gray-50 rounded-[6px] border border-gray-100 text-[14px]">
              <span className="font-semibold text-gray-900">Current Configuration:</span>
              <ul className="mt-1 list-disc list-inside text-gray-600 space-y-0.5">
                <li>Mack MP8 13L — {selectedHp} (Up to 1,860 lb-ft)</li>
                <li>Cab: {selectedCab}</li>
                <li>Axle: {selectedAxle} (GVWR 80,000 lbs)</li>
              </ul>
              {configSaved && (
                <p className="mt-2 text-green-600 font-medium text-[13px]">
                  ✓ Configuration saved to local session.
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setConfigSaved(true)}
                className="w-full sm:flex-1 py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors"
              >
                Save Configuration
              </button>
              <a
                href="#specifications-section"
                onClick={closeModal}
                className="w-full sm:flex-1 py-2.5 px-4 border border-gray-300 text-center font-semibold rounded-[6px] hover:bg-gray-50 transition-colors"
              >
                View Full Specs
              </a>
            </div>
          </div>
        )}

        {/* 2. Download Brochure Modal */}
        {activeModal === 'brochure' && (
          <div>
            <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
              Mack Anthem® Specification Sheet
            </h2>
            <p className="text-[14px] text-[#4B5563] mt-2">
              Comprehensive engineering specifications, powertrain ratings, and cab dimensions.
            </p>

            <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-[6px] border border-gray-100 text-[14px]">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Engine Platform:</span>
                <span className="font-semibold text-gray-900">Mack MP8 13L (Up to 505 HP)</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Fuel Economy:</span>
                <span className="font-semibold text-gray-900">Up to 8.5 MPG Highway</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">GVWR Rating:</span>
                <span className="font-semibold text-gray-900">80,000 lbs Maximum Capacity</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wheelbase Options:</span>
                <span className="font-semibold text-gray-900">{'189" – 280"'}</span>
              </div>
            </div>

            <p className="text-[12px] text-gray-500 mt-4">
              Note: Commercial PDF asset delivery is configured for local summary export.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleDownloadSpecSheet}
                className="w-full sm:flex-1 py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Summary (.txt)
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto py-2.5 px-6 border border-gray-300 font-semibold rounded-[6px] hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* 3. Contact Dealer Modal */}
        {activeModal === 'contact' && (
          <div>
            <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
              Contact an Authorized Mack Dealer
            </h2>
            <p className="text-[14px] text-[#4B5563] mt-2">
              Direct inquiries to dealership sales, parts, and commercial support representatives.
            </p>

            {contactSubmitted ? (
              <div className="mt-6 p-6 bg-green-50 rounded-[8px] text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mt-3">Inquiry Form Prepared</h3>
                <p className="text-[14px] text-gray-600 mt-2">
                  Thank you, <strong>{contactName}</strong>. Your request regarding{' '}
                  <strong>{contactType}</strong> has been prepared for transmission to your local Mack dealer.
                </p>
                <p className="text-[12px] text-gray-500 mt-3">
                  (Production note: Live CRM lead injection requires enterprise backend API credentials).
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-5 py-2 px-6 bg-black text-white font-semibold rounded-[6px]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!contactName.trim() || !contactEmail.trim()) {
                    setContactError('Please provide your name and email address.');
                    return;
                  }
                  setContactError('');
                  setContactSubmitted(true);
                }}
                className="mt-6 space-y-4"
              >
                {contactError && (
                  <p className="text-[13px] text-red-600 font-medium">{contactError}</p>
                )}
                <div>
                  <label htmlFor="contact-name" className="block text-[14px] font-semibold text-gray-900 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-[14px] font-semibold text-gray-900 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="contact-type" className="block text-[14px] font-semibold text-gray-900 mb-1">
                    Inquiry Subject
                  </label>
                  <select
                    id="contact-type"
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option>New Truck Purchase</option>
                    <option>Mack Genuine Parts & Service</option>
                    <option>Commercial Fleet Financing</option>
                    <option>Warranty & Roadside Assistance</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors"
                  >
                    Submit Dealer Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 4. Find a Dealer Modal */}
        {activeModal === 'find-dealer' && (
          <div>
            <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
              Mack Trucks Dealer Locator
            </h2>
            <p className="text-[14px] text-[#4B5563] mt-2">
              Find authorized Mack sales, certified service centers, and genuine parts locations.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!dealerZip.trim()) {
                  setDealerSearchResult('Please enter a valid ZIP / Postal Code or state name.');
                  return;
                }
                setDealerSearchResult(
                  `Displaying authorized Mack dealer network options for region "${dealerZip}". Official 24/7 National Dispatch Hotline: 1-800-866-1177 (Mack OneCall). Over 430 dealership centers operate nationwide.`
                );
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label htmlFor="dealer-zip" className="block text-[14px] font-semibold text-gray-900 mb-1">
                  Enter ZIP Code, City, or State
                </label>
                <div className="flex gap-2">
                  <input
                    id="dealer-zip"
                    type="text"
                    value={dealerZip}
                    onChange={(e) => setDealerZip(e.target.value)}
                    placeholder="e.g. 75001 or Dallas, TX"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="submit"
                    className="py-2 px-5 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>

              {dealerSearchResult && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-[6px] text-[14px] text-blue-900">
                  <p>{dealerSearchResult}</p>
                  <p className="text-[12px] text-blue-700 mt-2">
                    (Production Note: Real-time GPS dealer distance calculation requires Google Maps Platform API key integration).
                  </p>
                </div>
              )}
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-[6px] text-[13px] text-gray-600">
              <span className="font-semibold text-gray-900">Need Immediate Assistance?</span>
              <p className="mt-1">
                Call Mack OneCall at <strong>1-800-866-1177</strong> for 24/7 roadside assistance and nearest facility routing.
              </p>
            </div>
          </div>
        )}

        {/* 5. Request Quote Modal */}
        {activeModal === 'quote' && (
          <div>
            <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
              Commercial Fleet Quote Request
            </h2>
            <p className="text-[14px] text-[#4B5563] mt-2">
              Request procurement pricing for single-unit or commercial fleet orders.
            </p>

            {quoteSubmitted ? (
              <div className="mt-6 p-6 bg-green-50 rounded-[8px] text-center">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mt-3">Quote Request Prepared</h3>
                <p className="text-[14px] text-gray-600 mt-2">
                  Thank you. A fleet quotation inquiry for <strong>{quoteCompany}</strong> ({quoteFleetSize})
                  has been formatted and saved.
                </p>
                <p className="text-[12px] text-gray-500 mt-3">
                  (Production note: Live quotation calculation requires enterprise pricing engine integration).
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-5 py-2 px-6 bg-black text-white font-semibold rounded-[6px]"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!quoteCompany.trim() || !quoteEmail.trim()) {
                    setQuoteError('Please enter company name and contact email.');
                    return;
                  }
                  setQuoteError('');
                  setQuoteSubmitted(true);
                }}
                className="mt-6 space-y-4"
              >
                {quoteError && (
                  <p className="text-[13px] text-red-600 font-medium">{quoteError}</p>
                )}
                <div>
                  <label htmlFor="quote-company" className="block text-[14px] font-semibold text-gray-900 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    id="quote-company"
                    type="text"
                    value={quoteCompany}
                    onChange={(e) => setQuoteCompany(e.target.value)}
                    placeholder="e.g. Acme Logistics LLC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="quote-email" className="block text-[14px] font-semibold text-gray-900 mb-1">
                    Work Email *
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    placeholder="fleetmanager@acme.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label htmlFor="quote-fleet" className="block text-[14px] font-semibold text-gray-900 mb-1">
                    Fleet Requirement Size
                  </label>
                  <select
                    id="quote-fleet"
                    value={quoteFleetSize}
                    onChange={(e) => setQuoteFleetSize(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[6px] bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option>1–5 Units</option>
                    <option>6–20 Units</option>
                    <option>21–50 Units</option>
                    <option>50+ Enterprise Fleet</option>
                  </select>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors"
                  >
                    Generate Fleet Quote Request
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Helper function to open modal from anywhere */
export function openMackModal(type: ModalType) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-mack-modal', { detail: type }));
  }
}
