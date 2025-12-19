import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    // Extraire toutes les couleurs uniques des produits
    const allColors = mockProducts.flatMap(product => 
      product.colors.map(color => color.color_name)
    );
    
    const uniqueColors = Array.from(new Set(allColors));
    
    console.log('🎨 API Colors returning:', uniqueColors);
    
    return NextResponse.json(uniqueColors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}