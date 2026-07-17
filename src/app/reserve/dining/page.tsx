'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const diningPackages = [
  { value: 'sunset-dinner', label: 'Sunset Dinner', description: 'A romantic oceanfront dinner with signature cocktails.', price: 95 },
  { value: 'chefs-table', label: "Chef's Table Experience", description: 'A personalized tasting menu curated by our executive chef.', price: 165 },
  { value: 'poolside-brunch', label: 'Poolside Brunch', description: 'A leisurely brunch served by the pool with fresh tropical flavors.', price: 75 },
  { value: 'traditional-feast', label: 'Traditional Feast Night', description: 'A cultural dining event with local specialties and live music.', price: 110 },
];

const currency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function DiningReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    package: '',
    people: '2',
    seating: 'ocean-view',
    requests: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const selectedPackage = diningPackages.find((pkg) => pkg.value === formData.package);
  const total = selectedPackage ? selectedPackage.price * Number(formData.people) : 0;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-sunset-orange font-semibold mb-3">Dining Reservation</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark leading-tight">
              Secure your table in our signature dining venue.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-sunset-purple/75">
              Experience handcrafted menus, elegant service, and unforgettable ambiance with a dedicated dining reservation page built for a refined guest journey.
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
          <section className="rounded-[2rem] border border-sunset-gold/20 bg-white/90 shadow-card overflow-hidden">
            <div className="relative h-96 overflow-hidden">
              <Image
                src="/images/dining.png"
                alt="Fine dining experience"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/70 via-transparent to-transparent" />
              <div className="absolute left-6 bottom-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-sunset-dark shadow-sm">
                Private dining experience
              </div>
            </div>

            <div className="p-8">
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-sunset-orange font-semibold">Designed for discerning guests</span>
                <h2 className="font-serif text-3xl font-bold text-sunset-dark">Fine dining, personalized to your taste.</h2>
                <p className="text-sm leading-relaxed text-sunset-purple/75">
                  Choose your dining package, reserve the perfect seating, and let our culinary team prepare a seamless meal experience.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {diningPackages.slice(0, 2).map((pkg) => (
                  <div key={pkg.value} className="rounded-[1.4rem] border border-sunset-gold/15 bg-sunset-cream/80 p-4">
                    <p className="text-sm font-semibold text-sunset-dark">{pkg.label}</p>
                    <p className="mt-2 text-xs text-sunset-purple/65">{pkg.description}</p>
                    <p className="mt-4 font-semibold text-sunset-orange">{currency(pkg.price)}/person</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-sunset-gold/20 bg-white/95 p-8 shadow-card">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold">Reserve a table</p>
                <h2 className="mt-3 text-3xl font-serif font-bold text-sunset-dark">Dining reservation form</h2>
              </div>
              <span className="rounded-full border border-sunset-orange/20 bg-sunset-orange/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-sunset-orange font-semibold">
                Book now
              </span>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Full name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Alex Morgan"
                  />
                </label>
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Email address</span>
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
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Date</span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </label>
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Time</span>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Dining package</span>
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select a package</option>
                    {diningPackages.map((pkg) => (
                      <option key={pkg.value} value={pkg.value}>
                        {pkg.label} — {currency(pkg.price)}/person
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Guests</span>
                  <select
                    name="people"
                    value={formData.people}
                    onChange={handleChange}
                    className="form-input"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((count) => (
                      <option key={count} value={count}>{count} {count === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Seating preference</span>
                  <select
                    name="seating"
                    value={formData.seating}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="ocean-view">Ocean view terrace</option>
                    <option value="private-room">Private dining room</option>
                    <option value="garden-pavilion">Garden pavilion</option>
                  </select>
                </label>
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Special requests</span>
                  <textarea
                    name="requests"
                    value={formData.requests}
                    onChange={handleChange}
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Anniversary setup, menu preferences, cake request..."
                  />
                </label>
              </div>

              <div className="rounded-[1.4rem] border border-sunset-gold/20 bg-sunset-cream/80 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-sunset-purple/60">Estimated booking value</p>
                <p className="mt-2 text-2xl font-semibold text-sunset-dark">{selectedPackage ? currency(total) : '$0'}</p>
                <p className="mt-2 text-sm text-sunset-purple/70">
                  {selectedPackage ? `${selectedPackage.label} × ${formData.people} ${Number(formData.people) === 1 ? 'guest' : 'guests'}` : 'Pick a package to preview total.'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-sunset-dark px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sunset-orange"
              >
                Confirm dining reservation
              </button>

              {submitted && (
                <div className="rounded-[1.4rem] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700">
                  Your dining reservation request has been received. We will confirm your table shortly.
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
