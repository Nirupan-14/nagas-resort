// Navigation
export interface NavItem {
  label: string;
  href: string;
}

// Room/Property
export interface Room {
  id: string;
  name: string;
  description: string;
  image: string;
  stat: string;
  statLabel: string;
  price: string;
  size?: string;
  capacity?: number;
}

// Gallery
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  span?: 'wide' | 'tall' | 'normal';
}

// Review
export interface ReviewProps {
  name: string;
  role: string;
  quote: string;
  image?: string;
  rating: number;
  gender?: 'male' | 'female' | 'other';
  createdAt?: string;
}

// Booking Forms
export interface RoomBookingForm {
  checkIn: string;
  checkOut: string;
  roomType: string;
  guests: number;
  specialRequests: string;
}

export interface FoodBookingForm {
  date: string;
  time: string;
  package: string;
  people: number;
  dietaryNotes: string;
}

export interface VehicleBookingForm {
  vehicleType: string;
  pickupDate: string;
  pickupTime: string;
  destination: string;
  passengers: number;
}

export type BookingTab = 'room' | 'food' | 'vehicle';

// Contact
export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Garden Feature
export interface GardenFeature {
  icon: string;
  title: string;
  description: string;
}
