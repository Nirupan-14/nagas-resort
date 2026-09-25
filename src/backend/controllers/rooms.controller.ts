import { getRoomsCollection } from '@/backend/database/mongodb';

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'room'
  );
}

export async function getAllRooms() {
  const roomsCollection = await getRoomsCollection();
  const existing = await roomsCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return existing.map((r: any, index: number) => ({
    id: String(r._id),
    roomNo: r.roomNo,
    type: r.type,
    description: r.description,
    price: r.price ? Number(r.price) : 0,
    imageUrls: r.imageUrls && r.imageUrls.length > 0 ? r.imageUrls : ['/images/room-villa.png'],
    slug: slugify(`${r.roomNo}-${r.type}`) || `room-${index + 1}`,
  }));
}