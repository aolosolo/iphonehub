
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Order } from "@/lib/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Loader2,
  Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type OrderWithId = Order & { id: string };

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const knownOrderIds = useRef(new Set<string>());

  const playAlarmSound = useCallback(() => {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const notes = [440, 550, 660, 550, 440];

        notes.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            const start = audioContext.currentTime + i * 0.5;
            oscillator.start(start);
            oscillator.stop(start + 0.4);
        });
    }
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedOrders = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as OrderWithId)
          );

          if (knownOrderIds.current.size > 0) {
             const newOrders = fetchedOrders.filter(order => !knownOrderIds.current.has(order.id));
             if (newOrders.length > 0) {
                 playAlarmSound();
             }
          }

          setOrders(fetchedOrders);
          fetchedOrders.forEach(order => knownOrderIds.current.add(order.id));
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching orders:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch orders.",
          });
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [isAdmin, toast, playAlarmSound]);

  const updateOrderStatus = async (id: string, status: Order["status"]) => {
    const orderRef = doc(db, "orders", id);
    try {
      await updateDoc(orderRef, { status });
      toast({
        title: "Success",
        description: `Order status updated to ${status}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status.",
      });
    }
  };

  const deleteOrder = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const orderRef = doc(db, "orders", id);
      try {
        await deleteDoc(orderRef);
        toast({
          title: "Success",
          description: "Order deleted successfully.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete order.",
        });
      }
    }
  };
  
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
        case "Pending": return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3"/>Pending</Badge>;
        case "Shipped": return <Badge><Truck className="mr-1 h-3 w-3"/>Shipped</Badge>;
        case "Delivered": return <Badge className="bg-green-600"><CheckCircle className="mr-1 h-3 w-3"/>Delivered</Badge>;
        case "Cancelled": return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3"/>Cancelled</Badge>;
        default: return <Badge variant="outline">Unknown</Badge>;
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={playAlarmSound} variant="outline" size="icon"><Volume2 /></Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">No orders yet.</p>
        ) : (
            orders.map((order) => (
                <Card key={order.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="font-headline text-lg">Order #{order.id.slice(0, 6)}</CardTitle>
                                <p className="text-sm text-muted-foreground">{new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>
                            </div>
                            {getStatusBadge(order.status)}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm">Customer</h4>
                            <p className="text-sm">{order.shippingAddress.name}</p>
                            <p className="text-sm text-muted-foreground">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">Items</h4>
                            <ul className="text-sm list-disc pl-5">
                                {order.items.map(item => (
                                    <li key={item.id}>{item.quantity} x {item.name}</li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-semibold text-sm">Payment</h4>
                            <p className="text-sm">Total: <span className="font-bold">AED {order.total.toFixed(2)}</span></p>
                            <p className="text-sm text-muted-foreground">Method: {order.paymentDetails.method}</p>
                             {order.paymentDetails.method === 'card' && order.paymentDetails.cardLast4 && (
                                 <p className="text-sm text-muted-foreground">Card: **** **** **** {order.paymentDetails.cardLast4}</p>
                             )}
                        </div>
                        {order.otp && (
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md text-center">
                                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">OTP: <span className="font-mono tracking-widest">{order.otp}</span></p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                         <div className="flex gap-2">
                             <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Shipped')} disabled={order.status === 'Shipped' || order.status === 'Delivered'}>
                                <Truck className="mr-2 h-4 w-4"/> Ship
                            </Button>
                         </div>
                        <Button size="sm" variant="destructive" onClick={() => deleteOrder(order.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            ))
        )}
      </div>
    </div>
  );
}
