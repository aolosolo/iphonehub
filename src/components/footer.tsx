import Link from "next/link";
import { Icons } from "./icons";

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">iPhoneHub</span>
          </Link>

          <div className="mt-4 flex flex-wrap justify-center space-x-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
            <Link href="/cart" className="text-sm text-muted-foreground hover:text-foreground">Cart</Link>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Login</Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">My Account</Link>
          </div>
        </div>

        <hr className="my-6 border-border" />

        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} iPhoneHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
