'use client';

import { useState } from 'react';
import type { ContactForm } from '@/types';

const initialForm: ContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

export default function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSubmitted(true);
      setForm(initialForm);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white relative overflow-hidden">
      {/* Background decorative blob */}
      <div
        className="absolute top-0 right-0 w-80 h-80 opacity-5 pointer-events-none translate-x-1/3 -translate-y-1/3"
        style={{ background: 'radial-gradient(circle, #FF6B35, transparent)', borderRadius: '60% 40%' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 opacity-5 pointer-events-none -translate-x-1/3 translate-y-1/3"
        style={{ background: 'radial-gradient(circle, #C1447E, transparent)', borderRadius: '40% 60%' }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="sunset-divider" />
            <span className="text-sunset-orange text-xs sm:text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
            <div className="sunset-divider" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-sunset-dark">
            Contact <span className="sunset-gradient-text">Us</span>
          </h2>
          <p className="text-sunset-purple/65 mt-3 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base px-2">
            Ready to begin your journey? Our concierge team is available 24/7 to craft your perfect escape.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Info */}
          <div className="space-y-6 sm:space-y-8 reveal-left">
            {/* Address card */}
            <div className="resort-card p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl sunset-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📍</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-sunset-dark mb-1">Our Address</h3>
                  <p className="text-sunset-purple/70 text-sm leading-relaxed">
                    NAGAS Resort & Spa<br />
                    123 Sunset Cove Drive<br />
                    Jaffna<br />
                    Sri Lanka
                  </p>
                </div>
              </div>
            </div>

            {/* Phone card */}
            <div className="resort-card p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl sunset-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📞</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-sunset-dark mb-1">Phone</h3>
                  <p className="text-sunset-purple/70 text-sm">+66 (0) 123 456 789</p>
                  <p className="text-sunset-purple/70 text-sm">+66 (0) 987 654 321</p>
                  <p className="text-sunset-orange text-xs mt-1 font-medium">Available 24 hours, 7 days</p>
                </div>
              </div>
            </div>

            {/* Email card */}
            <div className="resort-card p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl sunset-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">✉️</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-sunset-dark mb-1">Email</h3>
                  <p className="text-sunset-purple/70 text-sm">hello@nagasresort.com</p>
                  <p className="text-sunset-purple/70 text-sm">bookings@nagasresort.com</p>
                </div>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="resort-card overflow-hidden reveal">
              <div className="relative h-56 sm:h-72">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.81615847076!2d80.0040838!3d9.6615028!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3aff034a1e2d6e8b%3A0x2b0365b6c7e3c44a!2sJaffna%2C%20Sri%20Lanka!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NAGAS Resort Location - Jaffna, Sri Lanka"
                  className="absolute inset-0"
                />
                <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 backdrop-blur-sm px-4 py-2.5 shadow-lg border border-sunset-orange/10">
                  <p className="text-sunset-orange font-semibold text-sm">NAGAS Resort</p>
                  <p className="text-sunset-purple/60 text-xs">Jaffna, Sri Lanka</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Jaffna+Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-4 right-4 rounded-full bg-white/95 backdrop-blur-sm px-4 py-2 text-xs font-semibold text-sunset-dark shadow-lg border border-sunset-orange/10 hover:bg-sunset-orange hover:text-white transition-colors"
                >
                  Open in Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal-right">
            <div className="resort-card p-5 sm:p-8">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-sunset-dark mb-5 sm:mb-6">Send a Message</h3>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center animate-fade-in">
                    <p className="text-red-600 text-sm font-semibold">{error}</p>
                  </div>
                )}

                {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-center animate-fade-in">
                  <p className="text-green-700 font-semibold">✅ Message sent! We'll respond within 24 hours.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      id="contact-name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      id="contact-email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      id="contact-phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sunset-purple mb-2">Subject *</label>
                    <select
                      name="subject"
                      id="contact-subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select subject...</option>
                      <option value="booking-inquiry">Booking Inquiry</option>
                      <option value="special-event">Special Event Planning</option>
                      <option value="spa-wellness">Spa & Wellness</option>
                      <option value="corporate">Corporate Retreat</option>
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-sunset-purple mb-2">Message *</label>
                  <textarea
                    name="message"
                    id="contact-message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your dream escape..."
                    className="form-input resize-none h-36"
                    required
                  />
                </div>

                <button type="submit" disabled={sending} className="btn-pill btn-sunset w-full py-4 text-base font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {sending ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    'Send Message →'
                  )}
                </button>

                <p className="text-center text-xs text-sunset-purple/40 mt-4">
                  We typically respond within 2–4 hours during business hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
