import type { Metadata } from 'next';
import { TrucksContent } from '@/components/pages/TrucksContent';

export const metadata: Metadata = {
  title: 'Trucks & Engines | Mack Anthem',
  description:
    'Explore the Mack Anthem Day Cab 6x4, 48" Flat Top Sleeper and 70" Stand-Up Sleeper, plus the Mack MP8 engine lineup. Configure, request a quote or book a test drive.',
};

export default function TrucksPage() {
  return <TrucksContent />;
}
