'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarX2, Loader2, Lock } from 'lucide-react';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';

const DEFAULT_VEHICLES = [
  { name: 'Luxury Sedan', description: 'Perfect for airport transfers and intimate journeys.', image: '/images/hero.png', price: 60 },
  { name: 'Premium SUV', description: 'Spacious comfort for families and small groups.', image: '/images/pool.png', price: 95 },
  { name: 'Executive Minivan', description: 'Business travel with room for luggage and extra passengers.', image: '/images/room-suite.png', price: 140 },
  { name: 'Private Speedboat', description: 'Fast island transfers with a private seaside launch.', image: '/images/room-villa.png', price: 0 },
];

const currency = (value: number) =>
  value === 0
    ? 'Custom quote'
    : value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const pad = (n: number) => String(n).padStart(2, '0');

const dateKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

interface VehicleOption {
  name: string;
  description: string;
  image: string;
  price: number;
}

interface PayPalButtonsInstance {
  render: (container: HTMLDivElement) => Promise<void>;
}

interface PayPalGlobal {
  paypal?: {
    Buttons: (config: {
      style?: Record<string, string | number | boolean>;
      createOrder?: () => Promise<string> | string;
      onApprove?: (data: { orderID: string }) => void | Promise<void>;
      onCancel?: () => void;
      onError?: () => void;
    }) => PayPalButtonsInstance;
  };
}

