
"use client";

import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  if (!query) {
    return (
      <div className="text-center">
        <p>Please enter a search term to find products.</p>
      </div>
    );
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tighter">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found.
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found matching your search term.</p>
      )}
    </div>
  );
}

export default function SearchPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <Suspense fallback={<div>Loading...</div>}>
                <SearchResults />
            </Suspense>
        </div>
    )
}
