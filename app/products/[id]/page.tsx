"use client";

import { notFound, useParams } from 'next/navigation';
import { Product, ProductColor, ProductVariant, mockProducts, getProduct, getProductVariants } from '@/lib/products';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Palette, Ruler, Package, Users, Tag, X, ExternalLink, Maximize2 } from 'lucide-react';
import { CartToast } from '@/components/CartToast';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'description' | 'fabric' | 'shipping' | null>('description');
  const [showToast, setShowToast] = useState(false);
  
  // États pour la sélection
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState<number[]>([]);
  
  // État pour le sidebar du guide des tailles
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // États pour la galerie d'images
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mapping des collections aux images de guide des tailles
  const sizeGuideImages: Record<string, string> = {
    'Everyday Set': '/size-guides/collection1.jpg',
    'Cozy Set': '/size-guides/collection2.jpg',
    'Active Logo Set': '/size-guides/collection3.jpg',
    'Varsity Gril Set': '/size-guides/collection4.jpg',
  };

  const defaultSizeGuideImage = '/size-guides/default-guide.jpg';

  // Fonction pour générer des placeholders d'image
  const getPlaceholderImage = (width: number, height: number, text?: string) => {
    const bgColor = 'f3f4f6'; // gray-100
    const textColor = '9ca3af'; // gray-400
    const defaultText = `${width}×${height}`;
    return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${text || defaultText}`;
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const productId = params.id && typeof params.id === 'string' ? parseInt(params.id) : null;
      
      if (productId) {
        try {
          const productData = await getProduct(productId);
          if (productData) {
            setProduct(productData);
            
            // Récupérer les variantes de taille
            const variantsData = await getProductVariants(productId);
            setVariants(variantsData);
            
            // Filtrer uniquement les tailles avec stock > 0
            const sizesWithStock = variantsData
              .filter((v: ProductVariant) => v.quantity > 0)
              .map((v: ProductVariant) => v.size)
              .sort((a: number, b: number) => a - b);
            
            setAvailableSizes(sizesWithStock);
            
            // Sélectionner automatiquement la première taille disponible
            if (sizesWithStock.length > 0) {
              setSelectedSize(sizesWithStock[0]);
            }

            // Sélectionner automatiquement la première couleur disponible
            if (productData.colors && productData.colors.length > 0) {
              setSelectedColor(productData.colors[0]);
            }

            // Définir l'image sélectionnée initiale avec l'image principale du produit
            const initialImage = productData.image || getPlaceholderImage(800, 1000, 'Product+Image');
            setSelectedImage(initialImage);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          // Fallback avec filtre des tailles disponibles
          const foundProduct = mockProducts.find(p => p.id === productId);
          if (foundProduct) {
            setProduct(foundProduct);
            setVariants(foundProduct.variants || []);
            
            const sizesWithStock = (foundProduct.variants || [])
              .filter((v: ProductVariant) => v.quantity > 0)
              .map((v: ProductVariant) => v.size)
              .sort((a: number, b: number) => a - b);
            
            setAvailableSizes(sizesWithStock);
            if (sizesWithStock.length > 0) {
              setSelectedSize(sizesWithStock[0]);
            }
            if (foundProduct.colors && foundProduct.colors.length > 0) {
              setSelectedColor(foundProduct.colors[0]);
            }
            
            // Définir l'image principale
            const fallbackImage = foundProduct.image || getPlaceholderImage(800, 1000, 'Product+Image');
            setSelectedImage(fallbackImage);
          }
        }
      }
      
      setIsLoading(false);
    };

    fetchProductData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      const selectedVariant = variants.find((v: ProductVariant) => v.size === selectedSize);
      
      if (selectedVariant && quantity > 0 && quantity <= selectedVariant.quantity) {
        addToCart({
          id: `${product.id}-${selectedColor.id}-${selectedSize}`,
          name: product.name,
          price: product.price,
          description: product.description,
          image: product.image,
          category: product.category,
          size: selectedSize,
          quantity: quantity,
          color: selectedColor.color_name,
          color_hex: selectedColor.color_hex,
          gender: product.gender,
          maxQuantity: selectedVariant.quantity
        });
        setShowToast(true);
      }
    }
  };

  const getStockForSize = (size: number) => {
    const variant = variants.find((v: ProductVariant) => v.size === size);
    return variant ? variant.quantity : 0;
  };

  const getMaxQuantity = () => {
    if (!selectedSize) return 1;
    const variant = variants.find((v: ProductVariant) => v.size === selectedSize);
    return variant ? variant.quantity : 1;
  };

  const formatGender = (gender: string) => {
    switch (gender) {
      case 'boy': return 'Boy';
      case 'girl': return 'Girl';
      case 'unisex': return 'Unisexe';
      default: return gender;
    }
  };

  const openSizeGuide = () => {
    setIsSizeGuideOpen(true);
  };

  const selectImage = (image: string) => {
    setSelectedImage(image);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
  const hasColors = product.colors && product.colors.length > 0;
  const canAddToCart = selectedSize && (!hasColors || selectedColor) && quantity > 0 && quantity <= maxQuantity;

  // Obtenir l'image du guide pour la collection actuelle
  const collectionName = product?.collection_name;
  const currentSizeGuideImage = collectionName && sizeGuideImages[collectionName] 
    ? sizeGuideImages[collectionName] 
    : defaultSizeGuideImage;

  // Préparer les images pour la galerie
  const productMainImage = product.image || getPlaceholderImage(800, 1000, 'Product+Image');
  const galleryImages = product.gallery && product.gallery.length > 0 
    ? product.gallery.slice(0, 4) // Prendre seulement les 4 premières images
    : [];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-amber-600">Products</Link>
            <span>›</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Section Galerie d'images */}
          <div className="space-y-6">
            {/* Image principale du produit */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white group">
              <img 
                src={selectedImage} 
                alt={`${product.name} - Main image`}
                className="w-full h-[500px] lg:h-[600px] object-contain"
                onError={(e) => {
                  e.currentTarget.src = getPlaceholderImage(800, 1000, 'Image+Failed');
                  e.currentTarget.className = 'w-full h-[500px] lg:h-[600px] object-contain bg-gray-100 p-8';
                }}
              />
              
              {/* Bouton plein écran */}
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-200"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
            
            {/* Grille 2x2 pour les images de la galerie */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 h-[300px] lg:h-[350px]">
                {galleryImages.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectImage(image)}
                    className={`
                      relative rounded-lg overflow-hidden border-2 transition-all duration-200
                      ${image === selectedImage 
                        ? 'border-amber-500 scale-[1.02] shadow-lg' 
                        : 'border-gray-200 hover:border-amber-300'
                      }
                    `}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = getPlaceholderImage(400, 300, `Gallery+${index + 1}`);
                      }}
                    />
                    
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-200" />
                    
                    {/* Indicateur si c'est l'image sélectionnée */}
                    {image === selectedImage && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {/* Badges d'information */}
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium border border-blue-200 flex items-center gap-1">
                <Users className="h-3 w-3" />
                {formatGender(product.gender || 'unisex')}
              </span>
              
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium border border-green-200 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {product.category}
              </span>
              
              {/* Badge de collection */}
              {product.collection_name && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium border border-purple-200 flex items-center gap-1">
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {product.collection_name}
                </span>
              )}
            </div>
          </div>

          {/* Details du produit */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-gray-900">{product.name}</h1>
              <p className="text-2xl font-semibold text-amber-600 mb-4">AED{product.price}</p>
              
              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">{product.description}</p>
            </div>

            {/* Sélection de la couleur */}
            {hasColors && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-gray-600" />
                  <label className="font-semibold text-gray-900 text-lg">Couleur:</label>
                  {selectedColor && (
                    <span className="text-sm text-gray-500 capitalize">
                      {selectedColor.color_name}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {product.colors?.map((color: ProductColor) => {
                    const isSelected = selectedColor?.id === color.id;
                    const isLight = color.color_hex && parseInt(color.color_hex.replace('#', ''), 16) > 0xFFFFFF / 2;
                    
                    return (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`
                          w-12 h-12 rounded-full border-4 transition-all duration-200 transform hover:scale-110
                          ${isSelected 
                            ? 'border-amber-500 shadow-lg scale-110' 
                            : 'border-gray-200 hover:border-amber-300'
                          }
                        `}
                        style={{ 
                          backgroundColor: color.color_hex || '#CCCCCC',
                        }}
                        title={color.color_name}
                      >
                        {isSelected && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className={`w-2 h-2 rounded-full ${isLight ? 'bg-gray-800' : 'bg-white'} shadow-sm`} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Informations rapides */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-gray-500">Gender</div>
                <div className="font-semibold text-gray-900">{formatGender(product.gender || 'unisex')}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Colours</div>
                <div className="font-semibold text-gray-900">
                  {product.colors?.length || 1} option(s)
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Collection</div>
                <div className="font-semibold text-gray-900">{product.collection_name || 'Standard'}</div>
              </div>
            </div>

            {/* Sélection de la taille */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-gray-600" />
                <button
                  type="button"
                  onClick={openSizeGuide}
                  className="font-semibold text-gray-900 text-lg hover:text-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300 rounded flex items-center gap-1"
                >
                  Select size:
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((size) => {
                  const stock = getStockForSize(size);
                  const isAvailable = stock > 0;
                  const isSelected = selectedSize === size;
                  
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      className={`
                        p-4 rounded-lg border-2 text-center transition-all duration-200 font-medium
                        transform hover:scale-105
                        ${isSelected 
                          ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-md' 
                          : isAvailable
                            ? 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:bg-amber-50'
                            : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        }
                      `}
                      disabled={!isAvailable}
                    >
                      <div className="text-base font-bold">{size}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {isAvailable ? `${stock} available` : 'out'}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {!selectedSize && availableSizes.length > 0 && (
                <p className="text-sm text-amber-600">Select a size</p>
              )}
            </div>

            {/* Sélection de la quantité */}
            {selectedSize && (
              <div className="space-y-3">
                <label className="font-semibold text-gray-900 text-lg block">
                  Quantité:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="px-6 py-3 font-medium min-w-12 text-center bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    Maximum: {maxQuantity} available
                  </span>
                </div>
              </div>
            )}

            {/* Stock total */}
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">
                    {product.total_stock && product.total_stock > 0 ? (
                      <span className="text-green-600 font-semibold">
                        ✓ In stock ({product.total_stock} unité(s) totale(s))
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="text-green-600 font-semibold">
                        ✓ In stock ({product.stock} Available(s))
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗ Out of stock</span>
                    )}
                  </p>
                  {availableSizes.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Available Sizes: {availableSizes.join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-4 pt-4">
              <Button 
                size="lg" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleAddToCart}
                disabled={!canAddToCart}
              >
                {canAddToCart 
                  ? `Add To cart - AED${(product.price * quantity).toFixed(2)}` 
                  : !selectedSize 
                    ? 'Select a size' 
                    : hasColors && !selectedColor
                    ? 'Select a colour'
                    : 'Quantity not available'
                }
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full py-4 text-lg border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300"
              >
                <Link href="/products">
                  ← Back to products page
                </Link>
              </Button>
            </div>

            {/* Section Informations dépliables */}
            <div className="pt-8 space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Product Information</h3>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Section Description */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab(activeTab === 'description' ? null : 'description')}
                    className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 text-lg">Description</span>
                    {activeTab === 'description' ? (
                      <ChevronUp className="h-5 w-5 text-amber-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {activeTab === 'description' && (
                    <div className="p-6 bg-gray-50">
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {product.description}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700">Selected premium materials</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700">Handmade craftsmanship</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700">Lifetime warranty</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700">Luxury gift packaging</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Fabric & Care */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab(activeTab === 'fabric' ? null : 'fabric')}
                    className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 text-lg">Fabric & Care</span>
                    {activeTab === 'fabric' ? (
                      <ChevronUp className="h-5 w-5 text-amber-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {activeTab === 'fabric' && (
                    <div className="p-6 bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Material Composition</h4>
                          <ul className="text-gray-600 space-y-2">
                            <li className="flex items-start space-x-3">
                              <span className="text-amber-600 mt-0.5">•</span>
                              <span>100% Premium Organic Cotton</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-amber-600 mt-0.5">•</span>
                              <span>Reinforced stitching for durability</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-amber-600 mt-0.5">•</span>
                              <span>Eco-friendly dyes and prints</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-amber-600 mt-0.5">•</span>
                              <span>Hypoallergenic and skin-friendly</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Care Instructions</h4>
                          <ul className="text-gray-600 space-y-2">
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Machine wash cold with similar colors</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Tumble dry low or air dry</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-red-600 mt-0.5">✗</span>
                              <span>Do not bleach</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-red-600 mt-0.5">✗</span>
                              <span>Do not iron directly on prints</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Iron on low heat if needed</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Shipping & Returns */}
                <div>
                  <button
                    onClick={() => setActiveTab(activeTab === 'shipping' ? null : 'shipping')}
                    className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 text-lg">Shipping & Returns</span>
                    {activeTab === 'shipping' ? (
                      <ChevronUp className="h-5 w-5 text-amber-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  
                  {activeTab === 'shipping' && (
                    <div className="p-6 bg-gray-50">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
                          <ul className="text-gray-600 space-y-3">
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Free delivery on orders over $200</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Delivery time: 2-5 business days</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Express delivery available</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Real-time order tracking</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>International shipping available</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Returns & Refunds</h4>
                          <ul className="text-gray-600 space-y-3">
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Free returns within 30 days</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Products must be in original condition with tags</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Refund processed within 5-7 business days</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Exchanges possible within 14 days</span>
                            </li>
                            <li className="flex items-start space-x-3">
                              <span className="text-green-600 mt-0.5">✓</span>
                              <span>Free return shipping label provided</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Featured Products */}
      <div className="mt-16 border-t pt-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover other premium pieces from our collection that complement your style
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockProducts
            .filter(p => p.featured && p.id !== product.id)
            .slice(0, 4)
            .map((featuredProduct) => (
              <div key={featuredProduct.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow group bg-white">
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg mb-3 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="text-center text-amber-800">
                    <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-sm font-bold">F</span>
                    </div>
                    <p className="text-sm font-medium">{featuredProduct.name}</p>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {featuredProduct.name}
                </h3>
                
                {/* Affichage des couleurs */}
                <div className="flex items-center gap-1 mb-2">
                  {(featuredProduct.colors || []).slice(0, 3).map((color, index: number) => (
                    <div 
                      key={color.id}
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.color_hex }}
                      title={color.color_name}
                    />
                  ))}
                  {featuredProduct.colors && featuredProduct.colors.length > 3 && (
                    <span className="text-xs text-gray-500 ml-1">
                      +{featuredProduct.colors.length - 3}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">{featuredProduct.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">AED{featuredProduct.price}</span>
                  <Button size="sm">
                    <Link href={`/products/${featuredProduct.id}`}>
                      View
                    </Link>
                  </Button>
                </div>

                {/* Stock */}
                <div className="mt-2 text-xs text-gray-500">
                  {featuredProduct.total_stock && featuredProduct.total_stock > 0 ? (
                    <span className="text-green-600">{featuredProduct.total_stock} in stock</span>
                  ) : featuredProduct.stock > 0 ? (
                    <span className="text-green-600">{featuredProduct.stock} in stock</span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Bouton pour voir tous les produits */}
        <div className="text-center mt-8">
          <Button variant="outline">
            <Link href="/products" className="flex items-center gap-2">
              View All Products
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </Button>
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
        productColor={selectedColor?.color_name}
        productColorHex={selectedColor?.color_hex}
        productGender={product.gender}
        quantity={quantity}
      />

      {/* Sidebar du guide des tailles */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setIsSizeGuideOpen(false)}
          />
          
          {/* Sidebar */}
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
                <p className="text-gray-600 mt-1">
                  {product?.collection_name 
                    ? `Collection: ${product.collection_name}` 
                    : 'Standard Size Guide'}
                </p>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenu du guide */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Image du guide */}
              <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img 
                  src={currentSizeGuideImage} 
                  alt={`Size Guide - ${product?.collection_name || 'Standard'}`}
                  className="w-full h-auto object-contain max-h-[70vh]"
                  onError={(e) => {
                    e.currentTarget.src = getPlaceholderImage(800, 1000, 'Size+Guide');
                    e.currentTarget.className = 'w-full h-auto object-contain max-h-[70vh] p-8 bg-gray-100';
                  }}
                />
              </div>

              {/* Instructions */}
              <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-gray-900 mb-3">How to measure:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-amber-700">1</span>
                    </div>
                    <span>Use a soft measuring tape for accurate measurements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-amber-700">2</span>
                    </div>
                    <span>Measure chest at the fullest part, under the arms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-amber-700">3</span>
                    </div>
                    <span>Measure waist at the natural waistline</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-amber-700">4</span>
                    </div>
                    <span>For height, measure without shoes</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal plein écran pour la galerie */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="w-full h-full flex items-center justify-center p-4">
            <img 
              src={selectedImage} 
              alt={`${product.name} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}