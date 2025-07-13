"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  Search,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "./icons";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const navLinks = [
    { href: "/", label: "Laptops" },
    { href: "/", label: "Desktop PCs" },
    { href: "/", label: "Networking Devices" },
    { href: "/", label: "PC Parts" },
    { href: "/", label: "Repairs" },
]

export function Header() {
  const { cart } = useCart();
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const itemCount = isMounted ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline text-2xl">
              iPhoneHub
            </span>
          </Link>
        </div>
        
        <div className="hidden md:flex flex-1 items-center justify-center">
             <nav className="flex items-center space-x-6 text-sm font-medium">
                {navLinks.map(link => (
                     <Link
                        key={link.label}
                        href={link.href}
                        className="transition-colors hover:text-foreground/80 text-foreground"
                        >
                        {link.label}
                    </Link>
                ))}
             </nav>
        </div>


        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <Icons.logo className="h-6 w-6" />
                <span className="font-bold font-headline">iPhoneHub</span>
              </Link>
              {navLinks.map(link => (
                     <Link
                        key={link.label}
                        href={link.href}
                        className="transition-colors hover:text-foreground/80 text-foreground"
                        >
                        {link.label}
                    </Link>
                ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {itemCount}
                </span>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    Hi, {user.displayName || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                        <Link href="/admin">Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}