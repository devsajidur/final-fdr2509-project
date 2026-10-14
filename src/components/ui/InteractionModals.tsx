'use client';

import React, { useState, useEffect, useRef } from 'react';
import { submitQuoteToFirestore, submitContactToFirestore } from '@/lib/firebase/firestore';
import { ConfigureModal } from '@/components/modals/ConfigureModal';
import { BrochureModal } from '@/components/modals/BrochureModal';
import { FindDealerModal, Dealership } from '@/components/modals/FindDealerModal';
import { QuoteModal } from '@/components/modals/QuoteModal';
import { ContactModal } from '@/components/modals/ContactModal';
import { SearchModal, SearchItem } from '@/components/modals/SearchModal';
import { SpecDetailModal } from '@/components/modals/SpecDetailModal';
import { FeatureDetailModal, TelemetryData } from '@/components/modals/FeatureDetailModal';
import { LightboxModal, GalleryPhoto } from '@/components/modals/LightboxModal';
import { TestDriveModal } from '@/components/modals/TestDriveModal';

export type ModalType =
  | 'configure'
  | 'brochure'
  | 'contact'
  | 'find-dealer'
  | 'quote'
  | 'test-drive'
  | 'search'
  | 'spec-detail'
  | 'feature-detail'
  | 'lightbox'
  | null;

export interface ModalOptions {
  selectedSpec?: 'engine' | 'fuel' | 'gvwr' | 'wheelbase';
  selectedFeature?: 'safety' | 'connected' | 'comfort';
  lightboxIndex?: number;
  /** What a quote / test drive / inquiry is about (truck, engine or part) */
  subject?: string;
  /** Pre-selects the Inquiry Topic of the Contact modal */
  topic?: string;
  /** Configurator presets: e.g. '415 HP', 'Day Cab', '6x4 Heavy Duty' */
  hp?: string;
  cab?: string;
  axle?: string;
}

export type ModalDetail = ModalType | ({ type: ModalType } & ModalOptions);

