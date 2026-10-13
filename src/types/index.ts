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
