
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroBanners() {
  const [banners, setBanners] = useState({
    main: "https://ipoint.ae/cdn/shop/files/New_iphone_14_pro_max_offer_banner.jpg?v=1743450038&width=2100",
    sub1: "https://ipoint.ae/cdn/shop/files/iPhone_16_pro_max_1.png?v=1740152531&width=430",
    sub2: "https://ipoint.ae/cdn/shop/files/iphone_13_pro_max_1.png?v=1740151679&width=430",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const docRef = doc(db, "siteContent", "banners");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.urls) {
            setBanners(data.urls);
          }
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
          <Skeleton className="w-full h-full col-span-1 md:col-span-1" />
          <div className="hidden md:grid gap-4">
            <Skeleton className="w-full h-full" />
            <Skeleton className="w-full h-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="group relative overflow-hidden rounded-lg">
          <Link href="/collections/all">
            <Image
              src={banners.main}
              alt="Main promotional banner"
              width={800}
              height={400}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              data-ai-hint="hero banner"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="group relative overflow-hidden rounded-lg">
            <Link href="/collections/all">
              <Image
                src={banners.sub1}
                alt="Secondary banner 1"
                width={400}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="promotional banner"
              />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            </Link>
          </div>
          <div className="group relative overflow-hidden rounded-lg">
            <Link href="/collections/all">
              <Image
                src={banners.sub2}
                alt="Secondary banner 2"
                width={400}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                 data-ai-hint="product sale"
              />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
