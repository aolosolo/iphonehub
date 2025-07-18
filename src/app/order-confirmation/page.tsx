
"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, Truck, ShoppingBag, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const orderRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(orderRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (!order) return null;

  const estimatedDeliveryDate = order.estimatedDelivery?.toDate().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <CardTitle className="mt-4 font-headline text-3xl">Congratulations!</CardTitle>
        <p className="text-muted-foreground">Your order has been placed successfully.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm">Order ID</p>
            <p className="font-mono text-lg font-semibold">{order.id}</p>
        </div>
        
        <Separator />
        
        <div>
            <h3 className="mb-4 font-semibold text-lg flex items-center"><ShoppingBag className="mr-2 h-5 w-5 text-primary" />Order Summary</h3>
            <div className="space-y-2">
                {order.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                        <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                        <span>AED {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
             <Separator className="my-4" />
            <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>AED {order.total.toFixed(2)}</span>
            </div>
        </div>
        
        <Separator />

        <div>
            <h3 className="mb-4 font-semibold text-lg flex items-center"><Truck className="mr-2 h-5 w-5 text-primary" />Shipping Details</h3>
            <p className="font-semibold">{order.shippingAddress.name}</p>
            <p className="text-muted-foreground">{order.shippingAddress.address}</p>
            <p className="text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
            <div className="mt-4 rounded-lg border border-dashed border-primary bg-primary/10 p-4 text-center">
                <p className="text-sm font-medium">Estimated Delivery</p>
                <p className="font-bold text-primary">{estimatedDeliveryDate}</p>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <p className="text-sm text-muted-foreground text-center">You will receive an email confirmation shortly. Thank you for shopping with us!</p>
        <Button asChild className="w-full">
            <Link href="/">Continue Shopping</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function OrderConfirmationPage() {
    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <Suspense fallback={<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
                <OrderConfirmationContent />
            </Suspense>
        </div>
    )
}
