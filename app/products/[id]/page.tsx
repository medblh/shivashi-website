"use client";

import { notFound, useParams } from 'next/navigation';
import { mockProducts, getProduct, getProductVariants, checkStock } from '@/lib/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Palette, Ruler, Package } from 'lucide-react';
import { CartToast } from '@/components/CartToast';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | null>('description');
  const [showToast, setShowToast] = useState(false);
  
  // Nouveaux états pour la sélection
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState<number[]>([]);

  useEffect(() => {
    // Dans la fonction fetchProductData
const fetchProductData = async () => {
  const productId = params.id ? parseInt(params.id as string) : null;
  
  if (productId) {
    try {
      const productData = await getProduct(productId);
      if (productData) {
        setProduct(productData);
        
        // Récupérer les variantes de taille
        const variantsData = await getProductVariants(productId);
        setVariants(variantsData);
        
        // ✅ CORRECTION: Filtrer uniquement les tailles avec stock > 0
        const sizesWithStock = variantsData
          .filter((v: any) => v.quantity > 0)
          .map((v: any) => v.size)
          .sort((a: number, b: number) => a - b);
        
        setAvailableSizes(sizesWithStock);
        
        // Sélectionner automatiquement la première taille disponible
        if (sizesWithStock.length > 0) {
          setSelectedSize(sizesWithStock[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Fallback avec filtre des tailles disponibles
      const foundProduct = mockProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setVariants(foundProduct.variants || []);
        
        // ✅ CORRECTION: Filtrer uniquement les tailles avec stock > 0
        const sizesWithStock = (foundProduct.variants || [])
          .filter((v: any) => v.quantity > 0)
          .map((v: any) => v.size)
          .sort((a: number, b: number) => a - b);
        
        setAvailableSizes(sizesWithStock);
        if (sizesWithStock.length > 0) {
          setSelectedSize(sizesWithStock[0]);
        }
      }
    }
  }
  
  setIsLoading(false);
};

    fetchProductData();
  }, [params.id]);

  // Mettre à jour la quantité max quand la taille change
  useEffect(() => {
    if (selectedSize && variants.length > 0) {
      const selectedVariant = variants.find((v: any) => v.size === selectedSize);
      if (selectedVariant && quantity > selectedVariant.quantity) {
        setQuantity(selectedVariant.quantity);
      }
    }
  }, [selectedSize, variants, quantity]);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      const selectedVariant = variants.find((v: any) => v.size === selectedSize);
      
      if (selectedVariant && quantity > 0 && quantity <= selectedVariant.quantity) {
        addToCart({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          size: selectedSize, // ✅ Ajout de la taille
          quantity: quantity, // ✅ Ajout de la quantité
          color: product.color, // ✅ Ajout de la couleur
          maxQuantity: selectedVariant.quantity // ✅ Stock max pour cette taille
        });
        setShowToast(true);
      }
    }
  };

  const handleTabClick = (tab: 'description' | 'shipping') => {
    if (activeTab === tab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  };

  const getStockForSize = (size: number) => {
    const variant = variants.find((v: any) => v.size === size);
    return variant ? variant.quantity : 0;
  };

  const getMaxQuantity = () => {
    if (!selectedSize) return 1;
    const variant = variants.find((v: any) => v.size === selectedSize);
    return variant ? variant.quantity : 1;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const maxQuantity = getMaxQuantity();
  const canAddToCart = selectedSize && quantity > 0 && quantity <= maxQuantity;

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl h-96 flex items-center justify-center border border-amber-200 relative">
            <div className="text-center text-amber-800">
              <div className="w-20 h-20 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">S</span>
              </div>
              <p className="text-lg font-semibold">{product.name}</p>
              <p className="text-sm text-amber-600">Product Image</p>
            </div>
            
            {/* Badge de couleur */}
            <div className="absolute top-4 right-4">
              <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-2 rounded-full text-sm font-medium border border-gray-200 flex items-center gap-2">
                <Palette className="h-4 w-4" />
                {product.color}
              </span>
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-amber-600 mb-6">AED{product.price}</p>
            
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">{product.description}</p>

            {/* Sélection de la taille */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Ruler className="h-5 w-5 text-gray-600" />
                <label className="font-semibold text-gray-900">Size:</label>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => {
                  const stock = getStockForSize(size);
                  const isAvailable = stock > 0;
                  const isSelected = selectedSize === size;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      className={`
                        p-3 rounded-lg border-2 text-center transition-all duration-200 font-medium
                        ${isSelected 
                          ? 'border-amber-500 bg-amber-50 text-amber-700' 
                          : isAvailable
                            ? 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-25'
                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }
                      `}
                      disabled={!isAvailable}
                    >
                      <div className="text-sm">{size}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {isAvailable ? `${stock} avai` : 'unavai'}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {!selectedSize && availableSizes.length > 0 && (
                <p className="text-sm text-amber-600 mt-2">Please select a size</p>
              )}
            </div>

            {/* Sélection de la quantité */}
            {selectedSize && (
              <div className="mb-6">
                <label className="font-semibold text-gray-900 mb-3 block">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium min-w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Maximum: {maxQuantity}
                  </span>
                </div>
              </div>
            )}

            {/* Stock total */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-gray-600" />
                <p className="text-sm text-gray-600">
                  {product.total_stock && product.total_stock > 0 ? (
                    <span className="text-green-600 font-semibold">
                      ✓ In stock ({product.total_stock} unité(s) totale(s))
                    </span>
                  ) : product.stock > 0 ? (
                    <span className="text-green-600 font-semibold">
                      ✓ In stock ({product.stock} disponible(s))
                    </span>
                  ) : (
                    <span className="text-red-600 font-semibold">✗ Out stock</span>
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
              >
                {canAddToCart 
                  ? `Add to bag - $${(product.price * quantity).toFixed(2)}` 
                  : !selectedSize 
                    ? 'Select a size' 
                    : 'Quantity not available'
                }
              </Button>
              <Button asChild variant="outline" className="w-full py-3 text-lg border-amber-200 text-amber-700 hover:bg-amber-50">
                <Link href="/products">
                  ← Back to Collections
                </Link>
              </Button>
            </div>

            {/* Section avec Onglets */}
            <div className="mt-12 space-y-4">
              <h3 className="text-2xl font-semibold text-gray-900">Informations</h3>
              
              {/* Onglets */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Bouton Description */}
                <button
                  onClick={() => handleTabClick('description')}
                  className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200"
                >
                  <span className="font-semibold text-gray-900">Description</span>
                  {activeTab === 'description' ? (
                    <ChevronUp className="h-5 w-5 text-amber-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Contenu Description */}
                {activeTab === 'description' && (
                  <div className="p-4 bg-gray-50 animate-in fade-in duration-200">
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Selected premium materials</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Handmade</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Lifetime warranty</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Luxury gift wrapping</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton Shipping & Refunds */}
                <button
                  onClick={() => handleTabClick('shipping')}
                  className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">Shipping & Refunds</span>
                  {activeTab === 'shipping' ? (
                    <ChevronUp className="h-5 w-5 text-amber-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Contenu Shipping & Refunds */}
                {activeTab === 'shipping' && (
                  <div className="p-4 bg-gray-50 animate-in fade-in duration-200">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Shipping</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Free delivery on purchases over AED200</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Delivery time: 2-5 business days</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Express delivery available</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Real-time order tracking</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Returns & Refunds</h4>
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Free returns within 30 days</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Products must be in their original condition</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Refund within 5-7 business days</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span>Exchange possible within 14 days</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category et Couleur */}
            <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-amber-800">Category:</strong>
                  <p className="text-amber-700">{product.category}</p>
                </div>
                <div>
                  <strong className="text-amber-800">Color:</strong>
                  <p className="text-amber-700">{product.color}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Toast flottant */}
      <CartToast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        productName={product.name}
        productPrice={product.price}
        productImage={product.image}
        productSize={selectedSize}
        productColor={product.color}
        quantity={quantity}
      />
    </>
  );
}