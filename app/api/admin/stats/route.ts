import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/database';
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

    const stats = getDashboardStats();

    return NextResponse.json({ stats });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}