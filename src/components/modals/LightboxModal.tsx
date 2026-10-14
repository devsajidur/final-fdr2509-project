import React from 'react';
import Image from 'next/image';

export interface GalleryPhoto {
  src: string;
  title: string;
  caption: string;
}

interface LightboxModalProps {
  photos: GalleryPhoto[];
  lightboxIndex: number;
  setLightboxIndex: React.Dispatch<React.SetStateAction<number>>;
  isZoomed: boolean;
  setIsZoomed: (val: boolean) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photos,
  lightboxIndex,
  setLightboxIndex,
  isZoomed,
  setIsZoomed,
}) => {
  const currentPhoto = photos[lightboxIndex];

  return (
    <div className="text-center">
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-800 text-[14px] text-gray-400">
        <span className="font-semibold text-white">
          {currentPhoto.title} ({lightboxIndex + 1} of {photos.length})
        </span>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            className="px-2.5 py-1 text-[12px] bg-gray-800 text-gray-300 rounded hover:bg-gray-700 cursor-pointer transition-colors"
          >
            {isZoomed ? 'Zoom 100%' : 'Zoom In'}
          </button>
        </div>
      </div>

      <div className="relative w-full h-[320px] sm:h-[480px] bg-black rounded-[6px] overflow-hidden flex items-center justify-center">
        <div
          className={`relative w-full h-full transition-transform duration-300 ${
            isZoomed ? 'scale-150 cursor-grab' : 'scale-100'
          }`}
        >
          <Image
            src={currentPhoto.src}
            alt={currentPhoto.title}
            fill
            className="object-contain"
            sizes="(max-width: 900px) 100vw, 900px"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length)
          }
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <button
          type="button"
          onClick={() => setLightboxIndex((prev) => (prev + 1) % photos.length)}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white rounded-full hover:bg-black transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <p className="text-[13px] text-gray-400 mt-3 max-w-[650px] mx-auto">
        {currentPhoto.caption}
      </p>
    </div>
  );
};
