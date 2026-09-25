import { getBookingsCollection, getRoomsCollection, getVehiclesCollection } from '@/backend/database/mongodb';

export const MIN_ADVANCE_HOURS = 24;
export const SLOT_MINUTES = 60;
export const BUFFER_MINUTES = 30;

const OPEN_HOUR = 8;
const CLOSE_HOUR = 22;
const MAX_RANGE_DAYS = 62;

const pad = (n: number) => String(n).padStart(2, '0');

export const SLOT_STARTS: string[] = Array.from(
  { length: CLOSE_HOUR - OPEN_HOUR },
  (_, i) => `${pad(OPEN_HOUR + i)}:00`
); // 08:00, 09:00, ... 21:00

export interface BookingInput {
  roomType: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM in SLOT_STARTS
  guest: { name: string; email: string; phone: string };
  guests: number;
  specialRequests?: string;
}

export interface SlotResult {
  time: string;
  available: boolean;
  reason: 'too-soon' | 'booked' | 'buffer' | '';
}

export class BookingError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = 'BookingError';
    this.status = status;
  }
}

export interface VehicleBookingInput {
  vehicleType?: string;
  pickupDate?: string;
  pickupTime?: string;
  destination?: string;
  passengers?: number;
  guest?: { name?: string; email?: string; phone?: string };
  specialRequests?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paypalOrderId?: string;
  paypalCaptureId?: string;
  transactionId?: string;
}

export interface PreparedVehicleBooking {
  vehicleType: string;
  pickupDate: string;
  pickupTime: string;
  destination: string;
  passengers: number;
  specialRequests: string;
  guest: { name: string; email: string; phone: string };
  amount: number;
}

function minsOf(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(total: number): string {
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return `${pad(Math.floor(wrapped / 60))}:${pad(wrapped % 60)}`;
}

function localDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isPastOrInvalidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return true;
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime());
}

function overlap(candStart: number, [blockStart, blockEnd]: [number, number]): boolean {
  return candStart < blockEnd && blockStart < candStart + SLOT_MINUTES;
}

function computeDaySlots(date: string, bookings: any[]): SlotResult[] {
  const blocked: [number, number][] = bookings.map((b) => {
    const start = minsOf(b.startTime);
    return [start, start + SLOT_MINUTES + BUFFER_MINUTES];
  });

  const minStartMs = Date.now() + MIN_ADVANCE_HOURS * 60 * 60 * 1000;

  return SLOT_STARTS.map((time) => {
    const start = minsOf(time);
    const startMs = new Date(`${date}T${time}`).getTime();
    let reason: SlotResult['reason'] = '';
    if (startMs < minStartMs) {
      reason = 'too-soon';
    } else if (blocked.some((range) => overlap(start, range))) {
      reason = 'booked';
    }
    return { time, available: reason === '', reason };
  });
}

