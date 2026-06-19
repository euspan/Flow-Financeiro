const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'E-mail é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: 6,
    },
    xp: {
      type: Number,
      default: 0,
    },
    nivel: {
      type: Number,
      default: 1,
    },
    sequencia: {
      type: Number,
      default: 0,
    },
    licoesConcluidas: {
      type: [Number], // IDs dos quizzes concluídos
      default: [],
    },
    medalhas: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Criptografar senha antes de salvar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('senha')) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método para comparar senhas
usuarioSchema.methods.compararSenha = async function (senhaDigitada) {
  return await bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
