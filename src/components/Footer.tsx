'use client';

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1A0A12, #2D0A20, #1A0A12)' }}
    >
      {/* Top sunset gradient line */}
      <div className="h-1 sunset-gradient-r" />

      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, #FF6B35, transparent)' }} />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full opacity-5 pointer-events-none" style={{ background: 'radial-gradient(circle, #C1447E, transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full sunset-gradient flex items-center justify-center shadow-sunset">
                <span className="text-white font-bold font-serif text-base">N</span>
              </div>
              <span className="font-serif text-2xl font-bold text-white">NAGAS Resort</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-6">
              A sanctuary of luxury, nature, and bespoke hospitality. Where every sunset is a celebration and every moment is crafted with love.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { label: 'Instagram', icon: '📸' },
                { label: 'Facebook', icon: '📘' },
                { label: 'Twitter/X', icon: '🐦' },
                { label: 'YouTube', icon: '▶️' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-sunset-orange/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <span className="text-sm">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-5">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '#home' },
                { label: 'About Us', href: '#about' },
                { label: 'Our Rooms', href: '#rooms' },
                { label: 'Gallery', href: '#gallery' },
                { label: 'Garden', href: '#garden' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-white/50 hover:text-sunset-gold text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-sunset-gold transition-all duration-300 overflow-hidden" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-5">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-sunset-orange mt-0.5">📍</span>
                <p className="text-white/50 text-sm leading-relaxed">
                  123 Sunset Cove Drive<br />
                  Thailand 83150
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-sunset-orange">📞</span>
                <p className="text-white/50 text-sm">+66 (0) 123 456 789</p>
              </li>
              <li className="flex gap-3">
                <span className="text-sunset-orange">✉️</span>
                <p className="text-white/50 text-sm">hello@nagasresort.com</p>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-white/70 text-sm font-medium mb-3">Stay inspired:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-white text-xs placeholder-white/30 outline-none focus:border-sunset-orange transition-colors"
                />
                <button className="btn-pill btn-sunset text-xs py-2 px-4">
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-xs">
            © 2026 NAGAS Resort & Spa. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-white/35 hover:text-white/70 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/35 text-xs">Concierge Online 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
