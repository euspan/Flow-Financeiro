const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  licao: { type: String, required: true },
  icone: { type: String, default: '📚' },
  xp: { type: Number, default: 20 },
  pergunta: { type: String, required: true },
  opcoes: [
    {
      texto: String,
      correta: Boolean,
    },
  ],
  explicacao: { type: String },
});

module.exports = mongoose.model('Quiz', quizSchema);
