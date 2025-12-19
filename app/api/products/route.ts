import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filtrer les produits si des paramètres sont présents
    let filteredProducts = mockProducts;

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const color = searchParams.get('color');
    const gender = searchParams.get('gender');
    const collection = searchParams.get('collection_name');

    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (color) {
      filteredProducts = filteredProducts.filter(p =>
        p.colors.some(c => c.color_name.toLowerCase() === color.toLowerCase())
      );
    }

    if (gender) {
      filteredProducts = filteredProducts.filter(p => 
        p.gender.toLowerCase() === gender.toLowerCase()
      );
    }

    if (collection) {
      filteredProducts = filteredProducts.filter(p =>
        p.collection_name.toLowerCase().includes(collection.toLowerCase())
      );
    }

    return NextResponse.json(filteredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}