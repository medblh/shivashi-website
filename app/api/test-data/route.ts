import { NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET() {
  try {
    console.log('🧪 TEST DIRECT des données...');
    
    // Compter tout directement
    const users = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    const products = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    const orders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
    const orderItems = db.prepare('SELECT COUNT(*) as count FROM order_items').get() as { count: number };

    // Récupérer quelques données
    const userList = db.prepare('SELECT id, email, name, role FROM users').all();
    const productList = db.prepare('SELECT id, name, price FROM products').all();
    const orderList = db.prepare('SELECT id, total, status FROM orders').all();

    const result = {
      counts: {
        users: users.count,
        products: products.count,
        orders: orders.count,
        orderItems: orderItems.count
      },
      users: userList,
      products: productList,
      orders: orderList
    };

    console.log('🎉 TEST RÉUSSI:', result.counts);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('❌ TEST ÉCHOUÉ:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}