function serializeBooking(doc: any) {
  const [h, m] = String(doc.startTime || '00:00').split(':').map(Number);
  return {
    id: String(doc._id),
    bookingRef: doc.bookingRef,
    roomType: doc.roomType,
    date: doc.date,
    startTime: doc.startTime,
    endTime: minutesToTime(h * 60 + (m || 0) + SLOT_MINUTES),
    guest: doc.guest || { name: '', email: '', phone: '' },
    guests: Number(doc.guests) || 1,
    specialRequests: doc.specialRequests || '',
    amount: Number(doc.amount) || 0,
    status: doc.status || 'confirmed',
    source: doc.source || 'website',
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function getAvailability(
  roomType: string,
  from: string,
  to: string
): Promise<{ days: Record<string, string[]>; from: string; to: string }> {
  const days: Record<string, string[]> = {};
  if (!roomType || isPastOrInvalidDate(from) || isPastOrInvalidDate(to)) {
    return { days, from, to };
  }

  const fromDate = new Date(`${from}T00:00:00`);
  const toDate = new Date(`${to}T00:00:00`);
  if (toDate.getTime() < fromDate.getTime()) return { days, from, to };

  const cap = new Date(fromDate.getTime());
  cap.setDate(cap.getDate() + MAX_RANGE_DAYS);
  const effectiveTo = toDate.getTime() > cap.getTime() ? cap : toDate;

  const collection = await getBookingsCollection();
  const rangeBookings = await collection
    .find({ roomType, date: { $gte: from, $lte: localDateString(effectiveTo) } })
    .project({ date: 1, startTime: 1 })
    .toArray();

  const byDate: Record<string, any[]> = {};
  for (const b of rangeBookings) {
    (byDate[b.date] ||= []).push(b);
  }

  const cursor = new Date(fromDate.getTime());
  while (cursor.getTime() <= effectiveTo.getTime()) {
    const dateStr = localDateString(cursor);
    if (!isPastOrInvalidDate(dateStr)) {
      const slots = computeDaySlots(dateStr, byDate[dateStr] || []);
      days[dateStr] = slots.filter((s) => s.available).map((s) => s.time);
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return { days, from, to: localDateString(effectiveTo) };
}

export async function createBooking(input: BookingInput) {
  const roomType = String(input.roomType || '').trim();
  const date = String(input.date || '').trim();
  const startTime = String(input.startTime || '').trim();
  const name = String(input.guest?.name || '').trim();
  const email = String(input.guest?.email || '').trim();
  const phone = String(input.guest?.phone || '').trim();
  const guests = Number(input.guests) || 1;

  if (!roomType) throw new BookingError('Please choose a room type.');
  if (!date || isPastOrInvalidDate(date)) throw new BookingError('Please choose a valid date.');
  if (!SLOT_STARTS.includes(startTime)) throw new BookingError('Please choose a valid start time.');
  if (!name) throw new BookingError('Please provide your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BookingError('Please provide a valid email address.');
  if (phone.length < 5) throw new BookingError('Please provide a contact phone number.');
  if (guests < 1 || guests > 12) throw new BookingError('Guest count must be between 1 and 12.');

  const roomsCollection = await getRoomsCollection();
  const room = await roomsCollection.findOne({ type: roomType });
  if (!room) throw new BookingError('That room type is no longer available.');

  const collection = await getBookingsCollection();
  const dayBookings = await collection
    .find({ roomType, date, status: { $ne: 'cancelled' } })
    .project({ startTime: 1 })
    .toArray();
  const slot = computeDaySlots(date, dayBookings).find((s) => s.time === startTime);
  if (!slot || !slot.available) {
    throw new BookingError(
      slot?.reason === 'too-soon'
        ? 'Bookings must be made at least 24 hours in advance.'
        : 'That time was just taken. Please pick another available time.',
      409
    );
  }

  const endTime = minutesToTime(minsOf(startTime) + SLOT_MINUTES);
  const doc = {
    bookingRef: `NAG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    roomType,
    date,
    startTime,
    endTime,
    guest: { name, email, phone },
    guests,
    specialRequests: String(input.specialRequests || '').trim(),
    amount: Math.round(Number(room.price) || 0),
    status: 'confirmed',
    source: 'website',
    createdAt: new Date(),
  };

  const result = await collection.insertOne(doc);
  return serializeBooking({ ...doc, _id: result.insertedId });
}

function serializeVehicleBooking(doc: any) {
  const [h, m] = String(doc.pickupTime || '00:00').split(':').map(Number);
  return {
    id: String(doc._id),
    bookingRef: doc.bookingRef,
    kind: 'vehicle' as const,
    vehicleType: doc.vehicleType,
    pickupDate: doc.pickupDate,
    pickupTime: doc.pickupTime,
    endTime: minutesToTime(h * 60 + (m || 0) + SLOT_MINUTES),
    destination: doc.destination || '',
    guest: doc.guest || { name: '', email: '', phone: '' },
    passengers: Number(doc.passengers) || 1,
    specialRequests: doc.specialRequests || '',
    amount: Number(doc.amount) || 0,
    status: doc.status || 'confirmed',
    source: doc.source || 'website',
    paymentStatus: doc.paymentStatus || 'pending',
    paymentMethod: doc.paymentMethod || 'pay-at-pickup',
    paypalOrderId: doc.paypalOrderId || '',
    paypalCaptureId: doc.paypalCaptureId || '',
    transactionId: doc.transactionId || '',
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function getVehicleAvailability(
  vehicleType: string,
  from: string,
  to?: string
): Promise<{ bookedDates: string[]; availableDates: string[]; from: string; to: string }> {
  const empty: { bookedDates: string[]; availableDates: string[]; from: string; to: string } = {
    bookedDates: [],
    availableDates: [],
    from,
    to: to || '',
  };

  if (!vehicleType || isPastOrInvalidDate(from)) return empty;

  const fromDate = new Date(`${from}T00:00:00`);
  if (Number.isNaN(fromDate.getTime())) return empty;

  const toDate = to ? new Date(`${to}T00:00:00`) : new Date(NaN);
  const cap = new Date(fromDate.getTime());
  cap.setDate(cap.getDate() + MAX_RANGE_DAYS);
  const effectiveTo =
    to && !Number.isNaN(toDate.getTime()) && toDate.getTime() <= cap.getTime()
      ? toDate
      : cap;

  const collection = await getBookingsCollection();
  const rangeBookings = await collection
    .find({
      kind: 'vehicle',
      vehicleType,
      pickupDate: { $gte: from, $lte: localDateString(effectiveTo) },
      status: { $ne: 'cancelled' },
    })
    .project({ pickupDate: 1 })
    .toArray();

  const bookedSet = new Set(rangeBookings.map((b) => b.pickupDate));
  const bookedDates: string[] = [];
  const availableDates: string[] = [];

  const cursor = new Date(fromDate.getTime());
  while (cursor.getTime() <= effectiveTo.getTime()) {
    const dateStr = localDateString(cursor);
    if (bookedSet.has(dateStr)) bookedDates.push(dateStr);
    else availableDates.push(dateStr);
    cursor.setDate(cursor.getDate() + 1);
  }

  return { bookedDates, availableDates, from, to: localDateString(effectiveTo) };
}

export async function prepareVehicleBooking(input: VehicleBookingInput): Promise<PreparedVehicleBooking> {
  const vehicleType = String(input.vehicleType || '').trim();
  const pickupDate = String(input.pickupDate || '').trim();
  const pickupTime = String(input.pickupTime || '').trim();
  const destination = String(input.destination || '').trim();
  const name = String(input.guest?.name || '').trim();
  const email = String(input.guest?.email || '').trim();
  const phone = String(input.guest?.phone || '').trim();
  const passengers = Number(input.passengers) || 1;

  if (!vehicleType) throw new BookingError('Please choose a vehicle.');
  if (!pickupDate || isPastOrInvalidDate(pickupDate)) throw new BookingError('Please choose a valid pickup date.');
  if (!pickupTime) throw new BookingError('Please choose a pickup time.');
  if (!destination) throw new BookingError('Please provide a destination.');
  if (!name) throw new BookingError('Please provide your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new BookingError('Please provide a valid email address.');
  if (phone.length < 5) throw new BookingError('Please provide a contact phone number.');
  if (passengers < 1 || passengers > 20) throw new BookingError('Passenger count must be between 1 and 20.');

  const vehiclesCollection = await getVehiclesCollection();
  const vehicle = await vehiclesCollection.findOne({ name: vehicleType });
  const amount = vehicle?.price ? Number(vehicle.price) : 0;

  return {
    vehicleType,
    pickupDate,
    pickupTime,
    destination,
    passengers,
    specialRequests: String(input.specialRequests || '').trim(),
    guest: { name, email, phone },
    amount: Math.round(amount),
  };
}

export async function assertVehicleSlotAvailable(vehicleType: string, pickupDate: string) {
  const collection = await getBookingsCollection();
  const existing = await collection.findOne({
    kind: 'vehicle',
    vehicleType,
    pickupDate,
    status: { $ne: 'cancelled' },
  });
  if (existing) {
    throw new BookingError(
      'Sorry, that vehicle is already booked on this date. Please pick another date.',
      409
    );
  }
}

export async function createVehicleBooking(input: VehicleBookingInput) {
  const prepared = await prepareVehicleBooking(input);

  const collection = await getBookingsCollection();
  await assertVehicleSlotAvailable(prepared.vehicleType, prepared.pickupDate);

  const doc = {
    bookingRef: `NAG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    kind: 'vehicle',
    vehicleType: prepared.vehicleType,
    pickupDate: prepared.pickupDate,
    pickupTime: prepared.pickupTime,
    endTime: minutesToTime(minsOf(prepared.pickupTime) + SLOT_MINUTES),
    destination: prepared.destination,
    guest: prepared.guest,
    passengers: prepared.passengers,
    specialRequests: prepared.specialRequests,
    amount: prepared.amount,
    status: 'confirmed',
    source: 'website',
    paymentStatus: input.paymentStatus === 'paid' ? 'paid' : 'pending',
    paymentMethod: prepared.amount > 0 && input.paymentStatus === 'paid' ? 'paypal' : (input.paymentMethod || 'pay-at-pickup'),
    paypalOrderId: String(input.paypalOrderId || ''),
    paypalCaptureId: String(input.paypalCaptureId || ''),
    transactionId: String(input.transactionId || input.paypalCaptureId || ''),
    createdAt: new Date(),
  };

  const result = await collection.insertOne(doc);
  return serializeVehicleBooking({ ...doc, _id: result.insertedId });
}