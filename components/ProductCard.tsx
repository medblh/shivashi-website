// components/ProductCard.tsx
import Link from 'next/link';
import { Product } from '@/lib/products';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Palette, Ruler } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculer les tailles disponibles AVEC STOCK
  const availableSizes = product.variants 
    ? product.variants
        .filter(variant => variant.quantity > 0)
        .map(variant => variant.size)
        .sort((a, b) => a - b)
    : [];

  // Utiliser le stock total si disponible
  const displayStock = product.total_stock ?? product.stock;

  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-amber-200">
      <CardHeader className="p-0 relative">
        <div className="w-full h-64 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center relative overflow-hidden">
          <div className="text-center text-amber-800">
            <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-8 w-8" />
            </div>
            <p className="font-medium">{product.name}</p>
          </div>
          
          {/* Badge de couleur */}
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200 flex items-center gap-1">
              <Palette className="h-3 w-3" />
              {product.color}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm text-gray-500">5.0</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Informations tailles et stock */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <Ruler className="h-4 w-4" />
              <span>Available sizes: </span>
            </div>
            <div className="flex gap-1">
              {availableSizes.slice(0, 4).map((size) => (
                <span 
                  key={size}
                  className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-200"
                >
                  {size}
                </span>
              ))}
              {availableSizes.length > 4 && (
                <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                  +{availableSizes.length - 4}
                </span>
              )}
              {availableSizes.length === 0 && (
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                  No size
                </span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Stock:</span>
            <span className={`font-medium ${
              displayStock > 10 
                ? 'text-green-600' 
                : displayStock > 0 
                ? 'text-amber-600' 
                : 'text-red-600'
            }`}>
              {displayStock > 0 ? `${displayStock} Available(s)` : 'Out of stock'}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-gray-900">AED{product.price}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 p-6 pt-0">
        <Button 
          asChild 
          className="flex-1 bg-amber-600 hover:bg-amber-700 border-0"
          disabled={availableSizes.length === 0}
        >
          <Link href={`/products/${product.id}`}>
            {availableSizes.length === 0 ? 'Out of stock' : 'See Details'}
          </Link>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-amber-200 text-amber-700 hover:bg-amber-50"
          disabled={availableSizes.length === 0}
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}