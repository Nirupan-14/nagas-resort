import { NextResponse } from 'next/server';
import { getReviewsCollection } from '@/lib/mongodb';

const seedReviews = [
  {
    name: 'Amelia Richardson',
    role: 'Travel Blogger, London',
    quote:
      'NAGAS Resort redefined what luxury means to me. Every sunrise from our villa deck was a masterpiece, and the staff made us feel like royalty from the first moment to the last. An experience I will carry forever.',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
    gender: 'female' as const,
    createdAt: new Date('2024-01-12T10:30:00.000Z'),
  },
  {
    name: 'James & Sofia Chen',
    role: 'Honeymooners, Singapore',
    quote:
      'We celebrated our honeymoon here and it was beyond anything we imagined. The private pool villa, the candlelit garden dinner, the spa — every element was crafted with love. NAGAS has our hearts forever.',
    image:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80',
    rating: 5,
    gender: 'male' as const,
    createdAt: new Date('2024-01-25T08:15:00.000Z'),
  },
  {
    name: 'Dr. Priya Nair',
    role: 'Medical Professional, Mumbai',
    quote:
      'After years of hectic work, I needed genuine rest. NAGAS delivered exactly that. The garden meditation paths, the wellness treatments, and the incredibly peaceful atmosphere healed me in ways I didn\'t expect.',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    rating: 5,
    gender: 'female' as const,
    createdAt: new Date('2024-02-03T13:45:00.000Z'),
  },
  {
    name: 'Marcus Thompson',
    role: 'Photographer & Adventurer, NYC',
    quote:
      'As a travel photographer, I have visited over 80 resorts worldwide. NAGAS stands alone. The golden light at dusk, the lush gardens, the architecture — it is a photographer\'s paradise wrapped in unmatched hospitality.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    rating: 5,
    gender: 'male' as const,
    createdAt: new Date('2024-02-10T11:00:00.000Z'),
  },
  {
    name: 'Isabella Moreau',
    role: 'Fashion Designer, Paris',
    quote:
      'The aesthetic of NAGAS is impeccable — it feels like a living work of art. The interplay of warm sunset tones, organic textures, and tropical florals created a visual and sensory experience unlike any other.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    rating: 5,
    gender: 'female' as const,
    createdAt: new Date('2024-02-18T16:20:00.000Z'),
  },
  {
    name: 'Kenji Watanabe',
    role: 'Executive, Tokyo',
    quote:
      'NAGAS offered me something rare — true disconnection. No distractions, just nature, exceptional cuisine, and a team that anticipated every need with quiet elegance. This is where I come to remember what truly matters.',
    image:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    rating: 5,
    gender: 'male' as const,
    createdAt: new Date('2024-02-25T09:50:00.000Z'),
  },
];

export async function GET() {
  try {
    const reviewsCollection = await getReviewsCollection();
    const existingReviews = await reviewsCollection.find({}).sort({ createdAt: -1 }).toArray();

    if (existingReviews.length === 0) {
      await reviewsCollection.insertMany(seedReviews);
      return NextResponse.json(seedReviews);
    }

    return NextResponse.json(existingReviews);
  } catch (error) {
    console.error('Failed to load reviews', error);
    return NextResponse.json(seedReviews, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, quote, rating, image, gender } = body;

    if (!name || !role || !quote) {
      return NextResponse.json({ error: 'Name, role, and quote are required.' }, { status: 400 });
    }

    const review = {
      name: String(name),
      role: String(role),
      quote: String(quote),
      rating: Number(rating) || 5,
      image: image ? String(image) : '',
      gender: gender === 'male' || gender === 'female' ? gender : 'other',
      createdAt: new Date(),
    };

    const reviewsCollection = await getReviewsCollection();
    const result = await reviewsCollection.insertOne(review);

    return NextResponse.json({ ...review, _id: result.insertedId }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to save review', error);
    // Surface the underlying error message to help debugging (non-sensitive)
    const message = error?.message || 'Unable to save review right now.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
