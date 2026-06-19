const express = require('express');
const router = express.Router();
const { proteger } = require('../middleware/auth');
const Usuario = require('../models/Usuario');

// Lista de quizzes (em produção viria do banco)
const QUIZZES = [
  {
    id: 1, licao: 'Poupança', icone: '🐷', xp: 20,
    pergunta: 'Qual é a melhor definição de poupança?',
    opcoes: [
      { texto: 'Gastar todo o salário no mês', correta: false },
      { texto: 'Guardar parte do dinheiro para o futuro', correta: true },
      { texto: 'Pegar dinheiro emprestado', correta: false },
      { texto: 'Investir em apostas', correta: false },
    ],
    explicacao: 'Poupar significa reservar uma parte da sua renda regularmente!',
  },
  {
    id: 2, licao: 'Orçamento', icone: '📊', xp: 20,
    pergunta: 'O que é um orçamento pessoal?',
    opcoes: [
      { texto: 'Lista de desejos de compra', correta: false },
      { texto: 'Planejamento de receitas e despesas', correta: true },
      { texto: 'Extrato bancário', correta: false },
      { texto: 'Fatura do cartão de crédito', correta: false },
    ],
    explicacao: 'Um orçamento é um plano financeiro que organiza quanto você ganha e quanto gasta!',
  },
  {
    id: 3, licao: 'Investimento', icone: '📈', xp: 30,
    pergunta: 'Qual é considerado um investimento de renda fixa?',
    opcoes: [
      { texto: 'Ações da bolsa de valores', correta: false },
      { texto: 'Tesouro Direto', correta: true },
      { texto: 'Fundos imobiliários', correta: false },
      { texto: 'Criptomoedas', correta: false },
    ],
    explicacao: 'O Tesouro Direto é um título público — você sabe quanto vai ganhar!',
  },
  {
    id: 4, licao: 'Juros', icone: '💳', xp: 25,
    pergunta: 'O que são juros compostos?',
    opcoes: [
      { texto: 'Juros cobrados apenas no valor inicial', correta: false },
      { texto: 'Juros calculados sobre juros anteriores', correta: true },
      { texto: 'Desconto em compras à vista', correta: false },
      { texto: 'Taxa de câmbio', correta: false },
    ],
    explicacao: 'Juros compostos crescem sobre o total acumulado!',
  },
  {
    id: 5, licao: 'Metas', icone: '🎯', xp: 20,
    pergunta: 'Para uma boa meta financeira, ela deve ser:',
    opcoes: [
      { texto: 'Vaga e sem prazo definido', correta: false },
      { texto: 'Específica, mensurável e com prazo', correta: true },
      { texto: 'Impossível de alcançar', correta: false },
      { texto: 'Dependente da sorte', correta: false },
    ],
    explicacao: 'Metas SMART funcionam muito melhor para o planejamento financeiro!',
  },
];

// ── GET /api/quiz ── Listar todos os quizzes
router.get('/', proteger, (req, res) => {
  // Remove a resposta correta antes de enviar ao cliente
  const quizzesSemResposta = QUIZZES.map((q) => ({
    ...q,
    opcoes: q.opcoes.map((o) => ({ texto: o.texto })),
  }));
  res.json(quizzesSemResposta);
});

// ── POST /api/quiz/:id/responder ── Responder um quiz
router.post('/:id/responder', proteger, async (req, res) => {
  const quizId = parseInt(req.params.id);
  const { opcaoIndex } = req.body;

  const quiz = QUIZZES.find((q) => q.id === quizId);
  if (!quiz) return res.status(404).json({ mensagem: 'Quiz não encontrado' });

  const opcaoEscolhida = quiz.opcoes[opcaoIndex];
  if (!opcaoEscolhida) return res.status(400).json({ mensagem: 'Opção inválida' });

  const correta = opcaoEscolhida.correta;

  // Se acertou, atualizar XP e progresso do usuário
  if (correta) {
    const usuario = await Usuario.findById(req.usuario._id);
    if (!usuario.licoesConcluidas.includes(quizId)) {
      usuario.xp += quiz.xp;
      usuario.licoesConcluidas.push(quizId);
      usuario.sequencia += 1;

      // Calcular nível (a cada 50 XP sobe um nível)
      usuario.nivel = Math.floor(usuario.xp / 50) + 1;

      await usuario.save();
    }
  }

  res.json({
    correta,
    explicacao: quiz.explicacao,
    xpGanho: correta ? quiz.xp : 0,
  });
});

module.exports = router;
