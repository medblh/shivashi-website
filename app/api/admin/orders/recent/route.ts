import { NextResponse } from 'next/server';
import { getRecentOrders } from '@/lib/database';
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

    const orders = getRecentOrders(5);

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Get recent orders error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}