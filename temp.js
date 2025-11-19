const bcrypt = require('bcryptjs');

async function hashPassword() {
  const hash = await bcrypt.hash('abacate99', 10);
  console.log(hash);
}

hashPassword();