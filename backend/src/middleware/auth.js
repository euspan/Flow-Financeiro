const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const proteger = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Pegar o token do header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adicionar usuário na requisição (sem a senha)
      req.usuario = await Usuario.findById(decoded.id).select('-senha');

      next();
    } catch (error) {
      return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }
  }

  if (!token) {
    return res.status(401).json({ mensagem: 'Sem token de autenticação' });
  }
};

module.exports = { proteger };
