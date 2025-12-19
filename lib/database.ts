import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getColorHex } from '@/lib/colors';

// Chemin vers la base de données
const dbPath = path.join(process.cwd(), 'database.sqlite');

// Assurer que le dossier existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialisation de la base de données
export const db = new Database(dbPath);

// Création des tables
export function initializeDatabase() {
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des produits (AVEC collection_name)
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      collection_name TEXT DEFAULT 'default',
      gender TEXT DEFAULT 'unisex',
      stock INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table : Couleurs des produits
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_colors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
      UNIQUE(product_id, color_name)
    )
  `);

  // Table pour les variantes de taille et quantité
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      size INTEGER NOT NULL CHECK (size >= 2 AND size <= 10),
      quantity INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
      UNIQUE(product_id, size)
    )
  `);

  // Table des commandes
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      status TEXT DEFAULT 'pending',
      shipping_address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Table des items de commande
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      size INTEGER NOT NULL,
      color_name TEXT NOT NULL,
      color_hex TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders (id),
      FOREIGN KEY (product_id) REFERENCES products (id)
    )
  `);

  // Table des favoris
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (product_id) REFERENCES products (id),
      UNIQUE(user_id, product_id)
    )
  `);

  console.log('✅ Base de données initialisée');
}

// Initialiser au démarrage
initializeDatabase();

// Migration pour ajouter les champs manquants
export function migrateDatabase() {
  const tableInfo = db.prepare("PRAGMA table_info(products)").all() as any[];
  
  // Vérifier et ajouter gender si nécessaire
  const hasGenderColumn = tableInfo.some(column => column.name === 'gender');
  if (!hasGenderColumn) {
    console.log('🔄 Ajout de la colonne gender...');
    db.exec(`ALTER TABLE products ADD COLUMN gender TEXT DEFAULT 'unisex'`);
    
    const products = db.prepare('SELECT id, category FROM products').all() as any[];
    const updateProduct = db.prepare('UPDATE products SET gender = ? WHERE id = ?');
    
    products.forEach(product => {
      let gender = 'unisex';
      if (product.category.includes('boy') || product.category.includes('men')) {
        gender = 'boy';
      } else if (product.category.includes('girl') || product.category.includes('women')) {
        gender = 'girl';
      }
      updateProduct.run(gender, product.id);
    });
    console.log('✅ Colonne gender ajoutée avec succès');
  }

  // Vérifier et ajouter collection_name si nécessaire
  const hasCollectionColumn = tableInfo.some(column => column.name === 'collection_name');
  if (!hasCollectionColumn) {
    console.log('🔄 Ajout de la colonne collection_name...');
    db.exec(`ALTER TABLE products ADD COLUMN collection_name TEXT DEFAULT 'default'`);
    console.log('✅ Colonne collection_name ajoutée avec succès');
  }

  // Gérer la migration des couleurs si l'ancienne colonne color existe
  const hasColorColumn = tableInfo.some(column => column.name === 'color');
  if (hasColorColumn) {
    console.log('🔄 Migration des couleurs vers la nouvelle table...');
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS product_colors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        color_name TEXT NOT NULL,
        color_hex TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
        UNIQUE(product_id, color_name)
      )
    `);

    const productsWithColors = db.prepare('SELECT id, color FROM products').all() as any[];
    const insertColor = db.prepare(`
      INSERT INTO product_colors (product_id, color_name, color_hex)
      VALUES (?, ?, ?)
    `);

    productsWithColors.forEach(product => {
      if (product.color) {
        const colorHex = getColorHex(product.color);
        insertColor.run(product.id, product.color, colorHex);
      }
    });

    // Recréer la table products sans la colonne color
    db.exec(`
      CREATE TABLE IF NOT EXISTS products_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        collection_name TEXT DEFAULT 'default',
        gender TEXT DEFAULT 'unisex',
        stock INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.exec(`
      INSERT INTO products_new (id, name, price, description, image, category, collection_name, gender, stock, featured, created_at)
      SELECT id, name, price, description, image, category, 'default', gender, stock, featured, created_at FROM products
    `);

    db.exec('DROP TABLE products');
    db.exec('ALTER TABLE products_new RENAME TO products');
    console.log('✅ Migration des couleurs terminée');
  }
}

