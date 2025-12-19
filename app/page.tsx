"use client";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/products';

export default function Home() {
  const featuredProducts = mockProducts.slice(0, 6);

  // Collections
  const collections = [
    {
      id: 1,
      title: "Everyday Set",
      image: "/images/Everydayset.webp",
      link: "/products?category=tops"
    },
    {
      id: 2,
      title: "Cozy Set",
      image: "/images/Cozyset.webp",
      link: "/products?category=bottoms"
    },
    {
      id: 3,
      title: "Active Logo Set",
      image: "/images/Activelogoset.webp",
      link: "/products?category=accessories"
    },
    {
      id: 4,
      title: "Varsity Gril Set",
      image: "/images/VarsityGirlset.webp",
      link: "/new-arrivals"
    }
  ];
  // Values
  const values = [
    {
      icon: "",
      title: "SUSTAINABLE MATERIALS",
      description: "ECO-FRIENDLY FABRICS THAT FEEL GOOD AND DO GOOD"
    },
    {
      icon: "",
      title: "GIVES BACK",
      description: "EVERY PURCHASE SUPPORTS MEANINGFUL CAUSES"
    },
    {
      icon: "",
      title: "ETHICAL PRODUCTION",
      description: "RESPONSIBLY MADE IN SAFE WORKING CONDITIONS"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section avec Vidéo en fond */}
<section className="relative h-[80vh] lg:h-[90vh] overflow-hidden bg-black">
  {/* Video Background WebM seul */}
  <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover opacity-100"
    preload="metadata"
  >
    <source src="/images/shivashi-kids.webm" type="video/webm" />
  </video>
  
  {/* Overlay sombre */}
  <div className="absolute inset-0 bg-black/30"></div>
  
  {/* Contenu */}
  <div className="relative h-full flex items-end justify-center text-center text-white pb-8 lg:pb-16">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          asChild
          size="sm"
          className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-6 py-3 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
        >
          <a href="/products">
            Shop Now
          </a>
        </Button>
      </div>
    </div>
  </div>
</section>

      <section className="w-full h-screen flex">
  {/* Boys Category */}
  <div className="relative flex-1 group overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: 'url(/images/boys.png)' }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
    </div>
    
    {/* Content */}
    <div className="relative h-full flex flex-col items-start justify-center text-white p-8 lg:p-16">
  <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-wide">BOYS</h3>
      <Button
        asChild
        className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-8 py-4 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
      >
        <a href="/products/boys">
          Discover Now
        </a>
      </Button>
    </div>
  </div>

  {/* Girls Category */}
  <div className="relative flex-1 group overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat h-250 transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: 'url(/images/girls.png)' }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
    </div>
    
    {/* Content */}
    <div className="relative h-full flex flex-col items-end justify-center text-white p-8 lg:p-16">
  <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-wide">GIRLS</h3>
      <Button
        asChild
        className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-8 py-4 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
      >
        <a href="/products/girls">
          Discover Now
        </a>
      </Button>
    </div>
  </div>
</section>

<section className="w-full h-screen flex">
  {/* Boys Category */}
  <div className="relative flex-1 group overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat h-250 transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: 'url(/images/activewear.png)' }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
    </div>
    
    {/* Content */}
    <div className="relative h-full flex flex-col items-start justify-center text-white p-8 lg:p-16">
  <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-wide">ACTIVEWEAR</h3>
      <Button
        asChild
        className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-8 py-4 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
      >
        <a href="/products/boys">
          Discover Now
        </a>
      </Button>
    </div>
  </div>

  {/* Girls Category */}
  <div className="relative flex-1 group overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat h-270 transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: 'url(/images/loungewear.png)' }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
    </div>
    
    {/* Content */}
    <div className="relative h-full flex flex-col items-end justify-center text-white p-8 lg:p-16">
  <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-wide">LOUNGEWEAR</h3>
      <Button
        asChild
        className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-8 py-4 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
      >
        <a href="/products/girls">
          Discover Now
        </a>
      </Button>
    </div>
  </div>
</section>


<section className="w-full h-screen flex">
  {/* Best Sellers */}
  <div className="relative flex-1 group overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat h-250 transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: 'url(/images/20.webp)' }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
    </div>
    
    {/* Content - Bouton en bas */}
    <div className="relative h-full flex items-end justify-center text-center text-white pb-8 lg:pb-12">
      <div className="w-full px-4">
        <Button
          asChild
          className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-6 py-3 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase w-full max-w-xs"
        >
          <a href="/best-sellers">
            Best Sellers
          </a>
        </Button>
      </div>
    </div>
  </div>

  {/* New Arrivals */}
  <div className="relative flex-1 group overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat h-250 transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: 'url(/images/26.png)' }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
    </div>
    
    {/* Content - Bouton en bas */}
    <div className="relative h-full flex items-end justify-center text-center text-white pb-8 lg:pb-12">
      <div className="w-full px-4">
        <Button
          asChild
          className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-6 py-3 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase w-full max-w-xs"
        >
          <a href="/new-arrivals">
            New Arrivals
          </a>
        </Button>
      </div>
    </div>
  </div>

  {/* Categories */}
  <div className="relative flex-1 group overflow-hidden">
    {/* Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center bg-no-repeat h-200 transition-transform duration-500 group-hover:scale-105"
      style={{ backgroundImage: 'url(/images/13.webp)' }}
    >
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
    </div>
    
    {/* Content - Bouton en bas */}
    <div className="relative h-full flex items-end justify-center text-center text-white pb-8 lg:pb-12">
      <div className="w-full px-4">
        <Button
          asChild
          className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-6 py-3 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase w-full max-w-xs"
        >
          <a href="/categories">
            Full collection
          </a>
        </Button>
      </div>
    </div>
  </div>
</section>

{/* Hero Section Statique */}
      <section className="relative h-[80vh] lg:h-[90vh] overflow-hidden bg-gray-100">
        {/* Background Image Statique */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat h-230"
          style={{ backgroundImage: 'url(/images/banner.png)' }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-end justify-center text-center text-white pb-8 lg:pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Button
                asChild
                size="sm"
                className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-6 py-3 text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
              >
                <a href="/products">
                  Shop Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* Values Section 
      <section className="py-20 bg-black text-white" style={{ backgroundImage: `url('./images/hero.png')` }}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {values.map((value, index) => (
              <div key={index} className="px-6">
                <div className="text-5xl mb-6">{value.icon}</div>
                <h3 className="text-lg font-black mb-4 tracking-widest uppercase">
                  {value.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed tracking-wide uppercase">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>*/}

      {/* Collections Grid */}
      <section className="bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
            {collections.map((collection) => (
              <div key={collection.id} className="group relative overflow-hidden bg-gray-100">
                <a href={collection.link}>
                  <div 
                    className="aspect-[3/4] bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-black text-xl lg:text-xl tracking-widest uppercase text-center px-4">
                      {collection.title}
                    </h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

            


      {/* Featured Products
      <section className="py-20 bg-gray-950 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight uppercase">
              Best Sellers
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto tracking-wide uppercase text-sm">
              Our most loved pieces, designed for comfort and style
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-12 py-6 rounded-none font-black tracking-widest uppercase transition-all duration-300"
            >
              <a href="/products" className="flex items-center gap-3">
                View All Products
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section> */}

      {/* Newsletter 
      <section className="py-20 bg-black text-white border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-3xl font-black mb-6 tracking-tight uppercase">
              Join Our Community
            </h3>
            <p className="text-gray-300 mb-8 text-sm tracking-wide uppercase">
              Get updates on new collections, exclusive offers, and sustainable living tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="ENTER YOUR EMAIL"
                className="flex-1 px-4 py-4 border border-gray-600 bg-transparent rounded-none text-sm focus:outline-none focus:border-white tracking-wide placeholder-gray-400 uppercase"
              />
              <Button className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-none font-black tracking-widest uppercase border-2 border-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>*/}
    </div>
  );
}