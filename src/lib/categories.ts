
import type { Product } from './types';

export interface Category {
  title: string;
  description: string;
  filter: (product: Product) => boolean;
  slug: string;
}

export const categories: Category[] = [
  {
    title: "Latest iPhones",
    description: "Discover the newest iPhone models with cutting-edge features.",
    filter: (p) => p.name.toLowerCase().includes('iphone'),
    slug: "latest-iphones"
  },
  {
    title: "Mac & MacBook",
    description: "Experience the power and performance of Apple's laptops and desktops.",
    filter: (p) => p.name.toLowerCase().includes('macbook') || p.name.toLowerCase().includes('imac') || p.name.toLowerCase().includes('mac mini'),
    slug: "mac-macbook"
  },
  {
    title: "iPad Collection",
    description: "Explore the versatile world of iPad for work, play, and creativity.",
    filter: (p) => p.name.toLowerCase().includes('ipad'),
    slug: "ipad-collection"
  },
  {
    title: "Apple Watch",
    description: "Stay connected, active, and healthy with the latest Apple Watch.",
    filter: (p) => p.name.toLowerCase().includes('watch'),
    slug: "apple-watch"
  },
  {
    title: "Accessories",
    description: "Enhance your Apple experience with our range of accessories.",
    filter: (p) => !p.name.toLowerCase().includes('iphone') && !p.name.toLowerCase().includes('mac') && !p.name.toLowerCase().includes('ipad') && !p.name.toLowerCase().includes('watch'),
    slug: "accessories"
  },
];
