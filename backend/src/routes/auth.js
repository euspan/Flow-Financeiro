const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Função auxiliar para gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ── POST /api/auth/cadastro ──
router.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Preencha todos os campos' });
  }

  try {
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado' });
    }

    const usuario = await Usuario.create({ nome, email, senha });

    res.status(201).json({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      xp: usuario.xp,
      nivel: usuario.nivel,
      token: gerarToken(usuario._id),
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar: ' + error.message });
  }
});

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Informe e-mail e senha' });
  }

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos' });
    }

    res.json({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      xp: usuario.xp,
      nivel: usuario.nivel,
      sequencia: usuario.sequencia,
      licoesConcluidas: usuario.licoesConcluidas,
      medalhas: usuario.medalhas,
      token: gerarToken(usuario._id),
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao fazer login: ' + error.message });
  }
});

module.exports = router;
