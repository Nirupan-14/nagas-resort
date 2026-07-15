'use client';

import type { ReviewProps } from '@/types';

export default function ReviewCard({ name, role, quote, image, rating }: ReviewProps) {
  return (
    <div className="resort-card p-8 flex flex-col items-start gap-6 group">
      {/* Top: Client photo + info */}
      <div className="flex items-center gap-4 w-full">
        {/* Circular photo with decorative ring */}
        <div className="relative flex-shrink-0">
          {/* Outer decorative ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-sunset-orange/40 animate-spin-slow"
            style={{ inset: '-6px' }}
          />
          {/* Inner subtle ring */}
          <div
            className="absolute inset-0 rounded-full border border-sunset-pink/20"
            style={{ inset: '-2px' }}
          />
          {/* Photo */}
          <div className="w-16 h-16 rounded-full overflow-hidden shadow-sunset">
            <img
              src={image}
              alt={`${name} — NAGAS Resort guest`}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Curved arrow accent */}
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-sunset-gold rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>

        {/* Name + role */}
        <div className="flex-1">
          <p className="font-serif text-lg font-bold text-sunset-dark group-hover:text-sunset-orange transition-colors">
            {name}
          </p>
          <p className="text-sunset-purple/60 text-sm">{role}</p>
          {/* Stars */}
          <div className="flex gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-sm transition-colors ${i < rating ? 'text-sunset-gold' : 'text-gray-200'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Large quote mark */}
        <div
          className="hidden sm:flex w-12 h-12 rounded-xl items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #FF6B35, #C1447E)' }}
        >
          <span className="text-white text-2xl font-serif leading-none" style={{ marginTop: '-6px' }}>&ldquo;</span>
        </div>
      </div>

      {/* Quote Text */}
      <blockquote className="text-sunset-purple/70 leading-relaxed text-sm italic border-l-2 border-sunset-orange/30 pl-4">
        &ldquo;{quote}&rdquo;
      </blockquote>
    </div>
  );
}
