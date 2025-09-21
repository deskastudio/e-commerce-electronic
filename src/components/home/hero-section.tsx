"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, Apple, Smartphone, Headphones, Star, Zap, Shield } from "lucide-react";
import SidebarCategories from "@/components/home/sidebar-categories";

const heroSlides = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    subtitle: "Titanium. So strong. So light. So Pro.",
    discount: "Save up to $200",
    description: "Experience the most advanced iPhone with Action Button and A17 Pro chip",
    buttonText: "Shop iPhone",
    link: "/shop/iphones",
    bgGradient: "from-slate-900 via-gray-900 to-black",
    textColor: "text-white",
    accentColor: "text-blue-400",
    icon: Apple,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    features: ["A17 Pro Chip", "Titanium Design", "48MP Camera"],
    rating: 4.9,
    price: "From $1,199"
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    subtitle: "Galaxy AI is here",
    discount: "Trade-in offer",
    description: "The most advanced Galaxy smartphone with built-in S Pen and 200MP camera",
    buttonText: "Explore Galaxy",
    link: "/shop/smartphones",
    bgGradient: "from-indigo-900 via-purple-900 to-violet-900",
    textColor: "text-white",
    accentColor: "text-purple-300",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    features: ["200MP Camera", "S Pen Built-in", "Galaxy AI"],
    rating: 4.8,
    price: "From $1,299"
  },
  {
    id: 3,
    title: "AirPods Pro (2nd Gen)",
    subtitle: "Adaptive Audio. Now Playing.",
    discount: "Special Price", 
    description: "Personalized spatial audio with dynamic head tracking",
    buttonText: "Shop Audio",
    link: "/shop/audio",
    bgGradient: "from-gray-50 via-white to-gray-100",
    textColor: "text-gray-900",
    accentColor: "text-blue-600",
    icon: Headphones,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80",
    features: ["Spatial Audio", "Noise Cancellation", "6H Battery"],
    rating: 4.7,
    price: "From $249"
  }
];

function HeroBanner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 30
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect);
    onSelect();

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(interval);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {heroSlides.map((slide, index) => {
            const IconComponent = slide.icon;
            return (
              <div
                key={slide.id}
                className={`relative flex h-[450px] min-w-0 flex-[0_0_100%] lg:h-[550px] bg-gradient-to-br ${slide.bgGradient}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:25px_25px]" />
                </div>

                {/* Floating Orbs */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Content */}
                <div className="relative z-10 flex w-full items-center">
                  <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      {/* Text Content */}
                      <div className="space-y-8">
                        {/* Discount Badge */}
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">
                          <Zap className="w-4 h-4 animate-pulse" />
                          {slide.discount}
                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">LIMITED</span>
                        </div>

                        {/* Icon & Brand */}
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 ${slide.accentColor}`}>
                            <IconComponent className="w-8 h-8" />
                          </div>
                          <div>
                            <span className={`text-sm font-semibold ${slide.accentColor} uppercase tracking-wide`}>
                              Premium Collection
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < Math.floor(slide.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                                  />
                                ))}
                              </div>
                              <span className={`text-xs ${slide.textColor} opacity-70`}>
                                {slide.rating} (2,143 reviews)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                          <h1 className={`text-5xl lg:text-7xl font-black ${slide.textColor} leading-tight`}>
                            {slide.title}
                          </h1>
                          <p className={`text-xl lg:text-2xl ${slide.accentColor} font-semibold`}>
                            {slide.subtitle}
                          </p>
                          <p className={`text-lg font-bold ${slide.textColor}`}>
                            {slide.price}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-3">
                          {slide.features.map((feature, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                            >
                              <Shield className="w-4 h-4 text-green-400" />
                              <span className={`text-sm font-medium ${slide.textColor}`}>
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Description */}
                        <p className={`text-lg ${slide.textColor} opacity-90 leading-relaxed max-w-lg`}>
                          {slide.description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex items-center gap-6">
                          <Link href={slide.link}>
                            <Button 
                              size="lg" 
                              className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            >
                              {slide.buttonText}
                              <ChevronRight className="ml-3 h-5 w-5" />
                            </Button>
                          </Link>
                          <Link 
                            href="/shop" 
                            className={`text-sm font-medium ${slide.accentColor} hover:underline`}
                          >
                            View all products →
                          </Link>
                        </div>
                      </div>

                      {/* Product Image */}
                      <div className="relative h-96 lg:h-[450px]">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-3xl" />
                        
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"
                          priority={index === 0}
                        />
                        
                        {/* Floating Product Info */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-gray-700">In Stock</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Free Shipping</div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />
                        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-white scale-125 shadow-lg' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-br-3xl"
           style={{ width: `${((selectedIndex + 1) / heroSlides.length) * 100}%` }} />

      {/* Navigation Arrows */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function HeroSection() {
  return (
    <div className="bg-background px-4 py-4 md:px-6">
      <div className="flex flex-col lg:flex-row lg:gap-6">
        <div className="hidden lg:block lg:w-64">
          <SidebarCategories />
        </div>
        <div className="flex-1">
          <HeroBanner />
        </div>
      </div>
    </div>
  );
}

