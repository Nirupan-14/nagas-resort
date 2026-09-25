import { NextResponse } from 'next/server';
import { getAllVehicles } from '@/backend';

export async function GET() {
  try {
    const vehicles = await getAllVehicles();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Failed to load vehicles', error);
    return NextResponse.json([], { status: 200 });
  }
}