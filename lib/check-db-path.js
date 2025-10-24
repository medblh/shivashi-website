const path = require('path');

console.log('📁 Chemins importants:');
console.log('Process CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Chemin relatif depuis src:', path.join(process.cwd(), 'database.sqlite'));