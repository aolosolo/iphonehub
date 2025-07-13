
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAdmin, loading } = useAuth();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@iphonehub.com",
      password: "",
    },
  });

  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, loading, router]);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    if (values.email !== 'admin@iphonehub.com') {
        toast({
            variant: "destructive",
            title: "Access Denied",
            description: "This login is for administrators only.",
        });
        return;
    }

    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Admin Login Successful",
        description: "Welcome, Admin!",
      });
      router.push("/admin");
    } catch (error: any) {
      console.error("Admin login failed:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
      });
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@iphonehub.com" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Sign in</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
