"use client";"use client""use client""use client""use client"



import { useState, useCallback, useEffect } from "react";

import Image from "next/image";

import Link from "next/link";import { useState, useCallback, useEffect } from "react"

import { Button } from "@/components/ui/button";

import useEmblaCarousel from "embla-carousel-react";import Image from "next/image"

import { ChevronRight, Apple, Smartphone, Headphones, Star, Zap, Shield } from "lucide-react";

import Link from "next/link"import { useState, useCallback, useEffect } from "react"

const heroSlides = [

  {import { Button } from "@/components/ui/button"

    id: 1,

    title: "iPhone 15 Pro Max",import useEmblaCarousel from "embla-carousel-react"import Image from "next/image"

    subtitle: "Titanium. So strong. So light. So Pro.",

    discount: "Save up to $200",import { ChevronRight, Apple, Smartphone, Headphones, Star, Zap, Shield } from "lucide-react"

    description: "Experience the most advanced iPhone with Action Button and A17 Pro chip",

    buttonText: "Shop iPhone",import Link from "next/link"import { useState, useCallback, useEffect } from "react"import { useState, useCallback, useEffect } from "react"

    link: "/shop/iphones",

    bgGradient: "from-slate-900 via-gray-900 to-black",const heroSlides = [

    textColor: "text-white",

    accentColor: "text-blue-400",  {import { Button } from "@/components/ui/button"

    icon: Apple,

    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",    id: 1,

    features: ["A17 Pro Chip", "Titanium Design", "48MP Camera"],

    rating: 4.9,    title: "iPhone 15 Pro Max",import useEmblaCarousel from "embla-carousel-react"import Image from "next/image"import Image from "next/image"

    price: "From $1,199"

  },    subtitle: "Titanium. So strong. So light. So Pro.",

  {

    id: 2,    discount: "Save up to $200",import { ChevronRight, Apple, Smartphone, Headphones, Star, Zap, Shield, Play } from "lucide-react"

    title: "Samsung Galaxy S24 Ultra",

    subtitle: "Galaxy AI is here",    description: "Experience the most advanced iPhone with Action Button and A17 Pro chip",

    discount: "Trade-in offer",

    description: "The most advanced Galaxy smartphone with built-in S Pen and 200MP camera",    buttonText: "Shop iPhone",import Link from "next/link"import Link from "next/link"

    buttonText: "Explore Galaxy",

    link: "/shop/smartphones",    link: "/shop/iphones",

    bgGradient: "from-indigo-900 via-purple-900 to-violet-900",

    textColor: "text-white",    bgGradient: "from-slate-900 via-gray-900 to-black",// Data untuk slides dengan design yang lebih menarik

    accentColor: "text-purple-300",

    icon: Smartphone,    textColor: "text-white",

    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",

    features: ["200MP Camera", "S Pen Built-in", "Galaxy AI"],    accentColor: "text-blue-400",const heroSlides = [import { Button } from "@/components/ui/button"import { Button } from "@/components/ui/button"

    rating: 4.8,

    price: "From $1,299"    icon: Apple,

  },

  {    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",  {

    id: 3,

    title: "AirPods Pro (2nd Gen)",    features: ["A17 Pro Chip", "Titanium Design", "48MP Camera"],

    subtitle: "Adaptive Audio. Now Playing.",

    discount: "Special Price",    rating: 4.9,    id: 1,import useEmblaCarousel from "embla-carousel-react"import useEmblaCarousel from "embla-carousel-react"

    description: "Personalized spatial audio with dynamic head tracking",

    buttonText: "Shop Audio",    price: "From $1,199"

    link: "/shop/audio",

    bgGradient: "from-gray-50 via-white to-gray-100",  },    title: "iPhone 15 Pro Max",

    textColor: "text-gray-900",

    accentColor: "text-blue-600",  {

    icon: Headphones,

    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80",    id: 2,    subtitle: "Titanium. So strong. So light. So Pro.",import { ChevronRight, Apple, Smartphone, Headphones, Star, Zap, Shield, Play } from "lucide-react"import { ChevronRight, Apple, Smartphone, Headphones } from "lucide-react"

    features: ["Spatial Audio", "Noise Cancellation", "6H Battery"],

    rating: 4.7,    title: "Samsung Galaxy S24 Ultra",

    price: "From $249"

  }    subtitle: "Galaxy AI is here",    discount: "Save up to $200",

];

    discount: "Trade-in offer",

export default function HeroBanner() {

  const [emblaRef, emblaApi] = useEmblaCarousel({     description: "The most advanced Galaxy smartphone with built-in S Pen and 200MP camera",    description: "Experience the most advanced iPhone with Action Button, 48MP camera, and A17 Pro chip",

    loop: true,

    duration: 30    buttonText: "Explore Galaxy",

  });

  const [selectedIndex, setSelectedIndex] = useState(0);    link: "/shop/smartphones",    buttonText: "Shop iPhone",



  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);    bgGradient: "from-indigo-900 via-purple-900 to-violet-900",



  const onSelect = useCallback(() => {    textColor: "text-white",    link: "/shop/iphones",// Data untuk slides dengan design yang lebih menarik// Data untuk slides

    if (!emblaApi) return;

    setSelectedIndex(emblaApi.selectedScrollSnap());    accentColor: "text-purple-300",

  }, [emblaApi]);

    icon: Smartphone,    bgGradient: "from-slate-900 via-gray-900 to-black",

  useEffect(() => {

    if (!emblaApi) return;    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",



    emblaApi.on("select", onSelect);    features: ["200MP Camera", "S Pen Built-in", "Galaxy AI"],    textColor: "text-white",const heroSlides = [const heroSlides = [

    onSelect();

    rating: 4.8,

    const interval = setInterval(() => {

      emblaApi.scrollNext();    price: "From $1,299"    accentColor: "text-blue-400",

    }, 5000);

  },

    return () => {

      emblaApi.off("select", onSelect);  {    icon: Apple,  {  {

      clearInterval(interval);

    };    id: 3,

  }, [emblaApi, onSelect]);

    title: "AirPods Pro (2nd Gen)",    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",

  return (

    <div className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl">    subtitle: "Adaptive Audio. Now Playing.",

      <div className="overflow-hidden" ref={emblaRef}>

        <div className="flex">    discount: "Special Price",    features: ["A17 Pro Chip", "Titanium Design", "48MP Camera"],    id: 1,    id: 1,

          {heroSlides.map((slide, index) => {

            const IconComponent = slide.icon;    description: "Personalized spatial audio with dynamic head tracking",

            return (

              <div    buttonText: "Shop Audio",    rating: 4.9,

                key={slide.id}

                className={`relative flex h-[450px] min-w-0 flex-[0_0_100%] lg:h-[550px] bg-gradient-to-br ${slide.bgGradient}`}    link: "/shop/audio",

              >

                {/* Background Pattern */}    bgGradient: "from-gray-50 via-white to-gray-100",    price: "From $1,199"    title: "iPhone 15 Pro Max",    title: "iPhone 15 Pro Max",

                <div className="absolute inset-0 opacity-10">

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:25px_25px]" />    textColor: "text-gray-900",

                </div>

    accentColor: "text-blue-600",  },

                {/* Floating Orbs */}

                <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />    icon: Headphones,

                <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80",  {    subtitle: "Titanium. So strong. So light. So Pro.",    subtitle: "Titanium. So strong. So light. So Pro.",

                {/* Content */}

                <div className="relative z-10 flex w-full items-center">    features: ["Spatial Audio", "Noise Cancellation", "6H Battery"],

                  <div className="container mx-auto px-6 lg:px-12">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">    rating: 4.7,    id: 2,

                      {/* Text Content */}

                      <div className="space-y-8">    price: "From $249"

                        {/* Discount Badge */}

                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">  }    title: "Samsung Galaxy S24 Ultra",    discount: "Save up to $200",    discount: "Up to 15%",

                          <Zap className="w-4 h-4 animate-pulse" />

                          {slide.discount}]

                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">LIMITED</span>

                        </div>    subtitle: "Galaxy AI is here",



                        {/* Icon & Brand */}export default function HeroBanner() {

                        <div className="flex items-center gap-4">

                          <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 ${slide.accentColor}`}>  const [emblaRef, emblaApi] = useEmblaCarousel({     discount: "Trade-in offer",    description: "Experience the most advanced iPhone with Action Button, 48MP camera, and A17 Pro chip",    description: "Experience the most advanced iPhone with A17 Pro chip and titanium design",

                            <IconComponent className="w-8 h-8" />

                          </div>    loop: true,

                          <div>

                            <span className={`text-sm font-semibold ${slide.accentColor} uppercase tracking-wide`}>    duration: 30    description: "The most advanced Galaxy smartphone with built-in S Pen and 200MP camera",

                              Premium Collection

                            </span>  })

                            <div className="flex items-center gap-2 mt-1">

                              <div className="flex items-center gap-1">  const [selectedIndex, setSelectedIndex] = useState(0)    buttonText: "Explore Galaxy",    buttonText: "Shop iPhone",    buttonText: "Shop iPhone",

                                {[...Array(5)].map((_, i) => (

                                  <Star 

                                    key={i} 

                                    className={`w-3 h-3 ${i < Math.floor(slide.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}   const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])    link: "/shop/smartphones",

                                  />

                                ))}

                              </div>

                              <span className={`text-xs ${slide.textColor} opacity-70`}>  const onSelect = useCallback(() => {    bgGradient: "from-indigo-900 via-purple-900 to-violet-900",    link: "/shop/iphones",    link: "/shop/smartphones",

                                {slide.rating} (2,143 reviews)

                              </span>    if (!emblaApi) return

                            </div>

                          </div>    setSelectedIndex(emblaApi.selectedScrollSnap())    textColor: "text-white",

                        </div>

  }, [emblaApi])

                        {/* Title */}

                        <div className="space-y-3">    accentColor: "text-purple-300",    bgGradient: "from-slate-900 via-gray-900 to-black",    bgGradient: "from-gray-900 via-gray-800 to-black",

                          <h1 className={`text-5xl lg:text-7xl font-black ${slide.textColor} leading-tight`}>

                            {slide.title}  useEffect(() => {

                          </h1>

                          <p className={`text-xl lg:text-2xl ${slide.accentColor} font-semibold`}>    if (!emblaApi) return    icon: Smartphone,

                            {slide.subtitle}

                          </p>

                          <p className={`text-lg font-bold ${slide.textColor}`}>

                            {slide.price}    emblaApi.on("select", onSelect)    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",    textColor: "text-white",    textColor: "text-white",

                          </p>

                        </div>    onSelect()



                        {/* Features */}    features: ["200MP Camera", "S Pen Built-in", "Galaxy AI"],

                        <div className="flex flex-wrap gap-3">

                          {slide.features.map((feature, idx) => (    const interval = setInterval(() => {

                            <div 

                              key={idx}      emblaApi.scrollNext()    rating: 4.8,    accentColor: "text-blue-400",    icon: Apple,

                              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"

                            >    }, 5000)

                              <Shield className="w-4 h-4 text-green-400" />

                              <span className={`text-sm font-medium ${slide.textColor}`}>    price: "From $1,299"

                                {feature}

                              </span>    return () => {

                            </div>

                          ))}      emblaApi.off("select", onSelect)  },    icon: Apple,    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80", // iPhone 15 Pro

                        </div>

      clearInterval(interval)

                        {/* Description */}

                        <p className={`text-lg ${slide.textColor} opacity-90 leading-relaxed max-w-lg`}>    }  {

                          {slide.description}

                        </p>  }, [emblaApi, onSelect])



                        {/* CTA Buttons */}    id: 3,    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",  },

                        <div className="flex items-center gap-6">

                          <Link href={slide.link}>  return (

                            <Button 

                              size="lg"     <div className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl">    title: "AirPods Pro (2nd Gen)",

                              className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"

                            >      <div className="overflow-hidden" ref={emblaRef}>

                              {slide.buttonText}

                              <ChevronRight className="ml-3 h-5 w-5" />        <div className="flex">    subtitle: "Adaptive Audio. Now Playing.",    features: ["A17 Pro Chip", "Titanium Design", "48MP Camera"],  {

                            </Button>

                          </Link>          {heroSlides.map((slide, index) => {

                          <Link 

                            href="/shop"             const IconComponent = slide.icon    discount: "Special Price",

                            className={`text-sm font-medium ${slide.accentColor} hover:underline`}

                          >            return (

                            View all products →

                          </Link>              <div    description: "Personalized spatial audio with dynamic head tracking for immersive sound",    rating: 4.9,    id: 2,

                        </div>

                      </div>                key={slide.id}



                      {/* Product Image */}                className={`relative flex h-[450px] min-w-0 flex-[0_0_100%] lg:h-[550px] bg-gradient-to-br ${slide.bgGradient}`}    buttonText: "Shop Audio",

                      <div className="relative h-96 lg:h-[450px]">

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl" />              >

                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-3xl" />

                                        {/* Background Pattern */}    link: "/shop/audio",    price: "From $1,199"    title: "Samsung Galaxy S24 Ultra",

                        <Image

                          src={slide.image}                <div className="absolute inset-0 opacity-10">

                          alt={slide.title}

                          fill                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:25px_25px]" />    bgGradient: "from-gray-50 via-white to-gray-100",

                          className="object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"

                          priority={index === 0}                </div>

                        />

                            textColor: "text-gray-900",  },    subtitle: "Galaxy AI is here",

                        {/* Floating Product Info */}

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">                {/* Floating Orbs */}

                          <div className="flex items-center gap-2">

                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>                <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />    accentColor: "text-blue-600",

                            <span className="text-xs font-semibold text-gray-700">In Stock</span>

                          </div>                <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

                          <div className="text-xs text-gray-600 mt-1">Free Shipping</div>

                        </div>    icon: Headphones,  {    discount: "Save up to 20%",



                        {/* Floating elements */}                {/* Content */}

                        <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />

                        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />                <div className="relative z-10 flex w-full items-center">    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80",

                      </div>

                    </div>                  <div className="container mx-auto px-6 lg:px-12">

                  </div>

                </div>                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">    features: ["Spatial Audio", "Active Noise Cancellation", "6 Hours Battery"],    id: 2,    description: "The most advanced Galaxy smartphone with built-in S Pen and 200MP camera",

              </div>

            );                      {/* Text Content */}

          })}

        </div>                      <div className="space-y-8">    rating: 4.7,

      </div>

                        {/* Discount Badge */}

      {/* Navigation Dots */}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">    price: "From $249"    title: "Samsung Galaxy S24 Ultra",    buttonText: "Explore Galaxy",

        {heroSlides.map((_, index) => (

          <button                          <Zap className="w-4 h-4 animate-pulse" />

            key={index}

            className={`w-4 h-4 rounded-full transition-all duration-300 ${                          {slide.discount}  }

              index === selectedIndex 

                ? 'bg-white scale-125 shadow-lg'                           <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">LIMITED</span>

                : 'bg-white/40 hover:bg-white/60'

            }`}                        </div>]    subtitle: "Galaxy AI is here",    link: "/shop/smartphones",

            onClick={() => scrollTo(index)}

          />

        ))}

      </div>                        {/* Icon & Brand */}



      {/* Progress Bar */}                        <div className="flex items-center gap-4">

      <div className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-br-3xl"

           style={{ width: `${((selectedIndex + 1) / heroSlides.length) * 100}%` }} />                          <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 ${slide.accentColor}`}>export default function HeroBanner() {    discount: "Trade-in offer",    bgGradient: "from-blue-900 via-purple-900 to-black",



      {/* Navigation Arrows */}                            <IconComponent className="w-8 h-8" />

      <button

        onClick={() => emblaApi?.scrollPrev()}                          </div>  const [emblaRef, emblaApi] = useEmblaCarousel({ 

        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"

        aria-label="Previous slide"                          <div>

      >

        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">                            <span className={`text-sm font-semibold ${slide.accentColor} uppercase tracking-wide`}>    loop: true,    description: "The most advanced Galaxy smartphone with built-in S Pen and 200MP camera",    textColor: "text-white",

          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />

        </svg>                              Premium Collection

      </button>

                            </span>    duration: 30

      <button

        onClick={() => emblaApi?.scrollNext()}                            <div className="flex items-center gap-2 mt-1">

        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"

        aria-label="Next slide"                              <div className="flex items-center gap-1">  })    buttonText: "Explore Galaxy",    icon: Smartphone,

      >

        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">                                {[...Array(5)].map((_, i) => (

          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />

        </svg>                                  <Star   const [selectedIndex, setSelectedIndex] = useState(0)

      </button>

    </div>                                    key={i} 

  );

}                                    className={`w-3 h-3 ${i < Math.floor(slide.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}     link: "/shop/smartphones",    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80", // Samsung phone

                                  />

                                ))}  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

                              </div>

                              <span className={`text-xs ${slide.textColor} opacity-70`}>    bgGradient: "from-indigo-900 via-purple-900 to-violet-900",  },

                                {slide.rating} (2,143 reviews)

                              </span>  const onSelect = useCallback(() => {

                            </div>

                          </div>    if (!emblaApi) return    textColor: "text-white",  {

                        </div>

    setSelectedIndex(emblaApi.selectedScrollSnap())

                        {/* Title */}

                        <div className="space-y-3">  }, [emblaApi])    accentColor: "text-purple-300",    id: 3,

                          <h1 className={`text-5xl lg:text-7xl font-black ${slide.textColor} leading-tight`}>

                            {slide.title}

                          </h1>

                          <p className={`text-xl lg:text-2xl ${slide.accentColor} font-semibold`}>  useEffect(() => {    icon: Smartphone,    title: "AirPods Pro",

                            {slide.subtitle}

                          </p>    if (!emblaApi) return

                          <p className={`text-lg font-bold ${slide.textColor}`}>

                            {slide.price}    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",    subtitle: "Adaptive Audio. Now Playing.",

                          </p>

                        </div>    emblaApi.on("select", onSelect)



                        {/* Features */}    onSelect()    features: ["200MP Camera", "S Pen Built-in", "Galaxy AI"],    discount: "Special Price",

                        <div className="flex flex-wrap gap-3">

                          {slide.features.map((feature, idx) => (

                            <div 

                              key={idx}    // Auto-play    rating: 4.8,    description: "Personalized spatial audio with dynamic head tracking for immersive sound",

                              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"

                            >    const interval = setInterval(() => {

                              <Shield className="w-4 h-4 text-green-400" />

                              <span className={`text-sm font-medium ${slide.textColor}`}>      emblaApi.scrollNext()    price: "From $1,299"    buttonText: "Shop Audio",

                                {feature}

                              </span>    }, 5000)

                            </div>

                          ))}  },    link: "/shop/audio",

                        </div>

    return () => {

                        {/* Description */}

                        <p className={`text-lg ${slide.textColor} opacity-90 leading-relaxed max-w-lg`}>      emblaApi.off("select", onSelect)  {    bgGradient: "from-white via-gray-50 to-gray-100",

                          {slide.description}

                        </p>      clearInterval(interval)



                        {/* CTA Buttons */}    }    id: 3,    textColor: "text-gray-900",

                        <div className="flex items-center gap-6">

                          <Link href={slide.link}>  }, [emblaApi, onSelect])

                            <Button 

                              size="lg"     title: "AirPods Pro (2nd Gen)",    icon: Headphones,

                              className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"

                            >  return (

                              {slide.buttonText}

                              <ChevronRight className="ml-3 h-5 w-5" />    <div className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl">    subtitle: "Adaptive Audio. Now Playing.",    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80", // AirPods

                            </Button>

                          </Link>      <div className="overflow-hidden" ref={emblaRef}>

                          <Link 

                            href="/shop"         <div className="flex">    discount: "Special Price",  }

                            className={`text-sm font-medium ${slide.accentColor} hover:underline`}

                          >          {heroSlides.map((slide, index) => {

                            View all products →

                          </Link>            const IconComponent = slide.icon    description: "Personalized spatial audio with dynamic head tracking for immersive sound",]

                        </div>

                      </div>            return (



                      {/* Product Image */}              <div    buttonText: "Shop Audio",

                      <div className="relative h-96 lg:h-[450px]">

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl" />                key={slide.id}

                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-3xl" />

                                        className={`relative flex h-[450px] min-w-0 flex-[0_0_100%] lg:h-[550px] bg-gradient-to-br ${slide.bgGradient}`}    link: "/shop/audio",export default function HeroBanner() {

                        <Image

                          src={slide.image}              >

                          alt={slide.title}

                          fill                {/* Background Pattern */}    bgGradient: "from-gray-50 via-white to-gray-100",  const [emblaRef, emblaApi] = useEmblaCarousel({ 

                          className="object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"

                          priority={index === 0}                <div className="absolute inset-0 opacity-10">

                        />

                                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:25px_25px]" />    textColor: "text-gray-900",    loop: true,

                        {/* Floating Product Info */}

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">                </div>

                          <div className="flex items-center gap-2">

                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>    accentColor: "text-blue-600",    duration: 30 // Auto-play duration

                            <span className="text-xs font-semibold text-gray-700">In Stock</span>

                          </div>                {/* Floating Orbs */}

                          <div className="text-xs text-gray-600 mt-1">Free Shipping</div>

                        </div>                <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />    icon: Headphones,  })



                        {/* Floating elements */}                <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

                        <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />

                        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80",  const [selectedIndex, setSelectedIndex] = useState(0)

                      </div>

                    </div>                {/* Content */}

                  </div>

                </div>                <div className="relative z-10 flex w-full items-center">    features: ["Spatial Audio", "Active Noise Cancellation", "6 Hours Battery"],

              </div>

            )                  <div className="container mx-auto px-6 lg:px-12">

          })}

        </div>                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">    rating: 4.7,  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

      </div>

                      {/* Text Content */}

      {/* Navigation Dots */}

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">                      <div className="space-y-8">    price: "From $249"

        {heroSlides.map((_, index) => (

          <button                        {/* Discount Badge */}

            key={index}

            className={`w-4 h-4 rounded-full transition-all duration-300 ${                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">  }  const onSelect = useCallback(() => {

              index === selectedIndex 

                ? 'bg-white scale-125 shadow-lg'                           <Zap className="w-4 h-4 animate-pulse" />

                : 'bg-white/40 hover:bg-white/60'

            }`}                          {slide.discount}]    if (!emblaApi) return

            onClick={() => scrollTo(index)}

          />                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">LIMITED</span>

        ))}

      </div>                        </div>    setSelectedIndex(emblaApi.selectedScrollSnap())



      {/* Progress Bar */}

      <div className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-br-3xl"

           style={{ width: `${((selectedIndex + 1) / heroSlides.length) * 100}%` }} />                        {/* Icon & Brand */}export default function HeroBanner() {  }, [emblaApi])



      {/* Navigation Arrows */}                        <div className="flex items-center gap-4">

      <button

        onClick={() => emblaApi?.scrollPrev()}                          <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 ${slide.accentColor}`}>  const [emblaRef, emblaApi] = useEmblaCarousel({ 

        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"

        aria-label="Previous slide"                            <IconComponent className="w-8 h-8" />

      >

        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">                          </div>    loop: true,  useEffect(() => {

          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />

        </svg>                          <div>

      </button>

                            <span className={`text-sm font-semibold ${slide.accentColor} uppercase tracking-wide`}>    duration: 30    if (!emblaApi) return

      <button

        onClick={() => emblaApi?.scrollNext()}                              Premium Collection

        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"

        aria-label="Next slide"                            </span>  })

      >

        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">                            <div className="flex items-center gap-2 mt-1">

          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />

        </svg>                              <div className="flex items-center gap-1">  const [selectedIndex, setSelectedIndex] = useState(0)    emblaApi.on("select", onSelect)

      </button>

    </div>                                {[...Array(5)].map((_, i) => (

  )

}                                  <Star     onSelect()

                                    key={i} 

                                    className={`w-3 h-3 ${i < Math.floor(slide.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}   const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi])

                                  />

                                ))}    // Auto-play functionality

                              </div>

                              <span className={`text-xs ${slide.textColor} opacity-70`}>  const onSelect = useCallback(() => {    const autoplay = setInterval(() => {

                                {slide.rating} (2,143 reviews)

                              </span>    if (!emblaApi) return      emblaApi.scrollNext()

                            </div>

                          </div>    setSelectedIndex(emblaApi.selectedScrollSnap())    }, 5000)

                        </div>

  }, [emblaApi])

                        {/* Title */}

                        <div className="space-y-3">    return () => {

                          <h1 className={`text-5xl lg:text-7xl font-black ${slide.textColor} leading-tight`}>

                            {slide.title}  useEffect(() => {      emblaApi.off("select", onSelect)

                          </h1>

                          <p className={`text-xl lg:text-2xl ${slide.accentColor} font-semibold`}>    if (!emblaApi) return      clearInterval(autoplay)

                            {slide.subtitle}

                          </p>    }

                          <p className={`text-lg font-bold ${slide.textColor}`}>

                            {slide.price}    emblaApi.on("select", onSelect)  }, [emblaApi, onSelect])

                          </p>

                        </div>    onSelect()



                        {/* Features */}  return (

                        <div className="flex flex-wrap gap-3">

                          {slide.features.map((feature, idx) => (    // Auto-play    <div className="relative mb-8 overflow-hidden rounded-2xl shadow-2xl">

                            <div 

                              key={idx}    const interval = setInterval(() => {      <div className="overflow-hidden" ref={emblaRef}>

                              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"

                            >      emblaApi.scrollNext()        <div className="flex">

                              <Shield className="w-4 h-4 text-green-400" />

                              <span className={`text-sm font-medium ${slide.textColor}`}>    }, 5000)          {heroSlides.map((slide) => {

                                {feature}

              </span>            const IconComponent = slide.icon

                            </div>

                          ))}    return () => {            return (

                        </div>

      emblaApi.off("select", onSelect)              <div 

                        {/* Description */}

                        <p className={`text-lg ${slide.textColor} opacity-90 leading-relaxed max-w-lg`}>      clearInterval(interval)                key={slide.id}

                          {slide.description}

                        </p>    }                className={`relative flex h-[400px] min-w-0 flex-[0_0_100%] items-center justify-between bg-gradient-to-br ${slide.bgGradient} p-8 md:h-[500px] md:p-12 lg:h-[600px] lg:p-16`}



                        {/* CTA Buttons */}  }, [emblaApi, onSelect])              >

                        <div className="flex items-center gap-6">

                          <Link href={slide.link}>                {/* Content Side */}

                            <Button 

                              size="lg"   return (                <div className={`z-10 max-w-lg space-y-6 ${slide.textColor}`}>

                              className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"

                            >    <div className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl">                  {/* Brand Icon & Category */}

                              {slide.buttonText}

                              <ChevronRight className="ml-3 h-5 w-5" />      <div className="overflow-hidden" ref={emblaRef}>                  <div className="flex items-center space-x-3">

                            </Button>

                          </Link>        <div className="flex">                    <div className={`rounded-full p-2 ${slide.textColor === 'text-white' ? 'bg-white/10' : 'bg-gray-900/10'}`}>

                          <button className={`flex items-center gap-3 ${slide.accentColor} hover:${slide.textColor} transition-colors font-semibold`}>

                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">          {heroSlides.map((slide, index) => {                      <IconComponent className="h-6 w-6" />

                              <Play className="w-5 h-5 ml-0.5" />

                            </div>            const IconComponent = slide.icon                    </div>

                            Watch Video

                          </button>            return (                    <span className="text-sm font-medium uppercase tracking-wider opacity-80">

                        </div>

                      </div>              <div                      Premium Electronics



                      {/* Product Image */}                key={slide.id}                    </span>

                      <div className="relative h-96 lg:h-[450px]">

                        {/* Glow Effect */}                className={`relative flex h-[450px] min-w-0 flex-[0_0_100%] lg:h-[550px] bg-gradient-to-br ${slide.bgGradient}`}                  </div>

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl" />

                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-3xl" />              >

                        

                        <Image                {/* Background Pattern */}                  {/* Discount Badge */}

                          src={slide.image}

                          alt={slide.title}                <div className="absolute inset-0 opacity-10">                  <div className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${

                          fill

                          className="object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:25px_25px]" />                    slide.textColor === 'text-white' 

                          priority={index === 0}

                        />                </div>                      ? 'bg-red-500 text-white' 

                        

                        {/* Floating Product Info */}                      : 'bg-red-500 text-white'

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">

                          <div className="flex items-center gap-2">                {/* Floating Orbs */}                  }`}>

                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>

                            <span className="text-xs font-semibold text-gray-700">In Stock</span>                <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />                    {slide.discount} OFF

                          </div>

                          <div className="text-xs text-gray-600 mt-1">Free Shipping</div>                <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />                  </div>

                        </div>



                        {/* Floating elements */}

                        <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />                {/* Content */}                  {/* Main Title */}

                        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

                      </div>                <div className="relative z-10 flex w-full items-center">                  <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">

                    </div>

                  </div>                  <div className="container mx-auto px-6 lg:px-12">                    {slide.title}

                </div>

              </div>                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">                  </h1>

            )

          })}                      {/* Text Content */}

        </div>

      </div>                      <div className="space-y-8">                  {/* Subtitle */}



      {/* Navigation Dots */}                        {/* Discount Badge */}                  <p className="text-lg font-medium opacity-90 md:text-xl">

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">

        {heroSlides.map((_, index) => (                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-sm font-bold shadow-lg">                    {slide.subtitle}

          <button

            key={index}                          <Zap className="w-4 h-4 animate-pulse" />                  </p>

            className={`w-4 h-4 rounded-full transition-all duration-300 ${

              index === selectedIndex                           {slide.discount}

                ? 'bg-white scale-125 shadow-lg' 

                : 'bg-white/40 hover:bg-white/60'                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">LIMITED</span>                  {/* Description */}

            }`}

            onClick={() => scrollTo(index)}                        </div>                  <p className="text-base opacity-75 md:text-lg">

          />

        ))}                    {slide.description}

      </div>

                        {/* Icon & Brand */}                  </p>

      {/* Progress Bar */}

      <div className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-br-3xl"                        <div className="flex items-center gap-4">

           style={{ width: `${((selectedIndex + 1) / heroSlides.length) * 100}%` }} />

                          <div className={`p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 ${slide.accentColor}`}>                  {/* CTA Button */}

      {/* Navigation Arrows */}

      <button                            <IconComponent className="w-8 h-8" />                  <div className="pt-4">

        onClick={() => emblaApi?.scrollPrev()}

        className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"                          </div>                    <Button 

        aria-label="Previous slide"

      >                          <div>                      asChild 

        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">

          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />                            <span className={`text-sm font-semibold ${slide.accentColor} uppercase tracking-wide`}>                      size="lg"

        </svg>

      </button>                              Premium Collection                      className={`group font-semibold ${



      <button                            </span>                        slide.textColor === 'text-white'

        onClick={() => emblaApi?.scrollNext()}

        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"                            <div className="flex items-center gap-2 mt-1">                          ? 'bg-white text-black hover:bg-gray-100'

        aria-label="Next slide"

      >                              <div className="flex items-center gap-1">                          : 'bg-black text-white hover:bg-gray-800'

        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">

          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />                                {[...Array(5)].map((_, i) => (                      }`}

        </svg>

      </button>                                  <Star                     >

    </div>

  )                                    key={i}                       <Link href={slide.link} className="flex items-center">

}
                                    className={`w-3 h-3 ${i < Math.floor(slide.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}                         {slide.buttonText}

                                  />                        <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />

                                ))}                      </Link>

                              </div>                    </Button>

                              <span className={`text-xs ${slide.textColor} opacity-70`}>                  </div>

                                {slide.rating} (2,143 reviews)                </div>

                              </span>

                            </div>                {/* Product Image Side */}

                          </div>                <div className="hidden md:block relative z-10 h-full w-1/2">

                        </div>                  <div className="relative h-full w-full">

                    <Image

                        {/* Title */}                      src={slide.image}

                        <div className="space-y-3">                      alt={slide.title}

                          <h1 className={`text-5xl lg:text-7xl font-black ${slide.textColor} leading-tight`}>                      fill

                            {slide.title}                      className="object-contain object-center"

                          </h1>                      priority={slide.id === 1}

                          <p className={`text-xl lg:text-2xl ${slide.accentColor} font-semibold`}>                    />

                            {slide.subtitle}                  </div>

                          </p>                </div>

                          <p className={`text-lg font-bold ${slide.textColor}`}>

                            {slide.price}                {/* Background Pattern */}

                          </p>                <div className="absolute inset-0 z-0 opacity-5">

                        </div>                  <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />

                </div>

                        {/* Features */}              </div>

                        <div className="flex flex-wrap gap-3">            )

                          {slide.features.map((feature, idx) => (          })}

                            <div         </div>

                              key={idx}      </div>

                              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"

                            >      {/* Navigation Dots */}

                              <Shield className="w-4 h-4 text-green-400" />      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 transform space-x-3">

                              <span className={`text-sm font-medium ${slide.textColor}`}>        {heroSlides.map((_, index) => (

                                {feature}          <button

                              </span>            key={index}

                            </div>            type="button"

                          ))}            onClick={() => scrollTo(index)}

                        </div>            className={`h-3 w-3 rounded-full transition-all duration-300 ${

              index === selectedIndex 

                        {/* Description */}                ? "bg-white scale-125 shadow-lg" 

                        <p className={`text-lg ${slide.textColor} opacity-90 leading-relaxed max-w-lg`}>                : "bg-white/50 hover:bg-white/75"

                          {slide.description}            }`}

                        </p>            aria-label={`Go to slide ${index + 1}`}

          />

                        {/* CTA Buttons */}        ))}

                        <div className="flex items-center gap-6">      </div>

                          <Link href={slide.link}>

                            <Button       {/* Navigation Arrows */}

                              size="lg"       <button

                              className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"        onClick={() => emblaApi?.scrollPrev()}

                            >        className="absolute left-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"

                              {slide.buttonText}        aria-label="Previous slide"

                              <ChevronRight className="ml-3 h-5 w-5" />      >

                            </Button>        <svg

                          </Link>          xmlns="http://www.w3.org/2000/svg"

                          <button className={`flex items-center gap-3 ${slide.accentColor} hover:${slide.textColor} transition-colors font-semibold`}>          width="24"

                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">          height="24"

                              <Play className="w-5 h-5 ml-0.5" />          viewBox="0 0 24 24"

                            </div>          fill="none"

                            Watch Video          stroke="currentColor"

                          </button>          strokeWidth="2"

                        </div>          strokeLinecap="round"

                      </div>          strokeLinejoin="round"

          className="h-5 w-5 text-gray-800"

                      {/* Product Image */}        >

                      <div className="relative h-96 lg:h-[450px]">          <path d="m15 18-6-6 6-6" />

                        {/* Glow Effect */}        </svg>

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-3xl" />      </button>

                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 rounded-3xl" />

                              <button

                        <Image        onClick={() => emblaApi?.scrollNext()}

                          src={slide.image}        className="absolute right-6 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110"

                          alt={slide.title}        aria-label="Next slide"

                          fill      >

                          className="object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"        <svg

                          priority={index === 0}          xmlns="http://www.w3.org/2000/svg"

                        />          width="24"

                                  height="24"

                        {/* Floating Product Info */}          viewBox="0 0 24 24"

                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">          fill="none"

                          <div className="flex items-center gap-2">          stroke="currentColor"

                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>          strokeWidth="2"

                            <span className="text-xs font-semibold text-gray-700">In Stock</span>          strokeLinecap="round"

                          </div>          strokeLinejoin="round"

                          <div className="text-xs text-gray-600 mt-1">Free Shipping</div>          className="h-5 w-5 text-gray-800"

                        </div>        >

          <path d="m9 18 6-6-6-6" />

                        {/* Floating elements */}        </svg>

                        <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl animate-pulse" />      </button>

                        <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />    </div>

                      </div>  )

                    </div>}

                  </div>

                </div>
              </div>
            )
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
  )
}