
"use client";

import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { HeroBanners } from '@/components/hero-banners';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

export default function Home() {
  return (
    <div className="bg-background">
      <HeroBanners />
      <div className="container mx-auto px-4 py-12 space-y-16">
        
        {categories.map((category) => {
          const categoryProducts = products.filter(category.filter).slice(0, 4);
          if (categoryProducts.length === 0) return null;

          return (
            <section key={category.title}>
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-headline text-3xl font-bold tracking-tighter">
                      {category.title}
                    </h2>
                    <p className="mt-1 text-muted-foreground max-w-2xl">
                      {category.description}
                    </p>
                  </div>
                  <Button variant="ghost" asChild className="mt-2 sm:mt-0">
                    <Link href={`/collections/${category.slug}`}>
                      View All <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}
