"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Shirt, Footprints, Baby, Sparkles, Gift, Crown, Star, Tag, Snowflake, Flower, Leaf, TrendingUp, Zap, Loader } from 'lucide-react';
import { getCollections, getProductsByCollection, Product } from '@/lib/products';
import { getColorHex } from '@/lib/colors';

// Mapping des icônes pour les collections
const collectionIcons: Record<string, any> = {
  'everyday set': ShoppingBag,
  'cozy set': ShoppingBag,
  'active logo set': ShoppingBag,
  'varsity girl set': ShoppingBag,
  'default': ShoppingBag,
  'summer': Sparkles,
  'winter': Snowflake,
  'spring': Flower,
  'fall': Leaf,
  'new arrival': Star,
  'premium': Crown,
  'sale': Tag,
  'limited': Gift,
  'essential': ShoppingBag,
  'fashion': Shirt,
  'footwear': Footprints,
  'baby': Baby,
  'trending': TrendingUp,
  'flash': Zap,
};

interface CollectionStats {
  count: number;
  minPrice: number;
  maxPrice: number;
  colors: string[];
  categories: string[];
  genders: string[];
  products: Product[];
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<string[]>([]);
  const [collectionStats, setCollectionStats] = useState<Record<string, CollectionStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer toutes les collections depuis votre API
        const collectionsData = getCollections();
        setCollections(collectionsData);
        
        // Calculer les statistiques pour chaque collection
        const stats: Record<string, CollectionStats> = {};
        
        collectionsData.forEach(collection => {
          const products = getProductsByCollection(collection);
          
          if (products.length > 0) {
            const prices = products.map(p => p.price);
            const allColors = products.flatMap(p => p.colors.map(c => c.color_name));
            const uniqueColors = Array.from(new Set(allColors));
            const categories = Array.from(new Set(products.map(p => p.category)));
            const genders = Array.from(new Set(products.map(p => p.gender)));
            
            stats[collection] = {
              count: products.length,
              minPrice: Math.min(...prices),
              maxPrice: Math.max(...prices),
              colors: uniqueColors,
              categories: categories,
              genders: genders,
              products: products
            };
          }
        });
        
