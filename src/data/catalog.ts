
export interface TruckVariant {
  id: string;
  /** Full marketing name; also used as the quote / test-drive subject */
  name: string;
  badge: string;
  tagline: string;
  /** Matches the cab options of the Configure & Price modal */
  configureCab: string;
  configureAxle: string;
  configureHp: string;
  stats: { label: string; value: string }[];
  features: string[];
  bestFor: string;
}

export const TRUCK_VARIANTS: TruckVariant[] = [
  {
    id: 'anthem-day-cab-6x4',
    name: 'Mack Anthem® Day Cab 6x4',
    badge: 'REGIONAL & DRAYAGE',
    tagline: 'Maximum payload and maneuverability for metro and intermodal work.',
    configureCab: 'Day Cab',
    configureAxle: '6x4 Heavy Duty',
    configureHp: '445 HP',
    stats: [
      { label: 'Cab', value: 'Non-sleeper day cab' },
      { label: 'Axle setup', value: '6x4 tandem drive' },
      { label: 'Engine', value: 'Mack MP8® 13L · 415–505 HP' },
      { label: 'Transmission', value: 'mDRIVE™ 12-speed automated' },
      { label: 'GCWR', value: 'Up to 80,000 lbs' },
    ],
    features: [
      'Up to 2,000 lbs of tare weight saved versus sleeper models',
      'Tight wheel cut for crowded docks, ports and rail yards',
      'Galvanized steel cab with dual E-coat for coastal and road-salt corrosion',
    ],
    bestFor: 'Port drayage, rail intermodal, retail and grocery distribution.',
  },
  {
    id: 'anthem-48-flat-top',
    name: 'Mack Anthem® 48" Flat Top Sleeper',
    badge: 'LOW-CLEARANCE SPECIALIST',
    tagline: 'Streamlined efficiency for regional routes and low-profile trailers.',
    configureCab: '48" Flat Top',
    configureAxle: '6x4 Heavy Duty',
    configureHp: '445 HP',
    stats: [
      { label: 'Cab', value: '48" flat-top sleeper' },
      { label: 'Axle setup', value: '6x2 or 6x4' },
      { label: 'Engine', value: 'Mack MP8® 13L · 415–505 HP' },
      { label: 'Transmission', value: 'mDRIVE™ 12-speed automated' },
      { label: 'GCWR', value: 'Up to 80,000 lbs' },
    ],
    features: [
      'Low roofline engineered for car-haulers, flatbeds and bulk tankers',
      'Weight-optimized cab preserves payload for heavy materials',
      'Heated LED headlamps that clear ice and snow automatically',
    ],
    bestFor: 'Regional flatbed, auto transport, liquid bulk and refrigerated runs.',
  },
  {
    id: 'anthem-70-stand-up',
    name: 'Mack Anthem® 70" Stand-Up Sleeper',
    badge: 'FLAGSHIP HIGHWAY',
    tagline: 'The long-haul flagship with a full stand-up living space.',
    configureCab: '70" Stand Up Sleeper',
    configureAxle: '6x2 Fuel Efficient',
    configureHp: '505 HP',
    stats: [
      { label: 'Cab', value: '70" high-roof stand-up sleeper' },
      { label: 'Axle setup', value: '6x2 fuel efficient or 6x4' },
      { label: 'Engine', value: 'Mack MP8® 13L / MP8HE · up to 505 HP' },
      { label: 'Transmission', value: 'mDRIVE™ 12-speed + Predictive Cruise' },
      { label: 'GCWR', value: '80,000+ lbs' },
    ],
    features: [
      'Aero-sculpted roof and fairings tuned for up to 12.5% better fuel efficiency',
      '7-foot interior ceiling, full wardrobe and a 35" pocket-coil mattress',
      'GuardDog® Connect telematics and Bendix® Wingman® Fusion active safety',
    ],
    bestFor: 'Cross-country dry van, refrigerated freight and dedicated fleets.',
  },
];

export interface EngineRating {
  id: string;
  name: string;
  badge: string;
  hp: string;
  torque: string;
  /** Matches the HP options of the Configure & Price modal (if available) */
  configureHp?: string;
  summary: string;
  highlights: string[];
  bestFor: string;
}

