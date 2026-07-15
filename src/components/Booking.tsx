'use client';

import { useState } from 'react';
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

export default function Booking() {
  const [activeTab, setActiveTab] = useState<BookingTab>('room');
  const [roomForm, setRoomForm] = useState<RoomBookingForm>(initialRoomForm);
  const [foodForm, setFoodForm] = useState<FoodBookingForm>(initialFoodForm);
  const [vehicleForm, setVehicleForm] = useState<VehicleBookingForm>(initialVehicleForm);
  const [submitted, setSubmitted] = useState(false);

  const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRoomForm(prev => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
  };

  const handleFoodChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFoodForm(prev => ({ ...prev, [name]: name === 'people' ? Number(value) : value }));
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleForm(prev => ({ ...prev, [name]: name === 'passengers' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      id="booking"
      className="section-padding relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #6A2C5C 0%, #C1447E 40%, #FF6B35 80%, #FFC15E 100%)' }}
    >
      {/* Decorative orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 opacity-10 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, white, transparent)' }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 opacity-10 translate-x-1/2 translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, #FFC15E, transparent)' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-white/40" />
            <span className="text-white/70 text-sm font-semibold tracking-widest uppercase">Reservations</span>
            <div className="h-px w-12 bg-white/40" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">
            Book Your <span style={{ color: '#FFC15E' }}>Experience</span>
          </h2>
          <p className="text-white/70 mt-4 max-w-xl mx-auto">
            Plan your perfect escape — from accommodations to dining and private transfers, we handle every detail.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 p-1.5 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 reveal">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`booking-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-white text-sunset-orange shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-sunset-lg reveal">
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
              <p className="text-green-700 font-semibold">✅ Booking request sent! We'll confirm within 24 hours.</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Room Booking Form */}
            {activeTab === 'room' && (
              <div className="space-y-5">
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
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Check-out Date</label>
                    <input
                      type="date"
                      name="checkOut"
                      id="booking-check-out"
                      value={roomForm.checkOut}
                      onChange={handleRoomChange}
                      className="form-input"
                      required
                    />
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
                      className="form-input"
                      required
                    >
                      <option value="">Select a room...</option>
                      <option value="garden-suite">Garden Suite — From $320/night</option>
                      <option value="sunset-villa">Sunset Pool Villa — From $780/night</option>
                      <option value="ocean-bungalow">Ocean Bungalow — From $520/night</option>
                      <option value="royal-penthouse">Royal Penthouse — From $1,200/night</option>
                    </select>
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
              <div className="space-y-5">
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
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      id="food-time"
                      value={foodForm.time}
                      onChange={handleFoodChange}
                      className="form-input"
                      required
                    />
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
                      className="form-input"
                      required
                    >
                      <option value="">Select package...</option>
                      <option value="sunset-dinner">Sunset Dinner — $85/person</option>
                      <option value="beach-breakfast">Beach Breakfast — $45/person</option>
                      <option value="chefs-table">Chef's Table Experience — $150/person</option>
                      <option value="poolside-brunch">Poolside Brunch — $65/person</option>
                      <option value="traditional-feast">Traditional Feast Night — $95/person</option>
                    </select>
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
              </div>
            )}

            {/* Vehicle Booking Form */}
            {activeTab === 'vehicle' && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl font-bold text-sunset-dark mb-6">Vehicle & Transfer</h3>
                <div>
                  <label className="block text-sm font-semibold text-sunset-purple mb-2">Vehicle Type</label>
                  <select
                    name="vehicleType"
                    id="vehicle-type"
                    value={vehicleForm.vehicleType}
                    onChange={handleVehicleChange}
                    className="form-input"
                    required
                  >
                    <option value="">Select vehicle...</option>
                    <option value="sedan">Luxury Sedan — Up to 3 passengers</option>
                    <option value="suv">Premium SUV — Up to 6 passengers</option>
                    <option value="minivan">Executive Minivan — Up to 9 passengers</option>
                    <option value="speedboat">Private Speedboat — Island Transfers</option>
                    <option value="helicopter">Helicopter Charter — Scenic Transfers</option>
                  </select>
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
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Pickup Time</label>
                    <input
                      type="time"
                      name="pickupTime"
                      id="vehicle-pickup-time"
                      value={vehicleForm.pickupTime}
                      onChange={handleVehicleChange}
                      className="form-input"
                      required
                    />
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
                      className="form-input"
                      required
                    />
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
              className="btn-pill btn-sunset w-full mt-8 py-4 text-base font-bold"
            >
              Confirm Reservation →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
