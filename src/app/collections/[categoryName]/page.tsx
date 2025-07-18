
"use client";

import { notFound } from "next/navigation";
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';

interface Category {
  title: string;
  description: string;
  filter: (product: Product) => boolean;
  slug: string;
}

const categories: Category[] = [
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


export default function CategoryPage({ params }: { params: { categoryName: string } }) {
  const { categoryName } = params;
  const category = categories.find(c => c.slug === categoryName);

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(category.filter);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter">
          {category.title}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
          {category.description}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
