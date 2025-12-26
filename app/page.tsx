"use client";
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { mockProducts } from '@/lib/products';

export default function Home() {
  const featuredProducts = mockProducts.slice(0, 6);

  // Collections - Only 3 items
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
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section avec Vidéo */}
      <section className="relative h-[60vh] lg:h-[90vh] overflow-hidden bg-black">
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
        
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative h-full flex items-end justify-center text-center text-white pb-6 lg:pb-16">
          <div className="container mx-auto px-4">
            <Button
              asChild
              size="sm"
              className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-6 lg:py-3 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
            >
              <a href="/products">
                Shop Now
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Split Sections - MODIFIÉ */}
      <div className="flex flex-row"> {/* Changé de flex-col lg:flex-row à flex-row */}
        {/* Boys Category */}
        <div className="relative w-1/2 h-[50vh] lg:h-screen group overflow-hidden"> {/* Changé w-full lg:w-1/2 à w-1/2 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: 'url(/images/boys.png)' }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
          
          <div className="relative h-full flex flex-col items-start justify-center text-white p-6 lg:p-16">
            <h3 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 tracking-wide">BOYS</h3>
            <Button
              asChild
              className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-8 lg:py-4 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
            >
              <a href="/products/boys">
                Discover Now
              </a>
            </Button>
          </div>
        </div>

        {/* Girls Category */}
        <div className="relative w-1/2 h-[50vh] lg:h-screen group overflow-hidden"> {/* Changé w-full lg:w-1/2 à w-1/2 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: 'url(/images/girls.png)' }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
          
          <div className="relative h-full flex flex-col items-end justify-center text-white p-6 lg:p-16">
            <h3 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 tracking-wide text-right">GIRLS</h3>
            <Button
              asChild
              className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-8 lg:py-4 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
            >
              <a href="/products/girls">
                Discover Now
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Activewear & Loungewear - MODIFIÉ */}
      <div className="flex flex-row"> {/* Changé de flex-col lg:flex-row à flex-row */}
        {/* Activewear */}
        <div className="relative w-1/2 h-[50vh] lg:h-screen group overflow-hidden"> {/* Changé w-full lg:w-1/2 à w-1/2 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: 'url(/images/activewear.png)' }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
          
          <div className="relative h-full flex flex-col items-start justify-center text-white p-6 lg:p-16">
            <h3 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 tracking-wide">ACTIVEWEAR</h3>
            <Button
              asChild
              className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-8 lg:py-4 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
            >
              <a href="/products/activewear">
                Discover Now
              </a>
            </Button>
          </div>
        </div>

        {/* Loungewear */}
        <div className="relative w-1/2 h-[50vh] lg:h-screen group overflow-hidden"> {/* Changé w-full lg:w-1/2 à w-1/2 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: 'url(/images/loungewear.png)' }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
          
          <div className="relative h-full flex flex-col items-end justify-center text-white p-6 lg:p-16">
            <h3 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 tracking-wide text-right">LOUNGEWEAR</h3>
            <Button
              asChild
              className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-8 lg:py-4 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
            >
              <a href="/products/loungewear">
                Discover Now
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Three Column Section */}
      <div className="flex flex-col lg:flex-row">
        {/* Best Sellers */}
        <div className="relative w-full lg:w-1/3 h-[40vh] lg:h-screen group overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: 'url(/images/20.webp)' }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
          
          <div className="relative h-full flex items-end justify-center text-center text-white pb-6 lg:pb-12">
            <div className="w-full px-4">
              <Button
                asChild
                className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-6 lg:py-3 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase w-full max-w-xs"
              >
                <a href="/best-sellers">
                  Best Sellers
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* New Arrivals */}
        <div className="relative w-full lg:w-1/3 h-[40vh] lg:h-screen group overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: 'url(/images/26.png)' }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
          
          <div className="relative h-full flex items-end justify-center text-center text-white pb-6 lg:pb-12">
            <div className="w-full px-4">
              <Button
                asChild
                className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-6 lg:py-3 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase w-full max-w-xs"
              >
                <a href="/new-arrivals">
                  New Arrivals
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="relative w-full lg:w-1/3 h-[40vh] lg:h-screen group overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: 'url(/images/13.webp)' }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
          </div>
          
          <div className="relative h-full flex items-end justify-center text-center text-white pb-6 lg:pb-12">
            <div className="w-full px-4">
              <Button
                asChild
                className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-6 lg:py-3 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase w-full max-w-xs"
              >
                <a href="/categories">
                  Full collection
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Static Hero Banner */}
      <section className="relative h-[60vh] lg:h-[120vh] overflow-hidden bg-gray-100">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/banner.png)' }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative h-full flex items-end justify-center text-center text-white pb-6 lg:pb-16">
          <div className="container mx-auto px-4">
            <Button
              asChild
              size="sm"
              className="bg-transparent text-white hover:bg-white hover:text-black border-2 border-white px-4 py-2 lg:px-6 lg:py-3 text-xs lg:text-sm font-bold tracking-widest rounded-none transition-all duration-300 uppercase"
            >
              <a href="/products">
                Shop Now
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Collections Grid - FULL WIDTH avec 3 items seulement */}
      <section className="bg-white w-full">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 w-full">
            {collections.map((collection) => (
              <div key={collection.id} className="group relative overflow-hidden bg-gray-100 w-full">
                <a href={collection.link}>
                  <div 
                    className="aspect-[4/5] bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 w-full"
                    style={{ backgroundImage: `url(${collection.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-black text-sm lg:text-xl tracking-widest uppercase text-center px-2 lg:px-4">
                      {collection.title}
                    </h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}