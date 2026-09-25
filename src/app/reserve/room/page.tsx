'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RoomBookingSection from '@/components/RoomBookingSection';

const DEFAULT_ROOMS = [
  { type: 'Lagoon Villa Retreat', description: 'A lush waterfront escape with soft natural light and calm, sustainable luxury.', image: '/images/room-villa.png', price: 420, roomNo: '' },
  { type: 'Ocean Edge Pavilion', description: 'A modern seaside home with inviting decks, striking views, and thoughtful eco design.', image: '/images/pool.png', price: 360, roomNo: '' },
  { type: 'Garden House Escape', description: 'Serene botanical living with warm textures, generous light, and lush private gardens.', image: '/images/garden.png', price: 260, roomNo: '' },
  { type: 'Royal Residence Suite', description: 'A refined residence that pairs open-air living with elegant sustainable finishes.', image: '/images/dining.png', price: 540, roomNo: '' },
];

const currency = (value: number) =>
  value === 0
    ? 'Custom quote'
    : value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function RoomReservationPage() {
  const [rooms, setRooms] = useState(DEFAULT_ROOMS);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/rooms', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: any[]) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setRooms(
            data.map((r) => ({
              type: r.type ?? 'Luxury Room',
              description: r.description ?? '',
              image: r.imageUrls?.[0] ?? '/images/room-villa.png',
              price: Number(r.price) || 0,
              roomNo: r.roomNo ?? '',
            }))
          );
        }
      })
      .catch(() => {
        // keep default rooms if the rooms API is unreachable
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-sunset-cream text-sunset-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-10 lg:px-8">
        <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-sunset-orange font-semibold mb-3">Room reservation</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-sunset-dark leading-tight">
              Every stay begins with the right room.
            </h1>
            <p className="mt-4 sm:mt-5 max-w-2xl text-xs sm:text-sm leading-relaxed text-sunset-purple/75">
              Browse the rooms below, pick the one that feels right, then lock in your day and start time
              through the live-availability calendar.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-sunset-gold/20 bg-white/90 px-5 py-3 text-sm font-semibold text-sunset-dark transition hover:border-sunset-orange"
          >
            Back to resort
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[1.5rem] sm:rounded-[2rem] border border-sunset-gold/20 bg-white/90 shadow-card overflow-hidden">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {rooms.map((room) => (
                <div key={room.type} className="group relative overflow-hidden border-b border-sunset-gold/10 last:border-none sm:border-r sm:border-b-0">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={room.image}
                      alt={room.type}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/60 via-transparent to-transparent" />
                    <div className="absolute left-4 bottom-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sunset-dark shadow-sm">
                      {room.price > 0 ? `${currency(room.price)}/night` : 'Custom quote'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-sunset-dark">{room.type}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-sunset-purple/60">
                      {room.roomNo ? `Room No. ${room.roomNo}` : 'Resort stay'}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-sunset-purple/70">{room.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <RoomBookingSection rooms={rooms} />
        </div>
      </div>
    </main>
  );
}