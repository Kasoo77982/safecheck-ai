const fs = require('fs');
const path = require('path');

function verifySignature(userId) {
  try {
    const dbPath = path.join(__dirname, 'database.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
      return { valid: false, message: 'Usuário não encontrado' };
    }
    
    if (!user.subscription || !user.subscription.paymentDate) {
      return { valid: false, message: 'Nenhuma assinatura encontrada' };
    }
    
    const paymentDate = new Date(user.subscription.paymentDate);
    const expiryDate = new Date(paymentDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    const now = new Date();
    
    if (now > expiryDate) {
      return { 
        valid: false, 
        message: 'Assinatura expirada',
        expiryDate: expiryDate.toISOString()
      };
    }
    
    return { 
      valid: true, 
      message: 'Assinatura ativa',
      expiryDate: expiryDate.toISOString(),
      daysRemaining: Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
    };
    
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return { valid: false, message: 'Erro ao verificar assinatura' };
  }
}

module.exports = verifySignature;
