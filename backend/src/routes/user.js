const express = require('express');
const router = express.Router();
const { proteger } = require('../middleware/auth');
const Usuario = require('../models/Usuario');

// ── GET /api/user/perfil ── Ver perfil do usuário logado
router.get('/perfil', proteger, async (req, res) => {
  const usuario = await Usuario.findById(req.usuario._id).select('-senha');
  res.json(usuario);
});

// ── GET /api/user/ranking ── Top 10 usuários por XP
router.get('/ranking', proteger, async (req, res) => {
  const top = await Usuario.find()
    .sort({ xp: -1 })
    .limit(10)
    .select('nome xp nivel sequencia');
  res.json(top);
});

// ── PUT /api/user/perfil ── Atualizar nome
router.put('/perfil', proteger, async (req, res) => {
  const { nome } = req.body;
  const usuario = await Usuario.findByIdAndUpdate(
    req.usuario._id,
    { nome },
    { new: true }
  ).select('-senha');
  res.json(usuario);
});

module.exports = router;
