'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getRoomOption } from '@/data/rooms';

export default function ReservePage() {
  const params = useParams<{ room?: string }>();
  const roomSlug = Array.isArray(params?.room) ? params.room[0] : params?.room;
  const selectedRoom = getRoomOption(roomSlug ?? '');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: '2026-08-10',
    checkOut: '2026-08-14',
    guests: '2',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-sunset-cream text-sunset-dark">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-sunset-gold/20 bg-white/80 px-4 py-2 text-sm font-semibold text-sunset-dark transition hover:border-sunset-orange/40">
          ← Back to resort
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="overflow-hidden rounded-[2rem] border border-sunset-gold/20 bg-white/90 shadow-card">
            <div className="relative h-80 overflow-hidden">
              <Image
                src={selectedRoom.image}
                alt={selectedRoom.label}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/40 via-transparent to-transparent" />
            </div>

            <div className="p-6 md:p-8">
              <p className="text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold">Reservation</p>
              <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold leading-tight text-sunset-dark">
                {selectedRoom.label}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-sunset-purple/70">
                {selectedRoom.description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.2rem] border border-sunset-gold/20 bg-sunset-cream/70 p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-sunset-purple/60">Availability</p>
                  <p className="mt-2 font-semibold text-sunset-dark">{selectedRoom.availability}</p>
                </div>
                <div className="rounded-[1.2rem] border border-sunset-gold/20 bg-sunset-cream/70 p-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-sunset-purple/60">Stay note</p>
                  <p className="mt-2 text-sm text-sunset-purple/70">{selectedRoom.note}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-sunset-gold/20 bg-white/90 p-6 shadow-card md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold">Book now</p>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl font-bold text-sunset-dark">
                  Reserve your stay
                </h2>
              </div>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Instant request
              </span>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-2 text-sm text-sunset-purple/80">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Full name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/80 px-4 py-3 text-sm text-sunset-dark outline-none focus:border-sunset-orange"
                  placeholder="Your name"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-sunset-purple/80">
                <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/80 px-4 py-3 text-sm text-sunset-dark outline-none focus:border-sunset-orange"
                  placeholder="you@example.com"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-sunset-purple/80">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Check in</span>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/80 px-4 py-3 text-sm text-sunset-dark outline-none focus:border-sunset-orange"
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-sunset-purple/80">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Check out</span>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/80 px-4 py-3 text-sm text-sunset-dark outline-none focus:border-sunset-orange"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-[0.7fr_1fr]">
                <label className="flex flex-col gap-2 text-sm text-sunset-purple/80">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Guests</span>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/80 px-4 py-3 text-sm text-sunset-dark outline-none focus:border-sunset-orange"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-sunset-purple/80">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Special requests</span>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/80 px-4 py-3 text-sm text-sunset-dark outline-none focus:border-sunset-orange"
                    placeholder="Any details for your stay?"
                  />
                </label>
              </div>

              <button type="submit" className="btn-pill btn-sunset px-5 py-3 text-sm">
                Reserve now
              </button>

              {submitted && (
                <div className="rounded-[1.2rem] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700">
                  Your reservation request for {selectedRoom.label} has been prepared. We will contact you shortly.
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
