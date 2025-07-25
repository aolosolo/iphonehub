
"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  Heart,
  GitCompare,
  LogOut,
  Phone,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Icons } from "./icons";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { categories } from "@/lib/categories";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Catalog" },
    ...categories.map(c => ({ href: `/collections/${c.slug}`, label: c.title })),
]

export function Header() {
  const { cart } = useCart();
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const itemCount = isMounted ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-card text-card-foreground border-b text-xs">
          <div className="container mx-auto flex items-center justify-between p-2 flex-wrap">
              <div className="flex gap-4 items-center">
                  <Link href="#" className="hover:text-primary">About Us</Link>
                  <Link href="/dashboard" className="hover:text-primary">My Account</Link>
                  <Link href="#" className="hover:text-primary">Wishlist</Link>
              </div>
              <div className="text-center hidden md:block">
                  Free shipping all over the UAE
              </div>
              <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4"/>
                  <span>Need help? Call Us: <strong className="text-primary">+971-523315754</strong></span>
              </div>
          </div>
      </div>

      <div className="container flex h-20 items-center justify-between">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-4">
                <Link href="/" className="mb-4 flex items-center space-x-2">
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
        </div>
        
        {/* Logo - Centered on mobile, left on desktop */}
         <div className="absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0 md:flex-none">
            <Link href="/" className="flex items-center space-x-2">
                <Icons.logo className="h-8 w-8 text-primary" />
                <span className="font-bold font-headline text-2xl">
                iPhoneHub
                </span>
            </Link>
        </div>
        
        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 items-center justify-center px-8">
             <form onSubmit={handleSearch} className="w-full max-w-lg">
                <div className="relative">
                    <Input 
                      type="search" 
                      placeholder="Search for items..." 
                      className="h-10 w-full rounded-md border pl-4 pr-20"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8">Search</Button>
                </div>
             </form>
        </div>
        
        {/* Icons */}
        <div className="flex items-center justify-end space-x-2">
          
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
                <GitCompare className="h-6 w-6"/>
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">0</span>
            </Button>
             <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-6 w-6"/>
                 <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">0</span>
            </Button>
          </div>

          <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
              <ShoppingCart className="h-6 w-6" />
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
                <User className="h-6 w-6" />
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
       <div className="hidden md:flex container mx-auto items-center justify-center py-2 border-t">
         <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
                    <Link
                    key={link.label}
                    href={link.href}
                    className="transition-colors hover:text-primary text-foreground"
                    >
                    {link.label}
                </Link>
            ))}
            </nav>
       </div>
    </header>
  );
}
