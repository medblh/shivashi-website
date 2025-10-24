import { z } from 'zod';

// Schéma pour l'inscription
export const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

// Schéma pour la connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

// Schéma pour la création de produit
export const productSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  price: z.number().min(0, 'Le prix doit être positif'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  image: z.string().url('URL invalide'),
  category: z.string().min(1, 'La catégorie est requise'),
  stock: z.number().int().min(0, 'Le stock ne peut pas être négatif'),
});

// Schéma pour la commande
export const orderSchema = z.object({
  userId: z.number().int().positive('ID utilisateur invalide'),
  items: z.array(z.object({
    productId: z.number().int().positive('ID produit invalide'),
    quantity: z.number().int().positive('Quantité invalide'),
    price: z.number().min(0, 'Prix invalide'),
  })),
  shippingAddress: z.string().min(10, 'Adresse trop courte'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;