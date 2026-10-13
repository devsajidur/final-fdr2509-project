'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { submitQuoteToFirestore, submitContactToFirestore } from '@/lib/firebase/firestore';

export type ModalType =
  | 'configure'
  | 'brochure'
  | 'contact'
  | 'find-dealer'
  | 'quote'
  | 'search'
  | 'spec-detail'
  | 'feature-detail'
  | 'lightbox'
  | null;

export interface ModalOptions {
  selectedSpec?: 'engine' | 'fuel' | 'gvwr' | 'wheelbase';
  selectedFeature?: 'safety' | 'connected' | 'comfort';
  lightboxIndex?: number;
}

export type ModalDetail = ModalType | ({ type: ModalType } & ModalOptions);

declare global {
  interface Window {
    openMackModal?: (type: ModalType, options?: ModalOptions) => void;
  }
}

interface Dealership {
  name: string;
  city: string;
  state: string;
  zip: string;
  distance: string;
  phone: string;
  address: string;
  inventory: number;
}

const AUTHORIZED_DEALERS: Dealership[] = [
  {
    name: 'Mack Trucks of Chicago',
    city: 'Chicago',
    state: 'IL',
    zip: '60609',
    distance: '4.2 miles',
    phone: '(312) 555-0144',
    address: '4250 S Cicero Ave, Chicago, IL 60638',
    inventory: 14,
  },
  {
    name: 'Midwest Mack Sales & Service',
    city: 'Gary',
    state: 'IN',
    zip: '46406',
    distance: '21.5 miles',
    phone: '(219) 555-0182',
    address: '1801 E 15th Ave, Gary, IN 46402',
    inventory: 9,
  },
  {
    name: 'Empire Mack Fleet Center',
    city: 'Milwaukee',
    state: 'WI',
    zip: '53207',
    distance: '82.0 miles',
    phone: '(414) 555-0199',
    address: '6100 S Howell Ave, Milwaukee, WI 53207',
    inventory: 22,
  },
  {
    name: 'Lone Star Mack Commercial Center',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
    distance: '3.8 miles',
    phone: '(214) 555-0133',
    address: '1240 S Lamar St, Dallas, TX 75215',
    inventory: 31,
  },
];

const SEARCH_INDEX = [
  {
    category: 'Models',
    title: 'Mack Anthem® Highway Sleeper',
    snippet: 'Flagship line-haul highway truck with 70" Stand-Up Sleeper and aerodynamic package.',
    href: '#trucks',
  },
  {
    category: 'Powertrain',
    title: 'Mack MP8 13-Liter Engine (505 HP)',
    snippet: 'High-torque inline 6 diesel engine with up to 1,860 lb-ft torque and mDRIVE transmission.',
    href: '#parts',
  },
  {
    category: 'Efficiency',
    title: 'Fuel Economy & Predictive Cruise',
    snippet: 'Up to 8.5 MPG with GPS-guided terrain mapping and aerodynamic side fairings.',
    href: '#parts',
  },
  {
    category: 'Chassis',
    title: 'GVWR 80,000 lbs & Heavy-Duty Tandem Axles',
    snippet: 'Engineered for maximum highway payloads with Grade 120 steel frame rails.',
    href: '#parts',
  },
  {
    category: 'Safety',
    title: 'Bendix Wingman Fusion 2.0 Collision Mitigation',
    snippet: 'Integrated radar and camera active safety system with automated emergency braking.',
    href: '#service',
  },
  {
    category: 'Technology',
    title: 'GuardDog® Connect 24/7 Telematics',
    snippet: 'Real-time vehicle health monitoring, predictive diagnostics, and Mack OneCall support.',
    href: '#service',
  },
  {
    category: 'Comfort',
    title: 'Ergonomic Driver Cab & Sears Air-Ride Seating',
    snippet: 'Spacious interior, tilt-telescopic steering wheel, and 7-inch Co-Pilot digital display.',
    href: '#service',
  },
  {
    category: 'Gallery',
    title: 'Cabin Interior Photography',
    snippet: 'High-resolution photo of the modern Mack Anthem cockpit and driver controls.',
    href: '#gallery',
  },
  {
    category: 'Gallery',
    title: 'Mack MP8 Powertrain Engine Compartment',
    snippet: 'Detailed view of the 13L turbocharged diesel powertrain bay.',
    href: '#gallery',
  },
  {
    category: 'Gallery',
    title: 'Rear Dual-Axle Exterior View',
    snippet: 'Highway shot showcasing dual rear axles, taillights, and trailer linkage.',
    href: '#gallery',
  },
];

