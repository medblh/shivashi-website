import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    console.log('🧪 Test de la base de données...');
    
    // Compter les enregistrements
    const users = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const products = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    const orders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
    const orderItems = db.prepare('SELECT COUNT(*) as count FROM order_items').get() as { count: number };
    
    // Récupérer les détails de l'admin
    const userDetails = db.prepare('SELECT id, email, name, role FROM users WHERE role = "admin"').get();

    console.log('📊 Résultats du test:');
    console.log('- Utilisateurs:', users.count);
    console.log('- Produits:', products.count);
    console.log('- Commandes:', orders.count);
    console.log('- Items commande:', orderItems.count);

    return NextResponse.json({
      users: users.count,
      products: products.count,
      orders: orders.count,
      orderItems: orderItems.count,
      userDetails: userDetails || null,
      status: 'success'
    });

  } catch (error: any) {
    console.error('❌ Erreur test DB:', error);
    
    return NextResponse.json({
      error: error.message,
      status: 'error'
    }, { status: 500 });
  }
}