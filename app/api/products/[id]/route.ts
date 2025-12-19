import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

// Données temporaires (remplacez par votre base de données)
const products = [
  {
    id: 1,
    name: "Product 1",
    price: 99.99,
    description: "Description here",
    image: "https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Product+1",
    category: "Clothing",
    collection_name: "Everyday Set",
    gender: "unisex",
    stock: 10,
    featured: true,
    colors: [
      { id: 1, color_name: "Red", color_hex: "#FF0000" },
      { id: 2, color_name: "Blue", color_hex: "#0000FF" }
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const product = products.find(p => p.id === productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error('Get product error:', error);
    
    return NextResponse.json(
      { error: 'Error fetching product' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}