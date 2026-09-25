import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createBooking, createVehicleBooking, BookingError } from '@/backend';

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const booking =
      body.kind === 'vehicle'
        ? await createVehicleBooking(body)
        : await createBooking(body);

    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error('Failed to create booking', error);
    return NextResponse.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
