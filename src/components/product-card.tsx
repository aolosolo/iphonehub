"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Progress } from './ui/progress';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const stockPercentage = product.stock > 0 ? (product.stock / (product.stock + 10)) * 100 : 0; // Example logic

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg shadow-md transition-shadow hover:shadow-xl relative">
       {product.price < 900 && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
            - {Math.round(((999 - product.price) / 999) * 100)}%
          </div>
        )}
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
        <p className="text-xl font-semibold">AED {product.price.toFixed(2)}</p>
         <div className="mt-2">
            <Progress value={stockPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Available: {product.stock}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <Button onClick={handleAddToCart} className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
