
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

const shippingSchema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(4, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
});

const paymentSchema = z.object({
    paymentMethod: z.enum(['card', 'crypto']),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvc: z.string().optional(),
    cryptoTrxId: z.string().optional(),
    otp: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.paymentMethod === 'card') {
        if (!/^\d{16}$/.test(data.cardNumber || '')) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid card number", path: ['cardNumber'] });
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry || '')) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid expiry date (MM/YY)", path: ['expiry'] });
        }
        if (!/^\d{3,4}$/.test(data.cvc || '')) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid CVC", path: ['cvc'] });
        }
    }
    if (data.paymentMethod === 'crypto' && !data.cryptoTrxId) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Transaction ID is required", path: ['cryptoTrxId'] });
    }
});

const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});


const checkoutSchema = shippingSchema.merge(paymentSchema);

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [timer, setTimer] = useState(180); // 3 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      zip: "",
      country: "",
      paymentMethod: 'card',
      cardNumber: "",
      expiry: "",
      cvc: "",
      cryptoTrxId: "",
      otp: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      toast({
        variant: "destructive",
        title: "Time's up!",
        description: "Your OTP has expired. Please go back and try again.",
      });
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer, toast]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const processNextStep = async () => {
    let fieldsToValidate: (keyof CheckoutFormValues)[] = [];
    if (step === 1) {
      fieldsToValidate = ["name", "address", "city", "zip", "country"];
    } else if (step === 2) {
      fieldsToValidate.push("paymentMethod");
      if (paymentMethod === 'card') {
        fieldsToValidate.push("cardNumber", "expiry", "cvc");
      } else {
        fieldsToValidate.push("cryptoTrxId");
      }
    }
    
    const isValid = await form.trigger(fieldsToValidate);
    if (!isValid) return;

    if (step === 2 && paymentMethod === 'card') {
        setStep(3);
        setTimer(180);
        setIsTimerRunning(true);
    } else {
        form.handleSubmit(onSubmit)();
    }
  };

  const processPrevStep = () => {
    setStep(s => s - 1);
  };

  async function onSubmit(values: CheckoutFormValues) {
     if (step === 3) {
        const isOtpValid = await form.trigger(['otp']);
        if (!isOtpValid) return;
     }

    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to place an order.",
        });
        router.push('/login');
        return;
    }

    setLoading(true);

    try {
        const orderData = {
            userId: user.uid,
            items: cart,
            total: subtotal,
            status: "Pending",
            shippingAddress: {
                name: values.name,
                address: values.address,
                city: values.city,
                zip: values.zip,
                country: values.country,
            },
            paymentDetails: {
                method: values.paymentMethod,
                cardLast4: values.paymentMethod === 'card' ? values.cardNumber?.slice(-4) : undefined,
                cryptoTrxId: values.paymentMethod === 'crypto' ? values.cryptoTrxId : undefined,
            },
            createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, "orders"), orderData);
        
        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase.",
        });
        clearCart();
        router.push("/dashboard");

    } catch (error) {
        console.error("Error placing order:", error);
        toast({
            variant: "destructive",
            title: "Order Failed",
            description: "There was a problem placing your order. Please try again.",
        });
    } finally {
        setLoading(false);
    }
  }

  if (cart.length === 0 && typeof window !== 'undefined') {
    router.push('/');
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Step {step}: {step === 1 ? 'Shipping Address' : step === 2 ? 'Payment Method' : 'Verification'}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {step === 1 && (
                  <section>
                    <div className="space-y-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl><Input placeholder="123 Apple St" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl><Input placeholder="Cupertino" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="zip" render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl><Input placeholder="95014" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                         <FormField control={form.control} name="country" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl><Input placeholder="USA" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Select Payment Method</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="card" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Credit/Debit Card
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="crypto" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Cryptocurrency
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {paymentMethod === 'card' && (
                        <div className="space-y-4 pt-4">
                            <FormField control={form.control} name="cardNumber" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Card Number</FormLabel>
                                  <FormControl><Input placeholder="**** **** **** ****" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                              <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="expiry" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiry (MM/YY)</FormLabel>
                                      <FormControl><Input placeholder="MM/YY" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )} />
                                <FormField control={form.control} name="cvc" render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVC</FormLabel>
                                      <FormControl><Input placeholder="123" {...field} /></FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )} />
                              </div>
                        </div>
                    )}

                    {paymentMethod === 'crypto' && (
                        <div className="space-y-4 pt-4">
                             <FormField control={form.control} name="cryptoTrxId" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Transaction ID (TRXID)</FormLabel>
                                  <FormControl><Input placeholder="Enter your transaction ID" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                        </div>
                    )}
                  </section>
                )}

                 {step === 3 && (
                  <section>
                    <div className="space-y-4 text-center">
                        <p>An OTP has been sent to your registered mobile number. Please enter it below to verify your payment.</p>
                        <FormField control={form.control} name="otp" render={({ field }) => (
                          <FormItem className="max-w-xs mx-auto">
                            <FormLabel>Enter OTP</FormLabel>
                            <FormControl>
                                <Input placeholder="123456" {...field} maxLength={6} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <p className="font-mono text-lg font-semibold text-destructive">{formatTime(timer)}</p>
                    </div>
                  </section>
                )}

                <div className="flex justify-between pt-4">
                    {step > 1 && (
                        <Button type="button" variant="outline" onClick={processPrevStep} disabled={loading}>
                            <ArrowLeft className="mr-2" />
                            Back
                        </Button>
                    )}
                    <div className="flex-grow" />
                    {step < 3 && (
                        <Button type="button" onClick={processNextStep} disabled={loading}>
                           {loading ? <Loader2 className="animate-spin"/> : 'Next'}
                           <ArrowRight className="ml-2" />
                        </Button>
                    )}
                     {(step === 3 || (step === 2 && paymentMethod === 'crypto')) && (
                        <Button type="submit" size="lg" disabled={loading || (step === 3 && timer === 0)}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             {step === 3 && timer === 0 ? 'OTP Expired' : `Place Order for $${subtotal.toFixed(2)}`}
                        </Button>
                    )}
                </div>

              </form>
            </Form>
          </CardContent>
        </Card>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                </div>
                                <p>${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>${subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    