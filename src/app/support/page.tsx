import type { Metadata } from 'next';
import { SupportContent } from '@/components/pages/SupportContent';

export const metadata: Metadata = {
  title: 'Support, Dealers & Contact | Mack Anthem',
  description:
    'Find an authorized Mack dealer, reach the 24/7 Fleet Support hotline, browse FAQs and send a message to the Mack support team.',
};

export default function SupportPage() {
  return <SupportContent />;
}