export const MP8_ENGINES: EngineRating[] = [
  {
    id: 'mp8-415',
    name: 'Mack MP8® 415',
    badge: 'EFFICIENCY',
    hp: '415 HP',
    torque: '1,560 lb.-ft.',
    configureHp: '415 HP',
    summary: 'A fuel-sipping rating for flat to rolling regional terrain.',
    highlights: ['13L inline-6 with Wave Piston technology', 'Optimized for mDRIVE™ 12-speed', 'Lowest running cost in the MP8 range'],
    bestFor: 'Regional distribution and dedicated lanes.',
  },
  {
    id: 'mp8-445',
    name: 'Mack MP8® 445',
    badge: 'ALL-ROUND',
    hp: '445 HP',
    torque: '1,660 lb.-ft.',
    configureHp: '445 HP',
    summary: 'The balanced choice when routes mix highway miles with grades.',
    highlights: ['Strong mid-range pull for rolling hills', 'Predictive Cruise with GPS terrain maps', 'Pairs with 6x2 or 6x4 drive axles'],
    bestFor: 'Mixed regional and interstate freight.',
  },
  {
    id: 'mp8-505',
    name: 'Mack MP8® 505',
    badge: 'MAX POWER',
    hp: '505 HP',
    torque: '1,860 lb.-ft.',
    configureHp: '505 HP',
    summary: 'Peak output for heavy hauls, mountain passes and permit loads.',
    highlights: ['Up to 1,860 lb.-ft. of peak torque', 'Strong grade-climbing without downshift hunting', 'Rated for 80,000+ lbs GCWR'],
    bestFor: 'Heavy haul, mountain routes and high-GCWR work.',
  },
  {
    id: 'mp8he',
    name: 'Mack MP8HE® Turbo-Compound',
    badge: 'FUEL-SAVER',
    hp: 'Up to 445 HP',
    torque: '1,660 lb.-ft.',
    summary: 'Recaptures exhaust energy to return power straight to the crankshaft.',
    highlights: ['Turbo compounding adds up to 50 HP of recovered energy', 'Up to 12.5% better fuel economy on Anthem', 'Ideal for high-mileage line-haul'],
    bestFor: 'High-mileage long-haul fleets chasing MPG.',
  },
];

export const PART_CATEGORIES = [
  'Engine & Powertrain',
  'Air & Filtration',
  'Braking Systems',
  'Cab & Aerodynamics',
] as const;

export type PartCategory = (typeof PART_CATEGORIES)[number];

export type StockStatus = 'in-stock' | 'low-stock' | 'special-order';

export interface MackPart {
  partNumber: string;
  category: PartCategory;
  name: string;
  description: string;
  fits: string;
  stock: StockStatus;
  stockDetail: string;
}

export const STOCK_LABELS: Record<StockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'special-order': 'Special Order',
};

