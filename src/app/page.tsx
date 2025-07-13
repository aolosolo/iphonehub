import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import Link from 'next/link';

export default function Home() {
  const featuredProduct = products[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 rounded-lg bg-card p-8 text-center shadow-lg">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Welcome to iPhoneHub
        </h1>
        <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
          Your one-stop shop for the latest and greatest from Apple. Discover the perfect iPhone for you.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="font-headline mb-6 text-3xl font-bold">All Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
