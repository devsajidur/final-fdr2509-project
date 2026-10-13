import React from 'react';
import Image from 'next/image';
import { galleryContent } from '@/data/site-content';

export function GallerySection() {
  return (
    <section
      id="gallery-section"
      className="w-full bg-[#F9FAFB] lg:h-[431px] pt-[64px] pb-12 lg:pb-0 overflow-hidden"
    >
      <div className="w-full max-w-[1216px] mx-auto px-4 sm:px-6 lg:px-0 flex flex-col items-center">
        {/* Title: 30px, 700, 36px line-height, center, margin bottom 48px */}
        <h2 className="text-[26px] sm:text-[30px] font-bold leading-[36px] text-[#111827] text-center mb-[48px]">
          {galleryContent.title}
        </h2>

        {/* 3 Images Grid: Gap 24px, total 1216px, height ~219px */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full max-w-[1216px] justify-items-center">
          {galleryContent.items.map((item) => (
            <div
              key={item.id}
              className="relative w-full max-w-[389.34px] h-[219px] rounded-[8px] overflow-hidden shrink-0 group"
              style={{
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                title={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 390px"
                className="object-cover object-center rounded-[8px] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
