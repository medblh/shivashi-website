import { NextRequest, NextResponse } from 'next/server';
import { loginSchema } from '@/lib/schemas';
import { getUserByEmail } from '@/lib/database';
import { createSession } from '@/lib/auth-utils';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    const validatedData = loginSchema.parse(body);
    
    // Récupérer l'utilisateur depuis la base de données
    const user = getUserByEmail(validatedData.email) as any;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    // Créer la session
    await createSession(user.id, user.role);

    // Retourner les infos utilisateur (sans le mot de passe)
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Connexion réussie',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}