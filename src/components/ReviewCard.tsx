'use client';

import Image from 'next/image';
import type { ReviewProps } from '@/types';

export default function ReviewCard({
  name,
  role,
  quote,
  rating,
}: ReviewProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 p-4 md:p-6">
      <div className="w-full md:w-auto shrink-0 flex justify-center bg-[#f5f8fd] rounded-3xl overflow-hidden">
        <Image
          src="/images/review/review-image.png"
          alt={`${name} — NAGAS Resort guest`}
          width={500}
          height={600}
          unoptimized
          className="w-full max-w-[420px] md:w-[500px] h-auto object-contain"
        />
      </div>

      <div className="flex flex-col justify-center flex-1 gap-4 md:gap-5">
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FF6B35, #C1447E)',
          }}
        >
          <span
            className="text-white text-2xl md:text-3xl font-serif leading-none"
            style={{ marginTop: '-4px' }}
          >
            &ldquo;
          </span>
        </div>

        <blockquote className="text-sunset-purple/70 leading-relaxed text-sm md:text-base lg:text-lg italic">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-sunset-dark">
            {name}
          </h3>

          <p className="text-sunset-purple/60 text-xs md:text-sm mt-1">
            {role}
          </p>

          <div className="flex gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-base md:text-lg ${
                  i < rating
                    ? 'text-sunset-gold'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
