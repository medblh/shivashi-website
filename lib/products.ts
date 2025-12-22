export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  gallery?: string[];
  category: string;
  collection_name: string;
  colors: ProductColor[];
  gender: 'boy' | 'girl' | 'unisex';
  stock: number;
  featured: boolean;
  created_at: string;
  total_stock?: number;
  available_sizes?: string;
  variants?: ProductVariant[];
}

export interface ProductColor {
  id: number;
  product_id: number;
  color_name: string;
  color_hex: string;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size: number;
  quantity: number;
  created_at: string;
}

// AJOUT: Interface pour les filtres étendus
export interface ProductFilters {
  category?: string;
  search?: string;
  featured?: boolean;
  color?: string;
  gender?: string;
  size?: number;
  minPrice?: number;
  maxPrice?: number;
  collection_name?: string; 
}

// UNE SEULE DÉFINITION de getProducts - remplacez l'ancienne par celle-ci
export async function getProducts(options?: ProductFilters): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.search) params.append('search', options.search);
    if (options?.featured) params.append('featured', 'true');
    if (options?.color) params.append('color', options.color);
    if (options?.gender) params.append('gender', options.gender); // AJOUT
    if (options?.size) params.append('size', options.size.toString()); // AJOUT
    if (options?.minPrice) params.append('minPrice', options.minPrice.toString()); // AJOUT
    if (options?.maxPrice) params.append('maxPrice', options.maxPrice.toString()); // AJOUT
    if (options?.collection_name) params.append('collection_name', options.collection_name);

    const response = await fetch(`/api/products?${params.toString()}`);
    
    if (!response.ok) {
      console.warn(`API returned ${response.status} for products`);
      return mockProducts;
    }

    const products = await response.json();
    return Array.isArray(products) ? products : mockProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts;
  }
}

export async function getProduct(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    
    if (!response.ok) {
      console.warn(`API returned ${response.status} for product ${id}`);
      const mockProduct = mockProducts.find(p => p.id === id) || null;
      console.log('Using mock product with colors:', mockProduct?.colors);
      return mockProduct;
    }

    const product = await response.json();
    
    if (!product || typeof product !== 'object') {
      console.warn('Invalid product data received, using mock data');
      const mockProduct = mockProducts.find(p => p.id === id) || null;
      console.log('Using mock product with colors:', mockProduct?.colors);
      return mockProduct;
    }
    
    // S'assurer que les couleurs existent
    if (!product.colors || !Array.isArray(product.colors) || product.colors.length === 0) {
      console.warn('Product has no colors, using mock colors');
      const mockProduct = mockProducts.find(p => p.id === id);
      if (mockProduct) {
        product.colors = mockProduct.colors;
      }
    }
    
    console.log('Returning product with colors:', product.colors);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    const mockProduct = mockProducts.find(p => p.id === id) || null;
    console.log('Error fallback to mock product with colors:', mockProduct?.colors);
    return mockProduct;
  }
}

export async function getProductVariants(productId: number): Promise<ProductVariant[]> {
  try {
    const response = await fetch(`/api/products/${productId}/variants`);
    
    if (!response.ok) {
      console.warn(`API returned ${response.status} for variants of product ${productId}`);
      const mockProduct = mockProducts.find(p => p.id === productId);
      return mockProduct?.variants || [];
    }

    const variants = await response.json();
    return Array.isArray(variants) ? variants : [];
  } catch (error) {
    console.error('Error fetching product variants:', error);
    const mockProduct = mockProducts.find(p => p.id === productId);
    return mockProduct?.variants || [];
  }
}

export async function checkStock(productId: number, size: number): Promise<number> {
  try {
    const response = await fetch(`/api/products/${productId}/stock?size=${size}`);
    
    if (!response.ok) {
      console.warn(`API returned ${response.status} for stock check`);
      return 0;
    }

    const data = await response.json();
    return data.quantity || 0;
  } catch (error) {
    console.error('Error checking stock:', error);
    return 0;
  }
}

