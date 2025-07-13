import type { Product } from './types';

export const products: Product[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    description:
      'The ultimate iPhone. A17 Pro chip. A customizable Action button. The most powerful iPhone camera system. And USB-C with USB 3 for superfast transfer speeds.',
    price: 999,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    specs: {
      storage: '128GB',
      color: 'Natural Titanium',
      display: '6.1-inch Super Retina XDR display',
    },
    features: ['Dynamic Island', 'A17 Pro Chip', 'Pro Camera System', 'USB-C Connector'],
    stock: 50,
  },
  {
    id: 'iphone-15',
    name: 'iPhone 15',
    description: 'iPhone 15 brings you Dynamic Island, a 48MP Main camera, and USB-C — all in a durable color-infused glass and aluminum design.',
    price: 799,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600', 'https://placehold.co/600x600'],
    specs: {
      storage: '128GB',
      color: 'Blue',
      display: '6.1-inch Super Retina XDR display',
    },
    features: ['Dynamic Island', 'A16 Bionic Chip', 'Advanced dual-camera system', 'USB-C Connector'],
    stock: 75,
  },
  {
    id: 'iphone-14',
    name: 'iPhone 14',
    description: 'A huge leap in battery life. A new, more advanced dual-camera system. A15 Bionic, the fastest chip in a smartphone.',
    price: 699,
    images: ['https://placehold.co/600x600', 'https://placehold.co/600x600'],
    specs: {
      storage: '128GB',
      color: 'Midnight',
      display: '6.1-inch Super Retina XDR display',
    },
    features: ['A15 Bionic Chip', 'Dual-camera system', 'Emergency SOS via satellite', 'Ceramic Shield'],
    stock: 100,
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    description: 'Serious power. Serious value. A15 Bionic chip and 5G. A superstar camera. All in a pocket-friendly 4.7-inch design.',
    price: 429,
    images: ['https://placehold.co/600x600'],
    specs: {
      storage: '64GB',
      color: 'Starlight',
      display: '4.7-inch Retina HD display',
    },
    features: ['A15 Bionic Chip', '5G capable', 'Advanced single-camera system', 'Home Button with Touch ID'],
    stock: 200,
  },
];
