'use client';

import RoomCard from './RoomCard';
import type { Room } from '@/types';

const rooms: Room[] = [
  {
    id: 'garden-suite',
    name: 'Garden Suite',
    description: 'Immerse yourself in tropical serenity with floor-to-ceiling windows overlooking our lush botanical garden. A sanctuary of calm and luxury.',
    image: '/images/room-suite.png',
    stat: '98%',
    statLabel: 'Guest Satisfaction Rating',
    price: 'From $320/night',
    size: '65 m²',
    capacity: 2,
  },
  {
    id: 'sunset-villa',
    name: 'Sunset Pool Villa',
    description: 'Your private tropical paradise. A standalone villa with a plunge pool, open-air living, and breathtaking ocean views bathed in eternal golden light.',
    image: '/images/room-villa.png',
    stat: '210%',
    statLabel: 'Return Guest Rate',
    price: 'From $780/night',
    size: '180 m²',
    capacity: 4,
  },
  {
    id: 'ocean-bungalow',
    name: 'Ocean Bungalow',
    description: 'Step off your deck directly into warm turquoise waters. This beachfront bungalow offers unrivalled access to nature with world-class amenities.',
    image: '/images/pool.png',
    stat: '310%',
    statLabel: 'Booking Demand vs. Avg.',
    price: 'From $520/night',
    size: '95 m²',
    capacity: 2,
  },
  {
    id: 'royal-penthouse',
    name: 'Royal Penthouse',
    description: 'The pinnacle of luxury at NAGAS. A rooftop sanctuary with a private pool, dedicated butler service, and a 360° panoramic view of the resort and ocean.',
    image: '/images/dining.png',
    stat: '510%',
    statLabel: 'Premium Experience Score',
    price: 'From $1,200/night',
    size: '320 m²',
    capacity: 6,
  },
];

export default function RoomsGrid() {
  return (
    <section id="rooms" className="section-padding bg-sunset-cream relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div
        className="absolute top-1/2 right-0 w-80 h-80 -translate-y-1/2 translate-x-1/3 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C1447E, transparent)', borderRadius: '60% 40% 50% 50%' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="reveal">
            <div className="flex items-center gap-3 mb-4">
              <div className="sunset-divider" />
              <span className="text-sunset-orange text-sm font-semibold tracking-widest uppercase">Accommodations</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark leading-tight">
              Our Rooms &{' '}
              <span className="sunset-gradient-text">Villas</span>
            </h2>
          </div>

          <div className="flex flex-col md:items-end gap-4 reveal">
            <p className="text-sunset-purple/65 max-w-sm text-sm leading-relaxed">
              Each space is thoughtfully designed to blend natural beauty with curated luxury — where every detail tells a story.
            </p>
            <button className="btn-pill btn-outline self-start md:self-auto text-sm py-2.5 px-5">
              View All Rooms →
            </button>
          </div>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

          {/* Card 1 — Large (spans 7 cols) */}
          <div className="lg:col-span-7 reveal">
            <div className="resort-card overflow-hidden group flex flex-col md:flex-row h-full">
              {/* Image */}
              <div className="relative overflow-hidden md:w-1/2 h-56 md:h-auto">
                <img
                  src={rooms[0].image}
                  alt={rooms[0].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-white/95 rounded-full px-3 py-1.5 shadow-card">
                  <span className="text-sunset-orange font-bold text-sm">{rooms[0].price}</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col justify-between md:w-1/2">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-sunset-dark mb-2 group-hover:text-sunset-orange transition-colors">
                    {rooms[0].name}
                  </h3>
                  <p className="text-sunset-purple/65 text-sm leading-relaxed mb-4">{rooms[0].description}</p>
                </div>
                <div>
                  <div className="stat-badge mb-4">
                    <span className="font-serif text-3xl font-bold sunset-gradient-text">{rooms[0].stat}</span>
                    <p className="text-xs text-sunset-purple/70 font-semibold mt-0.5">{rooms[0].statLabel}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-sunset-purple/50">
                      <span>📐 {rooms[0].size}</span>
                      <span>👥 {rooms[0].capacity} guests</span>
                    </div>
                    <button className="btn-pill btn-sunset text-xs py-2 px-4">Book</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Small (spans 5 cols) */}
          <div className="lg:col-span-5 reveal animation-delay-100">
            <RoomCard room={rooms[1]} variant="large" />
          </div>

          {/* Card 3 — Small (spans 5 cols) */}
          <div className="lg:col-span-5 reveal animation-delay-200">
            <RoomCard room={rooms[2]} variant="small" />
          </div>

          {/* Card 4 — Large (spans 7 cols) */}
          <div className="lg:col-span-7 reveal animation-delay-300">
            <div className="resort-card overflow-hidden group flex flex-col md:flex-row-reverse h-full">
              {/* Image */}
              <div className="relative overflow-hidden md:w-1/2 h-56 md:h-auto">
                <img
                  src={rooms[3].image}
                  alt={rooms[3].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/95 rounded-full px-3 py-1.5 shadow-card">
                  <span className="text-sunset-orange font-bold text-sm">{rooms[3].price}</span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col justify-between md:w-1/2">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-sunset-dark mb-2 group-hover:text-sunset-orange transition-colors">
                    {rooms[3].name}
                  </h3>
                  <p className="text-sunset-purple/65 text-sm leading-relaxed mb-4">{rooms[3].description}</p>
                </div>
                <div>
                  <div className="stat-badge mb-4">
                    <span className="font-serif text-3xl font-bold sunset-gradient-text">{rooms[3].stat}</span>
                    <p className="text-xs text-sunset-purple/70 font-semibold mt-0.5">{rooms[3].statLabel}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-sunset-purple/50">
                      <span>📐 {rooms[3].size}</span>
                      <span>👥 {rooms[3].capacity} guests</span>
                    </div>
                    <button className="btn-pill btn-sunset text-xs py-2 px-4">Book</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
