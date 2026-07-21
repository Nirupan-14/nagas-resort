'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import type { ReviewProps } from '@/types';

const defaultReviews: ReviewProps[] = [
  
 
  {
    name: 'Kenji Watanabe',
    role: 'Executive, Tokyo',
    quote:
      'NAGAS offered me something rare — true disconnection. No distractions, just nature, exceptional cuisine, and a team that anticipated every need with quiet elegance. This is where I come to remember what truly matters.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    rating: 5,
    gender: 'male',
  },
];

const emptyForm = {
  name: '',
  role: '',
  quote: '',
  rating: 5,
  gender: 'other' as ReviewProps['gender'],
  image: '',
};

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<ReviewProps[]>(defaultReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const total = reviews.length;

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        if (!isMounted) return;
        setReviews(Array.isArray(data) && data.length > 0 ? data : defaultReviews);
        setCurrentIndex(0);
      } catch {
        if (!isMounted) return;
        setReviews(defaultReviews);
      }
    };

    void loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFileName('');
      setFormData((previous) => ({ ...previous, image: '' }));
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((previous) => ({ ...previous, image: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.role.trim() || !formData.quote.trim()) {
      setError('Please add your name, role, and review before sharing it.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          role: formData.role.trim(),
          quote: formData.quote.trim(),
          rating: Number(formData.rating),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit review right now.');
      }

      setReviews((previous) => [data, ...previous]);
      setCurrentIndex(0);
      setFormData(emptyForm);
      setSelectedFileName('');
      setShowModal(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit review right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const goPrev = () => setCurrentIndex((previous) => (previous - 1 + total) % total);
  const goNext = () => setCurrentIndex((previous) => (previous + 1) % total);

  return (
    <section id="reviews" className="section-padding bg-sunset-cream relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C1447E, transparent)' }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Header row: title + subtitle on the left, round nav control on the right — mirrors the reference screenshot */}
        <div className="flex items-start justify-between gap-6 mb-10 reveal">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-sunset-dark">
              Client <span className="sunset-gradient-text">Reviews</span>
            </h2>
            <p className="text-sunset-purple/60 mt-2 max-w-sm text-sm">
              Hear from the guests who have lived the NAGAS experience — their stories are our greatest reward.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={goPrev}
              disabled={total <= 1}
              className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-sunset-orange text-sunset-orange transition-all duration-300 hover:bg-sunset-orange hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous review"
            >
              ←
            </button>
            <button
              onClick={goNext}
              disabled={total <= 1}
              className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-sunset-orange text-sunset-orange transition-all duration-300 hover:bg-sunset-orange hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next review"
            >
              →
            </button>
          </div>
        </div>

        {/* Single featured review card, styled per the screenshot */}
        <div className="reveal">
          {total > 0 ? (
            <ReviewCard {...reviews[currentIndex]} />
          ) : (
            <p className="text-sunset-purple/70">No reviews yet — be the first to add one.</p>
          )}
        </div>

        {/* Dots + add-review action */}
        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="flex gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-sunset-orange' : 'w-2.5 bg-sunset-orange/25'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-full bg-sunset-orange px-5 py-2 text-sm font-semibold text-white hover:bg-sunset-pink"
          >
            Add a review
          </button>
        </div>

        {/* Modal form for adding a review */}
        {showModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
             
             <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-sunset-dark">Share your valuable review</h3>
                  <p className="text-sunset-purple/70 text-sm mt-1">Add your story, upload a photo, and let your review appear here.</p>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="text-sunset-purple/60">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-sunset-dark">Name</label>
                  <input
                    value={formData.name}
                    onChange={(event) => setFormData((previous) => ({ ...previous, name: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-sunset-orange/20 bg-white px-4 py-3 text-sm outline-none focus:border-sunset-orange"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-sunset-dark">Role</label>
                  <input
                    value={formData.role}
                    onChange={(event) => setFormData((previous) => ({ ...previous, role: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-sunset-orange/20 bg-white px-4 py-3 text-sm outline-none focus:border-sunset-orange"
                    placeholder="Travel Blogger, London"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-sunset-dark">Review</label>
                  <textarea
                    value={formData.quote}
                    onChange={(event) => setFormData((previous) => ({ ...previous, quote: event.target.value }))}
                    rows={4}
                    className="mt-2 w-full rounded-2xl border border-sunset-orange/20 bg-white px-4 py-3 text-sm outline-none focus:border-sunset-orange"
                    placeholder="Tell us about your stay..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-sunset-dark">Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(event) => setFormData((previous) => ({ ...previous, rating: Number(event.target.value) }))}
                    className="mt-2 w-full rounded-2xl border border-sunset-orange/20 bg-white px-4 py-3 text-sm outline-none focus:border-sunset-orange"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} star{value > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-sunset-dark">Gender for your icon</label>
                  <select
                    value={formData.gender ?? 'other'}
                    onChange={(event) => setFormData((previous) => ({ ...previous, gender: event.target.value as ReviewProps['gender'] }))}
                    className="mt-2 w-full rounded-2xl border border-sunset-orange/20 bg-white px-4 py-3 text-sm outline-none focus:border-sunset-orange"
                  >
                    <option value="other">Other</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-sunset-dark">Upload photo (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-2 block w-full rounded-2xl border border-dashed border-sunset-orange/30 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-sunset-orange file:px-4 file:py-2 file:text-white"
                  />
                  {selectedFileName ? <p className="mt-2 text-sm text-sunset-purple/70">Selected: {selectedFileName}</p> : null}
                </div>
                {error ? <p className="md:col-span-2 text-sm text-rose-600">{error}</p> : null}
                <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-sunset-orange px-6 py-3 text-sm font-semibold text-white transition hover:bg-sunset-pink disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Sharing your review...' : 'Submit review'}
                  </button>
                  <p className="text-sm text-sunset-purple/70">If you skip the photo, a friendly avatar will appear based on your selected gender.</p>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}