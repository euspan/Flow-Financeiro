import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const MEDALHAS = [
  { id: 'first', icon: '⭐', nome: 'Primeira Lição', desc: 'Complete sua primeira lição', cond: (u) => (u.licoesConcluidas?.length || 0) >= 1 },
  { id: 'streak3', icon: '🔥', nome: 'Em Chamas', desc: 'Sequência de 3 lições', cond: (u) => (u.sequencia || 0) >= 3 },
  { id: 'halfway', icon: '🏅', nome: 'Na Metade', desc: 'Complete 3 quizzes', cond: (u) => (u.licoesConcluidas?.length || 0) >= 3 },
  { id: 'master', icon: '🏆', nome: 'Mestre', desc: 'Complete todos os quizzes', cond: (u) => (u.licoesConcluidas?.length || 0) >= 5 },
  { id: 'xp100', icon: '💎', nome: 'Centenário', desc: 'Acumule 100 XP', cond: (u) => (u.xp || 0) >= 100 },
];

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const xp = usuario?.xp || 0;
  const nivel = Math.floor(xp / 50) + 1;
  const nomeNivel = ['', 'Iniciante', 'Aprendiz', 'Intermediário', 'Avançado', 'Expert'][nivel] || 'Expert';

  return (
    <Layout>
      {/* Header do perfil */}
      <div style={s.header}>
        <div style={s.avatar}>🦉</div>
        <div>
          <div style={s.nome}>{usuario?.nome}</div>
          <div style={s.nivelLabel}>Nível {nivel} · {nomeNivel}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={s.grid}>
        {[
          { icon: '⚡', val: xp, label: 'XP Total' },
          { icon: '🔥', val: usuario?.sequencia || 0, label: 'Sequência' },
          { icon: '📚', val: usuario?.licoesConcluidas?.length || 0, label: 'Lições' },
          { icon: '🏅', val: MEDALHAS.filter((m) => m.cond(usuario || {})).length, label: 'Medalhas' },
        ].map((c) => (
          <div key={c.label} style={s.card}>
            <div style={{ fontSize: 26 }}>{c.icon}</div>
            <div style={s.cardVal}>{c.val}</div>
            <div style={s.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <p style={s.secao}>CONQUISTAS</p>
      <div style={s.medalhasGrid}>
        {MEDALHAS.map((m) => {
          const conquistada = m.cond(usuario || {});
          return (
            <div key={m.id} style={{ ...s.medalhaCard, borderColor: conquistada ? '#ca8a04' : '#e5e7eb', background: conquistada ? '#fffbeb' : 'white', opacity: conquistada ? 1 : 0.5 }}>
              <span style={{ fontSize: 30 }}>{m.icon}</span>
              <div>
                <div style={s.medalhaNome}>{m.nome}</div>
                <div style={s.medalhaDesc}>{m.desc}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={logout} style={s.logoutBtn}>Sair da conta</button>
    </Layout>
  );
}

const s = {
  header: { background: 'linear-gradient(135deg, #16a34a, #065f46)', borderRadius: 20, padding: 24, color: 'white', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 },
  avatar: { width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 },
  nome: { fontSize: 20, fontWeight: 800 },
  nivelLabel: { fontSize: 13, opacity: 0.85 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
  card: { background: 'white', borderRadius: 16, padding: 16, border: '2px solid #bbf7d0', textAlign: 'center' },
  cardVal: { fontFamily: "'Fredoka One', cursive", fontSize: 26, color: '#16a34a', margin: '4px 0 2px' },
  cardLabel: { fontSize: 12, color: '#6b7280', fontWeight: 700 },
  secao: { fontSize: 12, fontWeight: 800, letterSpacing: 1, color: '#6b7280', marginBottom: 14, textTransform: 'uppercase' },
  medalhasGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
  medalhaCard: { background: 'white', borderRadius: 16, padding: 16, border: '2px solid', display: 'flex', alignItems: 'center', gap: 12, transition: 'all .2s' },
  medalhaNome: { fontSize: 13, fontWeight: 800, color: '#14532d' },
  medalhaDesc: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  logoutBtn: { width: '100%', padding: 16, background: '#fee2e2', color: '#dc2626', border: '2px solid #fca5a5', borderRadius: 12, fontFamily: "'Nunito', sans-serif", fontSize: 15, fontWeight: 800, cursor: 'pointer' },
};
