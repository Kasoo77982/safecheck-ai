const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-super-seguro-aqui';
const DB_PATH = path.join(__dirname, '../database-15.json');

// Função para ler o banco de dados
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], audits: [] };
  }
}

// Função para salvar no banco de dados
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Função de registro
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres' });
    }
    
    const db = readDB();
    
    // Verificar se o email já existe
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Este e-mail já está cadastrado' });
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Criar novo usuário
    const newUser = {
      id: String(db.users.length + 1),
      email,
      password: hashedPassword,
      name,
      role: 'user', // Apenas afonsoswf08@gmail.com é admin (já existe no DB)
      createdAt: new Date().toISOString(),
      subscription: null
    };
    
    db.users.push(newUser);
    writeDB(db);
    
    // Gerar token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'Conta criada com sucesso',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
    
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro ao criar conta' });
  }
}

// Função de login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const db = readDB();
    
    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    let isValidPassword;
    if (user.email === 'afonsoswf08@gmail.com' && user.role === 'admin') {
      // Para o admin específico, verificar senha em texto plano
      isValidPassword = password === 'abacate99';
    } else {
      // Para outros usuários, verificar hash
      isValidPassword = await bcrypt.compare(password, user.password);
    }
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription: user.subscription
      }
    });
    
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

// Middleware de autenticação
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}

// Middleware para verificar se é admin
function isAdmin(req, res, next) {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.userId);
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  
  next();
}

// Função para upload de comprovante e ativação de assinatura
async function uploadComprovante(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === req.user.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Marcar como pendente de aprovação
    db.users[userIndex].subscription = {
      status: 'pending',
      requestedAt: new Date().toISOString(),
      comprovante: req.file.filename
    };

    writeDB(db);

    res.json({
      message: 'Comprovante enviado com sucesso. Aguarde aprovação do administrador.',
      subscription: db.users[userIndex].subscription
    });

  } catch (error) {
    console.error('Erro ao processar comprovante:', error);
    res.status(500).json({ error: 'Erro ao processar comprovante' });
  }
}

// Função para listar todos os usuários (admin)
async function getAllUsers(req, res) {
  try {
    const db = readDB();
    
    // Remover senhas dos dados retornados
    const users = db.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json({ users });
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

// Função para aprovar pagamento (admin)
async function approvePayment(req, res) {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }
    
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Ativar assinatura por 30 dias
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    
    db.users[userIndex].subscription = {
      ...db.users[userIndex].subscription,
      status: 'active',
      startedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      approvedAt: new Date().toISOString(),
      approvedBy: req.user.userId
    };
    
    writeDB(db);
    
    res.json({
      message: 'Pagamento aprovado com sucesso',
      user: {
        id: db.users[userIndex].id,
        name: db.users[userIndex].name,
        email: db.users[userIndex].email,
        subscription: db.users[userIndex].subscription
      }
    });
    
  } catch (error) {
    console.error('Erro ao aprovar pagamento:', error);
    res.status(500).json({ error: 'Erro ao aprovar pagamento' });
  }
}

// Função para rejeitar pagamento (admin)
async function rejectPayment(req, res) {
  try {
    const { userId, reason } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário é obrigatório' });
    }
    
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Marcar como rejeitado
    db.users[userIndex].subscription = {
      ...db.users[userIndex].subscription,
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectedBy: req.user.userId,
      rejectionReason: reason || 'Comprovante inválido'
    };
    
    writeDB(db);
    
    res.json({
      message: 'Pagamento rejeitado',
      user: {
        id: db.users[userIndex].id,
        name: db.users[userIndex].name,
        email: db.users[userIndex].email,
        subscription: db.users[userIndex].subscription
      }
    });
    
  } catch (error) {
    console.error('Erro ao rejeitar pagamento:', error);
    res.status(500).json({ error: 'Erro ao rejeitar pagamento' });
  }
}

module.exports = {
  register,
  login,
  authenticateToken,
  isAdmin,
  uploadComprovante,
  getAllUsers,
  approvePayment,
  rejectPayment
};
