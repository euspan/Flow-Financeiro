import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const LICOES = [
  { id: 1, nome: 'Poupança', icone: '🐷', xp: 20 },
  { id: 2, nome: 'Orçamento', icone: '📊', xp: 20 },
  { id: 3, nome: 'Investimento', icone: '📈', xp: 30 },
  { id: 4, nome: 'Juros', icone: '💳', xp: 25 },
  { id: 5, nome: 'Metas', icone: '🎯', xp: 20 },
];

export default function Dashboard() {
  const { usuario } = useAuth();
  const concluidas = usuario?.licoesConcluidas || [];
  const xp = usuario?.xp || 0;

  return (
    <Layout>
      <p style={s.secao}>SEU PROGRESSO</p>

      {/* Cards de stats */}
      <div style={s.grid}>
        {[
          { icon: '⚡', val: xp, desc: 'XP Total' },
          { icon: '📚', val: `${concluidas.length}/${LICOES.length}`, desc: 'Lições' },
          { icon: '🔥', val: usuario?.sequencia || 0, desc: 'Sequência' },
          { icon: '🏅', val: `Nível ${Math.floor(xp / 50) + 1}`, desc: 'Nível atual' },
        ].map((c) => (
          <div key={c.desc} style={s.card}>
            <div style={{ fontSize: 28 }}>{c.icon}</div>
            <div style={s.val}>{c.val}</div>
            <div style={s.desc}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Lista de lições */}
      <p style={s.secao}>LIÇÕES</p>
      <div style={s.listaCard}>
        {LICOES.map((licao, i) => {
          const feita = concluidas.includes(licao.id);
          const disponivel = i === concluidas.length;
          return (
            <div key={licao.id} style={{ ...s.linhaLicao, borderBottom: i < LICOES.length - 1 ? '1px solid #dcfce7' : 'none' }}>
              <span style={{ fontSize: 24 }}>{licao.icone}</span>
              <div style={{ flex: 1 }}>
                <div style={s.licaoNome}>{licao.nome}</div>
                <div style={s.licaoStatus}>
                  {feita ? `+${licao.xp} XP conquistados` : disponivel ? 'Disponível agora' : 'Bloqueada 🔒'}
                </div>
              </div>
              <span style={{ fontSize: 20 }}>{feita ? '✅' : disponivel ? '▶️' : '🔒'}</span>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

const s = {
  secao: { fontSize: 12, fontWeight: 800, letterSpacing: 1, color: '#6b7280', marginBottom: 14, textTransform: 'uppercase' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
  card: { background: 'white', borderRadius: 16, padding: 16, border: '2px solid #bbf7d0', textAlign: 'center' },
  val: { fontFamily: "'Fredoka One', cursive", fontSize: 26, color: '#16a34a', margin: '4px 0 2px' },
  desc: { fontSize: 12, color: '#6b7280', fontWeight: 700 },
  listaCard: { background: 'white', borderRadius: 16, padding: '8px 16px', border: '2px solid #bbf7d0' },
  linhaLicao: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' },
  licaoNome: { fontSize: 14, fontWeight: 700, color: '#14532d' },
  licaoStatus: { fontSize: 12, color: '#6b7280' },
};
