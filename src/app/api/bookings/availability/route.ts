import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAvailability, MIN_ADVANCE_HOURS } from '@/backend';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || '';
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';

  try {
    const result = await getAvailability(type, from, to);
    return NextResponse.json({ ...result, minimumAdvanceHours: MIN_ADVANCE_HOURS });
  } catch (error) {
    console.error('Failed to load availability', error);
    return NextResponse.json({ days: {}, from, to, minimumAdvanceHours: MIN_ADVANCE_HOURS }, { status: 200 });
  }
}