export const MACK_PARTS: MackPart[] = [
  {
    partNumber: 'MK-22340912',
    category: 'Engine & Powertrain',
    name: 'Reman MP8® Variable Geometry Turbocharger (VGT)',
    description: 'Factory-remanufactured with a new electronic actuator and dynamically balanced turbine wheel.',
    fits: 'Anthem & Pinnacle · MP8 13L',
    stock: 'low-stock',
    stockDetail: '4 units · ships same day',
  },
  {
    partNumber: 'MK-21045678',
    category: 'Engine & Powertrain',
    name: 'mDRIVE™ Dual-Plate Clutch Replacement Kit',
    description: 'Self-adjusting pressure plate, ceramic discs, pilot bearing and electronic alignment guide.',
    fits: 'Anthem, Pinnacle, Granite · mDRIVE 12/13/14',
    stock: 'in-stock',
    stockDetail: '26 units · ships same day',
  },
  {
    partNumber: 'MK-22941033',
    category: 'Engine & Powertrain',
    name: 'High-Pressure Common Rail Fuel Injector',
    description: 'Remanufactured to zero-tolerance factory specs with micro-honed nozzles.',
    fits: 'Mack MP8 13L (2018–2026)',
    stock: 'in-stock',
    stockDetail: '120+ units · ships same day',
  },
  {
    partNumber: 'MK-22110478',
    category: 'Engine & Powertrain',
    name: 'MP8 Water Pump Assembly',
    description: 'Cast-iron housing with sealed bearing and upgraded impeller for extended coolant life.',
    fits: 'Mack MP7 & MP8 engines',
    stock: 'in-stock',
    stockDetail: '18 units · ships same day',
  },
  {
    partNumber: 'MK-85137299',
    category: 'Air & Filtration',
    name: 'Ultra-Efficiency Fuel/Water Separator',
    description: '10-micron multi-layer media removes 99.8% of emulsified water to protect injectors.',
    fits: 'Anthem, Pinnacle, Granite · MP7 & MP8',
    stock: 'in-stock',
    stockDetail: '240+ units · ships same day',
  },
  {
    partNumber: 'MK-85137310',
    category: 'Air & Filtration',
    name: 'Heavy-Duty Primary Air Filter Element',
    description: 'High-capacity pleated media with extended service life for dusty line-haul duty.',
    fits: 'Anthem & Pinnacle · 13" housing',
    stock: 'in-stock',
    stockDetail: '85 units · ships same day',
  },
  {
    partNumber: 'MK-20508211',
    category: 'Air & Filtration',
    name: 'Full-Flow Oil Filter Cartridge',
    description: 'Synthetic-blend media rated for extended drain intervals with EOS-4.5 oils.',
    fits: 'All Mack MP7, MP8 & MP8HE',
    stock: 'in-stock',
    stockDetail: '300+ units · ships same day',
  },
  {
    partNumber: 'MK-22665002',
    category: 'Air & Filtration',
    name: 'Air Dryer Desiccant Cartridge',
    description: 'Spin-on cartridge that keeps the brake air system free of moisture and oil carry-over.',
    fits: 'Anthem, Pinnacle, Granite',
    stock: 'low-stock',
    stockDetail: '6 units · ships next day',
  },
  {
    partNumber: 'MK-85141022',
    category: 'Braking Systems',
    name: 'Bendix® ADB22X Air Disc Brake Caliper & Rotor Kit',
    description: 'Lightweight monobloc caliper with vented rotor for shorter stopping distances.',
    fits: 'Anthem · front steer & rear drive axles',
    stock: 'in-stock',
    stockDetail: '32 units · ships same day',
  },
  {
    partNumber: 'MK-85141877',
    category: 'Braking Systems',
    name: 'Air Disc Brake Pad Set (Axle Set)',
    description: 'Low-wear friction compound with integrated wear sensors and hardware.',
    fits: 'Anthem & Granite · ADB22X',
    stock: 'in-stock',
    stockDetail: '64 units · ships same day',
  },
  {
    partNumber: 'MK-85142390',
    category: 'Braking Systems',
    name: 'Type 30 Spring Brake Chamber',
    description: 'Long-stroke dual-diaphragm chamber with corrosion-resistant coated housing.',
    fits: 'Anthem, Pinnacle, Granite rear axles',
    stock: 'low-stock',
    stockDetail: '9 units · ships next day',
  },
  {
    partNumber: 'MK-85143002',
    category: 'Braking Systems',
    name: 'Bendix® Wingman® Fusion Radar Sensor',
    description: 'Forward radar module for collision mitigation and adaptive cruise; calibration included.',
    fits: 'Anthem · Wingman Fusion 2.0',
    stock: 'special-order',
    stockDetail: 'Built to order · 5–7 business days',
  },
  {
    partNumber: 'MK-23194011',
    category: 'Cab & Aerodynamics',
    name: 'Heated LED Headlamp Assembly (Right)',
    description: 'DOT/SAE-compliant projector with internal heating elements that melt road ice.',
    fits: 'Anthem 70" / 48" Sleeper & Day Cab',
    stock: 'in-stock',
    stockDetail: '14 units · ships same day',
  },
  {
    partNumber: 'MK-23588140',
    category: 'Cab & Aerodynamics',
    name: 'Heated Power Mirror Assembly',
    description: 'Breakaway mount with wide-angle spotter glass and integrated turn signal.',
    fits: 'Anthem · all cab configurations',
    stock: 'in-stock',
    stockDetail: '22 units · ships same day',
  },
  {
    partNumber: 'MK-23402219',
    category: 'Cab & Aerodynamics',
    name: 'Side Extender Fairing (70" Sleeper)',
    description: 'Closes the tractor–trailer gap to cut drag and improve highway fuel economy.',
    fits: 'Anthem 70" Stand-Up Sleeper',
    stock: 'low-stock',
    stockDetail: '5 units · ships next day',
  },
  {
    partNumber: 'MK-23310456',
    category: 'Cab & Aerodynamics',
    name: 'Aerodynamic Roof Deflector',
    description: 'Adjustable fiberglass deflector matched to trailer height for optimum airflow.',
    fits: 'Anthem 48" & 70" Sleeper',
    stock: 'special-order',
    stockDetail: 'Built to order · 7–10 business days',
  },
];

