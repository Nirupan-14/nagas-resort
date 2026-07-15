'use client';

import Image from 'next/image';

const stats = [
  { value: '15+', label: 'Years of Excellence' },
  { value: '250+', label: 'Luxury Villas' },
  { value: '98%', label: 'Guest Satisfaction' },
  { value: '50+', label: 'Curated Experiences' },
];

export default function About() {
  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      {/* Decorative bg blob */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-5 -translate-y-1/2 translate-x-1/2"
        style={{ background: 'radial-gradient(circle, #FF6B35, transparent)', borderRadius: '60% 40% 55% 45%' }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 opacity-5 translate-y-1/2 -translate-x-1/2"
        style={{ background: 'radial-gradient(circle, #C1447E, transparent)', borderRadius: '40% 60% 45% 55%' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 mb-6 reveal">
          <div className="sunset-divider" />
          <span className="text-sunset-orange text-sm font-semibold tracking-widest uppercase">Our Story</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative reveal-left">
            {/* Main image */}
            <div
              className="relative h-[500px] overflow-hidden shadow-sunset-lg"
              style={{ borderRadius: '55% 45% 50% 50% / 45% 50% 50% 55%' }}
            >
              <Image
                src="/images/hero.png"
                alt="NAGAS Resort beachfront"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), transparent 60%)' }}
              />
            </div>

            {/* Floating accent card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-5 shadow-card-hover border border-sunset-orange/10">
              <p className="text-3xl font-bold font-serif sunset-gradient-text">15+</p>
              <p className="text-sm text-sunset-purple font-medium mt-1">Years of Luxury Excellence</p>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-sunset-gold text-sm">★</span>
                ))}
              </div>
            </div>

            {/* Decorative ring */}
            <div
              className="absolute -top-8 -left-8 w-32 h-32 rounded-full border-2 border-dashed border-sunset-orange/20 animate-spin-slow"
            />
          </div>

          {/* Right: Content */}
          <div className="reveal-right">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark leading-tight mb-6">
              A Sanctuary Born From{' '}
              <span className="sunset-gradient-text">Passion</span>{' '}
              & Purpose
            </h2>

            <p className="text-sunset-purple/70 text-lg leading-relaxed mb-6">
              Nestled where the sky meets the sea, NAGAS Resort was born from a dream — to create a place where luxury and nature exist in perfect harmony. For over 15 years, we have been crafting moments that last a lifetime.
            </p>

            <p className="text-sunset-purple/60 leading-relaxed mb-8">
              Our philosophy is simple: every guest deserves an experience that transcends the ordinary. From our organically designed villas inspired by local craftsmanship, to our farm-to-table cuisine kissed by sunset flavors, every detail is curated with intention and love.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {['Eco-Luxury', 'Private Beach', 'Spa & Wellness', 'Farm-to-Table', 'Cultural Immersion'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-sunset-orange/25 text-sunset-orange bg-sunset-orange/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a href="#booking" className="btn-pill btn-sunset inline-flex">
              Explore Our World →
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="resort-card text-center p-6 reveal"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <p className="font-serif text-4xl font-bold sunset-gradient-text mb-2">{stat.value}</p>
              <p className="text-sm text-sunset-purple/70 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
