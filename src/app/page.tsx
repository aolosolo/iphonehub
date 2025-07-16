
"use client";

import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';

export default function Home() {
  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                All Products
            </h1>
            <p className="mt-2 max-w-2xl mx-auto text-muted-foreground">
                Browse our complete collection of the latest and greatest Apple products.
            </p>
        </header>

        <section>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
