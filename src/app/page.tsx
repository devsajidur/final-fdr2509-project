import React from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { SpecificationsSection } from '@/components/sections/SpecificationsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { CallToActionSection } from '@/components/sections/CallToActionSection';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      {/* 01. Header: Y=0, H=65px */}
      <Header />

      {/* Main Content: Y=65px to Y=2258px (H=2193px) */}
      <main className="flex-1 flex flex-col">
        {/* 02. Hero: Y=65px, H=600px */}
        <HeroSection />

        {/* 03. Technical Specifications: Y=665px, H=452px */}
        <SpecificationsSection />

        {/* 04. Key Features: Y=1117px, H=420px */}
        <FeaturesSection />

        {/* 05. Gallery: Y=1537px, H=431px */}
        <GallerySection />

        {/* 06. Call to Action: Y=1968px, H=290px */}
        <CallToActionSection />
      </main>

      {/* 07. Footer: Y=2258px, H=313px */}
      <Footer />
    </div>
  );
}