        setCollectionStats(stats);
      } catch (error) {
        console.error('Error loading collections:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollections();
  }, []);

  // Filtrer les collections
  const filteredCollections = collections.filter(collection => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'new') return collection.toLowerCase().includes('new') || collection.toLowerCase().includes('arrival');
    if (selectedFilter === 'sale') return collection.toLowerCase().includes('sale') || collection.toLowerCase().includes('flash');
    if (selectedFilter === 'premium') return collection.toLowerCase().includes('premium') || collection.toLowerCase().includes('limited');
    if (selectedFilter === 'set') return collection.toLowerCase().includes('set');
    return true;
  });

  // Trier les collections par nombre de produits (décroissant)
  const sortedCollections = [...filteredCollections].sort((a, b) => {
    const statsA = collectionStats[a];
    const statsB = collectionStats[b];
    return (statsB?.count || 0) - (statsA?.count || 0);
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-amber-600" />
          <span className="ml-2">Loading collections...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">Our Collections</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Discover our curated collections, each telling a unique story through carefully selected pieces
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
            All Collections
          </button>
          <button
            onClick={() => setSelectedFilter('set')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'set'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ShoppingBag className="inline-block h-3 w-3 mr-1" />
            Complete Sets
          </button>
          <button
            onClick={() => setSelectedFilter('premium')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'premium'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Crown className="inline-block h-3 w-3 mr-1" />
            Premium
          </button>
          <button
            onClick={() => setSelectedFilter('new')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilter === 'new'
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className="inline-block h-3 w-3 mr-1" />
            New Arrivals
          </button>
        </div>
      </div>
      
      {/* Grille des collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {sortedCollections.map((collection) => {
          const stats = collectionStats[collection] || { 
            count: 0, 
            minPrice: 0, 
            maxPrice: 0, 
            colors: [], 
            categories: [], 
            genders: [],
            products: []
          };
          
          // Déterminer l'icône basée sur le nom de la collection
          const collectionKey = collection.toLowerCase();
          let Icon = ShoppingBag; // icône par défaut
          
          if (collectionKey.includes('everyday')) Icon = ShoppingBag;
          else if (collectionKey.includes('cozy')) Icon = Shirt;
          else if (collectionKey.includes('active')) Icon = Footprints;
          else if (collectionKey.includes('varsity')) Icon = Sparkles;
          else if (collectionKey.includes('premium')) Icon = Crown;
          else if (collectionKey.includes('limited')) Icon = Gift;
          else if (collectionKey.includes('summer')) Icon = Sparkles;
          else if (collectionKey.includes('winter')) Icon = Snowflake;
          else if (collectionKey.includes('spring')) Icon = Flower;
          else if (collectionKey.includes('fall')) Icon = Leaf;
          else if (collectionKey.includes('new')) Icon = Star;
          else if (collectionKey.includes('sale')) Icon = Tag;
          else if (collectionKey.includes('flash')) Icon = Zap;
          else if (collectionKey.includes('trending')) Icon = TrendingUp;
          else if (collectionKey.includes('baby')) Icon = Baby;
          
          // Déterminer les badges
          const isSet = collectionKey.includes('set');
          const isNew = collectionKey.includes('new') || collectionKey.includes('arrival');
          const isLimited = collectionKey.includes('limited') || collectionKey.includes('premium');
          const isSeasonal = collectionKey.includes('summer') || collectionKey.includes('winter') || 
                           collectionKey.includes('spring') || collectionKey.includes('fall');
          
          return (
            <Link 
              key={collection} 
              href={`/collections/${encodeURIComponent(collection.toLowerCase().replace(/ /g, '-'))}`}
              className="block group"
            >
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full border-2 border-transparent hover:border-amber-100">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 group-hover:from-amber-200 group-hover:to-amber-300 transition-all">
                      <Icon className="h-5 w-5 text-amber-700" />
                    </div>
                    
                    {/* Badges */}
                    <div className="flex gap-1">
                      {isNew && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                      {isSet && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          Set
                        </span>
                      )}
                      {isLimited && (
                        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg font-bold capitalize line-clamp-1">
                    {collection}
                  </CardTitle>
                  
                  {stats.count > 0 && (
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {stats.count} {stats.count === 1 ? 'item' : 'items'}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm font-semibold text-amber-700">
                        AED{stats.minPrice} - AED{stats.maxPrice}
                      </span>
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Aperçu des couleurs */}
                    {stats.colors && stats.colors.length > 0 && (
                      <div className="flex items-center gap-1">
                        {stats.colors.slice(0, 4).map((color, index) => (
                          <div 
                            key={index}
                            className="w-6 h-6 rounded-full border border-gray-300 shadow-sm"
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
                    
                    {/* Catégories */}
                    {stats.categories && stats.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {stats.categories.slice(0, 3).map((category, index) => (
                          <span 
                            key={index}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                        {stats.categories.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{stats.categories.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-200 transition-colors"
                    >
                      View Collection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      
      {/* Collections vedettes basées sur vos données */}
      <div className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Featured Collections</h2>
          <p className="text-gray-600">Handpicked selections for every occasion</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection Everyday Set */}
          {collections.includes('Everyday Set') && (
            <Link href="/collections/everyday-set">
              <div className="relative overflow-hidden rounded-2xl h-80 group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-orange-400/90"></div>
                <div className="absolute inset-0 flex flex-col justify-center p-10 text-white">
                  <div className="mb-4">
                    <ShoppingBag className="h-10 w-10 mb-3" />
                    <h3 className="text-4xl font-bold mb-2">Everyday Set</h3>
                    <p className="text-lg opacity-95 mb-6 max-w-lg">
                      Comfortable and stylish pieces for daily wear
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                        {collectionStats['Everyday Set']?.count || 0} items
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                        From AED{collectionStats['Everyday Set']?.minPrice || 0}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                        👕 3+ categories
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    className="mt-6 bg-white text-amber-600 hover:bg-amber-50 w-fit"
                  >
                    Shop Everyday Set
                  </Button>
                </div>
              </div>
            </Link>
          )}
          
          {/* Collection Active Logo Set */}
          {collections.includes('Active Logo Set') && (
            <Link href="/collections/active-logo-set">
              <div className="relative overflow-hidden rounded-2xl h-80 group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-cyan-500/90"></div>
                <div className="absolute inset-0 flex flex-col justify-center p-10 text-white">
                  <div className="mb-4">
                    <Footprints className="h-10 w-10 mb-3" />
                    <h3 className="text-4xl font-bold mb-2">Active Logo Set</h3>
                    <p className="text-lg opacity-95 mb-6 max-w-lg">
                      Sporty and active wear for energetic kids
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                        {collectionStats['Active Logo Set']?.count || 0} items
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm">
                        From AED{collectionStats['Active Logo Set']?.minPrice || 0}
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
                    Shop Active Set
                  </Button>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
      
      {/* Stats générales */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-12">
        <h3 className="text-2xl font-bold mb-6 text-center">Collections Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {collections.length}
            </div>
            <div className="text-gray-600">Total Collections</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {Object.values(collectionStats).reduce((acc, stats) => acc + stats.count, 0)}
            </div>
            <div className="text-gray-600">Total Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {Array.from(new Set(Object.values(collectionStats).flatMap(stats => stats.colors))).length}
            </div>
            <div className="text-gray-600">Unique Colors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700">
              {Array.from(new Set(Object.values(collectionStats).flatMap(stats => stats.categories))).length}
            </div>
            <div className="text-gray-600">Categories</div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Can&apos;t find what you&apos;re looking for?</h3>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Browse our complete catalog or contact our style consultants for personalized recommendations
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
            <Link href="/products">
              View All Products
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/categories">
              Browse Categories
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}