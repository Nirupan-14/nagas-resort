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
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-sunset-cream text-sunset-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-10 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-sunset-gold/20 bg-white/80 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-sunset-dark transition hover:border-sunset-orange/40">
          ← Back to resort
        </Link>

        <div className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-sunset-gold/20 bg-white/90 shadow-card">
            <div className="relative h-56 sm:h-64 md:h-80 overflow-hidden">
              <Image
                src={selectedRoom.image}
                alt={selectedRoom.label}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/40 via-transparent to-transparent" />
            </div>

            <div className="p-5 sm:p-6 md:p-8">
              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold">Reservation</p>
              <h1 className="mt-2 sm:mt-3 font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-sunset-dark">
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

          <section className="rounded-[1.5rem] sm:rounded-[2rem] border border-sunset-gold/20 bg-white/90 p-5 sm:p-6 shadow-card md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold">Book now</p>
                <h2 className="mt-2 font-serif text-xl sm:text-2xl md:text-3xl font-bold text-sunset-dark">
                  Reserve your stay
                </h2>
              </div>
              <span className="self-start rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 shrink-0">
                Instant request
              </span>
            </div>

            <form className="mt-5 sm:mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="flex flex-col gap-1.5 sm:gap-2 text-sm text-sunset-purple/80">
                <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Full name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Your name"
                />
              </label>

              <label className="flex flex-col gap-1.5 sm:gap-2 text-sm text-sunset-purple/80">
                <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="you@example.com"
                />
              </label>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-1.5 sm:gap-2 text-sm text-sunset-purple/80">
                  <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Check in</span>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>

                <label className="flex flex-col gap-1.5 sm:gap-2 text-sm text-sunset-purple/80">
                  <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Check out</span>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-[0.7fr_1fr]">
                <label className="flex flex-col gap-1.5 sm:gap-2 text-sm text-sunset-purple/80">
                  <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Guests</span>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5 Guests</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 sm:gap-2 text-sm text-sunset-purple/80">
                  <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-sunset-purple/60">Special requests</span>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="form-input resize-none"
                    placeholder="Any details for your stay?"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 rounded-full px-6 py-3.5 sm:py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #C49A3C, #8B6914)' }}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="truncate">Reserving…</span>
                  </>
                ) : (
                  <span className="truncate">Reserve now</span>
                )}
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
