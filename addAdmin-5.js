const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'database.json');

function readDB() {
  if (!fs.existsSync(dbPath)) {
    return { users: [], audits: [] };
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function addAdmin() {
  const db = readDB();
  const hashedPassword = await bcrypt.hash('abacate99', 10);
  const adminUser = {
    id: Date.now().toString(),
    email: 'afonsoswf08@gmail.com',
    password: hashedPassword,
    name: 'Admin',
    role: 'admin',
    createdAt: new Date().toISOString(),
    subscription: null
  };
  db.users.push(adminUser);
  writeDB(db);
  console.log('Admin criado com sucesso:', adminUser.email);
}

addAdmin();