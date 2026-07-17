'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/types';

const galleryImages: GalleryImage[] = [
  { id: '1', src: '/images/hero.png', alt: 'Resort aerial view', category: 'resort', span: 'wide' },
  { id: '2', src: '/images/room-villa.png', alt: 'Sunset pool villa', category: 'rooms' },
  { id: '3', src: '/images/garden.png', alt: 'Tropical garden path', category: 'garden', span: 'tall' },
  { id: '4', src: '/images/room-suite.png', alt: 'Garden suite interior', category: 'rooms' },
  { id: '5', src: '/images/pool.png', alt: 'Infinity pool at sunset', category: 'pool', span: 'wide' },
  { id: '6', src: '/images/dining.png', alt: 'Open-air dining', category: 'dining' },
  { id: '7', src: '/images/garden.png', alt: 'Garden blooms', category: 'garden' },
  { id: '8', src: '/images/room-villa.png', alt: 'Private pool villa', category: 'rooms' },
  { id: '9', src: '/images/pool.png', alt: 'Beachfront pool', category: 'pool' },
];

const categories = ['All', 'Resort', 'Rooms', 'Garden', 'Pool', 'Dining'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? galleryImages
        : galleryImages.filter((img) => img.category.toLowerCase() === activeCategory.toLowerCase()),
    [activeCategory]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setLightboxIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length));
    },
    [filtered.length]
  );
  const showNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setLightboxIndex((i) => (i === null ? i : (i + 1) % filtered.length));
    },
    [filtered.length]
  );

  const lightboxImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <section id="gallery" className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="sunset-divider" />
            <span className="text-sunset-orange text-sm font-semibold tracking-widest uppercase">Visual Journey</span>
            <div className="sunset-divider" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark">
            Our <span className="sunset-gradient-text">Gallery</span>
          </h2>
          <p className="text-sunset-purple/65 mt-4 max-w-xl mx-auto">
            A glimpse into the world of NAGAS — where every corner is a frame-worthy moment.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 reveal">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setLightboxIndex(null);
              }}
              className={`btn-pill text-sm py-2 px-5 transition-all duration-300 ${
                activeCategory === cat
                  ? 'btn-sunset'
                  : 'bg-sunset-orange/5 text-sunset-purple border border-sunset-orange/20 hover:border-sunset-orange/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Editorial grid — deliberate, fixed placement rather than auto-flowing masonry */}
        <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[180px] sm:auto-rows-[220px] gap-4 reveal">
          {filtered.map((img, i) => {
            const isSignature = i === 0 && img.span === 'wide';
            const spanClasses =
              img.span === 'wide'
                ? 'col-span-2 row-span-1'
                : img.span === 'tall'
                ? 'col-span-1 row-span-2'
                : 'col-span-1 row-span-1';

            return (
              <button
                key={img.id}
                type="button"
                className={`relative overflow-hidden cursor-pointer group text-left shadow-card hover:shadow-card-hover transition-all duration-400 ${spanClasses} ${
                  isSignature ? 'rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-[56px]' : 'rounded-2xl'
                }`}
                onClick={() => setLightboxIndex(i)}
                aria-label={`Open ${img.alt} in lightbox`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-sunset-purple/70 via-sunset-purple/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end p-4">
                  <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                    <p className="text-white font-medium text-sm leading-tight">{img.alt}</p>
                    <p className="text-white/70 text-xs uppercase tracking-wide mt-0.5">{img.category}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm leading-none">⛶</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="lightbox-overlay"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-xl transition-all"
            aria-label="Close lightbox"
          >
            ✕
          </button>

          <button
            onClick={showPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg transition-all"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={showNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-lg transition-all"
            aria-label="Next image"
          >
            ›
          </button>

          <div
            className="relative w-full max-w-4xl max-h-[85vh] mx-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-[64px] overflow-hidden shadow-sunset-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain bg-sunset-dark"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-sunset-dark/80 to-transparent flex items-end justify-between gap-4">
              <div>
                <p className="text-white font-medium">{lightboxImage.alt}</p>
                <p className="text-white/60 text-sm capitalize">{lightboxImage.category}</p>
              </div>
              <p className="text-white/50 text-xs font-medium tabular-nums shrink-0">
                {(lightboxIndex ?? 0) + 1} / {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}