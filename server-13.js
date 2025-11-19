const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { register, login, authMiddleware } = require('./auth');
const { upload, uploadComprovante, getSubscriptionStatus } = require('./payment');
const { performAudit, getAuditHistory, getAuditDetails } = require('./audit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rotas públicas
app.post('/api/register', register);
app.post('/api/login', login);

// Rotas protegidas
app.post('/api/upload-comprovante', authMiddleware, upload.single('comprovante'), uploadComprovante);
app.get('/api/assinatura', authMiddleware, getSubscriptionStatus);
app.post('/api/auditar', authMiddleware, performAudit);
app.get('/api/historico', authMiddleware, getAuditHistory);
app.get('/api/auditoria/:id', authMiddleware, getAuditDetails);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SafeCheck AI Backend rodando' });
});

// Rota catch-all para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!', message: err.message });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║           🛡️  SafeCheck AI Backend 🛡️                ║
║                                                       ║
║   Servidor rodando em: http://localhost:${PORT}       ║
║                                                       ║
║   Endpoints disponíveis:                             ║
║   POST   /api/register                               ║
║   POST   /api/login                                  ║
║   POST   /api/upload-comprovante                     ║
║   GET    /api/assinatura                             ║
║   POST   /api/auditar                                ║
║   GET    /api/historico                              ║
║   GET    /api/auditoria/:id                          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
