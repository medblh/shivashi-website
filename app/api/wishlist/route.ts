import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { verifySession } from '@/lib/auth-utils';
import { StatusCodes } from 'http-status-codes';

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const wishlist = db.prepare(`
      SELECT w.*, 
             p.name, 
             p.price, 
             p.description, 
             p.image, 
             p.category,
             p.stock
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(session.userId);

    return NextResponse.json({ wishlist });

  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la wishlist' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'ID produit manquant' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Vérifier si le produit existe
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    // Vérifier si déjà dans la wishlist
    const existing = db.prepare(`
      SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?
    `).get(session.userId, productId);

    if (existing) {
      return NextResponse.json(
        { error: 'Produit déjà dans la wishlist' },
        { status: StatusCodes.CONFLICT }
      );
    }

    // Ajouter à la wishlist
    const result = db.prepare(`
      INSERT INTO wishlists (user_id, product_id)
      VALUES (?, ?)
    `).run(session.userId, productId);

    return NextResponse.json(
      { message: 'Produit ajouté à la wishlist' },
      { status: StatusCodes.CREATED }
    );

  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout à la wishlist' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'ID produit manquant' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Supprimer de la wishlist
    const result = db.prepare(`
      DELETE FROM wishlists 
      WHERE user_id = ? AND product_id = ?
    `).run(session.userId, productId);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Produit non trouvé dans la wishlist' },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    return NextResponse.json({ message: 'Produit retiré de la wishlist' });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la wishlist' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}