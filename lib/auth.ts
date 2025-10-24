import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

// Base de données simulée (remplacez par une vraie DB plus tard)
export let users: User[] = [
  {
    id: '1',
    email: 'admin@shivashi.com',
    password: '$2a$10$8K1p/a0dRTlB0.1.4Q7bE.4Q7bE.4Q7bE', // "password123"
    name: 'Administrateur',
    role: 'admin',
    createdAt: new Date()
  }
];

// Fonctions d'authentification
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function findUserByEmail(email: string): User | undefined {
  return users.find(user => user.email === email);
}

export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date()
  };
  
  users.push(newUser);
  return newUser;
}