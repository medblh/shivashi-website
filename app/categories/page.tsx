"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Shirt, Footprints, Baby, Star, TrendingUp, Zap, Package, Shirt as TShirt, Briefcase, Watch, Glasses } from 'lucide-react';
import { getCategories, getProducts, Product } from '@/lib/products';
import { getColorHex } from '@/lib/colors';

// Mapping des icônes pour les catégories
const categoryIcons: Record<string, any> = {
  'top': Shirt,
  'short': ShoppingBag,
  't-shirt': TShirt,
  'clothing': Shirt,
  'shoes': Footprints,
  'accessories': ShoppingBag,
  'pants': TShirt,
  'baby': Baby,
  'limited': Star,
  'trending': TrendingUp,
  'new': Zap,
  'bundle': Package,
  'formal': Briefcase,
  'watches': Watch,
  'sunglasses': Glasses,
  'default': ShoppingBag,
};

// Fonction pour convertir le nom de catégorie en slug d'URL
const getCategorySlug = (categoryName: string): string => {
  return categoryName.toLowerCase().replace(/ /g, '-');
};

interface CategoryStats {
  count: number;
  minPrice: number;
  maxPrice: number;
  colors: string[];
  collections: string[];
  genders: string[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<string, CategoryStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer toutes les catégories
        const categoriesData = getCategories();
        setCategories(categoriesData);
        
        // Récupérer tous les produits pour calculer les statistiques
        const allProducts = await getProducts();
        
        // Calculer les statistiques pour chaque catégorie
        const stats: Record<string, CategoryStats> = {};
        
        categoriesData.forEach(category => {
          const categoryProducts = allProducts.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
          );
          
          if (categoryProducts.length > 0) {
            const prices = categoryProducts.map(p => p.price);
            const allColors = categoryProducts.flatMap(p => p.colors.map(c => c.color_name));
            const uniqueColors = Array.from(new Set(allColors));
            const collections = Array.from(new Set(categoryProducts.map(p => p.collection_name).filter(Boolean)));
            const genders = Array.from(new Set(categoryProducts.map(p => p.gender)));
            
            stats[category] = {
              count: categoryProducts.length,
              minPrice: Math.min(...prices),
              maxPrice: Math.max(...prices),
              colors: uniqueColors,
              collections: collections,
              genders: genders
            };
          }
        });
        
