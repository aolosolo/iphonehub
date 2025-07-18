import Link from "next/link";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      <div className="bg-accent text-accent-foreground">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold font-headline">Subscribe & Get 10% Discount</h3>
                    <p className="text-muted-foreground">Get E-mail updates about our latest shop and special offers.</p>
                </div>
                <form className="w-full max-w-md">
                   <div className="relative">
                     <Input type="email" placeholder="Your email address" className="h-12 bg-background"/>
                     <Button type="submit" size="lg" className="absolute right-1 top-1/2 -translate-y-1/2 h-10">Subscribe</Button>
                   </div>
                </form>
            </div>
        </div>
      </div>

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
                <h3 className="font-semibold">Apple Devices</h3>
                <nav className="mt-4 flex flex-col space-y-2 text-sm">
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Apple Studio</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Mac's</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">MacBooks</Link>
                    <Link href="#" className="text-muted-foreground hover:text-foreground">Laptops</Link>
                </nav>
            </div>

             <div>
                <h3 className="font-semibold">Main Menu</h3>
                <nav className="mt-4 flex flex-col space-y-2 text-sm">
                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">My Account</Link>
                    <Link href="/cart" className="text-muted-foreground hover:text-foreground">Order History</Link>
                    <Link href="/cart" className="text-muted-foreground hover:text-foreground">Shopping Cart</Link>
                </nav>
            </div>

            <div>
                 <h3 className="font-semibold">Payment Methods</h3>
                 <div className="mt-4">
                     <Image 
                        src="https://ipoint.ae/cdn/shop/files/Payment-Cards-Banners.png" 
                        alt="Payment methods" 
                        width={250} 
                        height={40}
                        className="mt-2"
                     />
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
