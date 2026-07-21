'use client';

import Image from 'next/image';
import type { ReviewProps } from '@/types';

function AvatarFallback({ gender, name }: { gender?: ReviewProps['gender']; name: string }) {
  const baseClasses = 'w-full h-full flex items-center justify-center text-white';

  if (gender === 'male') {
    return (
      <div className={`${baseClasses} bg-linear-to-br from-sunset-orange to-sunset-pink`}>
        <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" aria-hidden="true">
          <circle cx="32" cy="22" r="10" fill="currentColor" opacity="0.95" />
          <path d="M20 44c0-7.2 5.8-13 12-13s12 5.8 12 13" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (gender === 'female') {
    return (
      <div className={`${baseClasses} bg-linear-to-br from-sunset-pink to-sunset-purple`}>
        <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" aria-hidden="true">
          <circle cx="32" cy="22" r="10" fill="currentColor" opacity="0.95" />
          <path d="M24 44c0-6.6 3.6-11 8-11s8 4.4 8 11" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M28 33c2.1 1.7 5.8 1.7 7.9 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-linear-to-br from-sunset-gold to-sunset-orange`}>
      <span className="text-4xl font-semibold tracking-wide">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

export default function ReviewCard({ name, role, quote, image, rating, gender }: ReviewProps) {
  return (
    <div className="resort-card grid grid-cols-1 md:grid-cols-[minmax(0,340px)_1fr] gap-10 md:gap-14 items-center p-8 md:p-12 ">
      {/* Left: photo with dashed ring + arrow accent, like the reference screenshot */}
      <div className="relative mx-auto md:mx-0 w-56 h-56 md:w-64 md:h-64 shrink-0">
        {/* soft background blob */}
        <div
          className="absolute -inset-6 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.12), transparent 70%)' }}
        />
        {/* dashed rotating ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-dashed border-sunset-orange/40 animate-spin-slow"
          style={{ inset: '-14px' }}
        />
        {/* solid thin ring */}
        <div className="absolute inset-0 rounded-full border border-sunset-pink/20" style={{ inset: '-6px' }} />

        {/* photo */}
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-sunset bg-sunset-cream">
          {image ? (
            <Image
              src={image}
              alt={`${name} — NAGAS Resort guest`}
              width={256}
              height={256}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <AvatarFallback gender={gender} name={name} />
          )}
        </div>

        {/* curved arrow accent, bottom-left, echoing the screenshot */}
        <svg
          viewBox="0 0 60 60"
          className="absolute -bottom-3 -left-3 w-14 h-14 text-sunset-orange"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M6 30c0 13.3 10.7 24 24 24"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="1 8"
          />
          <path
            d="M22 48l8 6 -2 -10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>

        {/* verified badge */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-sunset-gold rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-sm">✓</span>
        </div>
      </div>

      {/* Right: quote mark, quote, name, role, stars */}
      <div className="flex flex-col gap-5">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #C1447E)' }}
        >
          <span className="text-white text-3xl font-serif leading-none" style={{ marginTop: '-6px' }}>
            &ldquo;
          </span>
        </div>

        <blockquote className="text-sunset-purple/70 leading-relaxed text-base md:text-lg italic">
          &ldquo;{quote}&rdquo;
        </blockquote>

        <div>
          <p className="font-serif text-xl font-bold text-sunset-dark">{name}</p>
          <p className="text-sunset-purple/60 text-sm mt-0.5">{role}</p>
          <div className="flex gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-base transition-colors ${i < rating ? 'text-sunset-gold' : 'text-gray-200'}`}
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