export interface PmPlan {
  id: string;
  name: string;
  interval: string;
  duty: string;
  items: string[];
  downtime: string;
}

export const PM_PLANS: PmPlan[] = [
  {
    id: 'pm-a',
    name: 'PM Schedule A',
    interval: 'Every 25,000 miles',
    duty: 'All duty cycles',
    items: ['Oil & filter change', 'Chassis lubrication', 'Steering play check', '40-point safety inspection'],
    downtime: 'About 3–4 hours',
  },
  {
    id: 'pm-b',
    name: 'PM Schedule B',
    interval: 'Every 50,000 miles',
    duty: 'Line-haul & regional',
    items: ['Primary & secondary fuel filters', 'Air dryer & desiccant check', 'Coolant refractometer analysis', 'Everything in Schedule A'],
    downtime: 'About 5–6 hours',
  },
  {
    id: 'pm-c',
    name: 'PM Schedule C',
    interval: 'Every 100,000 miles',
    duty: 'Severe & high-mileage',
    items: ['Valve lash calibration', 'DPF pressure-flow analysis', 'Driveline U-joint inspection', 'Everything in Schedule B'],
    downtime: 'About 8–10 hours',
  },
];

export const SERVICE_TYPES = [
  'PM Schedule A (25,000 miles)',
  'PM Schedule B (50,000 miles)',
  'PM Schedule C (100,000 miles)',
  'Diagnostic trouble code (DTC) triage',
  'Brake & air system inspection',
  'mDRIVE clutch / powertrain service',
  'DPF regeneration & emissions check',
];

export const SERVICE_CENTER_CAPABILITIES = [
  { icon: '⏱️', title: '2-hour diagnostic triage', text: 'Master technicians inspect your truck and deliver a verified estimate within 120 minutes.' },
  { icon: '🛠️', title: 'Dedicated fast-lane bays', text: 'Repairs under 4 hours are routed to quick-turnaround bays so trucks go back to work.' },
  { icon: '📦', title: 'Parts staged in advance', text: 'Genuine Mack Parts are pre-ordered the moment a fault code is diagnosed.' },
  { icon: '📱', title: 'ASIST repair transparency', text: 'See photos, approve estimates and message your service writer from your phone.' },
  { icon: '🔄', title: 'Factory reman programs', text: 'Remanufactured engines, turbos and transmissions with full factory warranty.' },
  { icon: '🚨', title: 'Mack OneCall roadside', text: '24/7 heavy-duty towing, mobile repair and tire rescue across the US and Canada.' },
];

export const GUARDDOG_FEATURES = [
  { title: 'Remote diagnostics', text: 'Thousands of engine, transmission and aftertreatment signals are monitored in real time.' },
  { title: 'Automatic case creation', text: 'A fault code opens a service case and alerts the fleet manager by SMS and email.' },
  { title: 'Pre-staged parts & bays', text: 'Parts and a service bay are lined up at the nearest Uptime Center before you arrive.' },
  { title: 'Over-the-air updates', text: 'Engine and transmission calibrations update wirelessly while the driver is parked.' },
];

