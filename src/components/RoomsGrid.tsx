'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { roomOptions } from '@/data/rooms';

interface PropertyCard {
  id: string;
  title: string;
  description: string;
  image: string;
  percentage: string;
  caption: string;
  roomSlug: string;
}

const properties: PropertyCard[] = [
  {
    id: 'room-01',
    title: 'Lagoon Villa Retreat',
    description: 'A lush waterfront escape with soft natural light and calm, sustainable luxury.',
    image: '/images/room-villa.png',
    percentage: '60%',
    caption: 'Sustainability',
    roomSlug: 'lagoon-villa',
  },
  {
    id: 'room-02',
    title: 'Ocean Edge Pavilion',
    description: 'A modern seaside home with inviting decks, striking views, and thoughtful eco design.',
    image: '/images/pool.png',
    percentage: '210%',
    caption: 'Sustainability',
    roomSlug: 'ocean-pavilion',
  },
  {
    id: 'room-03',
    title: 'Garden House Escape',
    description: 'Serene botanical living with warm textures, generous light, and lush private gardens.',
    image: '/images/garden.png',
    percentage: '310%',
    caption: 'Sustainability',
    roomSlug: 'garden-suite',
  },
  {
    id: 'property-04',
    title: 'Royal Residence Suite',
    description: 'A refined residence that pairs open-air dining with elegant sustainable finishes.',
    image: '/images/dining.png',
    percentage: '510%',
    caption: 'Sustainability',
    roomSlug: 'royal-suite',
  },
  {
    id: 'room-05',
    title: 'Sunset Terrace House',
    description: 'A bright coastal haven framed by golden sunsets and premium, natural materials.',
    image: '/images/hero.png',
    percentage: '170%',
    caption: 'Sustainability',
    roomSlug: 'lagoon-villa',
  },
  {
    id: 'room-06',
    title: 'Poolside Luxe Residence',
    description: 'A seamless indoor-outdoor sanctuary built around light, water, and calm evenings.',
    image: '/images/room-suite.png',
    percentage: '420%',
    caption: 'Sustainability',
    roomSlug: 'ocean-pavilion',
  },
];

function RoomCard({ property, onSelect }: { property: PropertyCard; onSelect: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className="group flex flex-col overflow-hidden rounded-[2rem] border border-sunset-gold/20 bg-sunset-cream/80 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover cursor-pointer"
    >
      <div className="relative h-80 overflow-hidden transition-all duration-500">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/50 via-transparent to-transparent" />
        <div className="absolute left-4 bottom-4 rounded-full bg-white/90 px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-sunset-dark shadow-sm">
          {property.percentage}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 gap-5">
        <div>
          <span className="inline-flex rounded-full border border-sunset-dark/15 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sunset-dark">
            Luxury stay
          </span>
          <h3 className="mt-4 font-serif text-2xl font-bold text-sunset-dark leading-tight">
            {property.title}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-sunset-purple/70">
            {property.description}
          </p>
        </div>

        <div className="mt-auto flex flex-col gap-4">
          <div className="rounded-[1.4rem] border border-sunset-gold/20 bg-white/70 px-4 py-3 text-sm text-sunset-dark">
            <p className="font-semibold">{property.caption}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-sunset-purple/60">Sustainable comfort</p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
            className="inline-flex w-full justify-center rounded-full bg-sunset-dark px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sunset-orange"
          >
            Reserve now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RoomsGrid() {
  const router = useRouter();

  const handleSelectRoom = (property: PropertyCard) => {
    router.push(`/reserve/${property.roomSlug}`);
  };

  return (
    <section id="rooms" className="section-padding bg-sunset-cream relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-24 h-72 opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(196,154,60,0.35), transparent 55%)' }}
      />

      <div className="max-w-7xl mx-auto relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between mb-10">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.32em] text-sunset-orange font-semibold mb-3">Our Properties</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark leading-tight">
              Explore rooms first, then book the one that feels right.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-sunset-purple/70">
            Choose a room card to preview its details, then move into the booking form below for your preferred dates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <RoomCard key={property.id} property={property} onSelect={() => handleSelectRoom(property)} />
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-sunset-gold/20 bg-white/85 p-6 shadow-card backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold mb-2">Reserve your stay</p>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-sunset-dark leading-tight">
                Choose a room and continue to a dedicated reservation page.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-sunset-purple/70">
                Each room card now opens a full booking experience where you can review the room and submit your request.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push(`/reserve/${roomOptions[0].value}`)}
              className="btn-pill btn-sunset h-fit self-start text-sm"
            >
              Start reservation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