// Dans lib/products.ts

// Récupérer toutes les collections uniques
export function getCollections(): string[] {
  // Si vous avez une API, utilisez-la ici
  // Pour l'instant, retourne les collections uniques des mockProducts
  const uniqueCollections = [...new Set(mockProducts.map(p => p.collection_name).filter(name => name && name !== 'default'))];
  return uniqueCollections;
}

// Récupérer les produits par collection
export function getProductsByCollection(collection: string): Product[] {
  // Retourne les produits par collection
  return mockProducts.filter(product => 
    product.collection_name.toLowerCase() === collection.toLowerCase()
  );
}

// Optionnel: Récupérer les collections avec statistiques
export function getCollectionsWithStats(): { name: string; count: number; minPrice: number; maxPrice: number }[] {
  const collections = getCollections();
  return collections.map(collection => {
    const products = getProductsByCollection(collection);
    const prices = products.map(p => p.price);
    return {
      name: collection,
      count: products.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices)
    };
  });
}

export function getCategories(): string[] {
  // Si vous avez une API, utilisez-la ici
  // Pour l'instant, retourne les catégories uniques des mockProducts
  const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
  return uniqueCategories;
}

export function getProductsByCategory(category: string): Product[] {
  // Retourne les produits par catégorie
  return mockProducts.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
}


