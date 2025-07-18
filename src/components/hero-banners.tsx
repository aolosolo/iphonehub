
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
  useCarousel,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const bannerContent = [
    {
      heading: "The New iPhone 16 Pro",
      subheading: "Capture your moments like never before.",
      buttonText: "Shop Now",
      href: "/collections/latest-iphones",
    },
    {
      heading: "MacBook Pro with M4",
      subheading: "Unleash your creative potential.",
      buttonText: "Discover More",
      href: "/collections/mac-macbook",
    },
    {
      heading: "Apple Watch Series 10",
      subheading: "The future of health is on your wrist.",
      buttonText: "Explore",
      href: "/collections/apple-watch",
    },
]


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
        className="w-full relative"
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={autoplayPlugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {bannerImages.map((banner, index) => (
            <CarouselItem key={index}>
              <div className="group relative overflow-hidden rounded-lg h-[250px] md:h-[500px]">
                <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    priority={index === 0}
                    data-ai-hint={banner.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10" />

                  <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 text-white">
                    <h2 className="text-3xl md:text-5xl font-extrabold font-headline max-w-lg leading-tight animate-fade-in-down">
                        {bannerContent[index].heading}
                    </h2>
                    <p className="mt-4 text-lg md:text-xl max-w-lg animate-fade-in-up delay-200">
                        {bannerContent[index].subheading}
                    </p>
                    <Button asChild size="lg" className="mt-8 animate-fade-in-up delay-500">
                        <Link href={bannerContent[index].href}>{bannerContent[index].buttonText}</Link>
                    </Button>
                  </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
            <CarouselDots />
        </div>
      </Carousel>
    </div>
  );
}


function CarouselDots() {
    const { api } = useCarousel()
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
    const [selectedIndex, setSelectedIndex] = useState(0)
  
    useEffect(() => {
      if (!api) return
  
      const onSelect = () => {
        setSelectedIndex(api.selectedScrollSnap())
      }
  
      const onInit = () => {
        setScrollSnaps(api.scrollSnapList())
        setSelectedIndex(api.selectedScrollSnap())
      }
  
      api.on("select", onSelect)
      api.on("init", onInit)
      onInit() // Call onInit manually in case the event was missed
  
      return () => {
        api.off("select", onSelect)
      }
    }, [api])
  
    if (!api) return null;
  
    return (
      <div className="flex items-center justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => api.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              selectedIndex === index ? "w-6 bg-primary" : "bg-white/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    )
  }
