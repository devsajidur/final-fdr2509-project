import { NavItem, SpecificationItem, FeatureItemData, GalleryItemData, FooterColumn } from '@/types';

export const navigationItems: NavItem[] = [
  { label: 'Trucks', href: '#trucks', isActive: true },
  { label: 'Parts', href: '#parts', isActive: false },
  { label: 'Service', href: '#service', isActive: false },
  { label: 'Support', href: '#support', isActive: false },
];

export const heroContent = {
  eyebrow: 'Mack Anthem',
  title: 'Built for the Road Ahead',
  description:
    'The Mack Anthem combines proven reliability with advanced technology and driver comfort. Engineered for long-haul efficiency and built to handle the toughest jobs.',
  primaryCta: {
    label: 'Configure & Price',
    href: '#configure',
    width: 188.83,
  },
  secondaryCta: {
    label: 'Download Brochure',
    href: '#brochure',
    width: 213.33,
  },
  image: {
    name: 'Mack Anthem Highway Driving',
    title: 'Mack Anthem Silver Highway Truck',
    src: '/images/mack-anthem-hero.png',
    alt: 'Mack Anthem silver highway truck driving along an open highway',
    width: 584,
    height: 384,
  },
};

export const specificationsContent = {
  title: 'Technical Specifications',
  subtitle: 'Built with precision engineering for maximum performance',
  items: [
    {
      id: 'spec-engine',
      title: 'Engine',
      primaryDetail: 'Mack MP8 13L Engine',
      secondaryDetail: 'Up to 505 HP',
      iconType: 'engine',
    },
    {
      id: 'spec-fuel',
      title: 'Fuel Economy',
      primaryDetail: 'Up to 8.5 MPG',
      secondaryDetail: 'Highway driving',
      iconType: 'fuel',
    },
    {
      id: 'spec-gvwr',
      title: 'GVWR',
      primaryDetail: '80,000 lbs',
      secondaryDetail: 'Maximum capacity',
      iconType: 'gvwr',
    },
    {
      id: 'spec-wheelbase',
      title: 'Wheelbase',
      primaryDetail: 'Multiple Options',
      secondaryDetail: '189" - 280"',
      iconType: 'wheelbase',
    },
  ] as SpecificationItem[],
};

export const featuresContent = {
  title: 'Key Features',
  subtitle: 'Advanced technology and comfort for the modern driver',
  items: [
    {
      id: 'feature-safety',
      title: 'Safety First',
      description:
        'Advanced safety systems including collision mitigation and lane departure warning',
      iconType: 'safety',
    },
    {
      id: 'feature-connected',
      title: 'Connected',
      description:
        'GuardDog Connect telematics for real-time monitoring and diagnostics',
      iconType: 'connected',
    },
    {
      id: 'feature-comfort',
      title: 'Driver Comfort',
      description:
        'Spacious cab with premium seating and intuitive controls',
      iconType: 'comfort',
    },
  ] as FeatureItemData[],
};

export const galleryContent = {
  title: 'Gallery',
  items: [
    {
      id: 'gallery-interior',
      name: 'Mack Anthem Cabin Interior',
      title: 'Cabin Interior',
      src: '/images/mack-interior.png',
      alt: 'Mack Anthem modern truck cabin interior with dashboard and steering wheel',
      width: 389.33,
      height: 218.98,
      aspectClass: 'aspect-[389.33/218.98]',
    },
    {
      id: 'gallery-engine',
      name: 'Mack MP8 Engine Compartment',
      title: 'Engine Compartment',
      src: '/images/mack-engine.png',
      alt: 'Mack MP8 13L engine compartment showing high-performance mechanical powertrain',
      width: 389.33,
      height: 218.98,
      aspectClass: 'aspect-[389.33/218.98]',
    },
    {
      id: 'gallery-rear',
      name: 'Mack Anthem Rear View',
      title: 'Rear Exterior',
      src: '/images/mack-rear.png',
      alt: 'Rear view of Mack truck showing dual rear axles, taillights, and trailer linkage on highway',
      width: 389.34,
      height: 219.0,
      aspectClass: 'aspect-[389.34/219]',
    },
  ] as GalleryItemData[],
};

export const callToActionContent = {
  title: 'Ready to Experience the Mack Anthem?',
  description:
    'Contact your local dealer for pricing, financing options, and test drives',
  primaryCta: {
    label: 'Find a Dealer',
    href: '#find-dealer',
    width: 171.77,
  },
  secondaryCta: {
    label: 'Request Quote',
    href: '#request-quote',
    width: 188.47,
  },
};

export const footerContent = {
  brandTagline: 'Built to last. Born to work.',
  columns: [
    {
      title: 'Products',
      links: [
        { label: 'Trucks', href: '#trucks' },
        { label: 'Engines', href: '#engines' },
        { label: 'Parts', href: '#parts' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Service', href: '#service' },
        { label: 'Warranty', href: '#warranty' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Connect',
      links: [],
    },
  ] as FooterColumn[],
  copyright: '© 2024 Mack Trucks. All rights reserved.',
};
