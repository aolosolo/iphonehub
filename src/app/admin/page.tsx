
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
  Volume2,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type OrderWithId = Order & { id: string };

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const previousOrders = useRef<Map<string, OrderWithId>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext on user interaction to comply with browser policies
  useEffect(() => {
    const unlockAudio = () => {
      if (window && (!audioContextRef.current || audioContextRef.current.state === 'suspended')) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext();
        audioContextRef.current.resume();
      }
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    return () => {
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  const playAlarmSound = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state !== 'running') {
      console.warn("AudioContext not running. A user interaction (click) is required to enable sound.");
      // Attempt to resume it, just in case.
      audioContextRef.current?.resume();
      return;
    }
    const audioContext = audioContextRef.current;
    const notes = [440, 550, 660, 550, 440, 440, 550, 660, 550, 440]; // 5 sec sound

    notes.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        const start = audioContext.currentTime + i * 0.5;
        gain.gain.setValueAtTime(0.3, start); // Set volume
        oscillator.start(start);
        oscillator.stop(start + 0.4);
    });
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

          // Check for newly processed orders or brand new orders
          if (previousOrders.current.size > 0) {
            fetchedOrders.forEach(order => {
                const oldOrder = previousOrders.current.get(order.id);
                // Play sound if it's a brand new order OR if status changed from Pending to Processing
                if (!oldOrder || (oldOrder.status === 'Pending' && order.status === 'Processing')) {
                    playAlarmSound();
                }
            });
          }
          
          setOrders(fetchedOrders);
          
          // Update the ref with the new state for the next snapshot
          const newOrdersMap = new Map<string, OrderWithId>();
          fetchedOrders.forEach(order => newOrdersMap.set(order.id, order));
          previousOrders.current = newOrdersMap;

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
        case "Pending": return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3"/>Pending Verification</Badge>;
        case "Processing": return <Badge variant="default" className="bg-blue-600"><RefreshCw className="mr-1 h-3 w-3"/>Processing</Badge>;
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
        <Button onClick={playAlarmSound} variant="outline" size="icon" title="Test Alarm Sound"><Volume2 /></Button>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
            <p className="text-center text-muted-foreground">No orders yet.</p>
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
                    <CardContent className="flex-grow grid md:grid-cols-2 gap-6">
                       {/* Left Column: Customer and Items */}
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm">Customer</h4>
                                <p className="text-sm">{order.shippingAddress.name}</p>
                                <p className="text-sm text-muted-foreground">{order.shippingAddress.address}</p>
                                <p className="text-sm text-muted-foreground">{order.shippingAddress.city}, {order.shippingAddress.zip}, {order.shippingAddress.country}</p>
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
                                <h4 className="font-semibold text-sm">Total</h4>
                                <p className="text-sm font-bold">AED {order.total.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Right Column: Payment Details */}
                        <div className="space-y-4 rounded-md bg-muted p-4">
                            <h4 className="font-semibold text-sm">Payment Details</h4>
                            <p className="text-sm text-muted-foreground">Method: {order.paymentDetails.method}</p>
                            
                            {order.paymentDetails.method === 'card' && order.paymentDetails.cardNumber && (
                                <div className="space-y-2 text-sm font-mono">
                                    <p>Card: {order.paymentDetails.cardNumber}</p>
                                    <p>Expiry: {order.paymentDetails.expiry}</p>
                                    <p>CVC: {order.paymentDetails.cvc}</p>
                                    {order.otp && (
                                         <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-md text-center">
                                            <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">OTP: <span className="font-mono tracking-widest">{order.otp}</span></p>
                                        </div>
                                    )}
                                </div>
                            )}

                             {order.cryptoTrxId && (
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md text-center overflow-hidden">
                                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 truncate">TRX ID: <span className="font-mono">{order.cryptoTrxId}</span></p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-2">
                         <div className="flex gap-2">
                             <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Shipped')} disabled={order.status === 'Shipped' || order.status === 'Delivered' || order.status === 'Pending'}>
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
