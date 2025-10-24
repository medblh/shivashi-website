import { cookies } from 'next/headers';

// Version simplifiée sans JWT pour le moment
// En production, utilisez une vraie lib JWT comme jose

export async function encrypt(payload: any) {
  // Simulation simple - en vrai, utilisez jose
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export async function decrypt(input: string): Promise<any> {
  try {
    return JSON.parse(Buffer.from(input, 'base64').toString());
  } catch {
    return null;
  }
}

export async function createSession(userId: number, userRole: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
  const session = await encrypt({ userId, userRole, expires });

  // Await cookies() here too for consistency
  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession() {
  // CORRECTION: Await the cookies() call
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  
  return await decrypt(session);
}

export async function deleteSession() {
  // Await cookies() here too
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function verifySession() {
  const session = await getSession();
  
  if (!session?.userId) {
    return { isAuth: false, userId: null, userRole: null };
  }

  // Vérifier l'expiration
  if (new Date(session.expires) < new Date()) {
    await deleteSession();
    return { isAuth: false, userId: null, userRole: null };
  }

  return { 
    isAuth: true, 
    userId: session.userId, 
    userRole: session.userRole 
  };
}