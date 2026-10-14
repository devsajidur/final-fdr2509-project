import React from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { SpecificationsSection } from '@/components/sections/SpecificationsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { CallToActionSection } from '@/components/sections/CallToActionSection';
import { Footer } from '@/components/layout/Footer';
import { InteractionModals } from '@/components/ui/InteractionModals';
import { MobileAppNavBar } from '@/components/layout/MobileAppNavBar';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      <Header />

      <main className="flex-1 flex flex-col">
        <HeroSection />

        <SpecificationsSection />

        <FeaturesSection />

        <GallerySection />

        <CallToActionSection />
      </main>

      <Footer />

      <InteractionModals />

      <MobileAppNavBar />
    </div>
  );
}
