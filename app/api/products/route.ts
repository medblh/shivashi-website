import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { getAllProducts, createProduct } from '@/lib/database';
import { StatusCodes } from 'http-status-codes';
import { verifySession } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    const products = getAllProducts({
      category: category || undefined,
      search: search || undefined,
      featured: featured === 'true'
    });

    return NextResponse.json({
      products,
      total: products.length
    });

  } catch (error) {
    console.error('Get products error:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

// ... (le reste du code POST reste similaire mais utilise createProduct)

export async function POST(request: NextRequest) {
  try {
    // Vérifier la session
    const session = await verifySession();
    if (!session.isAuth || session.userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await request.json();
    
    // Validation basique
    if (!body.name || !body.price || !body.description) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Insérer le produit
    const result = db.prepare(`
      INSERT INTO products (name, price, description, image, category, stock, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      body.name,
      body.price,
      body.description,
      body.image || '/images/default.jpg',
      body.category || 'general',
      body.stock || 0,
      body.featured ? 1 : 0
    );

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(
      { 
        message: 'Produit créé avec succès',
        product 
      },
      { status: StatusCodes.CREATED }
    );

  } catch (error) {
    console.error('Create product error:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}