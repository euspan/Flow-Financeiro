import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Quizzes locais (em produção viriam do backend via GET /api/quiz)
const QUIZZES = [
  { id: 1, licao: 'Poupança', icone: '🐷', pergunta: 'Qual é a melhor definição de poupança?', opcoes: ['Gastar todo o salário no mês', 'Guardar parte do dinheiro para o futuro', 'Pegar dinheiro emprestado', 'Investir em apostas'] },
  { id: 2, licao: 'Orçamento', icone: '📊', pergunta: 'O que é um orçamento pessoal?', opcoes: ['Lista de desejos de compra', 'Planejamento de receitas e despesas', 'Extrato bancário', 'Fatura do cartão de crédito'] },
  { id: 3, licao: 'Investimento', icone: '📈', pergunta: 'Qual é considerado um investimento de renda fixa?', opcoes: ['Ações da bolsa de valores', 'Tesouro Direto', 'Fundos imobiliários', 'Criptomoedas'] },
  { id: 4, licao: 'Juros', icone: '💳', pergunta: 'O que são juros compostos?', opcoes: ['Juros cobrados apenas no valor inicial', 'Juros calculados sobre juros anteriores', 'Desconto em compras à vista', 'Taxa de câmbio'] },
  { id: 5, licao: 'Metas', icone: '🎯', pergunta: 'Para uma boa meta financeira, ela deve ser:', opcoes: ['Vaga e sem prazo definido', 'Específica, mensurável e com prazo', 'Impossível de alcançar', 'Dependente da sorte'] },
];

const LETRAS = ['A', 'B', 'C', 'D'];

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { atualizarUsuario, usuario } = useAuth();
  const quiz = QUIZZES.find((q) => q.id === parseInt(id));

  const [selecionado, setSelecionado] = useState(null);
  const [resultado, setResultado] = useState(null); // { correta, explicacao, xpGanho }
  const [vidas, setVidas] = useState(3);
  const [enviando, setEnviando] = useState(false);

  if (!quiz) return <div style={{ padding: 40, textAlign: 'center' }}>Quiz não encontrado.</div>;

  const verificar = async () => {
    if (selecionado === null || enviando) return;
    setEnviando(true);
    try {
      const { data } = await axios.post(`/api/quiz/${quiz.id}/responder`, { opcaoIndex: selecionado });
      setResultado(data);
      if (!data.correta) setVidas((v) => v - 1);
      if (data.correta) {
        atualizarUsuario({
          xp: (usuario?.xp || 0) + data.xpGanho,
          licoesConcluidas: [...(usuario?.licoesConcluidas || []), quiz.id],
        });
      }
    } catch (err) {
      alert('Erro ao enviar resposta. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const proximo = () => {
    if (resultado?.correta || vidas === 0) {
      navigate('/');
    } else {
      setSelecionado(null);
      setResultado(null);
    }
  };

  return (
    <div style={s.tela}>
      {/* Cabeçalho */}
      <div style={s.header}>
        <button style={s.voltarBtn} onClick={() => navigate('/')}>←</button>
        <div style={s.progressBar}>
          <div style={{ ...s.progressFill, width: `${(quiz.id / QUIZZES.length) * 100}%` }} />
        </div>
        <div style={s.vidas}>{[...Array(3)].map((_, i) => <span key={i}>{i < vidas ? '❤️' : '🖤'}</span>)}</div>
      </div>

      {/* Ícone do quiz */}
      <div style={s.mascote}>{quiz.icone}</div>

      {/* Card da pergunta */}
      <div style={s.card}>
        <div style={s.tag}>📚 {quiz.licao}</div>
        <p style={s.pergunta}>{quiz.pergunta}</p>
      </div>

      {/* Opções */}
      <div style={s.opcoes}>
        {quiz.opcoes.map((opcao, i) => {
          let bordaCor = '#bbf7d0';
          let bgCor = 'white';
          if (resultado) {
            if (i === resultado.opcaoCorreta || (resultado.correta && i === selecionado)) { bordaCor = '#16a34a'; bgCor = '#dcfce7'; }
            else if (i === selecionado && !resultado.correta) { bordaCor = '#ef4444'; bgCor = '#fee2e2'; }
          } else if (i === selecionado) {
            bordaCor = '#3b82f6'; bgCor = '#dbeafe';
          }
          return (
            <button key={i} disabled={!!resultado} onClick={() => setSelecionado(i)} style={{ ...s.opcaoBtn, borderColor: bordaCor, background: bgCor }}>
              <span style={s.letra}>{LETRAS[i]}</span>
              {opcao}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {resultado && (
        <div style={{ ...s.feedback, background: resultado.correta ? '#dcfce7' : '#fee2e2', borderColor: resultado.correta ? '#16a34a' : '#ef4444' }}>
          <strong style={{ color: resultado.correta ? '#16a34a' : '#ef4444' }}>
            {resultado.correta ? '✅ Correto!' : '❌ Ops, quase!'}
          </strong>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>{resultado.explicacao}</p>
          {resultado.correta && <p style={{ fontSize: 13, fontWeight: 700, color: '#16a34a' }}>+{resultado.xpGanho} XP! 🎉</p>}
        </div>
      )}

      {/* Botão */}
      {!resultado ? (
        <button style={{ ...s.botao, opacity: selecionado === null ? 0.5 : 1 }} disabled={selecionado === null || enviando} onClick={verificar}>
          {enviando ? 'Verificando...' : 'VERIFICAR'}
        </button>
      ) : (
        <button style={s.botao} onClick={proximo}>
          {resultado.correta || vidas === 0 ? 'CONTINUAR →' : 'TENTAR NOVAMENTE'}
        </button>
      )}
    </div>
  );
}

const s = {
  tela: { maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: 20, fontFamily: "'Nunito', sans-serif", display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 },
  voltarBtn: { background: '#dcfce7', border: 'none', width: 40, height: 40, borderRadius: 12, fontSize: 20, cursor: 'pointer' },
  progressBar: { flex: 1, background: '#dcfce7', borderRadius: 10, height: 10, overflow: 'hidden' },
  progressFill: { height: '100%', background: '#16a34a', borderRadius: 10 },
  vidas: { display: 'flex', gap: 4, fontSize: 18 },
  mascote: { fontSize: 56, textAlign: 'center', marginBottom: 12 },
  card: { background: 'white', borderRadius: 20, padding: 24, marginBottom: 20, boxShadow: '0 4px 0 #bbf7d0' },
  tag: { display: 'inline-block', background: '#dcfce7', color: '#16a34a', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 20, marginBottom: 12, textTransform: 'uppercase' },
  pergunta: { fontSize: 19, fontWeight: 800, lineHeight: 1.4, color: '#14532d', margin: 0 },
  opcoes: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
  opcaoBtn: { padding: '16px 20px', border: '3px solid', borderRadius: 16, background: 'white', fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 700, color: '#14532d', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12 },
  letra: { width: 28, height: 28, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#16a34a', flexShrink: 0 },
  feedback: { padding: 16, borderRadius: 14, border: '2px solid', marginBottom: 12 },
  botao: { width: '100%', padding: 18, background: '#16a34a', color: 'white', border: 'none', borderRadius: 14, fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', boxShadow: '0 5px 0 #166534', letterSpacing: 0.5 },
};
