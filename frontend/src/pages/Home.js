import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const LICOES = [
  { id: 1, nome: 'Poupança', icone: '🐷', xp: 20 },
  { id: 2, nome: 'Orçamento', icone: '📊', xp: 20 },
  { id: 3, nome: 'Investimento', icone: '📈', xp: 30 },
  { id: 4, nome: 'Juros', icone: '💳', xp: 25 },
  { id: 5, nome: 'Metas', icone: '🎯', xp: 20 },
];

export default function Home() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const concluidas = usuario?.licoesConcluidas || [];
  const progresso = concluidas.length;

  const xpAtual = usuario?.xp || 0;
  const proximoNivel = (Math.floor(xpAtual / 50) + 1) * 50;
  const pct = ((xpAtual % 50) / 50) * 100;

  return (
    <Layout>
      {/* Banner de boas-vindas */}
      <div style={s.banner}>
        <span style={{ fontSize: 48 }}>🦊</span>
        <div style={{ flex: 1 }}>
          <h2 style={s.bannerTitulo}>Olá, {usuario?.nome}!</h2>
          <p style={s.bannerSub}>Continue sua jornada financeira 💪</p>
          <div style={s.xpBarWrap}>
            <div style={{ ...s.xpBarFill, width: `${pct}%` }} />
          </div>
          <p style={s.xpLabel}>{xpAtual}/{proximoNivel} XP para o próximo nível</p>
        </div>
      </div>

      <p style={s.secao}>TRILHA DE APRENDIZADO</p>

      {/* Trilha */}
      <div style={s.trilha}>
        {LICOES.map((licao, idx) => {
          const feita = concluidas.includes(licao.id);
          const ativa = idx === progresso;
          const bloqueada = idx > progresso;

          return (
            <div key={licao.id} style={s.no}>
              {idx > 0 && (
                <div style={{ ...s.conector, background: feita ? '#16a34a' : '#bbf7d0' }} />
              )}
              <button
                style={{ ...s.liçãoBtn, cursor: bloqueada ? 'default' : 'pointer' }}
                disabled={bloqueada}
                onClick={() => !bloqueada && navigate(`/quiz/${licao.id}`)}
              >
                <div style={{
                  ...s.circulo,
                  background: feita ? '#16a34a' : ativa ? '#facc15' : '#e5e7eb',
                  borderColor: feita ? '#14532d' : ativa ? '#ca8a04' : '#d1d5db',
                  boxShadow: feita ? '0 6px 0 #14532d' : ativa ? '0 6px 0 #ca8a04' : '0 4px 0 #d1d5db',
                  filter: bloqueada ? 'grayscale(1)' : 'none',
                }}>
                  {feita ? '✓' : bloqueada ? '🔒' : licao.icone}
                </div>
                <span style={s.licaoNome}>{licao.nome}</span>
                <span style={s.licaoXp}>+{licao.xp} XP</span>
              </button>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

const s = {
  banner: { background: 'linear-gradient(135deg, #16a34a, #065f46)', borderRadius: 20, padding: 20, color: 'white', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 },
  bannerTitulo: { fontSize: 18, fontWeight: 800, margin: 0 },
  bannerSub: { fontSize: 13, opacity: 0.85, margin: '2px 0 10px' },
  xpBarWrap: { background: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 8, overflow: 'hidden' },
  xpBarFill: { height: '100%', background: '#facc15', borderRadius: 10, transition: 'width .6s' },
  xpLabel: { fontSize: 11, opacity: 0.75, margin: '4px 0 0' },
  secao: { fontSize: 12, fontWeight: 800, letterSpacing: 1, color: '#6b7280', marginBottom: 14, textTransform: 'uppercase' },
  trilha: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  no: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  conector: { width: 3, height: 30, borderRadius: 2 },
  liçãoBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: 4 },
  circulo: { width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: '4px solid', transition: 'all .3s' },
  licaoNome: { fontSize: 13, fontWeight: 700, color: '#14532d' },
  licaoXp: { fontSize: 11, fontWeight: 700, color: '#6b7280' },
};
