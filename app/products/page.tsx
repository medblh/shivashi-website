"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getProducts, Product, mockProducts, getAvailableColors } from '@/lib/products';
import { Search, Loader, Image as ImageIcon } from 'lucide-react';
import ProductFilters from '@/components/ProductFilters';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [colorsLoading, setColorsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    gender: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    collection: ''
  });

  // Charger les produits et couleurs
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        setColorsLoading(true);
        
        console.log('🔄 Starting to load all data...');
        
        // Charge les produits et couleurs en parallèle
        const [productsData, colorsData] = await Promise.all([
          getProducts(),
          getAvailableColors()
        ]);
        
        console.log('📦 Products loaded:', productsData.length);
        console.log('🎨 Colors loaded:', colorsData);
        
        // Traitement des produits
        if (productsData.length > 0) {
          setProducts(productsData);
          const uniqueCategories = [...new Set(productsData.map(p => p.category))];
          setCategories(uniqueCategories);
          const uniqueCollections = [...new Set(productsData.map(p => p.collection_name).filter(Boolean))];
          setCollections(uniqueCollections);
        } else {
          // Fallback aux données mock
          setProducts(mockProducts);
          setCategories([...new Set(mockProducts.map(p => p.category))]);
          const mockCollections = [...new Set(mockProducts.map(p => p.collection_name).filter(Boolean))];
          setCollections(mockCollections);
        }
        
        // Traitement des couleurs avec fallback garanti
        if (Array.isArray(colorsData) && colorsData.length > 0) {
          console.log('✅ Using colors from API');
          setColors(colorsData);
        } else {
          // Fallback aux couleurs des mockProducts
          const fallbackColors = [...new Set(mockProducts.flatMap(p => 
            p.colors.map(c => c.color_name)
          ))];
          console.log('🔄 Using fallback colors from mock products:', fallbackColors);
          setColors(fallbackColors);
        }
        
      } catch (error) {
        console.error('❌ Error loading data:', error);
        // Fallback complet en cas d'erreur
        setProducts(mockProducts);
        setCategories([...new Set(mockProducts.map(p => p.category))]);
        const mockCollections = [...new Set(mockProducts.map(p => p.collection_name).filter(Boolean))];
        setCollections(mockCollections);
        
        const fallbackColors = [...new Set(mockProducts.flatMap(p => 
          p.colors.map(c => c.color_name)
        ))];
        console.log('🔄 Error fallback colors:', fallbackColors);
        setColors(fallbackColors);
      } finally {
        setIsLoading(false);
        setColorsLoading(false);
        console.log('✅ All data loading completed');
      }
    };

    loadAllData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, filters]);

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.collection_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    if (filters.collection) {
      filtered = filtered.filter(product => product.collection_name === filters.collection);
    }

    if (filters.color) {
      filtered = filtered.filter(product => 
        product.colors.some(color => color.color_name === filters.color)
      );
    }

    if (filters.gender) {
      filtered = filtered.filter(product => product.gender === filters.gender);
    }

    if (filters.size) {
      filtered = filtered.filter(product => 
        product.variants?.some(variant => 
          variant.size === parseInt(filters.size) && variant.quantity > 0
        )
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice));
    }

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.color) count++;
    if (filters.gender) count++;
    if (filters.size) count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.collection) count++;
    return count;
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      category: '',
      color: '',
      gender: '',
      size: '',
      minPrice: '',
      maxPrice: '',
      collection: ''
    });
  };

  // Afficher le loader seulement si les produits ET les couleurs chargent
  if (isLoading || colorsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-amber-600" />
          <span className="ml-2">Loading products and colours...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      
      {/* Barre de recherche */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {colors.length} available colours
            </div>

            {getActiveFiltersCount() > 0 && (
              <>
                <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                  {getActiveFiltersCount()} active filter(s)
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear all
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal avec sidebar de filtres */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar des filtres */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <ProductFilters
            categories={categories}
            colors={colors}
            collections={collections}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredProducts.length} product(s) found
              {searchQuery && ` for "${searchQuery}"`}
              {filters.category && ` in ${filters.category}`}
              {filters.collection && ` in collection "${filters.collection}"`}
              {filters.color && ` in color ${filters.color}`}
              {filters.gender && ` for ${filters.gender === 'boy' ? 'boys' : filters.gender === 'girl' ? 'girls' : 'unisex'}`}
              {filters.size && ` in size ${filters.size}`}
              {(filters.minPrice || filters.maxPrice) && 
                ` between AED${filters.minPrice || '0'} and AED${filters.maxPrice || '∞'}`
              }
            </p>
          </div>
          
          {/* Grille de produits */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image du produit */}
                    <Link href={`/products/${product.id}`}>
                      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                        {product.image ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              priority={false}
                            />
                            {/* Overlay au survol */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full">
                            <ImageIcon className="h-12 w-12 text-amber-300 mb-3" />
                            <p className="text-amber-800 font-medium">No image available</p>
                            <p className="text-sm text-amber-600 mt-1">{product.name}</p>
                          </div>
                        )}
                        
                        {/* Badge de collection */}
                        {product.collection_name && product.collection_name !== 'default' && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-white/90 backdrop-blur-sm text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                              {product.collection_name}
                            </span>
                          </div>
                        )}
                        
                        {/* Badge featured */}
                        {product.featured && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    {/* Détails du produit */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-amber-600 transition-colors">
                        <Link href={`/products/${product.id}`}>
                          {product.name}
                        </Link>
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                          product.gender === 'boy' ? 'bg-blue-100 text-blue-800' :
                          product.gender === 'girl' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {product.gender}
                        </span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Couleurs disponibles */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {product.colors.slice(0, 3).map((color) => (
                            <div 
                              key={color.id}
                              className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                              style={{ backgroundColor: color.color_hex }}
                              title={color.color_name}
                            />
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-gray-500 ml-1">
                              +{product.colors.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/*<p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>*/}
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-gray-900">AED{product.price.toFixed(2)}</span>
                          <div className="text-sm text-gray-500 mt-1">
                            {product.total_stock && product.total_stock > 0 ? (
                              <span className="text-green-600">{product.total_stock} in stock</span>
                            ) : product.stock > 0 ? (
                              <span className="text-green-600">{product.stock} in stock</span>
                            ) : (
                              <span className="text-red-600">Out of stock</span>
                            )}
                          </div>
                        </div>
                        <Button asChild size="sm">
                          <Link href={`/products/${product.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                      
                      {/* Tailles disponibles 
                      {product.available_sizes && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">Available sizes:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {product.available_sizes.split(',').map((size, index) => (
                              <span 
                                key={index}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                              >
                                {size.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}*/}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                No products match your search criteria. Try adjusting your filters or search terms.
              </p>
              <Button onClick={clearAllFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation vers d'autres sections */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold mb-6">Explore More</h3>
        <div className="flex flex-wrap gap-4">
          <Link href="/categories">
            <Button variant="outline">
              Browse by Category
            </Button>
          </Link>
          <Link href="/collections">
            <Button variant="outline">
              Browse Collections
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}