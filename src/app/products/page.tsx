
"use client";

import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';

export default function ProductsPage() {

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter">
          All Products
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-3xl">
          Browse our complete catalog of Apple products and accessories.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
