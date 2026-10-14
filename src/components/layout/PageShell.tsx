import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InteractionModals } from '@/components/ui/InteractionModals';
import { MobileAppNavBar } from '@/components/layout/MobileAppNavBar';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <InteractionModals />
      <MobileAppNavBar />
    </div>
  );
}
