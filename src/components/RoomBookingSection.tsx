'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';

interface RoomOption {
  type: string;
  description: string;
  image: string;
  price: number;
  roomNo: string;
}

interface BookingSuccess {
  bookingRef: string;
  roomType: string;
  date: string;
  startTime: string;
  endTime: string;
  guests: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

const localDateString = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const currency = (value: number) =>
  value === 0
    ? 'Custom quote'
    : value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtTime = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ap}`;
};

const monthLabel = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function RoomBookingSection({ rooms, initialRoomType = '' }: { rooms: RoomOption[]; initialRoomType?: string }) {
  const [roomType, setRoomType] = useState(initialRoomType);
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState('2');
  const [requests, setRequests] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState<BookingSuccess | null>(null);

  const todayStr = useMemo(() => localDateString(new Date()), []);

  const loadAvailability = useCallback(async (type: string, view: Date) => {
    if (!type) {
      setAvailability({});
      return;
    }
    setLoadingAvail(true);
    const from = localDateString(new Date(view.getFullYear(), view.getMonth(), 1));
    const last = new Date(view.getFullYear(), view.getMonth() + 1, 0);
    const to = localDateString(last);
    try {
      const res = await fetch(`/api/bookings/availability?type=${encodeURIComponent(type)}&from=${from}&to=${to}`, { cache: 'no-store' });
      const json = await res.json();
      if (type === roomTypeRef.current) {
        setAvailability(json.days || {});
      }
    } catch {
      if (type === roomTypeRef.current) setAvailability({});
    } finally {
      setLoadingAvail(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roomTypeRef = useRef('');
  const prevTypeRef = useRef('');
  useEffect(() => {
    roomTypeRef.current = roomType;
    if (roomType !== prevTypeRef.current) {
      prevTypeRef.current = roomType;
      setSelectedDate('');
      setSelectedTime('');
    }
    loadAvailability(roomType, viewDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomType, viewDate]);

  const todayStrMemo = useMemo(() => localDateString(new Date()), []);

  const monthDays = useMemo(() => {
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const offset = first.getDay();
    const grid: (string | null)[] = Array(offset).fill(null);
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push(localDateString(new Date(viewDate.getFullYear(), viewDate.getMonth(), d)));
    }
    return grid;
  }, [viewDate]);

  const selectedRoom = rooms.find((r) => r.type === roomType);
  const rate = selectedRoom?.price ?? 0;
  const daySlots = availability[selectedDate] || [];

  const changeMonth = (delta: number) => {
    setViewDate((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      const now = new Date();
      const minMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const maxMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
      if (next < minMonth) return minMonth;
      if (next >= maxMonth) return maxMonth;
      return next;
    });
  };

  const isToday = (date: string) => date === todayStrMemo;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomType,
          date: selectedDate,
          startTime: selectedTime,
          guest: { name: name.trim(), email: email.trim(), phone: phone.trim() },
          guests: Number(guests),
          specialRequests: requests,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Booking failed. Please try again.');
      setSuccess(json.booking);
      loadAvailability(roomTypeRef.current, viewDate);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAll = () => {
    setSuccess(null);
    setSelectedDate('');
    setSelectedTime('');
    setRoomType('');
    setSubmitError('');
  };

  if (success) {
    return (
      <div className="rounded-[1.5rem] border border-emerald-500/25 bg-white/95 p-6 sm:p-8 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-xl">✓</span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-sunset-orange font-semibold">Confirmed</p>
            <h3 className="mt-1 font-serif text-2xl font-bold text-sunset-dark">Your time is reserved</h3>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/70 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-sunset-purple/60">Reference</dt>
            <dd className="mt-1 text-lg font-bold text-sunset-dark">{success.bookingRef}</dd>
          </div>
          <div className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/70 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-sunset-purple/60">Room type</dt>
            <dd className="mt-1 text-lg font-bold text-sunset-dark">{success.roomType}</dd>
          </div>
          <div className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/70 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-sunset-purple/60">When</dt>
            <dd className="mt-1 text-lg font-bold text-sunset-dark">
              {success.date} · {fmtTime(success.startTime)}–{fmtTime(success.endTime)}
            </dd>
          </div>
          <div className="rounded-2xl border border-sunset-gold/20 bg-sunset-cream/70 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-sunset-purple/60">Guests</dt>
            <dd className="mt-1 text-lg font-bold text-sunset-dark">
              {success.guests} {success.guests === 1 ? 'Guest' : 'Guests'}
            </dd>
          </div>
        </dl>
        <button
          onClick={resetAll}
          className="mt-7 w-full rounded-full bg-sunset-dark px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sunset-orange"
        >
          Book another time
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-sunset-gold/20 bg-white/95 p-5 sm:p-8 shadow-card">
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-sunset-orange font-semibold">Reserve your visit</p>
          <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-serif font-bold text-sunset-dark">Live availability</h2>
        </div>
        <span className="hidden sm:inline-flex rounded-full border border-sunset-orange/20 bg-sunset-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sunset-orange shrink-0">
          Real-time
        </span>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <label className="block text-sm text-sunset-purple/80">
          <span className="mb-2 block font-semibold">Room type</span>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.type} value={room.type}>
                {room.type}
              </option>
            ))}
          </select>
        </label>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-sunset-purple/80">Pick a day</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="rounded-full border border-sunset-gold/20 px-3 py-1.5 text-sm text-sunset-dark transition hover:border-sunset-orange"
                aria-label="Previous month"
              >
                ←
              </button>
              <span className="min-w-[9.5rem] text-center text-sm font-semibold text-sunset-dark">{monthLabel(viewDate)}</span>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="rounded-full border border-sunset-gold/20 px-3 py-1.5 text-sm text-sunset-dark transition hover:border-sunset-orange"
                aria-label="Next month"
              >
                →
              </button>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-sunset-gold/20 bg-sunset-cream/50 p-3 sm:p-4">
            <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] font-semibold uppercase tracking-widest text-sunset-purple/50">
              {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {monthDays.map((date, idx) => {
                if (date === null) return <span key={`blank-${idx}`} />;
                const slots = availability[date]?.length ?? 0;
                const past = date < todayStrMemo;
                const blocked = !roomType || past || isToday(date) || slots === 0;
                const selected = date === selectedDate;
                return (
                  <button
                    key={date}
                    type="button"
                    disabled={blocked || loadingAvail}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime('');
                    }}
                    className={`relative flex h-10 flex-col items-center justify-center rounded-xl text-sm font-semibold transition
                      ${selected
                        ? 'bg-sunset-orange text-white shadow-sm'
                        : blocked
                          ? 'text-sunset-purple/30'
                          : 'text-sunset-dark hover:bg-sunset-orange/15'}`}
                    aria-label={date}
                  >
                    {Number(date.slice(-2))}
                    {!blocked && !selected && (
                      <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-emerald-500" />
                    )}
                    {!past && !isToday(date) && slots === 0 && roomType && (
                      <span className="absolute bottom-1 text-[0.55rem] uppercase tracking-wider text-red-400">Booked</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-sunset-gold/15 pt-3 text-[0.7rem] text-sunset-purple/60">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Available</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400" /> Fully booked</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sunset-purple/25" /> Unavailable</span>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="animate-[fadeIn_0.25s_ease]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-sunset-purple/80">Available start times — {selectedDate}</span>
              {loadingAvail && <span className="text-xs text-sunset-purple/50">Updating…</span>}
            </div>
            {daySlots.length === 0 ? (
              <p className="rounded-[1.4rem] border border-sunset-gold/20 bg-sunset-cream/60 p-4 text-sm text-sunset-purple/70">
                No bookable times remain on this day. Try another date or room.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {daySlots.map((time) => {
                  const active = time === selectedTime;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition
                        ${active
                          ? 'border-sunset-orange bg-sunset-orange text-white'
                          : 'border-sunset-gold/25 bg-white text-sunset-dark hover:border-sunset-orange/60 hover:bg-sunset-orange/10'}`}
                    >
                      {fmtTime(time)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm text-sunset-purple/80">
            <span className="mb-2 block font-semibold">Full name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" placeholder="Jordan Lee" />
          </label>
          <label className="block text-sm text-sunset-purple/80">
            <span className="mb-2 block font-semibold">Email address</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" placeholder="you@example.com" />
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm text-sunset-purple/80">
            <span className="mb-2 block font-semibold">Phone</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="form-input" placeholder="+1 555 000 1234" />
          </label>
          <label className="block text-sm text-sunset-purple/80">
            <span className="mb-2 block font-semibold">Guests</span>
            <select value={guests} onChange={(e) => setGuests(e.target.value)} className="form-input">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((count) => (
                <option key={count} value={count}>{count} {count === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm text-sunset-purple/80">
          <span className="mb-2 block font-semibold">Special requests</span>
          <textarea value={requests} onChange={(e) => setRequests(e.target.value)} rows={3} className="form-input resize-none" placeholder="Extra towels, celebration setup, accessibility…" />
        </label>

        <div className="rounded-[1.4rem] border border-sunset-gold/20 bg-sunset-cream/80 p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-sunset-purple/60">Booking summary</p>
          <p className="mt-2 text-2xl font-semibold text-sunset-dark">{currency(rate)}</p>
          <p className="mt-2 text-sm text-sunset-purple/70">
            {selectedDate && selectedTime
              ? `${selectedRoom?.type ?? roomType} · ${selectedDate} · ${fmtTime(selectedTime)}`
              : selectedDate
                ? 'Choose a start time to confirm.'
                : 'Choose a day and start time to preview.'}
          </p>
        </div>

        {submitError && (
          <p className="rounded-[1.2rem] border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">{submitError}</p>
        )}

        <p className="text-xs leading-relaxed text-sunset-purple/60">
          Bookings must be made at least 24 hours in advance. Each 1-hour visit includes a 30-minute
          breathing room between reservations, so your experience is never rushed.
        </p>

        <button
          type="submit"
          disabled={submitting || !selectedTime}
          className="w-full rounded-full px-6 py-3.5 sm:py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-sunset-orange inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: '#1B2A4A' }}
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="truncate">Confirming…</span>
            </>
          ) : (
            <span className="truncate">Confirm reservation</span>
          )}
        </button>
      </form>
    </div>
  );
}