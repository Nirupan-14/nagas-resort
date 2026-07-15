'use client';

import { usePageScrollReveal } from '@/hooks/useScrollReveal';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import RoomsGrid from '@/components/RoomsGrid';
import Gallery from '@/components/Gallery';
import GardenArea from '@/components/GardenArea';
import Booking from '@/components/Booking';
import ReviewsSection from '@/components/ReviewsSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  usePageScrollReveal();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <RoomsGrid />
        <Gallery />
        <GardenArea />
        <Booking />
        <ReviewsSection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
