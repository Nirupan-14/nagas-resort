'use client';

import Image from 'next/image';

export default function Hero() {
  const handleScroll = (href: string) => {
    const el = document.getElementById(href.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero.png"
          alt="Luxury Resort"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 py-20">
        {/* Logo Section */}
        <div className="mb-12 animate-fade-up">
          <div className="text-center">
            <div className="text-5xl font-serif font-bold text-white mb-2">N</div>
            <h2 className="text-xl font-serif text-white/90 tracking-widest">NAGAS RESORTS & HOLIDAYS</h2>
          </div>
        </div>

        {/* Main Headline */}
        <div className="animate-fade-up animation-delay-200 mb-4">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight">
            Welcome to Nagas
          </h1>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Resorts & Holidays
          </h1>
        </div>

        {/* Subheadline */}
        <div className="animate-fade-up animation-delay-300 mb-8">
          <p className="text-xl sm:text-2xl text-white/90 font-light tracking-wider">
            Thoughtful Spaces · Timeless Stays
          </p>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-up animation-delay-400">
          <button
            onClick={() => handleScroll('#booking')}
            className="px-8 py-3 bg-sunset-gold/90 hover:bg-sunset-gold text-sunset-dark font-semibold rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Luxury Stays
          </button>
        </div>
      </div>
    </section>
  );
}
