import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { verifySession } from '@/lib/auth-utils';
import { StatusCodes } from 'http-status-codes';

interface OrderRow {
  id: number;
  user_id: number;
  total: number;
  shipping_address: string;
  status: string;
  created_at: string;
  items: string;
  [key: string]: any;
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const orders = db.prepare(`
      SELECT o.*, 
             COUNT(oi.id) as items_count,
             SUM(oi.quantity * oi.price) as total_amount
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all(session.userId);

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession();
    if (!session.isAuth) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const body = await request.json();
    const { items, shippingAddress } = body;

    if (!items || !items.length || !shippingAddress) {
      return NextResponse.json(
        { error: 'Données de commande invalides' },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    // Calculer le total
    const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Commencer une transaction
    const insertOrder = db.transaction(() => {
      // Créer la commande
      const orderResult = db.prepare(`
        INSERT INTO orders (user_id, total, shipping_address, status)
        VALUES (?, ?, ?, 'pending')
      `).run(session.userId, total, JSON.stringify(shippingAddress));

      const orderId = Number(orderResult.lastInsertRowid);

      // Ajouter les items de commande
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `);

      items.forEach((item: any) => {
        insertItem.run(orderId, item.productId, item.quantity, item.price);
        
        // Mettre à jour le stock
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?')
          .run(item.quantity, item.productId);
      });

      return orderId;
    });

    const orderId = insertOrder();

    // Récupérer la commande complète
    const order = db.prepare(`
      SELECT o.*, 
             json_group_array(
               json_object(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'product_name', p.name,
                 'product_image', p.image
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ?
      GROUP BY o.id
    `).get(orderId) as OrderRow;

    return NextResponse.json(
      { 
        message: 'Commande créée avec succès',
        order: {
          ...order,
          items: JSON.parse(order.items)
        }
      },
      { status: StatusCodes.CREATED }
    );

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}