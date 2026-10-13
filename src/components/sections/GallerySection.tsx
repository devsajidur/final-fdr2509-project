'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { galleryContent } from '@/data/site-content';
import { triggerMackModal } from '@/components/ui/InteractionModals';
import { subscribeGallery } from '@/lib/firebase/firestore';
import { GalleryItemData } from '@/types';

export function GallerySection() {
  const [items, setItems] = useState<GalleryItemData[]>(galleryContent.items);

  useEffect(() => {
    const unsubscribe = subscribeGallery((liveItems) => {
      if (liveItems && liveItems.length > 0) {
        setItems(liveItems);
      }
    });
    return () => unsubscribe();
  }, []);

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
          {items.map((item, index) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => triggerMackModal('lightbox', { lightboxIndex: index })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerMackModal('lightbox', { lightboxIndex: index });
                }
              }}
              aria-label={`Enlarge photo: ${item.title}`}
              className="relative w-full max-w-[389.34px] h-[219px] rounded-[8px] overflow-hidden shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-black active:scale-[0.98] transition-all duration-200 mx-auto"
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
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                <span className="bg-white/90 text-black text-[12px] font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                  <span>Enlarge</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
