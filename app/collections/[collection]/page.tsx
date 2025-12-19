"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getProductsByCollection, Product, getAvailableColors } from '@/lib/products';
import { Search, Loader, ArrowLeft, Sparkles, Crown, ShoppingBag, Shirt, Footprints, Tag } from 'lucide-react';
import ProductFilters from '@/components/ProductFilters';

// Mapping des icônes pour les collections
const collectionIcons: Record<string, any> = {
  'everyday': ShoppingBag,
  'cozy': ShoppingBag,
  'active': ShoppingBag,
  'varsity': ShoppingBag,
  'premium': Crown,
  'sale': Tag,
  'default': ShoppingBag,
};

export default function CollectionProductsPage() {
  const params = useParams();
  const router = useRouter();
  const collectionParam = params.collection as string;
  
  // Convertir le paramètre URL en nom de collection
  const getCollectionNameFromParam = (param: string) => {
    const decoded = decodeURIComponent(param);
    // Convertir "everyday-set" en "Everyday Set"
    return decoded.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const collectionName = getCollectionNameFromParam(collectionParam);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    gender: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    collection: collectionName
  });

  useEffect(() => {
    const loadCollectionData = async () => {
      try {
        setIsLoading(true);
        
        console.log(`🔄 Loading collection: ${collectionName}`);
        
        // Récupérer les produits de la collection
        const collectionProducts = getProductsByCollection(collectionName);
        
        console.log(`📦 Found ${collectionProducts.length} products in collection`);
        
        if (collectionProducts.length > 0) {
          setProducts(collectionProducts);
          setFilteredProducts(collectionProducts);
          
          // Extraire les catégories uniques
          const uniqueCategories = [...new Set(collectionProducts.map(p => p.category))];
          setCategories(uniqueCategories);
          console.log(`🏷️ Categories: ${uniqueCategories.join(', ')}`);
          
          // Extraire les couleurs uniques
          const allColors = collectionProducts.flatMap(p => 
            p.colors.map(c => c.color_name)
          );
          const uniqueColors = Array.from(new Set(allColors));
          setColors(uniqueColors);
          console.log(`🎨 Colors: ${uniqueColors.join(', ')}`);
          
          // Pour cette page collection, nous n'avons qu'une seule collection
          setCollections([collectionName]);
        } else {
          console.log(`❌ No products found for collection: ${collectionName}`);
          // Si pas de produits, rediriger vers la page des collections
          router.push('/collections');
        }
        
      } catch (error) {
        console.error('Error loading collection data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (collectionName) {
      loadCollectionData();
    }
  }, [collectionName, router]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, filters]);

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
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
      collection: collectionName
    });
  };

  // Déterminer l'icône de la collection
  const getCollectionIcon = () => {
    const collectionKey = collectionName.toLowerCase().split(' ')[0];
    return collectionIcons[collectionKey] || ShoppingBag;
  };

  const CollectionIcon = getCollectionIcon();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-amber-600" />
          <span className="ml-2">Loading {collectionName} collection...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/collections" className="inline-flex items-center text-amber-600 hover:text-amber-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Link>
          
          {/* Badge de collection */}
          <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full">
            <CollectionIcon className="h-5 w-5 text-amber-700" />
            <span className="font-medium text-amber-800">Collection</span>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 mb-4">
            <CollectionIcon className="h-12 w-12 text-amber-700" />
          </div>
          <h1 className="text-4xl font-bold capitalize mb-2">{collectionName} Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {products.length} premium items curated for style and comfort
          </p>
        </div>
      </div>
      
      {/* Stats de la collection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-amber-700">{products.length}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-amber-700">{categories.length}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-amber-700">{colors.length}</div>
          <div className="text-sm text-gray-600">Colors</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-amber-700">
            AED{Math.min(...products.map(p => p.price))} - AED{Math.max(...products.map(p => p.price))}
          </div>
          <div className="text-sm text-gray-600">Price Range</div>
        </Card>
      </div>
      
      {/* Barre de recherche et filtres */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-2xl">
            <Input
              type="text"
              placeholder={`Search in ${collectionName}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              {colors.length} unique colours
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

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar des filtres */}
        <div className="w-full lg:w-80 flex-shrink-0">
         <ProductFilters
          categories={categories}
          colors={colors}
          collections={[collectionName]} // Toujours passer la collection actuelle
          onFilterChange={handleFilterChange}
          hideCollectionFilter={true} // MASQUER le filtre de collection ici
          />
        </div>

        {/* Contenu principal */}
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} items in {collectionName}
              {searchQuery && ` for "${searchQuery}"`}
              {filters.category && ` in ${filters.category}`}
              {filters.color && ` in ${filters.color}`}
              {filters.gender && ` for ${filters.gender}`}
              {filters.size && ` in size ${filters.size}`}
            </p>
          </div>
          
          {/* Grille de produits */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image du produit */}
                    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100">
                      {product.image ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-amber-800">
                            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
                              <span className="text-lg font-bold">{product.name.charAt(0)}</span>
                            </div>
                            <p className="font-medium">{product.name}</p>
                          </div>
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
                    </div>
                    
                    {/* Détails du produit */}
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-amber-600 transition-colors">
                        {product.name}
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
                      
                      {/* Couleurs */}
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
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      
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
                      
                      {/* Tailles disponibles */}
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
                      )}
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
                No products match your search criteria in the {collectionName} collection.
              </p>
              <Button onClick={clearAllFilters}>
                Show all {collectionName} items
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation vers d'autres collections */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold mb-6">Explore Other Collections</h3>
        <div className="flex flex-wrap gap-4">
          {['Everyday Set', 'Cozy Set', 'Active Logo Set', 'Varsity Girl Set'].map((otherCollection) => {
            if (otherCollection === collectionName) return null;
            
            const otherCollectionParam = otherCollection.toLowerCase().replace(/ /g, '-');
            const Icon = collectionIcons[otherCollection.toLowerCase().split(' ')[0]] || ShoppingBag;
            
            return (
              <Link key={otherCollection} href={`/collections/${otherCollectionParam}`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {otherCollection}
                </Button>
              </Link>
            );
          })}
          <Link href="/collections">
            <Button variant="ghost">
              View All Collections
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}