import { NextResponse } from 'next/server';
import { getAllReviews, createReview } from '@/backend';

export async function GET() {
  try {
    const reviews = await getAllReviews();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Failed to load reviews', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const review = await createReview(body);
    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error('Failed to save review', error);
    const message = error?.message?.startsWith('VALIDATION:')
      ? error.message.replace('VALIDATION:', '')
      : error?.message || 'Unable to save review right now.';
    const status = error?.message?.startsWith('VALIDATION:') ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
