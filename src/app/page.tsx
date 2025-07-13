
"use client";

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { products } from '@/lib/mock-data';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Laptop, Smartphone, Speaker, Watch } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
    { name: 'Phones', icon: <Smartphone className="h-8 w-8" /> },
    { name: 'Laptops', icon: <Laptop className="h-8 w-8" /> },
    { name: 'Watches', icon: <Watch className="h-8 w-8" /> },
    { name: 'Accessories', icon: <Speaker className="h-8 w-8" /> },
];

export default function Home() {
  const flashDeals = products.slice(0, 5);
  const bestSellers = products.slice(5, 10);
  const newArrivals = products.slice(10, 15);

  const [banners, setBanners] = useState({
    main: "https://placehold.co/800x400",
    sub1: "https://placehold.co/400x200",
    sub2: "https://placehold.co/400x200",
  });
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const docRef = doc(db, "siteContent", "banners");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBanners(docSnap.data().urls);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoadingBanners(false);
      }
    };
    fetchBanners();
  }, []);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="relative col-span-1 h-64 w-full rounded-lg bg-card p-8 shadow-lg lg:col-span-2 lg:h-auto">
            {loadingBanners ? <Skeleton className="w-full h-full rounded-lg"/> : (
              <Image
                src={banners.main}
                alt="iPhone 14 Pro Max"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint="phone banner"
              />
            )}
            <div className="relative z-10 flex h-full flex-col justify-end">
              <h1 className="font-headline text-4xl font-bold tracking-tighter text-black sm:text-5xl md:text-6xl">
                iPhone 14 Pro Max
              </h1>
              <Button asChild className="mt-4 w-fit">
                <Link href="#">Shop Now</Link>
              </Button>
            </div>
          </div>
          <div className="col-span-1 space-y-6">
            <div className="relative h-48 w-full rounded-lg bg-card p-6 shadow-lg">
              {loadingBanners ? <Skeleton className="w-full h-full rounded-lg"/> : (
                  <Image
                  src={banners.sub1}
                  alt="iPhone 15 Pro"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  data-ai-hint="phone banner"
                  />
              )}
               <div className="relative z-10">
                  <h2 className="font-headline text-2xl font-bold text-black">iPhone 15 Pro</h2>
                  <Button asChild variant="secondary" className="mt-2">
                      <Link href="#">Shop Now</Link>
                  </Button>
               </div>
            </div>
            <div className="relative h-48 w-full rounded-lg bg-card p-6 shadow-lg">
              {loadingBanners ? <Skeleton className="w-full h-full rounded-lg"/> : (
                  <Image
                  src={banners.sub2}
                  alt="iPhone 15"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  data-ai-hint="phone banner"
                  />
              )}
              <div className="relative z-10">
                  <h2 className="font-headline text-2xl font-bold text-black">iPhone 15</h2>
                   <Button asChild variant="secondary" className="mt-2">
                      <Link href="#">Shop Now</Link>
                  </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-3xl font-bold">Featured Categories</h2>
                <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4"/></Button>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {categories.map(category => (
                    <div key={category.name} className="flex flex-col items-center justify-center gap-4 rounded-lg bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                        {category.icon}
                        <p className="font-semibold">{category.name}</p>
                    </div>
                ))}
            </div>
        </section>


        {/* Flash Deals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-3xl font-bold">Flash Deals</h2>
            <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {flashDeals.map((product: Product) => (
                <Card key={product.id} className="flex h-full flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl">
                    <CardHeader className="p-0">
                        <Link href={`/products/${product.id}`} className="block">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={400}
                            height={400}
                            className="h-48 w-full object-cover"
                            data-ai-hint="phone product"
                        />
                        </Link>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                        <Link href={`/products/${product.id}`}>
                        <CardTitle className="mb-2 text-md font-headline hover:text-primary h-10">{product.name}</CardTitle>
                        </Link>
                        <div className="flex items-baseline gap-2">
                            <p className="text-xl font-semibold text-primary">${(product.price * 0.9).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                        </div>
                        <Progress value={(product.stock / 200) * 100} className="mt-2 h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{product.stock} available</p>
                    </CardContent>
                    <CardFooter className="p-4">
                         <Button className="w-full">Add to Cart</Button>
                    </CardFooter>
                </Card>
            ))}
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-3xl font-bold">Best Sellers</h2>
            <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {bestSellers.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        
        {/* Banner Section */}
        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="relative h-64 w-full rounded-lg bg-card p-8 text-white shadow-lg">
                <Image
                src="https://placehold.co/600x300"
                alt="Apple Watch Series 8"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint="smartwatch banner"
                />
                <div className="relative z-10 flex h-full flex-col items-start justify-center">
                    <h3 className="font-headline text-3xl font-bold text-black">Apple Watch Series 8</h3>
                    <Button asChild className="mt-4">
                        <Link href="#">Shop Now</Link>
                    </Button>
                </div>
            </div>
             <div className="relative h-64 w-full rounded-lg bg-card p-8 text-white shadow-lg">
                <Image
                src="https://placehold.co/600x300"
                alt="Apple Watch SE"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint="smartwatch banner"
                />
                 <div className="relative z-10 flex h-full flex-col items-start justify-center">
                    <h3 className="font-headline text-3xl font-bold text-black">Apple Watch SE</h3>
                    <Button asChild className="mt-4">
                        <Link href="#">Shop Now</Link>
                    </Button>
                </div>
            </div>
        </section>

         {/* New Arrivals */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-3xl font-bold">New Arrivals</h2>
            <Button variant="ghost">View All <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {newArrivals.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>


        {/* Subscription */}
        <section className="rounded-lg bg-primary/10 p-8 text-center">
            <h2 className="font-headline text-3xl font-bold">Subscribe & Get 10% Discount</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                Subscribe to our newsletter and get a 10% discount on your first purchase.
            </p>
            <div className="mt-6 flex max-w-md mx-auto">
                <Input type="email" placeholder="Enter your email" className="rounded-r-none"/>
                <Button className="rounded-l-none">Subscribe</Button>
            </div>
        </section>

      </div>
    </div>
  );
}