declare global {
  interface Window {
    openMackModal?: (type: ModalType, options?: ModalOptions) => void;
  }
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

const SEARCH_INDEX: SearchItem[] = [
  {
    category: 'Models',
    title: 'Mack Anthem® Highway Sleeper',
    snippet: 'Flagship line-haul highway truck with 70" Stand-Up Sleeper and aerodynamic package.',
    href: '/trucks',
  },
  {
    category: 'Powertrain',
    title: 'Mack MP8 13-Liter Engine (505 HP)',
    snippet: 'High-torque inline 6 diesel engine with up to 1,860 lb-ft torque and mDRIVE transmission.',
    href: '/trucks#engines',
  },
  {
    category: 'Efficiency',
    title: 'Fuel Economy & Predictive Cruise',
    snippet: 'Up to 8.5 MPG with GPS-guided terrain mapping and aerodynamic side fairings.',
    href: '/trucks#specifications',
  },
  {
    category: 'Chassis',
    title: 'GVWR 80,000 lbs & Heavy-Duty Tandem Axles',
    snippet: 'Engineered for maximum highway payloads with Grade 120 steel frame rails.',
    href: '/trucks#specifications',
  },
  {
    category: 'Parts',
    title: 'Genuine Mack Parts Catalog',
    snippet: 'Engine, air filtration, braking and cab aerodynamics parts with live stock status.',
    href: '/parts',
  },
  {
    category: 'Safety',
    title: 'Bendix Wingman Fusion 2.0 Collision Mitigation',
    snippet: 'Integrated radar and camera active safety system with automated emergency braking.',
    href: '/trucks',
  },
  {
    category: 'Technology',
    title: 'GuardDog® Connect 24/7 Telematics',
    snippet: 'Real-time vehicle health monitoring, predictive diagnostics, and Mack OneCall support.',
    href: '/service#guarddog',
  },
  {
    category: 'Service',
    title: 'Preventive Maintenance Plans & Warranty',
    snippet: 'Schedule A/B/C PM intervals and factory warranty coverage at Certified Uptime Centers.',
    href: '/service#warranty',
  },
  {
    category: 'Support',
    title: 'Regional Dealer Hub & 24/7 Fleet Support',
    snippet: 'Find a dealer by region, call the fleet hotline, or send us a message.',
    href: '/support#dealers',
  },
  {
    category: 'Comfort',
    title: 'Ergonomic Driver Cab & Sears Air-Ride Seating',
    snippet: 'Spacious interior, tilt-telescopic steering wheel, and 7-inch Co-Pilot digital display.',
    href: '/trucks',
  },
  {
    category: 'Gallery',
    title: 'Cabin Interior Photography',
    snippet: 'High-resolution photo of the modern Mack Anthem cockpit and driver controls.',
    href: '/#gallery-section',
  },
  {
    category: 'Gallery',
    title: 'Mack MP8 Powertrain Engine Compartment',
    snippet: 'Detailed view of the 13L turbocharged diesel powertrain bay.',
    href: '/#gallery-section',
  },
  {
    category: 'Gallery',
    title: 'Rear Dual-Axle Exterior View',
    snippet: 'Highway shot showcasing dual rear axles, taillights, and trailer linkage.',
    href: '/#gallery-section',
  },
];

const GALLERY_PHOTOS: GalleryPhoto[] = [
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

  const [selectedHp, setSelectedHp] = useState('505 HP');
  const [selectedCab, setSelectedCab] = useState('70" Stand Up Sleeper');
  const [selectedAxle, setSelectedAxle] = useState('6x4 Heavy Duty');
  const [selectedColor, setSelectedColor] = useState('Mack Silver Metallic');
  const [configSaved, setConfigSaved] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactType, setContactType] = useState('New Truck Purchase');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  const [dealerZip, setDealerZip] = useState('');
  const [dealerSearchResult, setDealerSearchResult] = useState<string | null>(null);
  const [filteredDealers, setFilteredDealers] = useState<Dealership[]>(AUTHORIZED_DEALERS);

  const [quoteCompany, setQuoteCompany] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteFleetSize, setQuoteFleetSize] = useState('1–5 Units');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteError, setQuoteError] = useState('');

  const [modalSubject, setModalSubject] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedSpec, setSelectedSpec] = useState<'engine' | 'fuel' | 'gvwr' | 'wheelbase'>('engine');

  const [selectedFeature, setSelectedFeature] = useState<'safety' | 'connected' | 'comfort'>('safety');

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [telemetry, setTelemetry] = useState<TelemetryData>({
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

  useEffect(() => {
    const handleOpenModal = (event: Event) => {
      const customEvent = event as CustomEvent<ModalDetail>;
      const detail = customEvent.detail;

      if (typeof detail === 'string') {
        setActiveModal(detail);
        setModalSubject('');
      } else if (detail && typeof detail === 'object') {
        setActiveModal(detail.type);
        setModalSubject(detail.subject ?? '');
        if (detail.selectedSpec) setSelectedSpec(detail.selectedSpec);
        if (detail.selectedFeature) setSelectedFeature(detail.selectedFeature);
        if (detail.lightboxIndex !== undefined) setLightboxIndex(detail.lightboxIndex);
        if (detail.topic) setContactType(detail.topic);
        if (detail.hp) setSelectedHp(detail.hp);
        if (detail.cab) setSelectedCab(detail.cab);
        if (detail.axle) setSelectedAxle(detail.axle);
      }

      setConfigSaved(false);
      setContactSubmitted(false);
      setQuoteSubmitted(false);
      setDealerSearchResult(null);
      setIsZoomed(false);
    };

    window.addEventListener('open-mack-modal', handleOpenModal);

    const handleHash = () => {
      const hash = window.location.hash;
      setModalSubject('');
      if (hash === '#configure') setActiveModal('configure');
      else if (hash === '#brochure') setActiveModal('brochure');
      else if (hash === '#contact-dealer') setActiveModal('contact');
      else if (hash === '#find-dealer') setActiveModal('find-dealer');
      else if (hash === '#request-quote') setActiveModal('quote');
      else if (hash === '#search') setActiveModal('search');
    };

    window.addEventListener('hashchange', handleHash);

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

  useEffect(() => {
    if (activeModal === 'search') {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [activeModal]);

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

  const handleQuoteSubmit = async (e: React.FormEvent) => {
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
      fleetSize: quoteFleetSize,
      selectedEngine: modalSubject || selectedHp,
      estimatedPrice: modalSubject ? 'Quote requested' : `$${estimatedPrice.toLocaleString()}`,
      message: modalSubject ? `Quote requested for ${modalSubject}` : undefined,
    });
    if (res.isRealtime) {
      showToast('✓ Quote saved to Firebase Firestore in real-time!');
    } else {
      showToast('✓ Quote saved on this device.');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
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
      message: modalSubject
        ? `Dealer consultation regarding ${contactType}: ${modalSubject}`
        : `Dealer consultation regarding ${contactType}`,
    });
    if (res.isRealtime) {
      showToast('✓ Lead sent to Firebase Firestore in real-time!');
    } else {
      showToast('✓ Message saved on this device.');
    }
  };

  return (
    <>
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
            <button
              type="button"
              onClick={closeModal}
              className={`absolute top-4 right-4 p-2 rounded-[6px] transition-colors focus:outline-none focus-visible:ring-2 cursor-pointer ${
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

            {activeModal === 'configure' && (
              <ConfigureModal
                selectedHp={selectedHp}
                setSelectedHp={setSelectedHp}
                selectedCab={selectedCab}
                setSelectedCab={setSelectedCab}
                selectedAxle={selectedAxle}
                setSelectedAxle={setSelectedAxle}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                configSaved={configSaved}
                setConfigSaved={setConfigSaved}
                estimatedPrice={estimatedPrice}
                onSaveConfig={() => {
                  setConfigSaved(true);
                  showToast(`Mack Anthem (${selectedHp}) configuration saved.`);
                }}
                onRequestQuote={() => {
                  closeModal();
                  setTimeout(() => setActiveModal('quote'), 150);
                }}
              />
            )}

            {activeModal === 'brochure' && (
              <BrochureModal
                onDownloadSpecSheet={handleDownloadSpecSheet}
                onClose={closeModal}
              />
            )}

            {activeModal === 'find-dealer' && (
              <FindDealerModal
                dealerZip={dealerZip}
                setDealerZip={setDealerZip}
                onDealerSearch={handleDealerSearch}
                dealerSearchResult={dealerSearchResult}
                filteredDealers={filteredDealers}
                onSelectDealerVisit={() => {
                  closeModal();
                  setTimeout(() => setActiveModal('contact'), 150);
                }}
              />
            )}

            {activeModal === 'quote' && (
              <QuoteModal
                quoteCompany={quoteCompany}
                setQuoteCompany={setQuoteCompany}
                quoteEmail={quoteEmail}
                setQuoteEmail={setQuoteEmail}
                quoteFleetSize={quoteFleetSize}
                setQuoteFleetSize={setQuoteFleetSize}
                quoteSubmitted={quoteSubmitted}
                quoteError={quoteError}
                onSubmitQuote={handleQuoteSubmit}
                onClose={closeModal}
                subject={modalSubject}
              />
            )}

            {activeModal === 'test-drive' && (
              <TestDriveModal
                subject={modalSubject}
                dealerOptions={AUTHORIZED_DEALERS.map((d) => d.name)}
                onClose={closeModal}
                onBooked={showToast}
              />
            )}

            {activeModal === 'contact' && (
              <ContactModal
                contactName={contactName}
                setContactName={setContactName}
                contactEmail={contactEmail}
                setContactEmail={setContactEmail}
                contactPhone={contactPhone}
                setContactPhone={setContactPhone}
                contactType={contactType}
                setContactType={setContactType}
                contactSubmitted={contactSubmitted}
                contactError={contactError}
                onSubmitContact={handleContactSubmit}
                onClose={closeModal}
              />
            )}

            {activeModal === 'search' && (
              <SearchModal
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                searchInputRef={searchInputRef}
                onClose={closeModal}
              />
            )}

            {activeModal === 'spec-detail' && (
              <SpecDetailModal
                selectedSpec={selectedSpec}
                onClose={closeModal}
              />
            )}

            {activeModal === 'feature-detail' && (
              <FeatureDetailModal
                selectedFeature={selectedFeature}
                telemetry={telemetry}
                onClose={closeModal}
              />
            )}

            {activeModal === 'lightbox' && (
              <LightboxModal
                photos={GALLERY_PHOTOS}
                lightboxIndex={lightboxIndex}
                setLightboxIndex={setLightboxIndex}
                isZoomed={isZoomed}
                setIsZoomed={setIsZoomed}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** Helper function to open modal from anywhere */
export const openMackModal = triggerMackModal;
