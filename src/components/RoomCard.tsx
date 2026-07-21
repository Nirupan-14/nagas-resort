'use client';

import Image from 'next/image';
import type { Room } from '@/types';

interface RoomCardProps {
  room: Room;
  variant?: 'large' | 'small';
}

export default function RoomCard({ room, variant = 'small' }: RoomCardProps) {
  const isLarge = variant === 'large';

  return (
    <div
      className={ `resort-card overflow-hidden group ${isLarge ? 'flex flex-col' : 'flex flex-col'}`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${isLarge ? 'h-64' : 'h-48'}`}>
        <Image
          src={room.image}
          alt={room.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sunset-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-card">
          <span className="text-sunset-orange font-bold text-sm">{room.price}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-bold text-sunset-dark mb-2 group-hover:text-sunset-orange transition-colors">
          {room.name}
        </h3>
        <p className="text-sunset-purple/65 text-sm leading-relaxed flex-1 mb-4">
          {room.description}
        </p>

        {/* Stat Badge */}
        <div className="stat-badge mb-4">
          <span className="font-serif text-2xl font-bold sunset-gradient-text">{room.stat}</span>
          <p className="text-xs text-sunset-purple/70 font-medium mt-0.5">{room.statLabel}</p>
        </div>

        {/* Details Row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3 text-xs text-sunset-purple/50">
            {room.size && <span>📐 {room.size}</span>}
            {room.capacity && <span>👥 Up to {room.capacity} guests</span>}
          </div>
          <button className="btn-pill btn-sunset text-xs py-2 px-4">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}