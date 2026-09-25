import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  createPayPalOrder,
  PaypalError,
  BookingError,
  prepareVehicleBooking,
  assertVehicleSlotAvailable,
  type VehicleBookingInput,
} from '@/backend';

export async function POST(request: NextRequest) {
  try {
    let body: VehicleBookingInput = {};
    try {
      body = (await request.json()) as VehicleBookingInput;
    } catch {
      body = {};
    }

    const booking = await prepareVehicleBooking(body);
    await assertVehicleSlotAvailable(booking.vehicleType, booking.pickupDate);

    if (booking.amount <= 0) {
      return NextResponse.json(
        { ok: false, error: 'No payable amount is available for this vehicle. Please request a custom quote instead.', requiresCustomQuote: true },
        { status: 400 }
      );
    }

    const description = `Vehicle transfer booking: ${booking.vehicleType} to ${booking.destination} on ${booking.pickupDate} at ${booking.pickupTime}`;
    const order = await createPayPalOrder(booking.amount, description, booking.vehicleType);

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    if (error instanceof PaypalError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    if (error instanceof BookingError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error('Failed to create PayPal order', error);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}