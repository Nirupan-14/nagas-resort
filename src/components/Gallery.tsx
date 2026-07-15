'use client';

import { useState, useCallback } from 'react';
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
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  const filtered = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category.toLowerCase() === activeCategory.toLowerCase());

  const closeLightbox = useCallback(() => setLightbox(null), []);

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
              onClick={() => setActiveCategory(cat)}
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

        {/* Masonry/Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 reveal">
          {filtered.map((img) => (
            <div
              key={img.id}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group break-inside-avoid shadow-card hover:shadow-card-hover transition-all duration-400 ${
                img.span === 'wide' ? 'sm:aspect-video' : img.span === 'tall' ? 'aspect-[3/4]' : 'aspect-square'
              }`}
              onClick={() => setLightbox(img)}
            >
              <div className="relative w-full h-56 sm:h-auto" style={{ minHeight: img.span === 'tall' ? '320px' : '220px' }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-sunset-purple/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end p-4">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-white font-medium text-sm">{img.alt}</p>
                  <p className="text-white/70 text-xs capitalize">{img.category}</p>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⛶</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
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

          <div
            className="relative w-full max-w-4xl max-h-[85vh] mx-4 rounded-3xl overflow-hidden shadow-sunset-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-sunset-dark/80 to-transparent">
              <p className="text-white font-medium">{lightbox.alt}</p>
              <p className="text-white/60 text-sm capitalize">{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
