"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  featured: boolean;
  created_at: string;
}

export default function AdminProducts() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Rediriger si non admin
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Charger les produits
  useEffect(() => {
    if (user?.role === 'admin') {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setIsLoadingData(true);
      // Simulation - remplacez par un appel API
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Collection Élégance",
          price: 299.99,
          description: "Notre pièce signature, alliant tradition et modernité",
          category: "signature",
          stock: 10,
          featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: "Ligne Prestige",
          price: 459.99,
          description: "Excellence artisanale dans chaque détail",
          category: "premium",
          stock: 5,
          featured: true,
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: "Série Héritage",
          price: 199.99,
          description: "Un hommage à notre savoir-faire ancestral",
          category: "heritage",
          stock: 15,
          featured: true,
          created_at: new Date().toISOString()
        }
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (productId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      // Simulation de suppression
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="icon">
                <Link href="/admin/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
                <p className="text-gray-600 mt-2">Gérez votre catalogue produits</p>
              </div>
            </div>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Produit
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Barre de recherche */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
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
              <div className="text-sm text-gray-600 flex items-center">
                {filteredProducts.length} produit(s) trouvé(s)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des produits */}
        <Card>
          <CardHeader>
            <CardTitle>Produits ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-amber-600 font-semibold">${product.price}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                        <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                        {product.featured && (
                          <span className="inline-block px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun produit trouvé</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}