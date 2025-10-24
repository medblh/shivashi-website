const fs = require('fs');
const path = require('path');

console.log('🔍 Recherche de la base de données...');

const searchPaths = [
  'database.sqlite',
  './database.sqlite',
  path.join(process.cwd(), 'database.sqlite'),
  path.join(process.cwd(), '.next', 'database.sqlite'),
  path.join(__dirname, 'database.sqlite'),
  path.join(__dirname, '.next', 'database.sqlite')
];

searchPaths.forEach(dbPath => {
  const exists = fs.existsSync(dbPath);
  console.log(`${exists ? '✅' : '❌'} ${dbPath} ${exists ? `(${fs.statSync(dbPath).size} bytes)` : ''}`);
});