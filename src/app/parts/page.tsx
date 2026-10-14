import type { Metadata } from 'next';
import { PartsContent } from '@/components/pages/PartsContent';

export const metadata: Metadata = {
  title: 'Genuine Mack Parts | Mack Anthem',
  description:
    'Browse Genuine Mack Parts by category — engine & powertrain, air & filtration, braking systems and cab & aerodynamics — and request a part quote.',
};

export default function PartsPage() {
  return <PartsContent />;
}
