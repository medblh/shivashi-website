const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

console.log('🚀 Initialisation manuelle de la base de données...');

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Créer les tables
console.log('📋 Création des tables...');
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

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

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

db.exec(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  )
`);

console.log('✅ Tables créées');

// Vérifier si des données existent déjà
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;

if (userCount === 0 && productCount === 0) {
  console.log('📦 Peuplement des données...');
  
  // Créer l'utilisateur admin
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (email, password, name, role)
    VALUES (?, ?, ?, 'admin')
  `).run('admin@shivashi.com', hashedPassword, 'Administrateur Shivashi');
  
  console.log('✅ Utilisateur admin créé');

  // Créer les produits
  const products = [
    {
      name: 'Collection Élégance',
      price: 299.99,
      description: 'Notre pièce signature, alliant tradition et modernité',
      image: '/images/product1.jpg',
      category: 'signature',
      stock: 10,
      featured: true
    },
    {
      name: 'Ligne Prestige',
      price: 459.99,
      description: 'Excellence artisanale dans chaque détail',
      image: '/images/product2.jpg',
      category: 'premium',
      stock: 5,
      featured: true
    },
    {
      name: 'Série Héritage',
      price: 199.99,
      description: 'Un hommage à notre savoir-faire ancestral',
      image: '/images/product3.jpg',
      category: 'heritage',
      stock: 15,
      featured: true
    },
    {
      name: 'Édition Limitée',
      price: 599.99,
      description: 'Pièce exclusive numérotée et certifiée',
      image: '/images/product4.jpg',
      category: 'limited',
      stock: 2,
      featured: false
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, price, description, image, category, stock, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  products.forEach((product, index) => {
    insertProduct.run(
      product.name,
      product.price,
      product.description,
      product.image,
      product.category,
      product.stock,
      product.featured ? 1 : 0
    );
    console.log(`✅ Produit ${index + 1} créé: ${product.name}`);
  });

  // Créer des commandes de test
  const insertOrder = db.prepare(`
    INSERT INTO orders (user_id, total, shipping_address, status)
    VALUES (?, ?, ?, ?)
  `);

  const orders = [
    {
      user_id: 1,
      total: 759.98,
      shipping_address: '123 Avenue du Luxe, 75008 Paris, France',
      status: 'completed'
    }
  ];

  orders.forEach((order, index) => {
    insertOrder.run(
      order.user_id,
      order.total,
      order.shipping_address,
      order.status
    );
    console.log(`✅ Commande ${index + 1} créée`);
  });

  // Créer des items de commande
  const insertOrderItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES (?, ?, ?, ?)
  `);

  const orderItems = [
    { order_id: 1, product_id: 1, quantity: 1, price: 299.99 },
    { order_id: 1, product_id: 2, quantity: 1, price: 459.99 }
  ];

  orderItems.forEach((item, index) => {
    insertOrderItem.run(
      item.order_id,
      item.product_id,
      item.quantity,
      item.price
    );
    console.log(`✅ Item commande ${index + 1} créé`);
  });

  console.log('🎉 Base de données peuplée avec succès !');
} else {
  console.log('ℹ️  Base de données déjà peuplée');
}

// Afficher le résumé
console.log('\n📊 RÉSUMÉ DE LA BASE:');
console.log('- Utilisateurs:', db.prepare('SELECT COUNT(*) as count FROM users').get().count);
console.log('- Produits:', db.prepare('SELECT COUNT(*) as count FROM products').get().count);
console.log('- Commandes:', db.prepare('SELECT COUNT(*) as count FROM orders').get().count);
console.log('- Items commande:', db.prepare('SELECT COUNT(*) as count FROM order_items').get().count);

db.close();
console.log('✅ Initialisation terminée !');