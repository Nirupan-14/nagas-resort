'use client';

type IconProps = { className?: string };

const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
    <path d="M14 9h3V6h-3c-1.66 0-3 1.34-3 3v2H9v3h2v6h3v-6h3l1-3h-4v-2c0-.55.45-1 1-1z" />
  </svg>
);

const TwitterIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
    <path d="M4 4l7.5 9.5L4.3 20H6l6.2-5.9L17 20h3l-7.8-9.9L19.5 4h-1.7l-5.7 5.4L7 4H4z" />
  </svg>
);

const YoutubeIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className={className}>
    <rect x="2.5" y="6" width="19" height="12" rx="3" />
    <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
  </svg>
);

const MapPinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
    <path d="M12 22s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const PhoneIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
    <path d="M4 4h4l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v4a2 2 0 01-2 2A16 16 0 014 6a2 2 0 012-2z" />
  </svg>
);

const MailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const ArrowRightIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export default function Footer() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      className="relative"
      style={{ background: '#8B6914' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#2b2313]">
                <span className="text-[#E9CE8E] font-serif text-base">N</span>
              </div>
              <span className="font-serif text-xl font-semibold text-white tracking-wide">
                NAGAS RESORT
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-7">
              A sanctuary of luxury, nature, and bespoke hospitality — where every
              sunset is a celebration and every stay is crafted with care.
            </p>

            <div className="flex gap-3">
              {[
                { label: 'Instagram', Icon: InstagramIcon },
                { label: 'Facebook', Icon: FacebookIcon },
                { label: 'Twitter/X', Icon: TwitterIcon },
                { label: 'YouTube', Icon: YoutubeIcon },
              ].map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-white/90 hover:bg-white hover:text-[#2b2313] hover:border-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Explore
            </h4>
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
                    className="text-white/80 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Contact
            </h4>
            <ul className="space-y-4 mb-7">
              <li className="flex gap-3">
                <MapPinIcon className="w-4 h-4 text-[#2b2313] mt-0.5 shrink-0" />
                <p className="text-white/80 text-sm leading-relaxed">
                  123 Sunset Cove Drive<br />
                  Thailand 83150
                </p>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="w-4 h-4 text-[#2b2313] shrink-0" />
                <p className="text-white/80 text-sm">+66 (0) 123 456 789</p>
              </li>
              <li className="flex gap-3">
                <MailIcon className="w-4 h-4 text-[#2b2313] shrink-0" />
                <p className="text-white/80 text-sm">hello@nagasresort.com</p>
              </li>
            </ul>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/20 border border-white/30 rounded-full px-4 py-2.5 text-white text-xs placeholder-white/60 outline-none focus:border-white transition-colors"
              />
              <button
                aria-label="Subscribe"
                className="w-9 h-9 shrink-0 rounded-full bg-white text-[#2b2313] flex items-center justify-center hover:scale-105 transition-transform"
              >
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/25 mt-14 pt-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/70 text-xs">
            © 2026 NAGAS Resort &amp; Spa. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-white/70 hover:text-white text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
            <span className="text-white/70 text-xs">Concierge Online 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}