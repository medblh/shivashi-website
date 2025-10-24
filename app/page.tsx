"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Truck, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/products';
import { useState, useEffect } from 'react';

export default function Home() {
  const featuredProducts = mockProducts.slice(0, 3);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Données du carousel
  const carouselSlides = [
    {
      id: 1,
      title: "New Fall 2025 Collection",
      subtitle: "Discover reinvented elegance",
      image: "/images/hero.png",
      buttonText: "Discover",
      buttonLink: "/products/2"
    },
    {
      id: 2,
      title: "Exclusive Limited Edition",
      subtitle: "Numbered unique pieces",
      image: "/images/DSC09269.jpg",
      buttonText: "Discover",
      buttonLink: "/products/3"
    }
  ];

  // Section Boys & Girls
  const genderSections = [
    {
      id: 1,
      title: "Boys Collection",
      subtitle: "Style and confidence",
      image: "/images/DSC09334.jpg",
      link: "/products?category=boys",
      bgGradient: "from-blue-500 to-blue-700"
    },
    {
      id: 2,
      title: "Girls Collection", 
      subtitle: "Elegance and charm",
      image: "/images/DSC09271.jpg",
      link: "/products?category=girls",
      bgGradient: "from-pink-500 to-purple-600"
    }
  ];

  // Auto-slide du carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <section className="relative h-[95vh] overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image avec overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
            
            {/* Content */}
            <div className="relative h-full flex items-center justify-center text-center text-white">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white/90 px-6 py-3 rounded-full text-lg font-medium border border-white/30">
                      NEW Collection
                    </span>
                  </div>
                  
                  <h1 className="text-lg md:text-4xl font-bold mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  
                  <p className="text-lg md:text-2xl mb-8 text-gray-200 leading-relaxed">
                    {slide.subtitle}
                  </p>
                  
                  <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white border-0 px-12 py-6 text-lg">
                    <Link href={slide.buttonLink}>
                      {slide.buttonText}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 text-white"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 text-white"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-amber-400' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Section Boys & Girls */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Special <span className="text-amber-600">Collections</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our dedicated collections, designed for every personality
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {genderSections.map((section) => (
              <div key={section.id} className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500">
                {/* Background Image avec overlay dynamique */}
                <div 
                  className={`bg-gradient-to-br ${section.bgGradient} min-h-[500px] bg-cover bg-center bg-no-repeat relative`}
                  style={{ backgroundImage: `url(${section.image})` }}
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative h-full flex items-center justify-center text-center text-white p-8">
                    <div className="transform group-hover:scale-105 transition-transform duration-500">
                      <h3 className="text-4xl md:text-5xl font-bold mb-4">
                        {section.title}
                      </h3>
                      <p className="text-xl mb-6 text-gray-200">
                        {section.subtitle}
                      </p>
                      <Button asChild size="lg" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white">
                        <Link href={section.link} className="flex items-center gap-2">
                          Découvrir
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/50 rounded-2xl transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Collection Signature conservée */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Collection <span className="text-amber-600">Signature</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most iconic pieces, combining tradition and innovation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3">
              <Link href="/products" className="flex items-center gap-2">
                Voir Toute la Collection
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      
    </div>
  );
}