const GALLERY_PHOTOS = [
  {
    src: '/images/mack-interior.png',
    title: 'Mack Anthem Cabin Interior',
    caption: 'Modern truck cabin featuring ergonomic dashboard, premium steering wheel, and digital Co-Pilot display.',
  },
  {
    src: '/images/mack-engine.png',
    title: 'Mack MP8 13L Powertrain Engine',
    caption: 'Clean diesel 13-liter engine bay delivering up to 505 HP and 1,860 lb-ft torque.',
  },
  {
    src: '/images/mack-rear.png',
    title: 'Mack Anthem Rear Highway Exterior',
    caption: 'Dual rear tandem axles with heavy-duty suspension and aerodynamic trailer linkages.',
  },
];

export function triggerMackModal(type: ModalType, options?: ModalOptions) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<ModalDetail>('open-mack-modal', {
        detail: options ? { type, ...options } : type,
      })
    );
  }
}

export function InteractionModals() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.openMackModal = triggerMackModal;
    }
  }, []);

  // Configure modal state
  const [selectedHp, setSelectedHp] = useState('505 HP');
  const [selectedCab, setSelectedCab] = useState('70" Stand Up Sleeper');
  const [selectedAxle, setSelectedAxle] = useState('6x4 Heavy Duty');
  const [selectedColor, setSelectedColor] = useState('Mack Silver Metallic');
  const [configSaved, setConfigSaved] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactType, setContactType] = useState('New Truck Purchase');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  // Dealer search state
  const [dealerZip, setDealerZip] = useState('');
  const [dealerSearchResult, setDealerSearchResult] = useState<string | null>(null);
  const [filteredDealers, setFilteredDealers] = useState<Dealership[]>(AUTHORIZED_DEALERS);

  // Quote form state
  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteFleetSize, setQuoteFleetSize] = useState('1–5 Units');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Spec Detail state
  const [selectedSpec, setSelectedSpec] = useState<'engine' | 'fuel' | 'gvwr' | 'wheelbase'>('engine');

  // Feature Detail state
  const [selectedFeature, setSelectedFeature] = useState<'safety' | 'connected' | 'comfort'>('safety');

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time telematics simulator state
  const [telemetry, setTelemetry] = useState({
    speed: 64,
    rpm: 1350,
    fuelRate: 7.8,
    coolantTemp: 195,
    oilPressure: 45,
    engineLoad: 52,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const closeModal = React.useCallback(() => {
    setActiveModal(null);
    setIsZoomed(false);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // Live telemetry ticker for GuardDog Connect simulation
  useEffect(() => {
    if (activeModal === 'feature-detail' && selectedFeature === 'connected') {
      const interval = setInterval(() => {
        setTelemetry({
          speed: Math.floor(62 + Math.random() * 5),
          rpm: Math.floor(1320 + Math.random() * 60),
          fuelRate: +(7.6 + Math.random() * 0.5).toFixed(1),
          coolantTemp: Math.floor(194 + Math.random() * 3),
          oilPressure: Math.floor(44 + Math.random() * 3),
          engineLoad: Math.floor(50 + Math.random() * 8),
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [activeModal, selectedFeature]);

  // Listen for custom trigger events from any button or hash changes
  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<ModalDetail>;
      const detail = customEvent.detail;

      if (typeof detail === 'string') {
        setActiveModal(detail);
      } else if (detail && typeof detail === 'object') {
        setActiveModal(detail.type);
        if (detail.selectedSpec) setSelectedSpec(detail.selectedSpec);
        if (detail.selectedFeature) setSelectedFeature(detail.selectedFeature);
        if (detail.lightboxIndex !== undefined) setLightboxIndex(detail.lightboxIndex);
      }

      setConfigSaved(false);
      setContactSubmitted(false);
      setQuoteSubmitted(false);
      setDealerSearchResult(null);
      setIsZoomed(false);
    };

    window.addEventListener('open-mack-modal', handleOpenModal);

    // Hash change handler
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#configure') setActiveModal('configure');
      else if (hash === '#brochure') setActiveModal('brochure');
      else if (hash === '#contact-dealer') setActiveModal('contact');
      else if (hash === '#find-dealer') setActiveModal('find-dealer');
      else if (hash === '#request-quote') setActiveModal('quote');
      else if (hash === '#search') setActiveModal('search');
    };

    window.addEventListener('hashchange', handleHash);

    // Keyboard shortcuts (Escape to close, Cmd+K / Ctrl+K to search)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        closeModal();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveModal('search');
      } else if (activeModal === 'lightbox') {
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length);
        } else if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('open-mack-modal', handleOpenModal);
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal, closeModal]);

  // Focus search input when search modal opens
  useEffect(() => {
    if (activeModal === 'search') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [activeModal]);

  // Calculate estimated MSRP based on selection
  const estimatedPrice = React.useMemo(() => {
    let base = 165000;
    if (selectedHp === '445 HP') base += 3500;
    if (selectedHp === '505 HP') base += 6200;
    if (selectedCab === '48" Flat Top') base += 8500;
    if (selectedCab === '70" Stand Up Sleeper') base += 14500;
    if (selectedAxle === '6x4 Heavy Duty') base += 4200;
    return base;
  }, [selectedHp, selectedCab, selectedAxle]);

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
    showToast('Specification summary downloaded successfully.');
  };

  const handleDealerSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = dealerZip.trim().toLowerCase();
    if (!query) {
      setFilteredDealers(AUTHORIZED_DEALERS);
      setDealerSearchResult(`Showing all ${AUTHORIZED_DEALERS.length} authorized locations.`);
      return;
    }

    const matches = AUTHORIZED_DEALERS.filter(
      (d) =>
        d.zip.includes(query) ||
        d.city.toLowerCase().includes(query) ||
        d.state.toLowerCase().includes(query)
    );

    setFilteredDealers(matches.length > 0 ? matches : AUTHORIZED_DEALERS);
    setDealerSearchResult(
      matches.length > 0
        ? `Found ${matches.length} authorized dealer(s) near "${dealerZip}".`
        : `No direct matches for "${dealerZip}". Showing nearest regional facilities:`
    );
  };

  // Filtered search results for Search Modal
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_INDEX.slice(0, 6);
    const q = searchQuery.toLowerCase();
    return SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <>
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-[#111827] text-white px-5 py-3 rounded-[8px] shadow-2xl flex items-center space-x-3 border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="w-5 h-5 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-[12px]">
            ✓
          </div>
          <span className="text-[14px] font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Main Dialog Backdrop */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            ref={modalRef}
            className={`bg-[#FFFFFF] text-[#111827] rounded-[10px] shadow-2xl w-full max-h-[92vh] overflow-y-auto relative ${
              activeModal === 'lightbox' ? 'max-w-[900px] p-4 sm:p-6 bg-[#000000] text-white' : 'max-w-[620px] p-6 sm:p-8'
            }`}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeModal}
              className={`absolute top-4 right-4 p-2 rounded-[6px] transition-colors focus:outline-none focus-visible:ring-2 ${
                activeModal === 'lightbox'
                  ? 'text-gray-400 hover:text-white hover:bg-white/10 focus-visible:ring-white'
                  : 'text-gray-500 hover:text-black hover:bg-gray-100 focus-visible:ring-black'
              }`}
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
                              ? 'border-black bg-black text-white shadow-xs'
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
                              ? 'border-black bg-black text-white shadow-xs'
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
                              ? 'border-black bg-black text-white shadow-xs'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {axle}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-[14px] font-semibold text-[#111827] mb-1">
                      Exterior Finish: <span className="font-normal text-gray-600">{selectedColor}</span>
                    </label>
                    <div className="flex items-center space-x-3 mt-1.5">
                      {[
                        { name: 'Mack Silver Metallic', color: '#D1D5DB' },
                        { name: 'Obsidian Black', color: '#111827' },
                        { name: 'Polar White', color: '#F3F4F6' },
                        { name: 'Midnight Blue', color: '#1E3A8A' },
                        { name: 'Mack Crimson Red', color: '#991B1B' },
                      ].map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          aria-label={`Select ${c.name}`}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            selectedColor === c.name ? 'scale-115 border-black shadow-md' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: c.color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Summary with Live MSRP */}
                <div className="mt-6 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[14px]">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <span className="font-semibold text-gray-900">Current Configuration:</span>
                    <span className="text-[16px] font-bold text-black">
                      ${estimatedPrice.toLocaleString()} <span className="text-[12px] font-normal text-gray-500">MSRP</span>
                    </span>
                  </div>
                  <ul className="mt-2 list-disc list-inside text-gray-600 space-y-0.5 text-[13px]">
                    <li>Mack MP8 13L — {selectedHp} (Up to 1,860 lb-ft)</li>
                    <li>Cab: {selectedCab}</li>
                    <li>Axle: {selectedAxle} (GVWR 80,000 lbs)</li>
                    <li>Color: {selectedColor}</li>
                  </ul>
                  {configSaved && (
                    <p className="mt-2.5 text-green-700 font-medium text-[13px] flex items-center space-x-1.5">
                      <span>✓</span>
                      <span>Configuration saved to current session. Ready for dealer review.</span>
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setConfigSaved(true);
                      showToast(`Mack Anthem (${selectedHp}) configuration saved.`);
                    }}
                    className="flex-1 py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors"
                  >
                    Save Configuration
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      setTimeout(() => setActiveModal('quote'), 150);
                    }}
                    className="py-2.5 px-4 bg-gray-100 text-gray-900 font-semibold rounded-[6px] hover:bg-gray-200 transition-colors"
                  >
                    Request Dealer Quote
                  </button>
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
                  Comprehensive engineering overview, dimensions, powertrain curves, and standard features.
                </p>

                <div className="mt-6 border border-gray-200 rounded-[8px] p-4 bg-gray-50 space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-[6px] bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                    <div>
                      <h4 className="text-[14px] font-semibold text-gray-900">
                        Mack Anthem Engineering Brochure (2026 Edition)
                      </h4>
                      <p className="text-[12px] text-gray-500">24 Pages • High Resolution Technical Guide • 4.8 MB</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadSpecSheet}
                    className="flex-1 py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors"
                  >
                    Download Summary (.txt)
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="py-2.5 px-4 bg-gray-100 text-gray-700 font-semibold rounded-[6px] hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* 3. Find a Dealer Modal */}
            {activeModal === 'find-dealer' && (
              <div>
                <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
                  Mack Trucks Dealer Locator
                </h2>
                <p className="text-[14px] text-[#4B5563] mt-2">
                  Find authorized sales, parts, and certified master service centers across North America.
                </p>

                <form onSubmit={handleDealerSearch} className="mt-5 flex gap-2">
                  <input
                    type="text"
                    value={dealerZip}
                    onChange={(e) => setDealerZip(e.target.value)}
                    placeholder="Enter City, State, or ZIP code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <button
                    type="submit"
                    className="py-2 px-5 bg-black text-white text-[14px] font-semibold rounded-[6px] hover:bg-gray-800 transition-colors"
                  >
                    Search
                  </button>
                </form>

                {dealerSearchResult && (
                  <p className="text-[13px] font-medium text-gray-700 mt-3">{dealerSearchResult}</p>
                )}

                <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {filteredDealers.map((d) => (
                    <div
                      key={d.name}
                      className="p-3.5 border border-gray-200 rounded-[8px] hover:border-black transition-colors bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-[14px]">{d.name}</h4>
                          <span className="text-[12px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            {d.inventory} in stock
                          </span>
                        </div>
                        <p className="text-[13px] text-gray-600 mt-1">{d.address}</p>
                        <p className="text-[12px] text-gray-500 mt-0.5">Distance: {d.distance}</p>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[13px]">
                        <a
                          href={`tel:${d.phone.replace(/[^0-9]/g, '')}`}
                          className="font-semibold text-black hover:underline"
                        >
                          {d.phone}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            closeModal();
                            setTimeout(() => setActiveModal('contact'), 150);
                          }}
                          className="text-[12px] font-semibold text-gray-700 hover:text-black underline"
                        >
                          Schedule Visit →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded-[6px] text-[13px] text-gray-600 flex items-center justify-between">
                  <span>24/7 Roadside OneCall:</span>
                  <a href="tel:18008661177" className="font-bold text-black hover:underline">
                    1-800-866-1177
                  </a>
                </div>
              </div>
            )}

            {/* 4. Request Quote Modal */}
            {activeModal === 'quote' && (
              <div>
                <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
                  Request Commercial Fleet Quote
                </h2>
                <p className="text-[14px] text-[#4B5563] mt-2">
                  Receive personalized fleet pricing, Mack Financial Services leasing terms, and warranty options.
                </p>

                {quoteSubmitted ? (
                  <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-[8px] text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center font-bold text-xl">
                      ✓
                    </div>
                    <h3 className="text-[18px] font-bold text-gray-900 mt-3">Quote Request Submitted</h3>
                    <p className="text-[14px] text-gray-700 mt-2">
                      Thank you! Your quotation inquiry for <strong>{quoteCompany}</strong> ({quoteFleetSize}) has been registered.
                      A regional commercial account manager will reach out to <strong>{quoteEmail}</strong> within 1 business day.
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
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!quoteCompany.trim() || !quoteEmail.trim()) {
                        setQuoteError('Please enter company name and contact email.');
                        return;
                      }
                      setQuoteError('');
                      setQuoteSubmitted(true);
                      const res = await submitQuoteToFirestore({
                        name: quoteCompany,
                        email: quoteEmail,
                        company: quoteCompany,
                        selectedEngine: selectedHp,
                        estimatedPrice: `$${estimatedPrice.toLocaleString()}`,
                      });
                      if (res.isRealtime) {
                        showToast('✓ Quote saved to Firebase Firestore in real-time!');
                      } else {
                        showToast('✓ Quote saved on this device.');
                      }
                    }}
                    className="mt-5 space-y-4"
                  >
                    {quoteError && <p className="text-[13px] text-red-600 font-medium">{quoteError}</p>}
                    <div>
                      <label htmlFor="quote-company" className="block text-[14px] font-semibold text-gray-900 mb-1">
                        Company / Fleet Name *
                      </label>
                      <input
                        id="quote-company"
                        type="text"
                        value={quoteCompany}
                        onChange={(e) => setQuoteCompany(e.target.value)}
                        placeholder="e.g. Continental Freight Logistics"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div>
                      <label htmlFor="quote-email" className="block text-[14px] font-semibold text-gray-900 mb-1">
                        Corporate Email *
                      </label>
                      <input
                        id="quote-email"
                        type="email"
                        value={quoteEmail}
                        onChange={(e) => setQuoteEmail(e.target.value)}
                        placeholder="operations@continentalfreight.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="quote-fleet" className="block text-[14px] font-semibold text-gray-900 mb-1">
                          Fleet Size
                        </label>
                        <select
                          id="quote-fleet"
                          value={quoteFleetSize}
                          onChange={(e) => setQuoteFleetSize(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-[6px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          <option>1–5 Units</option>
                          <option>6–20 Units</option>
                          <option>21–50 Units</option>
                          <option>50+ Enterprise Fleet</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="quote-application" className="block text-[14px] font-semibold text-gray-900 mb-1">
                          Primary Haul
                        </label>
                        <select
                          id="quote-application"
                          className="w-full px-3 py-2 border border-gray-300 rounded-[6px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                        >
                          <option>Long Haul Interstate</option>
                          <option>Regional Distribution</option>
                          <option>Vocational / Heavy Haul</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors"
                      >
                        Submit Quote Request
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 5. Contact Dealer Modal */}
            {activeModal === 'contact' && (
              <div>
                <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
                  Contact Authorized Mack Dealer
                </h2>
                <p className="text-[14px] text-[#4B5563] mt-2">
                  Direct communication with authorized sales representatives and certified service managers.
                </p>

                {contactSubmitted ? (
                  <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-[8px] text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500 text-white mx-auto flex items-center justify-center font-bold text-xl">
                      ✓
                    </div>
                    <h3 className="text-[18px] font-bold text-gray-900 mt-3">Message Dispatched</h3>
                    <p className="text-[14px] text-gray-700 mt-2">
                      Thank you, <strong>{contactName}</strong>. Your inquiry regarding{' '}
                      <strong>{contactType}</strong> has been routed to your local dealership.
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
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!contactName.trim() || !contactEmail.trim()) {
                        setContactError('Please provide your name and email address.');
                        return;
                      }
                      setContactError('');
                      setContactSubmitted(true);
                      const res = await submitContactToFirestore({
                        name: contactName,
                        email: contactEmail,
                        phone: contactPhone,
                        subject: contactType,
                        message: `Dealer consultation regarding ${contactType}`,
                      });
                      if (res.isRealtime) {
                        showToast('✓ Lead sent to Firebase Firestore in real-time!');
                      } else {
                        showToast('✓ Message saved on this device.');
                      }
                    }}
                    className="mt-5 space-y-4"
                  >
                    {contactError && <p className="text-[13px] text-red-600 font-medium">{contactError}</p>}
                    <div>
                      <label htmlFor="contact-name" className="block text-[14px] font-semibold text-gray-900 mb-1">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-phone" className="block text-[14px] font-semibold text-gray-900 mb-1">
                          Phone Number
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="(555) 000-0000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-[6px] text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-type" className="block text-[14px] font-semibold text-gray-900 mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        id="contact-type"
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-[6px] bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option>New Truck Purchase</option>
                        <option>Certified Pre-Owned Inventory</option>
                        <option>Maintenance & Engine Service</option>
                        <option>Mack Genuine Parts Inquiry</option>
                        <option>Fleet Financing & Leasing</option>
                      </select>
                    </div>
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-black text-white font-semibold rounded-[6px] hover:bg-gray-800 transition-colors"
                      >
                        Send Inquiry
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 6. Live Search Modal */}
            {activeModal === 'search' && (
              <div>
                <h2 id="modal-title" className="text-[20px] font-bold text-[#111827] leading-[28px]">
                  Search Mack Anthem®
                </h2>
                <div className="relative mt-4">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search specifications, powertrain, features, dealers..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-[8px] text-[15px] focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <div className="absolute left-3.5 top-3.5 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                </div>

                <div className="mt-5 space-y-2 max-h-[350px] overflow-y-auto pr-1">
                  {searchResults.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      onClick={() => closeModal()}
                      className="block p-3 rounded-[6px] hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors group"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-0.5 rounded-[4px]">
                          {item.category}
                        </span>
                        <h4 className="text-[14px] font-semibold text-gray-900 group-hover:text-black">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[13px] text-gray-600 mt-1">{item.snippet}</p>
                    </a>
                  ))}
                  {searchResults.length === 0 && (
                    <div className="py-8 text-center text-gray-500 text-[14px]">
                      No results found for &ldquo;{searchQuery}&rdquo;. Try searching for &ldquo;engine&rdquo;, &ldquo;fuel&rdquo;, or &ldquo;safety&rdquo;.
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500">
                  <span>Navigation: Press Esc to close</span>
                  <span>Tip: Press Cmd+K / Ctrl+K anywhere</span>
                </div>
              </div>
            )}

            {/* 7. Specification Deep Dive Modal */}
            {activeModal === 'spec-detail' && (
              <div>
                <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
                  Technical Specification: {selectedSpec.toUpperCase()}
                </h2>

                {selectedSpec === 'engine' && (
                  <div className="mt-4 space-y-4 text-[14px] text-gray-700">
                    <p>
                      The <strong>Mack MP®8 engine</strong> is engineered for highway line-haul and regional distribution, offering an exceptional power-to-weight ratio.
                    </p>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px]">
                      <div>
                        <span className="text-gray-500 block">Displacement</span>
                        <strong className="text-gray-900">13 Liters (780 cu. in.)</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Horsepower Range</span>
                        <strong className="text-gray-900">415 – 505 HP</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Peak Torque</span>
                        <strong className="text-gray-900">Up to 1,860 lb-ft @ 900 RPM</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Fuel Injection</span>
                        <strong className="text-gray-900">Ultra-High Pressure Common Rail</strong>
                      </div>
                    </div>
                    <p className="text-[13px] text-gray-600">
                      Standard transmission pairing: <strong>mDRIVE™ 12-speed automated manual</strong> with grade gripper anti-roll technology.
                    </p>
                  </div>
                )}

                {selectedSpec === 'fuel' && (
                  <div className="mt-4 space-y-4 text-[14px] text-gray-700">
                    <p>
                      The aerodynamic design of the Mack Anthem delivers up to an <strong>8.5 MPG rating</strong> on long highway runs, reducing total cost of ownership by up to 3% annually.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-[8px] border border-gray-200 space-y-2 text-[13px]">
                      <div className="flex justify-between">
                        <span>Aerodynamic Sloped Hood & Fairings:</span>
                        <strong className="text-green-700">+1.5% Fuel Savings</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Predictive Cruise with GPS Mapping:</span>
                        <strong className="text-green-700">+1.0% Fuel Savings</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Smart Idle Shutdown & Downspeeding:</span>
                        <strong className="text-green-700">+0.5% Fuel Savings</strong>
                      </div>
                    </div>
                  </div>
                )}

                {selectedSpec === 'gvwr' && (
                  <div className="mt-4 space-y-4 text-[14px] text-gray-700">
                    <p>
                      Rated at <strong>80,000 lbs Gross Vehicle Weight Rating (GVWR)</strong> for maximum interstate freight capacity.
                    </p>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px]">
                      <div>
                        <span className="text-gray-500 block">Front Axle Rating</span>
                        <strong className="text-gray-900">12,000 – 14,600 lbs</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Rear Tandem Axle</span>
                        <strong className="text-gray-900">38,000 – 46,000 lbs</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Frame Rail Material</span>
                        <strong className="text-gray-900">120,000 PSI Steel</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Brake System</span>
                        <strong className="text-gray-900">Bendix Air Disc Brakes</strong>
                      </div>
                    </div>
                  </div>
                )}

                {selectedSpec === 'wheelbase' && (
                  <div className="mt-4 space-y-4 text-[14px] text-gray-700">
                    <p>
                      Configurable wheelbase options from <strong>189&quot; to 280&quot;</strong> adapt to flatbeds, refrigerated reefers, and dry van trailers.
                    </p>
                    <div className="p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px] space-y-1.5">
                      <div className="flex justify-between">
                        <span>Day Cab Wheelbase:</span>
                        <strong className="text-gray-900">189&quot; – 210&quot;</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>48&quot; Sleeper Wheelbase:</span>
                        <strong className="text-gray-900">215&quot; – 235&quot;</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>70&quot; Stand-Up Sleeper Wheelbase:</span>
                        <strong className="text-gray-900">230&quot; – 280&quot;</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-gray-200">
                        <span>Wheel Cut Angle:</span>
                        <strong className="text-green-700">Up to 50° Maneuverability</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="py-2 px-5 bg-black text-white font-semibold rounded-[6px]"
                  >
                    Close Specifications
                  </button>
                </div>
              </div>
            )}

            {/* 8. Feature Explorer & Live Telematics Simulator */}
            {activeModal === 'feature-detail' && (
              <div>
                <h2 id="modal-title" className="text-[22px] font-bold text-[#111827] leading-[28px]">
                  {selectedFeature === 'safety' && 'Safety First: Bendix Wingman Fusion 2.0'}
                  {selectedFeature === 'connected' && 'GuardDog® Connect: Live Telematics Simulator'}
                  {selectedFeature === 'comfort' && 'Driver Comfort: Ergonomic Cab Architecture'}
                </h2>

                {selectedFeature === 'safety' && (
                  <div className="mt-4 space-y-4 text-[14px] text-gray-700">
                    <p>
                      The Mack Anthem features comprehensive radar and camera-based collision mitigation, designed to keep drivers and motorists safe on every mile.
                    </p>
                    <div className="space-y-2 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px]">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span><strong>Full Automated Emergency Braking (AEB)</strong> on stationary and moving vehicles.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span><strong>Lane Departure Warning (LDW)</strong> with audible cabin alerts.</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-600 font-bold">✓</span>
                        <span><strong>Adaptive Cruise Control</strong> maintaining safe highway following distances.</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFeature === 'connected' && (
                  <div className="mt-4 space-y-4 text-[14px] text-gray-700">
                    <p className="text-[13px] text-gray-600">
                      Live Telematics Simulation streaming 24/7 diagnostic parameters from Mack GuardDog® Connect on-board telematics gateway:
                    </p>

                    <div className="grid grid-cols-3 gap-2.5 p-4 bg-gray-900 text-white rounded-[8px]">
                      <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
                        <span className="text-[11px] text-gray-400 block uppercase">Speed</span>
                        <span className="text-[20px] font-bold text-green-400">{telemetry.speed}</span>
                        <span className="text-[10px] text-gray-400 block">MPH</span>
                      </div>
                      <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
                        <span className="text-[11px] text-gray-400 block uppercase">Engine RPM</span>
                        <span className="text-[20px] font-bold text-blue-400">{telemetry.rpm}</span>
                        <span className="text-[10px] text-gray-400 block">RPM</span>
                      </div>
                      <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
                        <span className="text-[11px] text-gray-400 block uppercase">Fuel Flow</span>
                        <span className="text-[20px] font-bold text-yellow-400">{telemetry.fuelRate}</span>
                        <span className="text-[10px] text-gray-400 block">GAL/HR</span>
                      </div>
                      <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
                        <span className="text-[11px] text-gray-400 block uppercase">Coolant</span>
                        <span className="text-[18px] font-bold text-white">{telemetry.coolantTemp}°F</span>
                        <span className="text-[10px] text-gray-400 block">Optimal</span>
                      </div>
                      <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
                        <span className="text-[11px] text-gray-400 block uppercase">Oil Press.</span>
                        <span className="text-[18px] font-bold text-white">{telemetry.oilPressure}</span>
                        <span className="text-[10px] text-gray-400 block">PSI</span>
                      </div>
                      <div className="p-2.5 bg-gray-800 rounded-[6px] text-center">
                        <span className="text-[11px] text-gray-400 block uppercase">Faults</span>
                        <span className="text-[18px] font-bold text-green-400">0 Active</span>
                        <span className="text-[10px] text-gray-400 block">100% Health</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-[6px] text-[13px] text-green-800">
                      <span className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                        <span>Connected to Mack OneCall Diagnostic Center</span>
                      </span>
                      <strong className="text-[12px] bg-green-200 px-2 py-0.5 rounded-full">Active</strong>
                    </div>
                  </div>
                )}

                {selectedFeature === 'comfort' && (
                  <div className="mt-4 space-y-4 text-[14px] text-gray-700">
                    <p>
                      Engineered around driver ergonomics to reduce fatigue on 11-hour shifts and maximize sleeper resting comfort.
                    </p>
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-[8px] border border-gray-200 text-[13px]">
                      <div>
                        <span className="text-gray-500 block">Sleeper Height</span>
                        <strong className="text-gray-900">Full 70&quot; Stand-Up Clearance</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Driver Seating</span>
                        <strong className="text-gray-900">Sears Air-Suspension Lumbar</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Driver Cluster</span>
                        <strong className="text-gray-900">7&quot; Full Color Co-Pilot</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Storage Volume</span>
                        <strong className="text-gray-900">Up to 35.8 cu. ft.</strong>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="py-2 px-5 bg-black text-white font-semibold rounded-[6px]"
                  >
                    Close Feature Overview
                  </button>
                </div>
              </div>
            )}

            {/* 9. Gallery Lightbox Modal */}
            {activeModal === 'lightbox' && (
              <div className="text-center">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-800 text-[14px] text-gray-400">
                  <span className="font-semibold text-white">
                    {GALLERY_PHOTOS[lightboxIndex].title} ({lightboxIndex + 1} of {GALLERY_PHOTOS.length})
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="px-2.5 py-1 text-[12px] bg-gray-800 text-gray-300 rounded hover:bg-gray-700"
                    >
                      {isZoomed ? 'Zoom 100%' : 'Zoom In'}
                    </button>
                  </div>
                </div>

                <div className="relative w-full h-[320px] sm:h-[480px] bg-black rounded-[6px] overflow-hidden flex items-center justify-center">
                  <div className={`relative w-full h-full transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-grab' : 'scale-100'}`}>
                    <Image
                      src={GALLERY_PHOTOS[lightboxIndex].src}
                      alt={GALLERY_PHOTOS[lightboxIndex].title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 900px) 100vw, 900px"
                    />
                  </div>

                  {/* Prev Button */}
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((prev) => (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length)}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={() => setLightboxIndex((prev) => (prev + 1) % GALLERY_PHOTOS.length)}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>

                <p className="text-[13px] text-gray-400 mt-3 max-w-[650px] mx-auto">
                  {GALLERY_PHOTOS[lightboxIndex].caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** Helper function to open modal from anywhere */
export const openMackModal = triggerMackModal;
