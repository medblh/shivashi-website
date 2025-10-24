export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  color: string;
  stock: number;
  featured: boolean;
  created_at: string;
  total_stock?: number;
  available_sizes?: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  size: number;
  quantity: number;
  created_at: string;
}

export async function getProducts(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
  color?: string;
}): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.append('category', options.category);
    if (options?.search) params.append('search', options.search);
    if (options?.featured) params.append('featured', 'true');
    if (options?.color) params.append('color', options.color);

    const response = await fetch(`/api/products?${params.toString()}`);
    
    if (!response.ok) {
      console.warn(`API returned ${response.status} for products`);
      return mockProducts; // Retourner les mock data directement
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
      // Si l'API n'est pas disponible, retourner les mock data
      console.warn(`API returned ${response.status} for product ${id}`);
      return mockProducts.find(p => p.id === id) || null;
    }

    const product = await response.json();
    
    // Vérifier que la réponse contient bien un produit
    if (!product || typeof product !== 'object') {
      console.warn('Invalid product data received, using mock data');
      return mockProducts.find(p => p.id === id) || null;
    }
    
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    // Fallback sur les mock data
    return mockProducts.find(p => p.id === id) || null;
  }
}

export async function getProductVariants(productId: number): Promise<ProductVariant[]> {
  try {
    const response = await fetch(`/api/products/${productId}/variants`);
    
    if (!response.ok) {
      console.warn(`API returned ${response.status} for variants of product ${productId}`);
      // ✅ CORRECTION: Retourner les variantes mockées au lieu d'un tableau vide
      const mockProduct = mockProducts.find(p => p.id === productId);
      return mockProduct?.variants || [];
    }

    const variants = await response.json();
    return Array.isArray(variants) ? variants : [];
  } catch (error) {
    console.error('Error fetching product variants:', error);
    // ✅ CORRECTION: Retourner les variantes mockées
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

// Données factices mises à jour
export const mockProducts: Product[] = [
  {
    id: 1,
    name: "T-shirt SHIVASHI",
    price: 299.99,
    description: "Our signature piece, blending tradition and modernity",
    image: "/images/DSC09334.jpg",
    category: "signature",
    color: "yellow",
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
    name: "Prestige Collection", 
    price: 459.99,
    description: "Artisanal excellence in every detail",
    image: "/images/DSC09271.jpg",
    category: "premium",
    color: "White",
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
    name: "Heritage series",
    price: 199.99,
    description: "A tribute to our ancestral craftsmanship",
    image: "/images/IMG_20250928_15502664.jpg",
    category: "heritage", 
    color: "Gray",
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
    id: 4,
    name: "Limited edition",
    price: 599.99,
    description: "Exclusive numbered and certified piece", 
    image: "/images/IMG_20250928_15522292.jpg",
    category: "limited",
    color: "Red",
    stock: 2,
    featured: false,
    created_at: new Date().toISOString(),
    total_stock: 2,
    available_sizes: "4,5,6",
    variants: [
      { id: 24, product_id: 4, size: 4, quantity: 1, created_at: new Date().toISOString() },
      { id: 25, product_id: 4, size: 5, quantity: 1, created_at: new Date().toISOString() },
      { id: 26, product_id: 4, size: 6, quantity: 0, created_at: new Date().toISOString() }
    ]
  }
];

export async function getAvailableColors(): Promise<string[]> {
  try {
    const response = await fetch('/api/products/colors');
    
    if (!response.ok) {
      console.warn('API not available for colors, using mock data');
      return Array.from(new Set(mockProducts.map(p => p.color)));
    }

    const colors = await response.json();
    return Array.isArray(colors) ? colors : Array.from(new Set(mockProducts.map(p => p.color)));
  } catch (error) {
    console.error('Error fetching colors:', error);
    return Array.from(new Set(mockProducts.map(p => p.color)));
  }
}