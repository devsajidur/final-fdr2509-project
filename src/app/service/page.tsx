import type { Metadata } from 'next';
import { ServiceContent } from '@/components/pages/ServiceContent';

export const metadata: Metadata = {
  title: 'Service, Telematics & Warranty | Mack Anthem',
  description:
    'Mack Certified Uptime service, GuardDog Connect telematics, preventive maintenance plans, factory warranty coverage and online service booking.',
};

export default function ServicePage() {
  return <ServiceContent />;
}
