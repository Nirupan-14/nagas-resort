import { getVehiclesCollection } from '@/backend/database/mongodb';

export const seedVehicles = [
  {
    name: 'Luxury Sedan',
    slug: 'luxury-sedan',
    description: 'Perfect for airport transfers and intimate journeys.',
    imageUrl: '/images/hero.png',
    price: 60,
  },
  {
    name: 'Premium SUV',
    slug: 'premium-suv',
    description: 'Spacious comfort for families and small groups.',
    imageUrl: '/images/pool.png',
    price: 95,
  },
  {
    name: 'Executive Minivan',
    slug: 'executive-minivan',
    description: 'Business travel with room for luggage and extra passengers.',
    imageUrl: '/images/room-suite.png',
    price: 140,
  },
  {
    name: 'Private Speedboat',
    slug: 'private-speedboat',
    description: 'Fast island transfers with a private seaside launch.',
    imageUrl: '/images/room-villa.png',
    price: 0,
  },
];

export async function getAllVehicles() {
  const vehiclesCollection = await getVehiclesCollection();
  const existing = await vehiclesCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  if (existing.length === 0) {
    const now = new Date();
    const docs = seedVehicles.map((v) => ({ ...v, createdAt: now, updatedAt: now }));
    await vehiclesCollection.insertMany(docs);
    // Inserted docs carry the seed order; sort newest-first for display.
    return docs.reverse();
  }

  return existing.map((v: any) => ({
    name: v.name,
    slug: v.slug,
    description: v.description,
    imageUrl: v.imageUrl,
    price: v.price,
  }));
}