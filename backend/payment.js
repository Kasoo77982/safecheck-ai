const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifySignature = require('./verifySignature');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'comprovante-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Apenas imagens (JPEG, PNG) ou PDF são permitidos'));
    }
  }
});

function uploadComprovante(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }
    
    const dbPath = path.join(__dirname, 'database.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const user = db.users.find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Simulação de validação do comprovante (em produção, usar OCR ou API de pagamento)
    const paymentDate = new Date();
    const expiryDate = new Date(paymentDate);
    expiryDate.setDate(expiryDate.getDate() + 30);
    
    user.subscription = {
      active: true,
      paymentDate: paymentDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      amount: 19.90,
      receiptPath: req.file.path,
      receiptFilename: req.file.filename
    };
    
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    
    res.json({
      message: 'Comprovante enviado e assinatura ativada com sucesso!',
      subscription: {
        active: true,
        expiryDate: expiryDate.toISOString(),
        daysRemaining: 30
      }
    });
    
  } catch (error) {
    console.error('Erro ao processar comprovante:', error);
    res.status(500).json({ error: 'Erro ao processar comprovante' });
  }
}

function getSubscriptionStatus(req, res) {
  try {
    const result = verifySignature(req.userId);
    
    const dbPath = path.join(__dirname, 'database.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    const user = db.users.find(u => u.id === req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    res.json({
      subscription: result.valid ? {
        active: true,
        expiryDate: result.expiryDate,
        daysRemaining: result.daysRemaining,
        amount: user.subscription?.amount || 19.90
      } : {
        active: false,
        message: result.message
      }
    });
    
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    res.status(500).json({ error: 'Erro ao verificar assinatura' });
  }
}

module.exports = { upload, uploadComprovante, getSubscriptionStatus };
