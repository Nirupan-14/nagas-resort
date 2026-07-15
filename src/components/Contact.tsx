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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
    setTimeout(() => setSubmitted(false), 4000);
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
        <div className="text-center mb-14 reveal">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="sunset-divider" />
            <span className="text-sunset-orange text-sm font-semibold tracking-widest uppercase">Get In Touch</span>
            <div className="sunset-divider" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark">
            Contact <span className="sunset-gradient-text">Us</span>
          </h2>
          <p className="text-sunset-purple/65 mt-4 max-w-xl mx-auto">
            Ready to begin your journey? Our concierge team is available 24/7 to craft your perfect escape.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 reveal-left">
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
                    Tropical Island Paradise<br />
                    Thailand 83150
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

            {/* Embedded Map placeholder */}
            <div className="resort-card overflow-hidden reveal">
              <div
                className="h-48 relative flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FFF8F0, #FFE4CC)' }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p className="text-sunset-orange font-semibold text-sm">Interactive Map</p>
                  <p className="text-sunset-purple/50 text-xs">NAGAS Resort, Thailand</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 btn-pill btn-sunset text-xs py-2 px-4"
                  >
                    Open in Maps →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal-right">
            <div className="resort-card p-8">
              <h3 className="font-serif text-2xl font-bold text-sunset-dark mb-6">Send a Message</h3>

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

                <button type="submit" className="btn-pill btn-sunset w-full py-4 text-base font-bold">
                  Send Message →
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
