import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  createVehicleBooking,
  capturePayPalOrder,
  PaypalError,
  BookingError,
  type VehicleBookingInput,
} from '@/backend';

export async function POST(request: NextRequest) {
  try {
    let body: { orderId?: string; booking?: VehicleBookingInput } = {};
    try {
      body = (await request.json()) as { orderId?: string; booking?: VehicleBookingInput };
    } catch {
      body = {};
    }

    const orderId = String(body.orderId || '').trim();
    const bookingInput = body.booking || {};
    if (!orderId) {
      return NextResponse.json({ ok: false, error: 'Missing PayPal order.' }, { status: 400 });
    }

    const capture = await capturePayPalOrder(orderId);

    const booking = await createVehicleBooking({
      ...bookingInput,
      paymentStatus: 'paid',
      paymentMethod: 'paypal',
      paypalOrderId: orderId,
      paypalCaptureId: capture.captureId,
      transactionId: capture.captureId,
    });

    return NextResponse.json({ ok: true, booking });
  } catch (error) {
    if (error instanceof PaypalError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    if (error instanceof BookingError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: error.status });
    }
    console.error('Failed to capture PayPal payment', error);
    return NextResponse.json(
      { ok: false, error: 'Your payment could not be confirmed. Please try again.' },
      { status: 500 }
    );
  }
}