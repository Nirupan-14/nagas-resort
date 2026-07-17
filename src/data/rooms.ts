export interface RoomOption {
  value: string;
  label: string;
  availability: string;
  note: string;
  description: string;
  image: string;
}

export const roomOptions: RoomOption[] = [
  {
    value: 'lagoon-villa',
    label: 'Lagoon Villa Retreat',
    availability: '8 rooms available',
    note: 'Ocean-view villa with private terrace',
    description: 'A lush waterfront escape with soft natural light and calm, sustainable luxury.',
    image: '/images/room-villa.png',
  },
  {
    value: 'ocean-pavilion',
    label: 'Ocean Edge Pavilion',
    availability: '4 rooms available',
    note: 'Perfect for couples and weekend escapes',
    description: 'A modern seaside home with inviting decks, striking views, and thoughtful eco design.',
    image: '/images/pool.png',
  },
  {
    value: 'garden-suite',
    label: 'Garden House Escape',
    availability: 'Limited availability',
    note: 'Quiet garden stay with premium amenities',
    description: 'Serene botanical living with warm textures, generous light, and lush private gardens.',
    image: '/images/garden.png',
  },
  {
    value: 'royal-suite',
    label: 'Royal Residence Suite',
    availability: '2 rooms available',
    note: 'Top-tier luxury experience with suite perks',
    description: 'A refined residence that pairs open-air dining with elegant sustainable finishes.',
    image: '/images/dining.png',
  },
];

export function getRoomOption(value: string) {
  return roomOptions.find((room) => room.value === value) ?? roomOptions[0];
}