export default function VehicleReservationPage() {
  const [vehicles, setVehicles] = useState<VehicleOption[]>(DEFAULT_VEHICLES);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    pickupDate: '',
    pickupTime: '',
    destination: '',
    passengers: '2',
    requests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [paypalReady, setPaypalReady] = useState(false);
  const [dateConflict, setDateConflict] = useState(false);

  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const payloadRef = useRef<Record<string, unknown>>({});
  const bookedSetRef = useRef<Set<string>>(new Set());

  const buildPayload = useCallback(() => {
    return {
      kind: 'vehicle',
      vehicleType: formData.vehicleType,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      destination: formData.destination,
      passengers: Number(formData.passengers),
      guest: { name: formData.name.trim(), email: formData.email.trim(), phone: formData.phone.trim() },
      specialRequests: formData.requests.trim(),
    };
  }, [formData]);

  useEffect(() => {
    payloadRef.current = buildPayload();
  });

  useEffect(() => {
    bookedSetRef.current = new Set(bookedDates);
    if (formData.pickupDate && bookedDates.includes(formData.pickupDate)) {
      setDateConflict(true);
    } else {
      setDateConflict(false);
    }
  }, [bookedDates, formData.pickupDate]);

  const selectedVehicle = vehicles.find((item) => item.name === formData.vehicleType);
  const selectedPrice = selectedVehicle?.price ?? 0;
  const totalEstimate = selectedPrice > 0 ? selectedPrice * Number(formData.passengers) : 0;
  const payWithPaypal = paypalReady && selectedPrice > 0 && !dateConflict;

  useEffect(() => {
    let cancelled = false;
    fetch('/api/vehicles', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: Array<{ name?: string; description?: string; imageUrl?: string; image?: string; price?: number | string }>) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setVehicles(
            data.map((v) => ({
              name: v.name ?? 'Untitled Vehicle',
              description: v.description ?? '',
              image: v.imageUrl ?? v.image ?? '/images/hero.png',
              price: Number(v.price) || 0,
            }))
          );
        }
      })
      .catch(() => {
        // keep defaults if the fleet API is unreachable
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!formData.vehicleType) {
      setBookedDates([]);
      return;
    }
    let cancelled = false;
    setAvailabilityLoading(true);

    const from = dateKey(new Date());
    fetch(
      `/api/bookings/vehicle-availability?vehicleType=${encodeURIComponent(
        formData.vehicleType
      )}&from=${from}`
    )
      .then((res) => res.json())
      .then((data: { bookedDates?: string[] }) => {
        if (cancelled) return;
        setBookedDates(Array.isArray(data?.bookedDates) ? data.bookedDates : []);
        if (formData.pickupDate && (data?.bookedDates || []).includes(formData.pickupDate)) {
          setFormData((prev) => ({ ...prev, pickupDate: '' }));
        }
      })
      .catch(() => {
        if (!cancelled) setBookedDates([]);
      })
      .finally(() => {
        if (!cancelled) setAvailabilityLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [formData.vehicleType]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) return;
    const src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    if (document.querySelector(`script[src="${src}"]`)) {
      setPaypalReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => setPaypalReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!paypalReady || !formData.vehicleType || selectedPrice <= 0) return;
    const container = paypalContainerRef.current;
    if (!container) return;
    const win = window as unknown as PayPalGlobal;
    if (!win.paypal?.Buttons) return;

    container.innerHTML = '';
    win.paypal
      .Buttons({
        style: {
          layout: 'horizontal',
          color: 'gold',
          shape: 'pill',
          label: 'paypal',
          height: 46,
          tagline: false,
        },
        createOrder: async () => {
          const payload = payloadRef.current;
          if (bookedSetRef.current.has(String(payload.pickupDate))) {
            throw new Error('This date is already booked. Please pick another date.');
          }
          const res = await fetch('/api/payments/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload }),
          });
          const json = await res.json();
          if (!res.ok || !json.orderId) throw new Error(json?.error || 'Unable to start checkout.');
          return json.orderId;
        },
        onApprove: async (data: { orderID: string }) => {
          setSubmitting(true);
          setSubmitError('');
          try {
            const res = await fetch('/api/payments/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId: data.orderID, booking: payloadRef.current }),
            });
            const json = await res.json();
            if (!res.ok || !json.booking) throw new Error(json?.error || 'Payment could not be confirmed.');
            setBookingRef(json.booking.bookingRef);
            setFormData((prev) => ({ ...prev, pickupDate: '', pickupTime: '', vehicleType: '' }));
          } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Payment could not be confirmed.');
          } finally {
            setSubmitting(false);
          }
        },
        onCancel: () => {
          setSubmitError('Payment was cancelled. You have not been charged.');
        },
        onError: () => {
          setSubmitError('PayPal checkout failed. Please try again.');
        },
      })
      .render(container);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [paypalReady, formData.vehicleType, selectedPrice]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDirectRequest = async () => {
    if (dateConflict) {
      setSubmitError('This date is already booked. Please choose an available date from the calendar.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadRef.current),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Booking failed. Please try again.');
      setBookingRef(json.booking.bookingRef);
      setFormData((prev) => ({ ...prev, pickupDate: '', pickupTime: '' }));
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-sunset-cream text-sunset-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-10 lg:px-8">
        <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-[0.32em] text-sunset-orange font-semibold mb-3">Transfer booking</p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-sunset-dark leading-tight">
              Private vehicle reservation, polished for every journey.
            </h1>
            <p className="mt-4 sm:mt-5 max-w-2xl text-xs sm:text-sm leading-relaxed text-sunset-purple/75">
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
          <section className="rounded-[1.5rem] sm:rounded-[2rem] border border-sunset-gold/20 bg-white/90 shadow-card overflow-hidden">
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

          <section className="rounded-[1.5rem] sm:rounded-[2rem] border border-sunset-gold/20 bg-white/95 p-5 sm:p-8 shadow-card">
            <div className="flex items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold">Reserve transport</p>
                <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-serif font-bold text-sunset-dark">Vehicle booking form</h2>
              </div>
              <span className="hidden sm:inline-flex rounded-full border border-sunset-orange/20 bg-sunset-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sunset-orange shrink-0">
                Travel ready
              </span>
            </div>

            <div className="space-y-5">
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
                  <span className="mb-2 block font-semibold">Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="+1 555 000 1234"
                  />
                </label>
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

              <label className="block text-sm text-sunset-purple/80">
                <span className="mb-2 block font-semibold">
                  Pickup date
                  {availabilityLoading ? (
                    <Loader2 className="ml-2 inline h-3.5 w-3.5 animate-spin text-sunset-orange" />
                  ) : null}
                </span>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                  min={dateKey(new Date())}
                />
              </label>

              {formData.vehicleType ? (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-sunset-purple/60">
                    Availability for {formData.vehicleType}
                  </p>
                  <AvailabilityCalendar
                    bookedDates={bookedDates}
                    value={formData.pickupDate}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, pickupDate: date }))}
                  />
                </div>
              ) : (
                <div className="rounded-[1.25rem] border border-sunset-gold/15 bg-sunset-cream/70 p-4 text-sm text-sunset-purple/60">
                  Select a vehicle above to see which dates are available.
                </div>
              )}

              {dateConflict ? (
                <div className="flex items-start gap-2.5 rounded-[1.25rem] border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-600">
                  <CalendarX2 className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    This vehicle is already booked on <strong>{formData.pickupDate}</strong>.
                    Please choose an available date from the calendar.
                  </span>
                </div>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2">
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
              </div>

              <label className="block text-sm text-sunset-purple/80">
                <span className="mb-2 block font-semibold">Special requests</span>
                <textarea
                  name="requests"
                  value={formData.requests}
                  onChange={handleChange}
                  rows={3}
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

              {bookingRef ? (
                <div className="flex items-start gap-2.5 rounded-[1.4rem] border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm text-emerald-700">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Your vehicle reservation is confirmed! Booking reference: <strong>{bookingRef}</strong>. A confirmation will be sent to your email.
                  </span>
                </div>
              ) : submitError ? (
                <div className="rounded-[1.4rem] border border-rose-500/25 bg-rose-500/10 p-4 text-sm text-rose-600">{submitError}</div>
              ) : null}

              {payWithPaypal ? (
                <div>
                  <div
                    ref={paypalContainerRef}
                    className="min-h-[46px]"
                    aria-label="PayPal checkout"
                  />
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-sunset-purple/60">
                    <Lock className="h-3 w-3" /> Secure payment via PayPal · You will be redirected to complete payment.
                  </p>
                </div>
              ) : formData.vehicleType && selectedPrice === 0 ? (
                <button
                  type="button"
                  onClick={handleDirectRequest}
                  disabled={submitting || !formData.pickupDate || dateConflict}
                  className="w-full rounded-full px-6 py-3.5 sm:py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sunset-orange inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: '#1B2A4A' }}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Request custom quote'
                  )}
                </button>
              ) : formData.vehicleType ? (
                <button
                  type="button"
                  onClick={handleDirectRequest}
                  disabled={submitting || !formData.pickupDate || dateConflict}
                  className="w-full rounded-full px-6 py-3.5 sm:py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sunset-orange inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: '#1B2A4A' }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="truncate">Booking…</span>
                    </>
                  ) : (
                    <span className="truncate">Request booking (pay at pickup)</span>
                  )}
                </button>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}