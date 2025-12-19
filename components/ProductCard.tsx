// components/ProductCard.tsx
import Link from 'next/link';
import { Product } from '@/lib/products';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Palette, Ruler, Tag, Users } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

// Fonction pour générer des placeholders d'image
const getPlaceholderImage = (width: number, height: number, text?: string) => {
  const bgColor = 'f3f4f6';
  const textColor = '9ca3af';
  const defaultText = text || `${width}×${height}`;
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(defaultText)}`;
};

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
  
  // Déterminer l'URL de l'image
  const imageUrl = product.image || 
    (product.gallery && product.gallery.length > 0 ? product.gallery[0] : 
    getPlaceholderImage(400, 300, product.name));
  
  // Format du genre
  const formatGender = (gender: string) => {
    switch (gender) {
      case 'boy': return 'Boy';
      case 'girl': return 'Girl';
      case 'unisex': return 'Unisexe';
      default: return gender;
    }
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white hover:border-amber-300">
      {/* Header avec image */}
      <CardHeader className="p-0 relative">
        <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
          {/* Image du produit */}
          <img 
            src={imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = getPlaceholderImage(400, 300, product.name);
              e.currentTarget.className = 'w-full h-full object-contain p-8 bg-gray-100';
            }}
          />
          
          {/* Overlay au survol */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          
          {/* Badge Featured */}
          {product.featured && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
              <Star className="h-3 w-3 fill-white" />
              Featured
            </div>
          )}
          
          {/* Badge Collection */}
          {product.collection_name && product.collection_name !== 'default' && (
            <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {product.collection_name}
            </div>
          )}

          {/* Badge stock */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-lg backdrop-blur-sm ${
              displayStock > 10 
                ? 'bg-green-600/90 text-white' 
                : displayStock > 0 
                ? 'bg-amber-500/90 text-white' 
                : 'bg-red-600/90 text-white'
            }`}>
              {displayStock > 0 ? `${displayStock} in stock` : 'SOLD OUT'}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5">
        {/* En-tête compact */}
        <div className="mb-4">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          {/* Prix */}
          <div className="flex items-center justify-between mt-2">
            <div className="text-2xl font-bold text-amber-600">
              AED{product.price}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-500">5.0</span>
            </div>
          </div>
        </div>
        
        {/* Badges d'information */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Users className="h-3 w-3" />
            {formatGender(product.gender)}
          </span>
          
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {product.category}
          </span>
        </div>
        
        {/* Description courte */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Couleurs disponibles */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Palette className="h-4 w-4" />
              <span>Colours:</span>
            </div>
            <div className="flex gap-2">
              {product.colors.slice(0, 4).map((color) => (
                <div 
                  key={color.id}
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: color.color_hex || '#CCCCCC' }}
                  title={color.color_name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 self-center">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Tailles disponibles */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2 text-gray-700">
              <Ruler className="h-4 w-4" />
              <span>Available sizes:</span>
            </div>
            <div className="flex gap-1">
              {availableSizes.slice(0, 4).map((size) => (
                <span 
                  key={size}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold min-w-8 text-center border border-gray-200"
                >
                  {size}
                </span>
              ))}
              {availableSizes.length > 4 && (
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">
                  +{availableSizes.length - 4}
                </span>
              )}
              {availableSizes.length === 0 && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                  No sizes
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Actions */}
      <CardFooter className="p-5 pt-0 border-t">
        <div className="w-full flex gap-3">
          <Button 
            asChild 
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium text-sm py-2 transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={availableSizes.length === 0}
          >
            <Link href={`/products/${product.id}`}>
              {availableSizes.length === 0 ? 'SOLD OUT' : 'VIEW DETAILS'}
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="border border-gray-300 text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 rounded-lg transition-all duration-200 disabled:border-gray-200 disabled:text-gray-400 h-10 w-10 shadow-sm hover:shadow"
            disabled={availableSizes.length === 0}
            title={availableSizes.length === 0 ? "Sold out" : "Add to cart"}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}