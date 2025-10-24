const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

console.log('🎯 CRÉATION DÉFINITIVE DE LA BASE');

// CHEMIN ABSOLU - le même que dans database.ts
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
console.log('📁 Chemin:', dbPath);

// SUPPRIMER TOUTES LES BASES EXISTANTES
console.log('🗑️ Nettoyage des anciennes bases...');
const pathsToDelete = [
  'database.sqlite',
  './database.sqlite',
  path.join(process.cwd(), 'database.sqlite'),
  path.join(process.cwd(), '.next', 'database.sqlite')
];

pathsToDelete.forEach(pathToDelete => {
  if (fs.existsSync(pathToDelete)) {
    fs.unlinkSync(pathToDelete);
    console.log('✅ Supprimé:', pathToDelete);
  }
});

// CRÉER LA NOUVELLE BASE
console.log('🆕 Création de la base...');
const db = new Database(dbPath);

// CRÉER LES TABLES
console.log('📋 Création des tables...');
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE products (
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
  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
  )
`);

console.log('✅ Tables créées');

// PEUPLER LES DONNÉES
console.log('📦 Peuplement des données...');

// 1. UTILISATEUR ADMIN
const hashedPassword = bcrypt.hashSync('admin123', 10);
db.prepare(`
  INSERT INTO users (email, password, name, role)
  VALUES (?, ?, ?, 'admin')
`).run('admin@shivashi.com', hashedPassword, 'Administrateur Shivashi');
console.log('✅ Admin créé');

// 2. PRODUITS
const products = [
  {
    name: 'Collection Élégance',
    price: 299.99,
    description: 'Notre pièce signature, alliant tradition et modernité',
    image: '/images/product1.jpg',
    category: 'signature',
    stock: 10,
    featured: 1
  },
  {
    name: 'Ligne Prestige', 
    price: 459.99,
    description: 'Excellence artisanale dans chaque détail',
    image: '/images/product2.jpg',
    category: 'premium',
    stock: 5,
    featured: 1
  },
  {
    name: 'Série Héritage',
    price: 199.99,
    description: 'Un hommage à notre savoir-faire ancestral',
    image: '/images/product3.jpg',
    category: 'heritage',
    stock: 15,
    featured: 1
  },
  {
    name: 'Édition Limitée',
    price: 599.99,
    description: 'Pièce exclusive numérotée et certifiée',
    image: '/images/product4.jpg',
    category: 'limited',
    stock: 2,
    featured: 0
  },
  {
    name: 'Collection Modernité',
    price: 349.99,
    description: 'Design contemporain pour les esprits avant-gardistes',
    image: '/images/product5.jpg',
    category: 'modern',
    stock: 8,
    featured: 1
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
    product.featured
  );
  console.log(`✅ Produit ${index + 1}: ${product.name}`);
});

// 3. COMMANDES DE TEST
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
  },
  {
    user_id: 1, 
    total: 199.99,
    shipping_address: '456 Rue de la Mode, 69001 Lyon, France',
    status: 'shipped'
  },
  {
    user_id: 1,
    total: 349.99,
    shipping_address: '789 Boulevard du Style, 13001 Marseille, France',
    status: 'pending'
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

// 4. ITEMS DE COMMANDE
const insertOrderItem = db.prepare(`
  INSERT INTO order_items (order_id, product_id, quantity, price)
  VALUES (?, ?, ?, ?)
`);

const orderItems = [
  { order_id: 1, product_id: 1, quantity: 1, price: 299.99 },
  { order_id: 1, product_id: 2, quantity: 1, price: 459.99 },
  { order_id: 2, product_id: 3, quantity: 1, price: 199.99 },
  { order_id: 3, product_id: 5, quantity: 1, price: 349.99 }
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

// VÉRIFICATION FINALE
console.log('\n🎉 VÉRIFICATION FINALE:');
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
const orderItemCount = db.prepare('SELECT COUNT(*) as count FROM order_items').get().count;
const totalRevenue = db.prepare('SELECT SUM(total) as total FROM orders WHERE status = "completed"').get().total;

console.log(`👤 Utilisateurs: ${userCount}`);
console.log(`📦 Produits: ${productCount}`);
console.log(`🛒 Commandes: ${orderCount}`);
console.log(`📋 Items commande: ${orderItemCount}`);
console.log(`💰 Revenus: $${totalRevenue || 0}`);

console.log('\n🔐 IDENTIFIANTS:');
console.log('Email: admin@shivashi.com');
console.log('Mot de passe: admin123');

db.close();

console.log('\n✅ BASE CRÉÉE AVEC SUCCÈS !');
console.log('📍 Emplacement:', dbPath);
console.log('📊 Taille:', fs.statSync(dbPath).size, 'bytes');