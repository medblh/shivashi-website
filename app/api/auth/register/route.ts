import { NextRequest, NextResponse } from 'next/server';
import { registerSchema } from '@/lib/schemas';
import { getUserByEmail, createUser } from '@/lib/database';
import { createSession } from '@/lib/auth-utils';
import bcrypt from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    const validatedData = registerSchema.parse(body);
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = getUserByEmail(validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: StatusCodes.CONFLICT }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Insérer l'utilisateur dans la base de données
    const userId = createUser(validatedData.email, hashedPassword, validatedData.name, 'user');

    // Créer la session
    await createSession(userId, 'user');

    // Récupérer l'utilisateur créé
    const newUser = getUserByEmail(validatedData.email) as any;
    const { password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      { 
        message: 'Utilisateur créé avec succès',
        user: userWithoutPassword
      },
      { status: StatusCodes.CREATED }
    );

  } catch (error) {
    console.error('Register error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues
         },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}