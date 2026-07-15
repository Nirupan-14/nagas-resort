'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { NavItem } from '@/types';

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Rooms', href: '#rooms' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Garden', href: '#garden' },
  { label: 'Booking', href: '#booking' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Active section detection
      const sections = navItems.map(item => item.href.replace('#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'navbar-scrolled' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="#home"
            onClick={(e) => handleNavClick(e, '#home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full sunset-gradient flex items-center justify-center shadow-sunset">
              <span className="text-white font-bold text-sm font-serif">N</span>
            </div>
            <span
              className={`font-serif text-xl font-bold tracking-wide transition-colors duration-300 ${
                scrolled ? 'text-sunset-dark' : 'text-white'
              }`}
            >
              NAGAS
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                  scrolled ? 'text-sunset-dark' : 'text-white/90'
                } hover:text-sunset-orange`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-sunset-orange rounded-full transition-all duration-300 ${
                    activeSection === item.href.replace('#', '') ? 'w-4/5' : 'w-0 group-hover:w-4/5'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Year Badge + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                scrolled
                  ? 'border-sunset-orange/30 text-sunset-orange bg-sunset-orange/5'
                  : 'border-white/30 text-white bg-white/10'
              }`}
            >
              Est. 2026
            </span>
            <a
              href="#booking"
              onClick={(e) => handleNavClick(e, '#booking')}
              className="btn-pill btn-sunset text-sm py-2.5 px-5"
            >
              Book Now
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden flex flex-col gap-1.5 p-2 transition-colors ${
              scrolled ? 'text-sunset-dark' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden transition-all duration-400 overflow-hidden ${
          mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ background: 'rgba(255, 248, 240, 0.97)', backdropFilter: 'blur(20px)' }}
      >
        <div className="px-6 py-6 flex flex-col gap-2 border-t border-sunset-orange/10">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`py-3 px-4 rounded-xl font-medium transition-all ${
                activeSection === item.href.replace('#', '')
                  ? 'bg-sunset-orange/10 text-sunset-orange'
                  : 'text-sunset-dark hover:text-sunset-orange hover:bg-sunset-orange/5'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#booking"
            onClick={(e) => handleNavClick(e, '#booking')}
            className="btn-pill btn-sunset text-center mt-2"
          >
            Book Now
          </a>
        </div>
      </div>
    </nav>
  );
}
