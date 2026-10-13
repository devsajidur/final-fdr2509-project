export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface SpecificationItem {
  id: string;
  title: string;
  primaryDetail: string;
  secondaryDetail: string;
  iconType: 'engine' | 'fuel' | 'gvwr' | 'wheelbase';
}

export interface FeatureItemData {
  id: string;
  title: string;
  description: string;
  iconType: 'safety' | 'connected' | 'comfort';
}

export interface GalleryItemData {
  id: string;
  name?: string;
  title?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectClass: string;
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  company?: string;
  phone?: string;
  fleetSize?: string;
  createdAt: string;
}

export interface QuoteRequestRecord {
  id: string;
  quoteNumber?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  fleetSize?: string;
  model: string;
  timeFrame?: string;
  message?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'contacted' | 'archived';
  submittedAt: string;
  estimatedValue?: number;
  notes?: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dealership?: string;
  interest?: string;
  message?: string;
  status: 'new' | 'contacted' | 'closed';
  submittedAt: string;
}

export interface TestDriveBooking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  model: string;
  preferredDate: string;
  preferredLocation: string;
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  submittedAt: string;
}

