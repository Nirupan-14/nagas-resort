'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { RoomBookingForm, FoodBookingForm, VehicleBookingForm, BookingTab } from '@/types';

const initialRoomForm: RoomBookingForm = {
  checkIn: '',
  checkOut: '',
  roomType: '',
  guests: 1,
  specialRequests: '',
};

const initialFoodForm: FoodBookingForm = {
  date: '',
  time: '',
  package: '',
  people: 2,
  dietaryNotes: '',
};

const initialVehicleForm: VehicleBookingForm = {
  vehicleType: '',
  pickupDate: '',
  pickupTime: '',
  destination: '',
  passengers: 1,
};

const tabs: { id: BookingTab; label: string; icon: string }[] = [
  { id: 'room', label: 'Room Booking', icon: '🏨' },
  { id: 'food', label: 'Dining Reservation', icon: '🍽️' },
  { id: 'vehicle', label: 'Vehicle & Transfer', icon: '🚗' },
];

const experienceCards = [
  {
    href: '/reserve/dining',
    image: '/images/dining.png',
    title: 'Dining reservation',
    eyebrow: 'Signature dining',
    description: 'Reserve a refined culinary experience with tasting menus, sunset dinners, and private table settings.',
    badge: 'New page',
  },
  {
    href: '/reserve/vehicle',
    image: '/images/hero.png',
    title: 'Transfer booking',
    eyebrow: 'Luxury arrivals',
    description: 'Arrange seamless airport pickup, private transfers, and island travel with premium comfort.',
    badge: 'New page',
  },
];

// ---- Pricing tables (kept in one place so totals stay in sync with the <option> labels) ----
const ROOM_PRICES: Record<string, { label: string; price: number }> = {
  'garden-suite': { label: 'Garden Suite', price: 320 },
  'sunset-villa': { label: 'Sunset Pool Villa', price: 780 },
  'ocean-bungalow': { label: 'Ocean Bungalow', price: 520 },
  'royal-penthouse': { label: 'Royal Penthouse', price: 1200 },
};

const FOOD_PACKAGES: Record<string, { label: string; price: number }> = {
  'sunset-dinner': { label: 'Sunset Dinner', price: 85 },
  'beach-breakfast': { label: 'Beach Breakfast', price: 45 },
  'chefs-table': { label: "Chef's Table Experience", price: 150 },
  'poolside-brunch': { label: 'Poolside Brunch', price: 65 },
  'traditional-feast': { label: 'Traditional Feast Night', price: 95 },
};

const VEHICLE_PRICES: Record<string, { label: string; price: number | null }> = {
  sedan: { label: 'Luxury Sedan', price: 60 },
  suv: { label: 'Premium SUV', price: 95 },
  minivan: { label: 'Executive Minivan', price: 140 },
  speedboat: { label: 'Private Speedboat', price: null },
  helicopter: { label: 'Helicopter Charter', price: null },
};

