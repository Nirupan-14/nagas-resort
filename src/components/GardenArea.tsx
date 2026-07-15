'use client';

import Image from 'next/image';
import type { GardenFeature } from '@/types';

const features: GardenFeature[] = [
  {
    icon: '🌺',
    title: 'Botanical Trails',
    description: 'Wind through curated paths of exotic orchids, heliconia, and rare tropical specimens from across Southeast Asia.',
  },
  {
    icon: '🦋',
    title: 'Butterfly Sanctuary',
    description: 'A living garden dedicated to native butterfly species, fostering biodiversity and serene moments of wonder.',
  },
  {
    icon: '💧',
    title: 'Koi Ponds & Waterfalls',
    description: 'Cascading water features and tranquil koi ponds provide a meditative soundscape throughout the gardens.',
  },
  {
    icon: '🌿',
    title: 'Herb & Spice Garden',
    description: 'Our culinary garden supplies fresh aromatics and medicinal herbs directly to our restaurant kitchen daily.',
  },
];

export default function GardenArea() {
  return (
    <section id="garden" className="section-padding relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #FFF8F0 0%, #fff3e0 50%, #FFF8F0 100%)' }}>
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full border border-sunset-orange/10 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full border border-sunset-pink/10 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #FF6B35, transparent 50%), radial-gradient(circle at 80% 20%, #C1447E, transparent 50%)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="reveal">
            <div className="flex items-center gap-3 mb-4">
              <div className="sunset-divider" />
              <span className="text-sunset-orange text-sm font-semibold tracking-widest uppercase">Natural Paradise</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark">
              The Garden{' '}
              <span className="sunset-gradient-text">Experience</span>
            </h2>
          </div>
          <p className="text-sunset-purple/65 max-w-md leading-relaxed reveal">
            Six acres of meticulously maintained tropical gardens, where every path leads to a discovery and every corner holds a moment of pure serenity.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Images collage */}
          <div className="relative reveal-left">
            {/* Primary large image */}
            <div
              className="relative h-80 md:h-[480px] overflow-hidden shadow-sunset-lg"
              style={{ borderRadius: '45% 55% 50% 50% / 50% 45% 55% 50%' }}
            >
              <Image
                src="/images/garden.png"
                alt="NAGAS Resort tropical garden pathway"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(255, 193, 94, 0.15), transparent 60%)' }}
              />
            </div>

            {/* Overlapping secondary image */}
            <div
              className="absolute -bottom-8 -right-4 md:-right-8 w-40 md:w-56 h-32 md:h-44 overflow-hidden shadow-card-hover border-4 border-white"
              style={{ borderRadius: '40% 60% 55% 45% / 50% 40% 60% 50%' }}
            >
              <Image
                src="/images/pool.png"
                alt="Garden pool"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>

            {/* Floating stat */}
            <div className="absolute top-8 -right-4 bg-white rounded-2xl p-4 shadow-card-hover border border-sunset-gold/20 animate-float">
              <p className="text-2xl font-bold font-serif text-sunset-orange">6 Acres</p>
              <p className="text-xs text-sunset-purple font-medium">Tropical Gardens</p>
            </div>
          </div>

          {/* Features */}
          <div className="reveal-right">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, i) => (
                <div
                  key={feature.title}
                  className="resort-card p-5 group"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-serif text-lg font-bold text-sunset-dark mb-2 group-hover:text-sunset-orange transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sunset-purple/60 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <button className="btn-pill btn-sunset mt-8 inline-flex">
              🌿 Explore the Garden →
            </button>
          </div>
        </div>

        {/* Full-width panoramic banner */}
        <div
          className="relative h-64 md:h-80 overflow-hidden shadow-sunset reveal"
          style={{ borderRadius: '1.5rem' }}
        >
          <Image
            src="/images/garden.png"
            alt="NAGAS Resort garden panorama"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(90deg, rgba(106, 44, 92, 0.7), rgba(255, 107, 53, 0.4), rgba(106, 44, 92, 0.7))' }}
          >
            <div className="text-center text-white px-6">
              <p className="font-serif text-3xl md:text-4xl font-bold mb-3">
                &ldquo;Where nature is the luxury&rdquo;
              </p>
              <p className="text-white/75">— NAGAS Resort Philosophy</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
