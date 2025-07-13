"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, ClipboardList, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="mb-8 font-headline text-4xl font-bold">Admin Dashboard</h1>
            <p>Loading or redirecting...</p>
        </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-headline text-4xl font-bold">Admin Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Manage your products, orders, and users from here.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Manage Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full"><Link href="#">Go to Products</Link></Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Manage Orders</CardTitle>
                    <ClipboardList className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full"><Link href="#">Go to Orders</Link></Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full"><Link href="#">Go to Users</Link></Button>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}