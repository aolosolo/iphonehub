
"use client";

import { useState } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/mock-data";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Minus, Plus, ShoppingCart } from "lucide-react";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
    });
    router.push('/cart');
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={600}
            height={600}
            className="w-full rounded-lg object-cover shadow-lg"
            data-ai-hint="phone product"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
          <p className="mt-2 text-3xl font-semibold text-primary">AED {product.price}</p>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Key Features:</h3>
            <ul className="mt-2 space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-md border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button size="lg" onClick={handleAddToCart} className="flex-grow">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
           <div className="mt-6">
                <Image 
                    src="https://ipoint.ae/cdn/shop/files/Payment-Cards-Banners.png" 
                    alt="Payment methods" 
                    width={450} 
                    height={30}
                    className="object-contain"
                />
            </div>
        </div>
      </div>
    </div>
  );
}
