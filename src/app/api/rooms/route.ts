import { NextResponse } from 'next/server';
import { getAllRooms } from '@/backend';

export async function GET() {
  try {
    const rooms = await getAllRooms();
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Failed to load rooms', error);
    return NextResponse.json([], { status: 200 });
  }
}