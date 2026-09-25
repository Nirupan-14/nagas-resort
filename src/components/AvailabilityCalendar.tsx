'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const startOfDay = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

interface AvailabilityCalendarProps {
  bookedDates: string[];
  value: string;
  onSelect: (date: string) => void;
}

export default function AvailabilityCalendar({
  bookedDates,
  value,
  onSelect,
}: AvailabilityCalendarProps) {
  const today = startOfDay(new Date());
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    if (value) {
      const parsed = new Date(`${value}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) return new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    }
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const bookedSet = useMemo(() => new Set(bookedDates), [bookedDates]);

  const cells = useMemo(() => {
    const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const list: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), d));
    }
    return list;
  }, [viewDate]);

  const canGoPrev = viewDate.getFullYear() > today.getFullYear() || viewDate.getMonth() > today.getMonth();

  return (
    <div className="rounded-[1.25rem] border border-sunset-gold/20 bg-white/90 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoPrev && setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          className="rounded-lg border border-sunset-gold/20 p-1.5 text-sunset-dark transition hover:border-sunset-orange disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold text-sunset-dark">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <button
          type="button"
          onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          className="rounded-lg border border-sunset-gold/20 p-1.5 text-sunset-dark transition hover:border-sunset-orange"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[0.6rem] font-bold uppercase tracking-widest text-sunset-purple/50">
            {day}
          </span>
        ))}
        {cells.map((date, idx) => {
          if (!date) return <span key={`empty-${idx}`} />;
          const key = dateKey(date);
          const isPast = date.getTime() < today.getTime();
          const isBooked = bookedSet.has(key);
          const isSelected = value === key;
          const clickable = !isPast && !isBooked;

          return (
            <button
              key={key}
              type="button"
              disabled={!clickable}
              onClick={() => onSelect(key)}
              title={isBooked ? 'Already booked' : isPast ? 'Unavailable' : 'Available'}
              className={`flex h-9 items-center justify-center rounded-lg text-sm font-medium transition ${
                isSelected
                  ? 'bg-[#1B2A4A] text-white shadow'
                  : isBooked
                    ? 'cursor-not-allowed bg-rose-500/15 text-rose-600 line-through'
                    : isPast
                      ? 'cursor-not-allowed text-sunset-purple/25'
                      : 'cursor-pointer text-sunset-dark hover:bg-sunset-orange/20 hover:text-sunset-orange'
              }`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-sunset-gold/15 pt-3 text-xs text-sunset-purple/70">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded border border-sunset-gold/40 bg-white" />
          Available
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-rose-500/25" />
          Booked (blocked)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-[#1B2A4A]" />
          Selected
        </span>
      </div>
    </div>
  );
}