import { NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { verifySession } from '@/lib/auth-utils';
import { StatusCodes } from 'http-status-codes';

export async function GET() {
  try {
    // Vérifier la session admin
    const session = await verifySession();
    if (!session.isAuth || session.userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    // Récupérer toutes les données des tables
    const users = db.prepare('SELECT id, email, name, role, created_at FROM users').all();
    const products = db.prepare('SELECT * FROM products').all();
    const orders = db.prepare('SELECT * FROM orders').all();
    const order_items = db.prepare('SELECT * FROM order_items').all();
    const wishlists = db.prepare('SELECT * FROM wishlists').all();

    return NextResponse.json({
      data: {
        users,
        products,
        orders,
        order_items,
        wishlists
      }
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données debug' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}