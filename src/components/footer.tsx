import Link from "next/link";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
                <Link href="/" className="flex items-center space-x-2">
                    <Icons.logo className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold font-headline">iPhoneHub</span>
                </Link>
                <p className="mt-4 text-sm text-muted-foreground">
                    The best place to buy your favorite Apple products.
                </p>
                 <div className="mt-4 flex space-x-4">
                    <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Icons.facebook className="h-6 w-6"/>
                    </Link>
                     <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Icons.twitter className="h-6 w-6"/>
                    </Link>
                     <Link href="#" className="text-muted-foreground hover:text-foreground">
                        <Icons.instagram className="h-6 w-6"/>
                    </Link>
                 </div>
            </div>

            <div>
                <h3 className="font-semibold">Shop</h3>
                <nav className="mt-4 flex flex-col space-y-2 text-sm">
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Laptops</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Desktop PCs</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Phones & Mobile</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">PC Parts</Link>
                </nav>
            </div>

             <div>
                <h3 className="font-semibold">My Account</h3>
                <nav className="mt-4 flex flex-col space-y-2 text-sm">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">My Account</Link>
                    <Link href="/cart" className="text-muted-foreground hover:text-foreground">Order History</Link>
                    <Link href="/cart" className="text-muted-foreground hover:text-foreground">Shopping Cart</Link>
                </nav>
            </div>

            <div>
                 <h3 className="font-semibold">Apps & Payment</h3>
                <div className="mt-4 flex space-x-2">
                    <Link href="#"><Icons.appStore className="h-10"/></Link>
                    <Link href="#"><Icons.googlePlay className="h-10"/></Link>
                </div>
                 <div className="mt-4">
                     <p className="text-sm text-muted-foreground">Payment Methods</p>
                     <Icons.paymentMethods className="h-8 mt-2"/>
                 </div>
            </div>
        </div>


        <hr className="my-8 border-border" />

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} iPhoneHub. All rights reserved.
          </p>
           <div className="mt-4 flex flex-wrap justify-center space-x-6 sm:mt-0">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
