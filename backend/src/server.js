const dns = require('dns');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log('🔧 DNS servers configurados para:', dns.getServers());

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');

const app = express();

let isConnected = false;

// ── Middlewares ──
app.use(cors());
app.use(express.json());

// Middleware para verificar conexão com o MongoDB
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ mensagem: 'Servidor indisponível, tente novamente mais tarde.' });
  }
  next();
});

// ── Rotas ──
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);

// ── Rota de teste ──
app.get('/', (req, res) => {
  res.json({ 
    mensagem: '🌱 Flow Financeiro API rodando!',
    mongoStatus: isConnected ? '✅ Conectado' : '❌ Desconectado'
  });
});

// ── Conectar ao MongoDB e iniciar servidor ──
const PORT = parseInt(process.env.PORT) || 5000;
console.log('📡 Porta configurada para:', PORT);

console.log('🔍 Tentando conectar ao MongoDB...');
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log('✅ MongoDB conectado!');
    isConnected = true;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    console.error('❌ Verifique a URL no arquivo .env e a conexão com a internet.');
    process.exit(1);
  });
