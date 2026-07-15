'use client';

import { useState } from 'react';
import ReviewCard from './ReviewCard';
import type { ReviewProps } from '@/types';

const reviews: ReviewProps[] = [
  {
    name: 'Amelia Richardson',
    role: 'Travel Blogger, London',
    quote: 'NAGAS Resort redefined what luxury means to me. Every sunrise from our villa deck was a masterpiece, and the staff made us feel like royalty from the first moment to the last. An experience I will carry forever.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 5,
  },
  {
    name: 'James & Sofia Chen',
    role: 'Honeymooners, Singapore',
    quote: 'We celebrated our honeymoon here and it was beyond anything we imagined. The private pool villa, the candlelit garden dinner, the spa — every element was crafted with love. NAGAS has our hearts forever.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&q=80',
    rating: 5,
  },
  {
    name: 'Dr. Priya Nair',
    role: 'Medical Professional, Mumbai',
    quote: 'After years of hectic work, I needed genuine rest. NAGAS delivered exactly that. The garden meditation paths, the wellness treatments, and the incredibly peaceful atmosphere healed me in ways I didn\'t expect.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    rating: 5,
  },
  {
    name: 'Marcus Thompson',
    role: 'Photographer & Adventurer, NYC',
    quote: 'As a travel photographer, I have visited over 80 resorts worldwide. NAGAS stands alone. The golden light at dusk, the lush gardens, the architecture — it is a photographer\'s paradise wrapped in unmatched hospitality.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    rating: 5,
  },
  {
    name: 'Isabella Moreau',
    role: 'Fashion Designer, Paris',
    quote: 'The aesthetic of NAGAS is impeccable — it feels like a living work of art. The interplay of warm sunset tones, organic textures, and tropical florals created a visual and sensory experience unlike any other.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    rating: 5,
  },
  {
    name: 'Kenji Watanabe',
    role: 'Executive, Tokyo',
    quote: 'NAGAS offered me something rare — true disconnection. No distractions, just nature, exceptional cuisine, and a team that anticipated every need with quiet elegance. This is where I come to remember what truly matters.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    rating: 5,
  },
];

export default function ReviewsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const visibleReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

  return (
    <section id="reviews" className="section-padding bg-sunset-cream relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C1447E, transparent)' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header — matches reference layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="reveal">
            <div className="flex items-center gap-3 mb-4">
              <div className="sunset-divider" />
              <span className="text-sunset-orange text-sm font-semibold tracking-widest uppercase">Testimonials</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark">
              Client <span className="sunset-gradient-text">Reviews</span>
            </h2>
            <p className="text-sunset-purple/65 mt-3 max-w-sm text-sm">
              Hear from the guests who have lived the NAGAS experience — their stories are our greatest reward.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-3 reveal">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentPage === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-sunset-orange text-sunset-orange hover:bg-sunset-orange hover:text-white'
              }`}
              aria-label="Previous reviews"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                currentPage === totalPages - 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-sunset-orange text-sunset-orange hover:bg-sunset-orange hover:text-white'
              }`}
              aria-label="Next reviews"
            >
              →
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((review, i) => (
            <div key={review.name} className="reveal" style={{ animationDelay: `${i * 100}ms` }}>
              <ReviewCard {...review} />
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentPage
                  ? 'w-8 h-3 bg-sunset-orange'
                  : 'w-3 h-3 bg-sunset-orange/25 hover:bg-sunset-orange/50'
              }`}
              aria-label={`Go to page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
