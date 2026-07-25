import { getReviewsCollection } from '@/backend/database/mongodb';
import { seedReviews } from '@/backend/seed/reviews.seed';

export async function getAllReviews() {
  const reviewsCollection = await getReviewsCollection();
  const existingReviews = await reviewsCollection.find({}).sort({ createdAt: -1 }).toArray();

  if (existingReviews.length === 0) {
    await reviewsCollection.insertMany(seedReviews);
    return seedReviews;
  }

  return existingReviews;
}

export async function createReview(body: Record<string, unknown>) {
  const { name, role, quote, rating } = body;

  if (!name || !role || !quote) {
    throw new Error('VALIDATION:Name, role, and quote are required.');
  }

  const review = {
    name: String(name),
    role: String(role),
    quote: String(quote),
    rating: Number(rating) || 5,
    createdAt: new Date(),
  };

  const reviewsCollection = await getReviewsCollection();
  const result = await reviewsCollection.insertOne(review);

  return { ...review, _id: result.insertedId };
}
