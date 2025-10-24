"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts, Product, mockProducts } from '@/lib/products';
import { Search, Loader } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const productsData = await getProducts();
      
      if (productsData.length > 0) {
        setProducts(productsData);
        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(productsData.map(p => p.category))];
        setCategories(uniqueCategories);
      } else {
        // Fallback aux données mock
        setProducts(mockProducts);
        setCategories([...new Set(mockProducts.map(p => p.category))]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts(mockProducts);
      setCategories([...new Set(mockProducts.map(p => p.category))]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Collection</h1>
      
      {/* Barre de recherche et filtres */}
      <div className="mb-12 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Filtre par catégorie */}
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border rounded-md px-3 py-2 bg-white"
          >
            <option value="">All categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Résultats */}
        <p className="text-gray-600">
          {filteredProducts.length} product(s) Found(s)
          {searchQuery && ` pour "${searchQuery}"`}
          {selectedCategory && ` dans ${selectedCategory}`}
        </p>
      </div>
      
      {/* Grille de produits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow group">
            {/* Image placeholder */}
            <div className="w-full h-48 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="text-center text-amber-800">
                <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg font-bold">S</span>
                </div>
                <p className="font-medium">{product.name}</p>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-amber-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">${product.price}</span>
              <Button asChild>
                <Link href={`/products/${product.id}`}>
                  See Details
                </Link>
              </Button>
            </div>

            {/* Stock */}
            <div className="mt-3 text-sm text-gray-500">
              {product.stock > 0 ? (
                <span className="text-green-600">{product.stock} In stock</span>
              ) : (
                <span className="text-red-600">Out stock</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun résultat */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found</p>
          <Button onClick={() => { setSearchQuery(''); setSelectedCategory(''); }}>
            See all products
          </Button>
        </div>
      )}
    </div>
  );
}