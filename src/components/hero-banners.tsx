
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function HeroBanners() {
  const [banners, setBanners] = useState({
    main: "https://ipoint.ae/cdn/shop/files/New_iphone_14_pro_max_offer_banner.jpg?v=1743450038&width=2100",
    sub1: "https://ipoint.ae/cdn/shop/files/iPhone_16_pro_max_1.png?v=1740152531&width=430",
    sub2: "https://ipoint.ae/cdn/shop/files/iphone_13_pro_max_1.png?v=1740151679&width=430",
  });
  const [loading, setLoading] = useState(true);
  const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

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

  const bannerImages = [
    { src: banners.main, alt: "Main promotional banner", hint: "hero banner" },
    { src: banners.sub1, alt: "Secondary banner 1", hint: "promotional banner" },
    { src: banners.sub2, alt: "Secondary banner 2", hint: "product sale" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-[400px] md:h-[500px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
       <Carousel
        plugins={[autoplayPlugin.current]}
        className="w-full"
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={autoplayPlugin.current.reset}
      >
        <CarouselContent>
          {bannerImages.map((banner, index) => (
            <CarouselItem key={index}>
              <div className="group relative overflow-hidden rounded-lg h-[250px] md:h-[500px]">
                <Link href="/collections/latest-iphones">
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={index === 0}
                    data-ai-hint={banner.hint}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
      </Carousel>
    </div>
  );
}