const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const nightsBetween = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;
  const inD = new Date(checkIn);
  const outD = new Date(checkOut);
  const diff = Math.round((outD.getTime() - inD.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

type FieldErrors = Record<string, string>;

export default function Booking() {
  const [activeTab, setActiveTab] = useState<BookingTab>('room');
  const [roomForm, setRoomForm] = useState<RoomBookingForm>(initialRoomForm);
  const [foodForm, setFoodForm] = useState<FoodBookingForm>(initialFoodForm);
  const [vehicleForm, setVehicleForm] = useState<VehicleBookingForm>(initialVehicleForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoomForm(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFoodForm(prev => ({ ...prev, [name]: name === 'people' ? Number(value) : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleForm(prev => ({ ...prev, [name]: name === 'passengers' ? Number(value) : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ---- Live summary math ----
  const nights = useMemo(() => nightsBetween(roomForm.checkIn, roomForm.checkOut), [roomForm.checkIn, roomForm.checkOut]);
  const roomTotal = useMemo(() => {
    const rate = ROOM_PRICES[roomForm.roomType]?.price ?? 0;
    return rate * (nights || 0);
  }, [roomForm.roomType, nights]);

  const foodTotal = useMemo(() => {
    const rate = FOOD_PACKAGES[foodForm.package]?.price ?? 0;
    return rate * (foodForm.people || 0);
  }, [foodForm.package, foodForm.people]);

  const vehicleRate = VEHICLE_PRICES[vehicleForm.vehicleType]?.price ?? null;

  const summary = useMemo(() => {
    if (activeTab === 'room') {
      return {
        title: roomForm.roomType ? ROOM_PRICES[roomForm.roomType]?.label : 'Choose a room',
        lines: [
          nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : 'Select your dates',
          `${roomForm.guests} guest${roomForm.guests > 1 ? 's' : ''}`,
        ],
        total: roomTotal > 0 ? currency(roomTotal) : '—',
        note: roomForm.roomType && nights > 0 ? `${currency(ROOM_PRICES[roomForm.roomType].price)} × ${nights} night${nights > 1 ? 's' : ''}` : null,
      };
    }
    if (activeTab === 'food') {
      return {
        title: foodForm.package ? FOOD_PACKAGES[foodForm.package]?.label : 'Choose a package',
        lines: [
          foodForm.date && foodForm.time ? `${foodForm.date} at ${foodForm.time}` : 'Select date & time',
          `${foodForm.people} guest${foodForm.people > 1 ? 's' : ''}`,
        ],
        total: foodTotal > 0 ? currency(foodTotal) : '—',
        note: foodForm.package ? `${currency(FOOD_PACKAGES[foodForm.package].price)} × ${foodForm.people}` : null,
      };
    }
    return {
      title: vehicleForm.vehicleType ? VEHICLE_PRICES[vehicleForm.vehicleType]?.label : 'Choose a vehicle',
      lines: [
        vehicleForm.pickupDate && vehicleForm.pickupTime ? `${vehicleForm.pickupDate} at ${vehicleForm.pickupTime}` : 'Select pickup date & time',
        vehicleForm.destination ? `To ${vehicleForm.destination}` : 'Destination not set',
      ],
      total: vehicleRate !== null ? currency(vehicleRate) : vehicleForm.vehicleType ? 'Custom quote' : '—',
      note: null,
    };
  }, [activeTab, roomForm, foodForm, vehicleForm, nights, roomTotal, foodTotal, vehicleRate]);

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (activeTab === 'room') {
      if (!roomForm.checkIn) next.checkIn = 'Required';
      if (!roomForm.checkOut) next.checkOut = 'Required';
      if (roomForm.checkIn && roomForm.checkOut && nights <= 0) next.checkOut = 'Must be after check-in';
      if (!roomForm.roomType) next.roomType = 'Please select a room';
    } else if (activeTab === 'food') {
      if (!foodForm.date) next.date = 'Required';
      if (!foodForm.time) next.time = 'Required';
      if (!foodForm.package) next.package = 'Please select a package';
    } else {
      if (!vehicleForm.vehicleType) next.vehicleType = 'Please select a vehicle';
      if (!vehicleForm.pickupDate) next.pickupDate = 'Required';
      if (!vehicleForm.pickupTime) next.pickupTime = 'Required';
      if (!vehicleForm.destination.trim()) next.destination = 'Required';
    }
    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus('submitting');
    // Simulated network round-trip — swap for a real API call.
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3500);
    }, 900);
  };

  const switchTab = (tab: BookingTab) => {
    setActiveTab(tab);
    setErrors({});
  };

  const errClass = (field: string) => (errors[field] ? 'ring-2 ring-red-400 border-red-400' : '');

  return (
    <section
      id="booking"
      className="section-padding relative overflow-hidden scroll-mt-28"
      style={{ background: 'linear-gradient(160deg, #6A2C5C 0%, #C1447E 40%, #FF6B35 80%, #FFC15E 100%)' }}
    >
      {/* Decorative orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 opacity-10 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 opacity-10 translate-x-1/2 translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, #FFC15E, transparent)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-white/40" />
            <span className="text-white/85 text-sm font-semibold tracking-widest uppercase">Reservations</span>
            <div className="h-px w-12 bg-white/40" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.25)]">
            Book Your <span style={{ color: '#FFC15E' }}>Experience</span>
          </h2>
          <p className="text-white/90 mt-4 max-w-2xl mx-auto text-base leading-relaxed">
            Plan your perfect escape — from accommodations to dining and private transfers, we handle every detail with refined care.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          {experienceCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group overflow-hidden rounded-4xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-sunset-orange/40 hover:bg-white/20"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-sunset-dark/85 via-sunset-dark/20 to-transparent" />
                <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur">
                  {card.badge}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[0.7rem] uppercase tracking-[0.3em] text-sunset-gold">{card.eyebrow}</p>
                  <h3 className="mt-2 font-serif text-2xl font-bold text-white">{card.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm leading-relaxed text-white/80">{card.description}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sunset-orange">
                  Open booking page
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1.5 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 reveal">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`booking-tab-${tab.id}`}
              type="button"
              onClick={() => switchTab(tab.id)}
              aria-selected={activeTab === tab.id}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-sunset-orange shadow-md scale-[1.02]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form + Summary layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Form Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-sunset-lg reveal">
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-center animate-[fadeIn_0.3s_ease]">
                <p className="text-green-700 font-semibold">✅ Booking request sent! We'll confirm within 24 hours.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Room Booking Form */}
              {activeTab === 'room' && (
                <div key="room" className="space-y-5 animate-[fadeIn_0.25s_ease]">
                  <h3 className="font-serif text-2xl font-bold text-sunset-dark mb-6">Room Reservation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Check-in Date</label>
                      <input
                        type="date"
                        name="checkIn"
                        id="booking-check-in"
                        value={roomForm.checkIn}
                        onChange={handleRoomChange}
                        className={`form-input ${errClass('checkIn')}`}
                      />
                      {errors.checkIn && <p className="text-xs text-red-500 mt-1">{errors.checkIn}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Check-out Date</label>
                      <input
                        type="date"
                        name="checkOut"
                        id="booking-check-out"
                        value={roomForm.checkOut}
                        onChange={handleRoomChange}
                        className={`form-input ${errClass('checkOut')}`}
                      />
                      {errors.checkOut && <p className="text-xs text-red-500 mt-1">{errors.checkOut}</p>}
                      {!errors.checkOut && nights > 0 && (
                        <p className="text-xs text-sunset-purple/60 mt-1">{nights} night{nights > 1 ? 's' : ''} selected</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Room Type</label>
                      <select
                        name="roomType"
                        id="booking-room-type"
                        value={roomForm.roomType}
                        onChange={handleRoomChange}
                        className={`form-input ${errClass('roomType')}`}
                      >
                        <option value="">Select a room...</option>
                        {Object.entries(ROOM_PRICES).map(([value, { label, price }]) => (
                          <option key={value} value={value}>{label} — From {currency(price)}/night</option>
                        ))}
                      </select>
                      {errors.roomType && <p className="text-xs text-red-500 mt-1">{errors.roomType}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Number of Guests</label>
                      <select
                        name="guests"
                        id="booking-guests"
                        value={roomForm.guests}
                        onChange={handleRoomChange}
                        className="form-input"
                      >
                        {[1, 2, 3, 4, 5, 6].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Special Requests</label>
                    <textarea
                      name="specialRequests"
                      id="booking-special-requests"
                      value={roomForm.specialRequests}
                      onChange={handleRoomChange}
                      placeholder="Honeymoon setup, dietary needs, early check-in..."
                      className="form-input resize-none h-28"
                    />
                  </div>
                </div>
              )}

              {/* Food Booking Form */}
              {activeTab === 'food' && (
                <div key="food" className="space-y-5 animate-[fadeIn_0.25s_ease]">
                  <h3 className="font-serif text-2xl font-bold text-sunset-dark mb-6">Dining Reservation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        id="food-date"
                        value={foodForm.date}
                        onChange={handleFoodChange}
                        className={`form-input ${errClass('date')}`}
                      />
                      {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Time</label>
                      <input
                        type="time"
                        name="time"
                        id="food-time"
                        value={foodForm.time}
                        onChange={handleFoodChange}
                        className={`form-input ${errClass('time')}`}
                      />
                      {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Dining Package</label>
                      <select
                        name="package"
                        id="food-package"
                        value={foodForm.package}
                        onChange={handleFoodChange}
                        className={`form-input ${errClass('package')}`}
                      >
                        <option value="">Select package...</option>
                        {Object.entries(FOOD_PACKAGES).map(([value, { label, price }]) => (
                          <option key={value} value={value}>{label} — {currency(price)}/person</option>
                        ))}
                      </select>
                      {errors.package && <p className="text-xs text-red-500 mt-1">{errors.package}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Number of People</label>
                      <select
                        name="people"
                        id="food-people"
                        value={foodForm.people}
                        onChange={handleFoodChange}
                        className="form-input"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Dietary Notes</label>
                    <textarea
                      name="dietaryNotes"
                      id="food-dietary"
                      value={foodForm.dietaryNotes}
                      onChange={handleFoodChange}
                      placeholder="Allergies, vegetarian, vegan preferences..."
                      className="form-input resize-none h-28"
                    />
                  </div>

                  <div className="rounded-[1.4rem] border border-sunset-orange/20 bg-sunset-orange/10 p-4 text-sm text-sunset-dark">
                    <p className="font-semibold">Prefer a dedicated dining experience?</p>
                    <p className="mt-2 text-sunset-purple/70">
                      Visit our professional dining reservation page for a full table booking journey.
                    </p>
                    <Link
                      href="/reserve/dining"
                      className="mt-4 inline-flex rounded-full bg-sunset-dark px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sunset-orange"
                    >
                      Go to dining reservation
                    </Link>
                  </div>
                </div>
              )}

              {/* Vehicle Booking Form */}
              {activeTab === 'vehicle' && (
                <div key="vehicle" className="space-y-5 animate-[fadeIn_0.25s_ease]">
                  <h3 className="font-serif text-2xl font-bold text-sunset-dark mb-6">Vehicle & Transfer</h3>
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Vehicle Type</label>
                    <select
                      name="vehicleType"
                      id="vehicle-type"
                      value={vehicleForm.vehicleType}
                      onChange={handleVehicleChange}
                      className={`form-input ${errClass('vehicleType')}`}
                    >
                      <option value="">Select vehicle...</option>
                      <option value="sedan">Luxury Sedan — Up to 3 passengers</option>
                      <option value="suv">Premium SUV — Up to 6 passengers</option>
                      <option value="minivan">Executive Minivan — Up to 9 passengers</option>
                      <option value="speedboat">Private Speedboat — Island Transfers</option>
                      <option value="helicopter">Helicopter Charter — Scenic Transfers</option>
                    </select>
                    {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Pickup Date</label>
                      <input
                        type="date"
                        name="pickupDate"
                        id="vehicle-pickup-date"
                        value={vehicleForm.pickupDate}
                        onChange={handleVehicleChange}
                        className={`form-input ${errClass('pickupDate')}`}
                      />
                      {errors.pickupDate && <p className="text-xs text-red-500 mt-1">{errors.pickupDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Pickup Time</label>
                      <input
                        type="time"
                        name="pickupTime"
                        id="vehicle-pickup-time"
                        value={vehicleForm.pickupTime}
                        onChange={handleVehicleChange}
                        className={`form-input ${errClass('pickupTime')}`}
                      />
                      {errors.pickupTime && <p className="text-xs text-red-500 mt-1">{errors.pickupTime}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Destination</label>
                      <input
                        type="text"
                        name="destination"
                        id="vehicle-destination"
                        value={vehicleForm.destination}
                        onChange={handleVehicleChange}
                        placeholder="Airport, hotel, city..."
                        className={`form-input ${errClass('destination')}`}
                      />
                      {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-sunset-purple mb-2">Passengers</label>
                      <select
                        name="passengers"
                        id="vehicle-passengers"
                        value={vehicleForm.passengers}
                        onChange={handleVehicleChange}
                        className="form-input"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-pill btn-sunset w-full mt-8 py-4 text-base font-bold disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending request...
                  </>
                ) : (
                  <>Confirm Reservation →</>
                )}
              </button>
            </form>
          </div>

          {/* Live Summary Sidebar */}
          <aside className="reveal">
            <div className="sticky top-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 text-white">
              <p className="text-xs uppercase tracking-widest text-white/60 font-semibold mb-1">Your Selection</p>
              <h4 className="font-serif text-xl font-bold mb-4">{summary.title}</h4>

              <div className="space-y-2 mb-5">
                {summary.lines.map((line, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    {line}
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/20 my-4" />

              <div className="flex items-baseline justify-between">
                <span className="text-sm text-white/70">Estimated total</span>
                <span className="text-2xl font-bold" style={{ color: '#FFC15E' }}>{summary.total}</span>
              </div>
              {summary.note && (
                <p className="text-xs text-white/50 mt-1">{summary.note}</p>
              )}

              <div className="mt-6 pt-5 border-t border-white/10 text-xs text-white/60 leading-relaxed">
                No payment is taken now — our concierge team confirms availability and final pricing within 24 hours.
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}