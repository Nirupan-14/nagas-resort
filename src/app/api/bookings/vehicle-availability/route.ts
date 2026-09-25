import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getVehicleAvailability } from '@/backend';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vehicleType = searchParams.get('vehicleType') || '';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  try {
    const result = await getVehicleAvailability(vehicleType, from, to);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to load vehicle availability', error);
    return NextResponse.json(
      { bookedDates: [], availableDates: [], from, to },
      { status: 200 }
    );
  }
}