const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

console.log('🔧 Réparation de la base de données...');

// Essayer différents chemins possibles
const possiblePaths = [
  'database.sqlite',
  './database.sqlite',
  path.join(process.cwd(), 'database.sqlite'),
  path.join(__dirname, 'database.sqlite')
];

let dbPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    console.log(`📁 Base trouvée: ${testPath}`);
    dbPath = testPath;
    break;
  }
}

if (!dbPath) {
  dbPath = 'database.sqlite';
  console.log(`📁 Création de la base: ${dbPath}`);
}

const db = new Database(dbPath);

// VÉRIFIER SI LES DONNÉES EXISTENT DÉJÀ
console.log('\n🔍 Vérification des données existantes...');

try {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  
  console.log(`📊 Actuel - Utilisateurs: ${userCount}, Produits: ${productCount}`);

  if (userCount === 0) {
    console.log('👤 Création de l\'utilisateur admin...');
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, 'admin')
    `).run('admin@shivashi.com', hashedPassword, 'Administrateur Shivashi');
    console.log('✅ Admin créé');
  }

  if (productCount === 0) {
    console.log('📦 Création des produits...');
    const products = [
      { name: 'Collection Élégance', price: 299.99, description: 'Notre pièce signature', image: '/images/product1.jpg', category: 'signature', stock: 10, featured: 1 },
      { name: 'Ligne Prestige', price: 459.99, description: 'Excellence artisanale', image: '/images/product2.jpg', category: 'premium', stock: 5, featured: 1 },
      { name: 'Série Héritage', price: 199.99, description: 'Hommage au savoir-faire', image: '/images/product3.jpg', category: 'heritage', stock: 15, featured: 1 },
      { name: 'Édition Limitée', price: 599.99, description: 'Pièce exclusive', image: '/images/product4.jpg', category: 'limited', stock: 2, featured: 0 }
    ];

    const insertProduct = db.prepare(`
      INSERT INTO products (name, price, description, image, category, stock, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    products.forEach((product, index) => {
      insertProduct.run(
        product.name, product.price, product.description, 
        product.image, product.category, product.stock, product.featured
      );
      console.log(`✅ Produit ${index + 1}: ${product.name}`);
    });
  }

  // VÉRIFIER LE RÉSULTAT FINAL
  const finalUserCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  const finalProductCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  const finalOrderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  
  console.log('\n🎉 RÉSULTAT FINAL:');
  console.log(`- Utilisateurs: ${finalUserCount}`);
  console.log(`- Produits: ${finalProductCount}`);
  console.log(`- Commandes: ${finalOrderCount}`);
  console.log('🔐 Identifiants: admin@shivashi.com / admin123');

} catch (error) {
  console.log('❌ Erreur:', error.message);
  console.log('🔄 Création des tables...');
  
  // CRÉER LES TABLES SI ELLES N'EXISTENT PAS
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Tables créées, relancez le script...');
}

db.close();
console.log('\n✅ Opération terminée!');