export const WARRANTY_COVERAGE = [
  { component: 'Base MP8 engine & aftertreatment', detail: 'Block, heads, pistons, camshaft, turbo, SCR', term: '3 yrs / 350,000 mi' },
  { component: 'mDRIVE™ automated transmission', detail: 'Case, gears, internal bearings, actuator', term: '5 yrs / 750,000 mi' },
  { component: 'Mack drive axle carriers', detail: 'Single & tandem housings, ring and pinion gears', term: '5 yrs / 750,000 mi' },
  { component: 'Anthem galvanized steel cab', detail: 'Structural integrity & rust perforation', term: '5 yrs / unlimited mi' },
  { component: 'Premium Extended Protection', detail: 'Complete bumper-to-crossmember plan', term: 'Up to 6 yrs / 600,000 mi' },
];

export const DEALER_REGIONS = ['Midwest', 'Northeast', 'Southeast', 'Southwest', 'West'] as const;
export type DealerRegion = (typeof DEALER_REGIONS)[number];

export interface RegionalDealer {
  id: string;
  name: string;
  region: DealerRegion;
  city: string;
  state: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
}

export const REGIONAL_DEALERS: RegionalDealer[] = [
  { id: 'chi', name: 'Mack Trucks of Chicago', region: 'Midwest', city: 'Chicago', state: 'IL', address: '4250 S Cicero Ave, Chicago, IL 60638', phone: '(312) 555-0144', hours: 'Mon–Sat · 6am–10pm', services: ['Sales', 'Parts', 'Uptime Center'] },
  { id: 'mil', name: 'Empire Mack Fleet Center', region: 'Midwest', city: 'Milwaukee', state: 'WI', address: '6100 S Howell Ave, Milwaukee, WI 53207', phone: '(414) 555-0199', hours: 'Mon–Fri · 6am–8pm', services: ['Sales', 'Parts', 'Service'] },
  { id: 'alt', name: 'Mack Allentown Flagship Center', region: 'Northeast', city: 'Allentown', state: 'PA', address: '2001 Mack Blvd, Allentown, PA 18103', phone: '(610) 555-0120', hours: 'Open 24/7', services: ['Sales', 'Parts', 'Uptime Center', 'Roadside'] },
  { id: 'nwk', name: 'Garden State Mack', region: 'Northeast', city: 'Newark', state: 'NJ', address: '55 Delancy St, Newark, NJ 07105', phone: '(973) 555-0166', hours: 'Mon–Sat · 6am–9pm', services: ['Sales', 'Parts', 'Service'] },
  { id: 'atl', name: 'Mack Atlanta Logistics Depot', region: 'Southeast', city: 'Atlanta', state: 'GA', address: '3300 Fulton Industrial Blvd, Atlanta, GA 30336', phone: '(404) 555-0157', hours: 'Open 24/7', services: ['Sales', 'Parts', 'Uptime Center', 'Roadside'] },
  { id: 'jax', name: 'Sunshine Mack Trucks', region: 'Southeast', city: 'Jacksonville', state: 'FL', address: '9100 Beach Blvd, Jacksonville, FL 32216', phone: '(904) 555-0181', hours: 'Mon–Sat · 7am–7pm', services: ['Sales', 'Parts', 'Service'] },
  { id: 'dal', name: 'Lone Star Mack Commercial Center', region: 'Southwest', city: 'Dallas', state: 'TX', address: '1240 S Lamar St, Dallas, TX 75215', phone: '(214) 555-0133', hours: 'Open 24/7', services: ['Sales', 'Parts', 'Uptime Center', 'Roadside'] },
  { id: 'phx', name: 'Desert Valley Mack', region: 'Southwest', city: 'Phoenix', state: 'AZ', address: '4400 W Buckeye Rd, Phoenix, AZ 85043', phone: '(602) 555-0175', hours: 'Mon–Fri · 6am–8pm', services: ['Sales', 'Parts', 'Service'] },
  { id: 'lax', name: 'Mack Los Angeles Port Corridor', region: 'West', city: 'Carson', state: 'CA', address: '2200 E 223rd St, Carson, CA 90810', phone: '(310) 555-0112', hours: 'Open 24/7', services: ['Sales', 'Parts', 'Uptime Center', 'Roadside'] },
  { id: 'sea', name: 'Pacific Northwest Mack', region: 'West', city: 'Kent', state: 'WA', address: '7800 S 196th St, Kent, WA 98032', phone: '(253) 555-0148', hours: 'Mon–Sat · 6am–8pm', services: ['Sales', 'Parts', 'Service'] },
];