        setCategoryStats(stats);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Filtrer les catégories
  const filteredCategories = categories.filter(category => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'tops') return category.toLowerCase().includes('top') || category.toLowerCase().includes('t-shirt');
    if (selectedFilter === 'bottoms') return category.toLowerCase().includes('short') || category.toLowerCase().includes('pants');
    if (selectedFilter === 'accessories') return category.toLowerCase().includes('accessory') || category.toLowerCase().includes('limited');
    return true;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
          <span className="ml-2">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Shop by Category</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Browse our collection organized by category for easy shopping
        </p>
        
        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setSelectedFilter('tops')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'tops'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Shirt className="inline-block h-3 w-3 mr-1" />
            Tops
          </button>
          <button
            onClick={() => setSelectedFilter('bottoms')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'bottoms'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ShoppingBag className="inline-block h-3 w-3 mr-1" />
            Bottoms
          </button>
          <button
            onClick={() => setSelectedFilter('accessories')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'accessories'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className="inline-block h-3 w-3 mr-1" />
            Accessories
          </button>
        </div>
      </div>
      
      {/* Grille des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {filteredCategories.map((category) => {
          const stats = categoryStats[category] || { 
            count: 0, 
            minPrice: 0, 
            maxPrice: 0, 
            colors: [], 
            collections: [], 
            genders: [] 
          };
          
          // Déterminer l'icône
          const categoryKey = category.toLowerCase();
          let Icon = ShoppingBag;
          
          if (categoryKey.includes('top') || categoryKey.includes('t-shirt')) Icon = Shirt;
          else if (categoryKey.includes('short') || categoryKey.includes('pants')) Icon = ShoppingBag;
          else if (categoryKey.includes('shoe')) Icon = Footprints;
          else if (categoryKey.includes('baby')) Icon = Baby;
          else if (categoryKey.includes('accessory') || categoryKey.includes('limited')) Icon = Star;
          else if (categoryKey.includes('trending')) Icon = TrendingUp;
          else if (categoryKey.includes('new')) Icon = Zap;
          else if (categoryKey.includes('bundle')) Icon = Package;
          
          return (
            <Link 
              key={category} 
              href={`/categories/${getCategorySlug(category)}`}
              className="block group"
            >
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border-2 border-transparent hover:border-amber-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300 transition-all">
                      <Icon className="h-5 w-5 text-amber-700" />
                    </div>
                    
                    {/* Badge du nombre de produits */}
                    {stats.count > 0 && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                        {stats.count} {stats.count === 1 ? 'item' : 'items'}
                      </span>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg font-bold capitalize">
                    {category}
                  </CardTitle>
                  
                  {stats.count > 0 && (
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-semibold text-amber-700">
                        AED{stats.minPrice} - AED{stats.maxPrice}
                      </span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Genres disponibles */}
                    {stats.genders && stats.genders.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {stats.genders.slice(0, 2).map((gender, index) => (
                          <span 
                            key={index}
                            className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                              gender === 'boy' ? 'bg-blue-100 text-blue-800' :
                              gender === 'girl' ? 'bg-pink-100 text-pink-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {gender}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Couleurs disponibles */}
                    {stats.colors && stats.colors.length > 0 && (
                      <div className="flex items-center gap-1">
                        {stats.colors.slice(0, 4).map((color, index) => (
                          <div 
                            key={index}
                            className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                            style={{ 
                              backgroundColor: getColorHex(color)
                            }}
                            title={color}
                          />
                        ))}
                        {stats.colors.length > 4 && (
                          <span className="text-xs text-gray-500 ml-1">
                            +{stats.colors.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-200 transition-colors"
                    >
                      Browse {category}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      
      {/* Catégories vedettes - MISE À JOUR DES LIENS */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Featured Categories</h2>
          <p className="text-gray-600">Popular categories with wide selections</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Tops */}
          <Link href={`/categories/${getCategorySlug('TOP')}`}>
            <div className="relative overflow-hidden rounded-2xl h-80 group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-orange-400/90"></div>
              <div className="absolute inset-0 flex flex-col justify-center p-10 text-white">
                <div className="mb-4">
                  <Shirt className="h-10 w-10 mb-3" />
                  <h3 className="text-4xl font-bold mb-2">Tops Collection</h3>
                  <p className="text-lg opacity-95 mb-6 max-w-lg">
                    From t-shirts to hoodies, find the perfect top for every occasion
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                      {categoryStats['TOP']?.count || 0}+ items
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                      From AED{categoryStats['TOP']?.minPrice || 0}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                      👕 Multiple styles
                    </span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="mt-6 bg-white text-amber-600 hover:bg-amber-50 w-fit"
                >
                  Shop Tops
                </Button>
              </div>
            </div>
          </Link>
          
          {/* Category Shorts */}
          <Link href={`/categories/${getCategorySlug('Short')}`}>
            <div className="relative overflow-hidden rounded-2xl h-80 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-500/90"></div>
              <div className="absolute inset-0 flex flex-col justify-center p-10 text-white">
                <div className="mb-4">
                  <ShoppingBag className="h-10 w-10 mb-3" />
                  <h3 className="text-4xl font-bold mb-2">Shorts Collection</h3>
                  <p className="text-lg opacity-95 mb-6 max-w-lg">
                    Comfortable and stylish shorts for active little ones
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                      {categoryStats['Short']?.count || 0}+ items
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                      From AED{categoryStats['Short']?.minPrice || 0}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                      🏃 Active Wear
                    </span>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="mt-6 bg-white text-blue-600 hover:bg-blue-50 w-fit"
                >
                  Shop Shorts
                </Button>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Stats générales */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Shop by Numbers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {categories.length}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {Object.values(categoryStats).reduce((acc, stats) => acc + stats.count, 0)}
            </div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {Array.from(new Set(Object.values(categoryStats).flatMap(stats => stats.colors))).length}
            </div>
            <div className="text-gray-600">Color Options</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {Array.from(new Set(Object.values(categoryStats).flatMap(stats => stats.collections))).length}
            </div>
            <div className="text-gray-600">Collections</div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Can&apos;t find what you&apos;re looking for?</h3>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Browse our complete product catalog or explore by collection
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/products">
              View All Products
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/collections">
              Browse Collections
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}