// Appeler la migration au démarrage
migrateDatabase();

// Peupler la base avec des données de test
export function seedDatabase() {
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  
  if (productCount.count === 0) {
    console.log('📦 Peuplement de la base de données...');
    
    const insertProduct = db.prepare(`
      INSERT INTO products (name, price, description, image, category, collection_name, gender, stock, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertColor = db.prepare(`
      INSERT INTO product_colors (product_id, color_name, color_hex)
      VALUES (?, ?, ?)
    `);

    const insertVariant = db.prepare(`
      INSERT INTO product_variants (product_id, size, quantity)
      VALUES (?, ?, ?)
    `);

    const products = [
      {
        name: 'Collection Élégance',
        price: 299.99,
        description: 'Notre pièce signature, alliant tradition et modernité',
        image: '/images/product1.jpg',
        category: 'signature',
        collection_name: 'Collection Printemps-Été 2024',
        gender: 'unisex',
        stock: 10,
        featured: true,
        colors: [
          { name: 'Noir', hex: '#000000' },
          { name: 'Blanc', hex: '#FFFFFF' },
          { name: 'Bleu Marine', hex: '#000080' }
        ]
      },
      {
        name: 'Ligne Prestige',
        price: 459.99,
        description: 'Excellence artisanale dans chaque détail',
        image: '/images/product2.jpg',
        category: 'premium',
        collection_name: 'Collection Prestige',
        gender: 'boy',
        stock: 5,
        featured: true,
        colors: [
          { name: 'Blanc', hex: '#FFFFFF' },
          { name: 'Rouge', hex: '#FF0000' },
          { name: 'Vert', hex: '#008000' }
        ]
      },
      {
        name: 'Série Héritage',
        price: 199.99,
        description: 'Un hommage à notre savoir-faire ancestral',
        image: '/images/product3.jpg',
        category: 'heritage',
        collection_name: 'Collection Héritage',
        gender: 'girl',
        stock: 15,
        featured: true,
        colors: [
          { name: 'Bleu Marine', hex: '#000080' },
          { name: 'Rose', hex: '#FFC0CB' },
          { name: 'Violet', hex: '#800080' }
        ]
      },
      {
        name: 'Édition Limitée',
        price: 599.99,
        description: 'Pièce exclusive numérotée et certifiée',
        image: '/images/product4.jpg',
        category: 'limited',
        collection_name: 'Éditions Limitées',
        gender: 'unisex',
        stock: 2,
        featured: false,
        colors: [
          { name: 'Rouge Bordeaux', hex: '#800020' },
          { name: 'Or', hex: '#FFD700' }
        ]
      },
      {
        name: 'Moderne Urbain',
        price: 349.99,
        description: 'Style contemporain pour la ville',
        image: '/images/product5.jpg',
        category: 'urban',
        collection_name: 'Collection Printemps-Été 2024',
        gender: 'unisex',
        stock: 8,
        featured: true,
        colors: [
          { name: 'Gris', hex: '#808080' },
          { name: 'Noir', hex: '#000000' }
        ]
      },
      {
        name: 'Chic Élégant',
        price: 399.99,
        description: 'Élégance raffinée pour occasions spéciales',
        image: '/images/product6.jpg',
        category: 'chic',
        collection_name: 'Collection Prestige',
        gender: 'girl',
        stock: 12,
        featured: false,
        colors: [
          { name: 'Rose', hex: '#FFC0CB' },
          { name: 'Blanc', hex: '#FFFFFF' },
          { name: 'Or', hex: '#FFD700' }
        ]
      }
    ];

    products.forEach(product => {
      const result = insertProduct.run(
        product.name,
        product.price,
        product.description,
        product.image,
        product.category,
        product.collection_name,
        product.gender,
        product.stock,
        product.featured ? 1 : 0
      );

      const productId = Number(result.lastInsertRowid);

      product.colors.forEach(color => {
        insertColor.run(productId, color.name, color.hex);
      });

      for (let size = 2; size <= 10; size++) {
        const quantity = Math.floor(Math.random() * 6);
        insertVariant.run(productId, size, quantity);
      }
    });

    // Créer un utilisateur admin par défaut
    const bcrypt = require('bcryptjs');
    const hashedPassword = bcrypt.hashSync('password123', 10);
    
    const insertUser = db.prepare(`
      INSERT OR IGNORE INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `);

    insertUser.run(
      'admin@shivashi.com',
      hashedPassword,
      'Administrateur Shivashi',
      'admin'
    );

    console.log('✅ Base de données peuplée avec des données de test');
  }
}

// Fonctions pour les utilisateurs
export function getUserByEmail(email: string) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
}

export function createUser(email: string, hashedPassword: string, name: string, role: string = 'user') {
  const result = db.prepare(`
    INSERT INTO users (email, password, name, role)
    VALUES (?, ?, ?, ?)
  `).run(email, hashedPassword, name, role);
  
  return Number(result.lastInsertRowid);
}

// Fonctions pour les produits
export function getAllProducts(filters?: { 
  category?: string; 
  search?: string; 
  featured?: boolean; 
  color?: string; 
  gender?: string; 
  size?: number; 
  minPrice?: number; 
  maxPrice?: number;
  collection_name?: string;
}) {
  let query = `
    SELECT p.*, 
           SUM(pv.quantity) as total_stock,
           GROUP_CONCAT(DISTINCT pv.size) as available_sizes,
           (SELECT GROUP_CONCAT(color_name) FROM product_colors WHERE product_id = p.id) as color_names
    FROM products p
    LEFT JOIN product_variants pv ON p.id = pv.product_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (filters?.category) {
    query += ' AND p.category = ?';
    params.push(filters.category);
  }

  if (filters?.search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.collection_name LIKE ?)';
    params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }

  if (filters?.featured) {
    query += ' AND p.featured = 1';
  }

  if (filters?.color) {
    query += ' AND p.id IN (SELECT product_id FROM product_colors WHERE color_name = ?)';
    params.push(filters.color);
  }

  if (filters?.gender) {
    query += ' AND p.gender = ?';
    params.push(filters.gender);
  }

  if (filters?.size) {
    query += ' AND p.id IN (SELECT product_id FROM product_variants WHERE size = ? AND quantity > 0)';
    params.push(filters.size);
  }

  if (filters?.minPrice) {
    query += ' AND p.price >= ?';
    params.push(filters.minPrice);
  }

  if (filters?.maxPrice) {
    query += ' AND p.price <= ?';
    params.push(filters.maxPrice);
  }

  if (filters?.collection_name) {
    query += ' AND p.collection_name = ?';
    params.push(filters.collection_name);
  }

  query += ' GROUP BY p.id ORDER BY p.created_at DESC';

  const products = db.prepare(query).all(...params) as any[];
  
  return products.map(product => {
    const colors = db.prepare('SELECT * FROM product_colors WHERE product_id = ?').all(product.id);
    return {
      ...product,
      colors
    };
  });
}

export function getProductById(id: number) {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
  if (product) {
    const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY size').all(id);
    const colors = db.prepare('SELECT * FROM product_colors WHERE product_id = ?').all(id);
    
    product.variants = variants;
    product.colors = colors;
    product.total_stock = variants.reduce((sum: number, variant: any) => sum + variant.quantity, 0);
  }
  return product;
}

export function getProductsByCollection(collectionName: string) {
  return db.prepare('SELECT * FROM products WHERE collection_name = ? ORDER BY created_at DESC').all(collectionName) as any[];
}

export function getProductColors(productId: number) {
  return db.prepare('SELECT * FROM product_colors WHERE product_id = ?').all(productId);
}

export function getProductVariants(productId: number) {
  return db.prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY size').all(productId);
}

export function getProductVariant(productId: number, size: number) {
  return db.prepare('SELECT * FROM product_variants WHERE product_id = ? AND size = ?').get(productId, size);
}

export function createProduct(productData: {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  collection_name?: string;
  gender: string;
  stock: number;
  featured: boolean;
  colors: Array<{ name: string; hex: string }>;
}) {
  const result = db.prepare(`
    INSERT INTO products (name, price, description, image, category, collection_name, gender, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    productData.name,
    productData.price,
    productData.description,
    productData.image,
    productData.category,
    productData.collection_name || 'default',
    productData.gender,
    productData.stock,
    productData.featured ? 1 : 0
  );
  
  const productId = Number(result.lastInsertRowid);

  const insertColor = db.prepare(`
    INSERT INTO product_colors (product_id, color_name, color_hex)
    VALUES (?, ?, ?)
  `);

  productData.colors.forEach(color => {
    insertColor.run(productId, color.name, color.hex);
  });
  
  return productId;
}

export function createProductVariant(productId: number, size: number, quantity: number) {
  const result = db.prepare(`
    INSERT INTO product_variants (product_id, size, quantity)
    VALUES (?, ?, ?)
  `).run(productId, size, quantity);
  
  return Number(result.lastInsertRowid);
}

export function updateProductVariant(productId: number, size: number, quantity: number) {
  const result = db.prepare(`
    UPDATE product_variants 
    SET quantity = ? 
    WHERE product_id = ? AND size = ?
  `).run(quantity, productId, size);
  
  return result.changes;
}

export function updateProduct(id: number, productData: {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  category?: string;
  collection_name?: string;
  gender?: string;
  stock?: number;
  featured?: boolean;
}) {
  const fields = [];
  const params = [];

  if (productData.name) {
    fields.push('name = ?');
    params.push(productData.name);
  }
  if (productData.price) {
    fields.push('price = ?');
    params.push(productData.price);
  }
  if (productData.description) {
    fields.push('description = ?');
    params.push(productData.description);
  }
  if (productData.image) {
    fields.push('image = ?');
    params.push(productData.image);
  }
  if (productData.category) {
    fields.push('category = ?');
    params.push(productData.category);
  }
  if (productData.collection_name !== undefined) {
    fields.push('collection_name = ?');
    params.push(productData.collection_name);
  }
  if (productData.gender) {
    fields.push('gender = ?');
    params.push(productData.gender);
  }
  if (productData.stock !== undefined) {
    fields.push('stock = ?');
    params.push(productData.stock);
  }
  if (productData.featured !== undefined) {
    fields.push('featured = ?');
    params.push(productData.featured ? 1 : 0);
  }

  if (fields.length === 0) return 0;

  params.push(id);
  
  const result = db.prepare(`
    UPDATE products 
    SET ${fields.join(', ')} 
    WHERE id = ?
  `).run(...params);
  
  return result.changes;
}

export function deleteProduct(id: number) {
  return db.transaction(() => {
    db.prepare('DELETE FROM product_variants WHERE product_id = ?').run(id);
    db.prepare('DELETE FROM product_colors WHERE product_id = ?').run(id);
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes;
  })();
}

// Fonctions pour les commandes
export function getOrdersByUserId(userId: number) {
  return db.prepare(`
    SELECT o.*, 
           COUNT(oi.id) as items_count
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `).all(userId);
}

export function createOrder(orderData: {
  userId: number;
  total: number;
  shippingAddress: string;
  items: Array<{
    productId: number;
    size: number;
    colorName: string;
    colorHex: string;
    quantity: number;
    price: number;
  }>;
}) {
  return db.transaction(() => {
    const orderResult = db.prepare(`
      INSERT INTO orders (user_id, total, shipping_address, status)
      VALUES (?, ?, ?, 'pending')
    `).run(orderData.userId, orderData.total, orderData.shippingAddress);

    const orderId = Number(orderResult.lastInsertRowid);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, size, color_name, color_hex, quantity, price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    orderData.items.forEach(item => {
      insertItem.run(orderId, item.productId, item.size, item.colorName, item.colorHex, item.quantity, item.price);
      
      db.prepare(`
        UPDATE product_variants 
        SET quantity = quantity - ? 
        WHERE product_id = ? AND size = ?
      `).run(item.quantity, item.productId, item.size);
    });

    return orderId;
  });
}

// Fonctions pour les statistiques admin
export function getDashboardStats() {
  const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  const totalRevenue = db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status = "completed"').get() as { total: number };
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  const lowStockProducts = db.prepare(`
    SELECT COUNT(DISTINCT product_id) as count 
    FROM product_variants 
    WHERE quantity < 5
  `).get() as { count: number };

  return {
    totalUsers: totalUsers.count,
    totalOrders: totalOrders.count,
    totalRevenue: totalRevenue.total,
    totalProducts: totalProducts.count,
    lowStockProducts: lowStockProducts.count
  };
}

export function getRecentOrders(limit: number = 5) {
  return db.prepare(`
    SELECT o.*, u.name as user_name
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT ?
  `).all(limit);
}

// Fonctions pour la wishlist
export function getWishlistByUserId(userId: number) {
  return db.prepare(`
    SELECT w.*, p.name, p.price, p.description, p.image, p.category, p.gender, p.collection_name
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC
  `).all(userId);
}

export function addToWishlist(userId: number, productId: number) {
  const result = db.prepare(`
    INSERT OR IGNORE INTO wishlists (user_id, product_id)
    VALUES (?, ?)
  `).run(userId, productId);
  
  return result.changes;
}

export function removeFromWishlist(userId: number, productId: number) {
  const result = db.prepare(`
    DELETE FROM wishlists 
    WHERE user_id = ? AND product_id = ?
  `).run(userId, productId);
  
  return result.changes;
}

// Fonctions pour les couleurs disponibles
export function getAvailableColors(): string[] {
  try {
    console.log('🔄 Database: Fetching available colors...');
    const colors = db.prepare('SELECT DISTINCT color_name FROM product_colors ORDER BY color_name').all() as { color_name: string }[];
    
    const colorNames = colors.map(item => item.color_name);
    console.log('✅ Database: Available colors:', colorNames);
    
    return colorNames;
    
  } catch (error) {
    console.error('❌ Database: Error in getAvailableColors:', error);
    return [];
  }
}

// Fonctions pour les collections
export function getAllCollections() {
  return db.prepare(`
    SELECT DISTINCT collection_name 
    FROM products 
    WHERE collection_name IS NOT NULL AND collection_name != '' AND collection_name != 'default'
    ORDER BY collection_name
  `).all() as { collection_name: string }[];
}

export function getProductsByCollectionName(collectionName: string) {
  const products = db.prepare('SELECT * FROM products WHERE collection_name = ? ORDER BY created_at DESC').all(collectionName) as any[];
  
  return products.map(product => {
    const colors = db.prepare('SELECT * FROM product_colors WHERE product_id = ?').all(product.id);
    return {
      ...product,
      colors
    };
  });
}

// Fonctions pour les stocks par taille
export function getProductStockBySize(productId: number) {
  return db.prepare(`
    SELECT size, quantity 
    FROM product_variants 
    WHERE product_id = ? AND quantity > 0 
    ORDER BY size
  `).all(productId);
}

export function checkStockAvailability(productId: number, size: number, requestedQuantity: number) {
  const variant = db.prepare(`
    SELECT quantity 
    FROM product_variants 
    WHERE product_id = ? AND size = ?
  `).get(productId, size) as { quantity: number } | undefined;
  
  return variant && variant.quantity >= requestedQuantity;
}

// Exécuter le peuplement
seedDatabase();

export default db;