export const FLEET_HOTLINE = { display: '1-800-866-1177', tel: '+18008661177' };

export interface FaqItem {
  id: string;
  category: 'Warranty' | 'Parts' | 'Service' | 'Financing' | 'Telematics' | 'Test Drive';
  question: string;
  answer: string;
}

export const FAQ_CATEGORIES = ['All', 'Warranty', 'Parts', 'Service', 'Financing', 'Telematics', 'Test Drive'] as const;

export const FAQS: FaqItem[] = [
  {
    id: 'faq-warranty-engine',
    category: 'Warranty',
    question: 'What does the base 3-year / 350,000-mile engine warranty cover?',
    answer:
      'It covers parts and certified technician labor for the cylinder block, heads, camshaft, crankshaft, connecting rods, oil pump and other internal lubricated components, with no deductible at any authorized Mack dealer in the US and Canada.',
  },
  {
    id: 'faq-warranty-extend',
    category: 'Warranty',
    question: 'Can I extend coverage beyond the base warranty?',
    answer:
      'Yes. Premium Extended Protection can be added for up to 6 years / 600,000 miles and can be bundled into your Mack Financial Services contract. Ask your dealer for a quote or send us a message below.',
  },
  {
    id: 'faq-parts-genuine',
    category: 'Parts',
    question: 'How do I know a Mack part will fit my truck?',
    answer:
      'Every part in our catalog lists the models and engines it fits. For a guaranteed match, give your dealer the truck VIN and they will verify the exact part number before shipping.',
  },
  {
    id: 'faq-parts-order',
    category: 'Parts',
    question: 'How quickly can I get a part?',
    answer:
      'In-stock parts ship the same day from our regional distribution hubs. Special-order items are built to order and typically ship in 5–10 business days. Use "Request Part Quote" and a parts specialist will confirm availability.',
  },
  {
    id: 'faq-service-book',
    category: 'Service',
    question: 'How do I book a service appointment?',
    answer:
      'Use the booking form on the Service page, call your nearest Certified Uptime Center, or let GuardDog Connect open a case automatically when a fault code occurs.',
  },
  {
    id: 'faq-service-roadside',
    category: 'Service',
    question: 'What should a driver do if the truck breaks down?',
    answer:
      'Move to a safe location and call Mack OneCall at 1-800-866-1177, any time of day. A live dispatcher coordinates towing or mobile repair using the truck GPS position.',
  },
  {
    id: 'faq-financing-trac',
    category: 'Financing',
    question: 'What is a TRAC lease?',
    answer:
      'A Terminal Rental Adjustment Clause lease offers lower monthly payments with a pre-agreed residual value. At the end you can buy the truck at that value, or trade up and keep any proceeds above it.',
  },
  {
    id: 'faq-financing-body',
    category: 'Financing',
    question: 'Can bodybuilder equipment be included in my loan?',
    answer:
      'Yes. Mack Financial Services can package the chassis, a dump, mixer or reefer body, extended warranty and maintenance into a single monthly payment.',
  },
  {
    id: 'faq-telematics-ota',
    category: 'Telematics',
    question: 'How do GuardDog® Connect over-the-air updates work?',
    answer:
      'Built-in 4G connectivity pushes calibration updates to the truck. When the driver is safely parked with the key off, the cluster prompts them to accept and the update completes without a dealer visit.',
  },
  {
    id: 'faq-testdrive',
    category: 'Test Drive',
    question: 'Can I test drive an Anthem with my own trailer?',
    answer:
      'In most cases yes. When you book a test drive, mention your trailer type in the notes and the dealer will arrange a demonstrator with a matching setup.',
  },
];
