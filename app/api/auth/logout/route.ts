import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth-utils';
import { StatusCodes } from 'http-status-codes';

export async function POST() {
  try {
    await deleteSession();
    
    return NextResponse.json({
      message: 'Déconnexion réussie'
    });

  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'Erreur lors de la déconnexion' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}