// Mettez à jour les mockProducts pour inclure gender et corriger les couleurs
export const mockProducts: Product[] = [
  {
    id: 25,
    name: "Everyday Hoodie",
    price: 299.99,
    description: "a soft and cozy hoodie made for everyday adventures. Designed with a relaxed fit, it features a front kangaroo pocket, ribbed cuffs, and hem for a snug feel. Crafted from premium cotton for comfort and durability perfect for layering or wearing on its own.",
    image: "/images/Hoodieimage.jpg",
    gallery: [ 
      "/images/every3.jpg",
      "/images/every4.jpg",
      "/images/every2.jpg",
      "/images/every1.jpg"
    ],
    category: "TOP",
    collection_name: "Everyday Set",
    colors: [
      { id: 1, product_id: 1, color_name: "ivory", color_hex: "#FFFFF0", created_at: new Date().toISOString() },
      { id: 2, product_id: 1, color_name: "soft pink", color_hex: "#FDB0C0", created_at: new Date().toISOString() },
      { id: 3, product_id: 1, color_name: "camel beige", color_hex: "#C7AA82", created_at: new Date().toISOString() },
      { id: 4, product_id: 1, color_name: "chocolate brown", color_hex: "#7B3F00", created_at: new Date().toISOString() }
    ],
    gender: "boy",
    stock: 10,
    featured: true,
    created_at: new Date().toISOString(),
    total_stock: 10,
    available_sizes: "2,3,4,5,6,7,8,9,10",
    variants: [
      { id: 1, product_id: 1, size: 2, quantity: 1, created_at: new Date().toISOString() },
      { id: 2, product_id: 1, size: 3, quantity: 2, created_at: new Date().toISOString() },
      { id: 3, product_id: 1, size: 4, quantity: 3, created_at: new Date().toISOString() },
      { id: 4, product_id: 1, size: 5, quantity: 2, created_at: new Date().toISOString() },
      { id: 5, product_id: 1, size: 6, quantity: 1, created_at: new Date().toISOString() },
      { id: 6, product_id: 1, size: 7, quantity: 1, created_at: new Date().toISOString() },
      { id: 7, product_id: 1, size: 8, quantity: 0, created_at: new Date().toISOString() },
      { id: 8, product_id: 1, size: 9, quantity: 0, created_at: new Date().toISOString() },
      { id: 9, product_id: 1, size: 10, quantity: 0, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 2,
    name: "Everyday Short", 
    price: 459.99,
    description: "Comfortable and stylish shorts designed for active little ones. Featuring an elastic waistband with an adjustable drawstring for the perfect fit, these shorts are made from soft cotton fabric to keep kids cool and comfy all day long.",
    image: "/images/shortimage.jpg",
    gallery: [ 
      "/images/short.jpg",
      "/images/short1.jpg",
      "/images/short2.jpg",
      "/images/every1.jpg"
    ],
    category: "Short",
    collection_name: "Everyday Set",
    colors: [
      { id: 5, product_id: 2, color_name: "ivory", color_hex: "#FFFFF0", created_at: new Date().toISOString() },
      { id: 6, product_id: 2, color_name: "soft pink", color_hex: "#FDB0C0", created_at: new Date().toISOString() },
      { id: 7, product_id: 2, color_name: "camel beige", color_hex: "#C7AA82", created_at: new Date().toISOString() },
      { id: 8, product_id: 2, color_name: "chocolate brown", color_hex: "#7B3F00", created_at: new Date().toISOString() }
    ],
    gender: "boy",
    stock: 5,
    featured: true,
    created_at: new Date().toISOString(),
    total_stock: 5,
    available_sizes: "3,4,5,6,7",
    variants: [
      { id: 10, product_id: 2, size: 3, quantity: 1, created_at: new Date().toISOString() },
      { id: 11, product_id: 2, size: 4, quantity: 2, created_at: new Date().toISOString() },
      { id: 12, product_id: 2, size: 5, quantity: 1, created_at: new Date().toISOString() },
      { id: 13, product_id: 2, size: 6, quantity: 1, created_at: new Date().toISOString() },
      { id: 14, product_id: 2, size: 7, quantity: 0, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 3,
    name: "Relaxed tee",
    price: 199.99,
    description: "A timeless everyday essential with a laid-back fit and soft touch. The Relaxed Tee is crafted from premiumcotton, offering breathability and comfort for playtime, lounging, or layering. Designed with a classic crew neckline and short sleeves for an easy, effortless look.",
    image: "/images/shirt2.jpg",
    gallery: [
      "/images/shirt.jpg",
      "/images/shirt1.jpg",
      "/images/shirt2.jpg",
      "/images/shirt.jpg"
    ],
    category: "T-shirt", 
    collection_name: "Everyday Set",
    colors: [
      { id: 9, product_id: 3, color_name: "ivory", color_hex: "#FFFFF0", created_at: new Date().toISOString() },
      { id: 10, product_id: 3, color_name: "soft pink", color_hex: "#FDB0C0", created_at: new Date().toISOString() },
      { id: 11, product_id: 3, color_name: "camel beige", color_hex: "#C7AA82", created_at: new Date().toISOString() },
      { id: 12, product_id: 3, color_name: "chocolate brown", color_hex: "#7B3F00", created_at: new Date().toISOString() }
    ],
    gender: "girl",
    stock: 15,
    featured: true,
    created_at: new Date().toISOString(),
    total_stock: 15,
    available_sizes: "2,3,4,5,6,7,8,9,10",
    variants: [
      { id: 15, product_id: 3, size: 2, quantity: 2, created_at: new Date().toISOString() },
      { id: 16, product_id: 3, size: 3, quantity: 3, created_at: new Date().toISOString() },
      { id: 17, product_id: 3, size: 4, quantity: 3, created_at: new Date().toISOString() },
      { id: 18, product_id: 3, size: 5, quantity: 2, created_at: new Date().toISOString() },
      { id: 19, product_id: 3, size: 6, quantity: 2, created_at: new Date().toISOString() },
      { id: 20, product_id: 3, size: 7, quantity: 2, created_at: new Date().toISOString() },
      { id: 21, product_id: 3, size: 8, quantity: 1, created_at: new Date().toISOString() },
      { id: 22, product_id: 3, size: 9, quantity: 0, created_at: new Date().toISOString() },
      { id: 23, product_id: 3, size: 10, quantity: 0, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 10,
    name: "Cozy Sweat",
    price: 60.00,
    description: "A soft and easy pullover designed for relaxed days. The Cozy Sweat features a comfortable, oversized fit with ribbed cuffs and hem, crafted from premium cotton for a gentle touch on the skin. Perfect for layering or pairing with our matching Track Pants for a complete look.", 
    image: "/images/cozysweat.jpg",
    gallery: [ // ← AJOUTER LA GALERIE D'IMAGES
      "/images/DSC09334.jpg",
      "/images/DSC09335.jpg",
      "/images/DSC09336.jpg",
      "/images/DSC09337.jpg"
    ],
    category: "limited",
    collection_name: "Cozy Set",
    colors: [
      { id: 35, product_id: 10, color_name: "or", color_hex: "#FFD700", created_at: new Date().toISOString() },
      { id: 36, product_id: 10, color_name: "argent", color_hex: "#C0C0C0", created_at: new Date().toISOString() }
    ],
    gender: "unisex",
    stock: 2,
    featured: false,
    created_at: new Date().toISOString(),
    total_stock: 2,
    available_sizes: "4,5,6",
    variants: [
      { id: 78, product_id: 10, size: 4, quantity: 1, created_at: new Date().toISOString() },
      { id: 79, product_id: 10, size: 5, quantity: 1, created_at: new Date().toISOString() },
      { id: 80, product_id: 10, size: 6, quantity: 0, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 4,
    name: "Cozy Track Pant",
    price: 199.99,
    description: "Designed for movement and comfort, the Track Pants bring effortless style to everyday play. Crafted from soft cotton with a relaxed, straight-leg fit, they feature an elastic waistband and drawstring for the perfect fit. The minimal design makes them easy to pair with any top — especially our matching Cozy Sweat.",
    image: "/images/cozypant.jpg",
    gallery: [ // ← AJOUTER LA GALERIE D'IMAGES
      "/images/DSC09334.jpg",
      "/images/DSC09335.jpg",
      "/images/DSC09336.jpg",
      "/images/DSC09337.jpg"
    ],
    category: "T-shirt", 
    collection_name: "Cozy Set",
    colors: [
      { id: 13, product_id: 4, color_name: "or", color_hex: "#FFD700", created_at: new Date().toISOString() },
      { id: 14, product_id: 4, color_name: "argent", color_hex: "#C0C0C0", created_at: new Date().toISOString() }
    ],
    gender: "boy",
    stock: 15,
    featured: true,
    created_at: new Date().toISOString(),
    total_stock: 15,
    available_sizes: "2,3,4,5,6,7,8,9,10",
    variants: [
      { id: 24, product_id: 4, size: 2, quantity: 2, created_at: new Date().toISOString() },
      { id: 25, product_id: 4, size: 3, quantity: 3, created_at: new Date().toISOString() },
      { id: 26, product_id: 4, size: 4, quantity: 3, created_at: new Date().toISOString() },
      { id: 27, product_id: 4, size: 5, quantity: 2, created_at: new Date().toISOString() },
      { id: 28, product_id: 4, size: 6, quantity: 2, created_at: new Date().toISOString() },
      { id: 29, product_id: 4, size: 7, quantity: 2, created_at: new Date().toISOString() },
      { id: 30, product_id: 4, size: 8, quantity: 1, created_at: new Date().toISOString() },
      { id: 31, product_id: 4, size: 9, quantity: 0, created_at: new Date().toISOString() },
      { id: 32, product_id: 4, size: 10, quantity: 0, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 5,
    name: "Logo Tee",
    price: 199.99,
    description: "Soft, simple, and effortlessly stylish. The Logo Tee features a relaxed, boxy fit with a crew neckline and subtle Shivashi logo detail. Lightweight and breathable, perfect for every adventure.",
    image: "/images/logoshirt.jpg",
    gallery: [ // ← AJOUTER LA GALERIE D'IMAGES
      "/images/DSC09334.jpg",
      "/images/DSC09335.jpg",
      "/images/DSC09336.jpg",
      "/images/DSC09337.jpg"
    ],
    category: "T-shirt", 
    collection_name: "Active Logo Set",
    colors: [
      { id: 15, product_id: 5, color_name: "ivory", color_hex: "#FFFFF0", created_at: new Date().toISOString() },
      { id: 16, product_id: 5, color_name: "soft pink", color_hex: "#FDB0C0", created_at: new Date().toISOString() },
      { id: 17, product_id: 5, color_name: "camel beige", color_hex: "#C7AA82", created_at: new Date().toISOString() },
      { id: 18, product_id: 5, color_name: "chocolate brown", color_hex: "#7B3F00", created_at: new Date().toISOString() }
    ],
    gender: "girl",
    stock: 15,
    featured: true,
    created_at: new Date().toISOString(),
    total_stock: 15,
    available_sizes: "2,3,4,5,6,7,8,9,10",
    variants: [
      { id: 33, product_id: 5, size: 2, quantity: 2, created_at: new Date().toISOString() },
      { id: 34, product_id: 5, size: 3, quantity: 3, created_at: new Date().toISOString() },
      { id: 35, product_id: 5, size: 4, quantity: 3, created_at: new Date().toISOString() },
      { id: 36, product_id: 5, size: 5, quantity: 2, created_at: new Date().toISOString() },
      { id: 37, product_id: 5, size: 6, quantity: 2, created_at: new Date().toISOString() },
      { id: 38, product_id: 5, size: 7, quantity: 2, created_at: new Date().toISOString() },
      { id: 39, product_id: 5, size: 8, quantity: 1, created_at: new Date().toISOString() },
      { id: 40, product_id: 5, size: 9, quantity: 0, created_at: new Date().toISOString() },
      { id: 41, product_id: 5, size: 10, quantity: 0, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 6,
    name: "Logo bike short",
    price: 199.99,
    description: "Play, stretch, and move with ease. The Logo Bike Shorts feature a flattering high-rise logo waistband and a soft stretch cotton finish for total comfort. Designed for active days and endless play.",
    image: "/images/logoshort.jpg",
    gallery: [ // ← AJOUTER LA GALERIE D'IMAGES
      "/images/DSC09334.jpg",
      "/images/DSC09335.jpg",
      "/images/DSC09336.jpg",
      "/images/DSC09337.jpg"
    ],
    category: "T-shirt", 
    collection_name: "Active Logo Set",
    colors: [
      { id: 19, product_id: 6, color_name: "ivory", color_hex: "#FFFFF0", created_at: new Date().toISOString() },
      { id: 20, product_id: 6, color_name: "soft pink", color_hex: "#FDB0C0", created_at: new Date().toISOString() },
      { id: 21, product_id: 6, color_name: "camel beige", color_hex: "#C7AA82", created_at: new Date().toISOString() },
      { id: 22, product_id: 6, color_name: "chocolate brown", color_hex: "#7B3F00", created_at: new Date().toISOString() }
    ],
    gender: "girl",
    stock: 15,
    featured: true,
    created_at: new Date().toISOString(),
    total_stock: 15,
    available_sizes: "2,3,4,5,6,7,8,9,10",
    variants: [
      { id: 42, product_id: 6, size: 2, quantity: 2, created_at: new Date().toISOString() },
      { id: 43, product_id: 6, size: 3, quantity: 3, created_at: new Date().toISOString() },
      { id: 44, product_id: 6, size: 4, quantity: 3, created_at: new Date().toISOString() },
      { id: 45, product_id: 6, size: 5, quantity: 2, created_at: new Date().toISOString() },
      { id: 46, product_id: 6, size: 6, quantity: 2, created_at: new Date().toISOString() },
      { id: 47, product_id: 6, size: 7, quantity: 2, created_at: new Date().toISOString() },
      { id: 48, product_id: 6, size: 8, quantity: 1, created_at: new Date().toISOString() },
      { id: 49, product_id: 6, size: 9, quantity: 0, created_at: new Date().toISOString() },
      { id: 50, product_id: 6, size: 10, quantity: 0, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 7,
    name: "Logo Legging",
    price: 199.99,
    description: "Play, stretch, and move with ease. The Logo Bike Shorts feature a flattering high-rise logo waistband and a soft stretch cotton finish for total comfort. Designed for active days and endless play.",
    image: "/images/logopant.jpg",
    gallery: [ // ← AJOUTER LA GALERIE D'IMAGES
      "/images/DSC09334.jpg",
      "/images/DSC09335.jpg",
      "/images/DSC09336.jpg",
      "/images/DSC09337.jpg"
    ],
    category: "T-shirt", 
    collection_name: "Active Logo Set",
    colors: [
      { id: 23, product_id: 7, color_name: "ivory", color_hex: "#FFFFF0", created_at: new Date().toISOString() },
      { id: 24, product_id: 7, color_name: "soft pink", color_hex: "#FDB0C0", created_at: new Date().toISOString() },
      { id: 25, product_id: 7, color_name: "camel beige", color_hex: "#C7AA82", created_at: new Date().toISOString() },
      { id: 26, product_id: 7, color_name: "chocolate brown", color_hex: "#7B3F00", created_at: new Date().toISOString() }
    ],
    gender: "girl",
    stock: 15,
    featured: true,
    created_at: new Date().toISOString(),
    total_stock: 15,
    available_sizes: "2,3,4,5,6,7,8,9,10",
    variants: [
      { id: 51, product_id: 7, size: 2, quantity: 2, created_at: new Date().toISOString() },
      { id: 52, product_id: 7, size: 3, quantity: 3, created_at: new Date().toISOString() },
      { id: 53, product_id: 7, size: 4, quantity: 3, created_at: new Date().toISOString() },
      { id: 54, product_id: 7, size: 5, quantity: 2, created_at: new Date().toISOString() },
      { id: 55, product_id: 7, size: 6, quantity: 2, created_at: new Date().toISOString() },
      { id: 56, product_id: 7, size: 7, quantity: 2, created_at: new Date().toISOString() },
      { id: 57, product_id: 7, size: 8, quantity: 1, created_at: new Date().toISOString() },
      { id: 58, product_id: 7, size: 9, quantity: 0, created_at: new Date().toISOString() },
      { id: 59, product_id: 7, size: 10, quantity: 0, created_at: new Date().toISOString() }
    ]
  }

  
];


// Fonction utilitaire pour formater les noms de couleurs
export function formatColorName(colorName: string): string {
  const colorMap: { [key: string]: string } = {
    'yellow': 'jaune',
    'blue': 'bleu', 
    'red': 'rouge',
    'white': 'blanc',
    'black': 'noir',
    'navy': 'bleu marine',
    'gray': 'gris',
    'grey': 'gris',
    'burgundy': 'bordeaux',
    'green': 'vert',
    'gold': 'or',
    'silver': 'argent',
    'forest green': 'vert forêt'
  };
  
  return colorMap[colorName.toLowerCase()] || colorName;
}

export async function getAvailableColors(): Promise<string[]> {
  try {
    console.log('🔄 Fetching colors from API...');
    const response = await fetch('/api/products/colors');
    
    if (!response.ok) {
      console.warn('API not available for colors, using mock data');
      // Utilise les couleurs corrigées des mock products
      const allColors = mockProducts.flatMap(product => 
        product.colors.map(color => color.color_name)
      );
      const uniqueColors = Array.from(new Set(allColors));
      console.log('✅ Using corrected mock colors:', uniqueColors);
      return uniqueColors;
    }

    const colors = await response.json();
    console.log('✅ Colors from API:', colors);
    return Array.isArray(colors) ? colors : [];
    
  } catch (error) {
    console.error('❌ Error fetching colors:', error);
    // Utilise les couleurs corrigées des mock products
    const allColors = mockProducts.flatMap(product => 
      product.colors.map(color => color.color_name)
    );
    const uniqueColors = Array.from(new Set(allColors));
    console.log('✅ Error fallback to corrected mock colors:', uniqueColors);
    return uniqueColors;
  }
}