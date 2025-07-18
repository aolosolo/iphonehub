
"use client";

import { notFound } from "next/navigation";
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import { categories } from "@/lib/categories";

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
