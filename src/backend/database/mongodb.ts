import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your MongoDB URI to the MONGODB_URI environment variable');
}

const mongoUri = uri;
let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;

export async function getMongoClient() {
  if (!clientPromise) {
    client = new MongoClient(mongoUri);

    clientPromise = (async () => {
      try {
        await client!.connect();
        return client!;
      } catch (err: any) {
        console.error('Primary Mongo connect failed:', err?.message || err);

        const fallback = process.env.MONGODB_URI_FALLBACK;
        if (fallback) {
          console.warn('Attempting Mongo fallback URI');
          const fallbackClient = new MongoClient(fallback);
          await fallbackClient.connect();
          client = fallbackClient;
          return client;
        }

        throw err;
      }
    })();
  }

  return clientPromise;
}

export async function getReviewsCollection() {
  const mongoClient = await getMongoClient();
  const db = mongoClient.db('nagas-resort');
  return db.collection('reviews');
}

export async function getVehiclesCollection() {
  const mongoClient = await getMongoClient();
  const db = mongoClient.db('nagas-resort');
  return db.collection('vehicles');
}

export async function getRoomsCollection() {
  const mongoClient = await getMongoClient();
  const db = mongoClient.db('nagas-resort');
  return db.collection('rooms');
}

export async function getBookingsCollection() {
  const mongoClient = await getMongoClient();
  const db = mongoClient.db('nagas-resort');
  return db.collection('bookings');
}
