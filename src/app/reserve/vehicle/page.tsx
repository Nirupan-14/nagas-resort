'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const vehicles = [
  { name: 'Luxury Sedan', description: 'Perfect for airport transfers and intimate journeys.', image: '/images/hero.png', price: 60 },
  { name: 'Premium SUV', description: 'Spacious comfort for families and small groups.', image: '/images/pool.png', price: 95 },
  { name: 'Executive Minivan', description: 'Business travel with room for luggage and extra passengers.', image: '/images/room-suite.png', price: 140 },
  { name: 'Private Speedboat', description: 'Fast island transfers with a private seaside launch.', image: '/images/room-villa.png', price: 0 },
];

const currency = (value: number) =>
  value === 0
    ? 'Custom quote'
    : value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function VehicleReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    vehicleType: '',
    pickupDate: '',
    pickupTime: '',
    destination: '',
    passengers: '2',
    requests: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const selectedVehicle = vehicles.find((item) => item.name === formData.vehicleType);
  const selectedPrice = selectedVehicle?.price ?? 0;
  const totalEstimate = selectedPrice > 0 ? selectedPrice * Number(formData.passengers) : 0;

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
            <p className="text-sm uppercase tracking-[0.32em] text-sunset-orange font-semibold mb-3">Transfer booking</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark leading-tight">
              Private vehicle reservation, polished for every journey.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-sunset-purple/75">
              Reserve private transfers, island speedboat charters, and luxury ground transport with a dedicated booking page built for smooth travel planning.
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {vehicles.map((vehicle) => (
                <div key={vehicle.name} className="group relative overflow-hidden border-b border-sunset-gold/10 last:border-none sm:border-r sm:border-b-0">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/60 via-transparent to-transparent" />
                    <div className="absolute left-4 bottom-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sunset-dark shadow-sm">
                      {vehicle.price > 0 ? currency(vehicle.price) : 'Custom quote'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-semibold text-sunset-dark">{vehicle.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-sunset-purple/70">{vehicle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-sunset-gold/20 bg-white/95 p-8 shadow-card">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold">Reserve transport</p>
                <h2 className="mt-3 text-3xl font-serif font-bold text-sunset-dark">Vehicle booking form</h2>
              </div>
              <span className="rounded-full border border-sunset-orange/20 bg-sunset-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sunset-orange">
                Travel ready
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
                    placeholder="Jordan Lee"
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
                  <span className="mb-2 block font-semibold">Vehicle type</span>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.name} value={vehicle.name}>
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Passengers</span>
                  <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="form-input"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                      <option key={count} value={count}>{count} {count === 1 ? 'Passenger' : 'Passengers'}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Pickup date</span>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </label>
                <label className="block text-sm text-sunset-purple/80">
                  <span className="mb-2 block font-semibold">Pickup time</span>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </label>
              </div>

              <label className="block text-sm text-sunset-purple/80">
                <span className="mb-2 block font-semibold">Destination</span>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Resort, airport, private villa..."
                />
              </label>

              <label className="block text-sm text-sunset-purple/80">
                <span className="mb-2 block font-semibold">Special requests</span>
                <textarea
                  name="requests"
                  value={formData.requests}
                  onChange={handleChange}
                  rows={4}
                  className="form-input resize-none"
                  placeholder="Child seat, quiet ride, surprise arrangements..."
                />
              </label>

              <div className="rounded-[1.4rem] border border-sunset-gold/20 bg-sunset-cream/80 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-sunset-purple/60">Estimated transfer value</p>
                <p className="mt-2 text-2xl font-semibold text-sunset-dark">{selectedPrice > 0 ? currency(totalEstimate) : 'Custom quote'}</p>
                <p className="mt-2 text-sm text-sunset-purple/70">
                  {selectedVehicle ? `${selectedVehicle.name} × ${formData.passengers} ${Number(formData.passengers) === 1 ? 'passenger' : 'passengers'}` : 'Choose a vehicle to preview pricing.'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-sunset-dark px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sunset-orange"
              >
                Confirm transfer request
              </button>

              {submitted && (
                <div className="rounded-[1.4rem] border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700">
                  Your transfer reservation request has been received. We will confirm your vehicle shortly.
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
