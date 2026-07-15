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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #6A2C5C 0%, #C1447E 30%, #FF6B35 60%, #FFC15E 100%)' }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #FFC15E, transparent)' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 animate-float"
          style={{ background: 'radial-gradient(circle, #FF6B35, transparent)', animationDelay: '3s' }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10 animate-float"
          style={{ background: 'radial-gradient(circle, #C1447E, transparent)', animationDelay: '1.5s' }}
        />
      </div>

      {/* Decorative stars / dots — fixed positions to avoid hydration mismatch */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: '8%', left: '12%', delay: '0s' },
          { top: '15%', left: '85%', delay: '0.5s' },
          { top: '22%', left: '45%', delay: '1s' },
          { top: '35%', left: '72%', delay: '1.5s' },
          { top: '48%', left: '5%', delay: '2s' },
          { top: '55%', left: '90%', delay: '0.3s' },
          { top: '62%', left: '30%', delay: '0.8s' },
          { top: '75%', left: '60%', delay: '1.2s' },
          { top: '85%', left: '18%', delay: '1.7s' },
          { top: '92%', left: '78%', delay: '0.6s' },
          { top: '5%', left: '55%', delay: '2.2s' },
          { top: '30%', left: '20%', delay: '0.4s' },
          { top: '42%', left: '95%', delay: '1.8s' },
          { top: '68%', left: '42%', delay: '0.9s' },
          { top: '78%', left: '88%', delay: '1.4s' },
          { top: '18%', left: '65%', delay: '2.5s' },
          { top: '52%', left: '50%', delay: '0.2s' },
          { top: '88%', left: '35%', delay: '1.1s' },
          { top: '25%', left: '8%', delay: '1.9s' },
          { top: '72%', left: '15%', delay: '0.7s' },
        ].map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{ top: star.top, left: star.left, animationDelay: star.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center pt-28">
        {/* Top Tag */}
        <div className="animate-fade-up mb-6">
          <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-2 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-sunset-gold rounded-full animate-pulse" />
            Premium Luxury Resort Experience
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-serif text-white animate-fade-up animation-delay-200" style={{ opacity: 0 }}>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight mb-2">
            LUXURY ESCAPE
          </span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-none tracking-wider text-white/80">
            IN NAGAS RESORT
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-white/75 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed font-sans animate-fade-up animation-delay-300" style={{ opacity: 0 }}>
          Where golden sunsets meet tropical serenity. An unforgettable sanctuary of bespoke luxury, curated experiences, and breathtaking natural beauty.
        </p>

        {/* Hero Image Blob Container */}
        <div className="relative mt-12 w-full max-w-4xl animate-fade-up animation-delay-400" style={{ opacity: 0 }}>
          {/* Book Now pill overlapping top */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => handleScroll('#booking')}
              className="btn-pill btn-white text-sm shadow-lg px-8 py-3 font-bold"
            >
              <span>✦</span>
              Book Your Stay
              <span>↗</span>
            </button>
          </div>

          {/* Blob Image Container */}
          <div
            className="relative w-full overflow-hidden shadow-sunset-lg"
            style={{
              borderRadius: '50% 50% 45% 55% / 40% 40% 60% 60%',
              aspectRatio: '16/9',
              maxHeight: '520px',
            }}
          >
            <Image
              src="/images/hero.png"
              alt="NAGAS Resort aerial view at sunset"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            {/* Warm overlay */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(106, 44, 92, 0.4) 100%)' }}
            />
          </div>

          {/* Floating Stats Cards */}
          <div className="absolute bottom-8 left-4 md:left-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-card animate-float">
            <p className="text-2xl font-bold font-serif text-sunset-orange">98%</p>
            <p className="text-xs text-sunset-purple font-medium">Guest Satisfaction</p>
          </div>
          <div className="absolute bottom-8 right-4 md:right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: '2s' }}>
            <p className="text-2xl font-bold font-serif text-sunset-pink">250+</p>
            <p className="text-xs text-sunset-purple font-medium">Luxury Villas</p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 flex flex-col items-center gap-2 animate-fade-up animation-delay-600" style={{ opacity: 0 }}>
          <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
