import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

// Dados organizados em 3 etapas (mesmo que na Home)
const ETAPAS = [
  { id: 1, nome: "Iniciante", icone: "🌱", cor: "#16a34a", licoes: 10 },
  { id: 2, nome: "Intermediário", icone: "📘", cor: "#b45309", licoes: 10 },
  { id: 3, nome: "Avançado", icone: "🔬", cor: "#7c3aed", licoes: 10 },
];

// Conquistas
const CONQUISTAS = [
  { id: "iniciante", nome: "Primeiros Passos", icone: "🌱", desc: "Complete todas as lições do nível Iniciante", etapa: 1, cor: "#16a34a", corClara: "#dcfce7" },
  { id: "intermediario", nome: "Crescendo", icone: "📘", desc: "Complete todas as lições do nível Intermediário", etapa: 2, cor: "#b45309", corClara: "#fef3c7" },
  { id: "avancado", nome: "Mestre Financeiro", icone: "🔬", desc: "Complete todas as lições do nível Avançado", etapa: 3, cor: "#7c3aed", corClara: "#ede9fe" },
];

// Lista completa de lições para o Dashboard
const LICOES = [
  { id: 1, nome: "Orçamento Pessoal", icone: "📋", xp: 15 },
  { id: 2, nome: "Poupança vs Investimento", icone: "🐷", xp: 15 },
  { id: 3, nome: "Juros Compostos", icone: "📈", xp: 15 },
  { id: 4, nome: "Reserva de Emergência", icone: "🛡️", xp: 15 },
  { id: 5, nome: "Inflação e Poder de Compra", icone: "💸", xp: 15 },
  { id: 6, nome: "Score de Crédito", icone: "💳", xp: 15 },
  { id: 7, nome: "Tesouro Direto", icone: "🏦", xp: 15 },
  { id: 8, nome: "Cartão de Crédito", icone: "🃏", xp: 15 },
  { id: 9, nome: "Diversificação", icone: "🧩", xp: 15 },
  { id: 10, nome: "INSS vs Previdência Privada", icone: "👴", xp: 15 },
  { id: 11, nome: "Tributação de Investimentos", icone: "🧾", xp: 20 },
  { id: 12, nome: "CDI como Benchmark", icone: "📉", xp: 20 },
  { id: 13, nome: "Análise Fundamentalista", icone: "🔍", xp: 20 },
  { id: 14, nome: "Fundos Imobiliários", icone: "🏢", xp: 20 },
  { id: 15, nome: "Perfil de Investidor", icone: "🧭", xp: 20 },
  { id: 16, nome: "Dollar-Cost Averaging", icone: "🔄", xp: 20 },
  { id: 17, nome: "Risco de Liquidez", icone: "💧", xp: 20 },
  { id: 18, nome: "ETFs vs Gestão Ativa", icone: "📊", xp: 20 },
  { id: 19, nome: "Retorno Real — Fisher", icone: "🧮", xp: 20 },
  { id: 20, nome: "Planejamento Sucessório", icone: "📜", xp: 20 },
  { id: 21, nome: "Duration Modificada", icone: "⏱️", xp: 25 },
  { id: 22, nome: "Viés de Linearidade", icone: "🧠", xp: 25 },
  { id: 23, nome: "Fronteira Eficiente", icone: "📐", xp: 25 },
  { id: 24, nome: "Política Monetária", icone: "🏛️", xp: 25 },
  { id: 25, nome: "VaR e Basel III", icone: "⚠️", xp: 25 },
  { id: 26, nome: "Yield Curve Invertida", icone: "📉", xp: 25 },
  { id: 27, nome: "PGBL vs VGBL", icone: "📁", xp: 25 },
  { id: 28, nome: "Mercados Eficientes", icone: "🎲", xp: 25 },
  { id: 29, nome: "Alavancagem", icone: "⚡", xp: 25 },
  { id: 30, nome: "VPL vs TIR", icone: "🏆", xp: 25 },
];

export default function Dashboard() {
  const { usuario } = useAuth();
  const concluidas = usuario?.licoesConcluidas || [];
  const xp = usuario?.xp || 0;
  
  // Calcula progresso total
  const totalLicoes = LICOES.length;
  const progressoTotal = concluidas.length;

  // Verifica se etapa está concluída
  const etapaConcluida = (etapaId) => {
    const inicio = (etapaId - 1) * 10 + 1;
    const fim = etapaId * 10;
    for (let i = inicio; i <= fim; i++) {
      if (!concluidas.includes(i)) return false;
    }
    return true;
  };

  return (
    <Layout>
      <p style={s.secao}>SEU PROGRESSO</p>

      {/* Cards de stats */}
      <div style={s.grid}>
        {[
          { icon: '⚡', val: xp, desc: 'XP Total' },
          { icon: '📚', val: `${progressoTotal}/${totalLicoes}`, desc: 'Lições' },
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

      {/* Conquistas */}
      <p style={s.secao}>MINHAS CONQUISTAS</p>
      <div style={s.conquistasWrap}>
        {CONQUISTAS.map(conquista => {
          const desbloqueada = etapaConcluida(conquista.etapa);
          return (
            <div key={conquista.id} style={{
              ...s.conquistaCard,
              background: desbloqueada ? conquista.corClara : '#f3f4f6',
              borderColor: desbloqueada ? conquista.cor : '#d1d5db',
            }}>
              <div style={{
                ...s.conquistaIcone,
                filter: desbloqueada ? 'none' : 'grayscale(1)',
                opacity: desbloqueada ? 1 : 0.3,
              }}>
                {conquista.icone}
              </div>
              <div>
                <p style={{
                  ...s.conquistaNome,
                  color: desbloqueada ? '#1f2937' : '#9ca3af',
                }}>
                  {desbloqueada ? conquista.nome : '???'}
                </p>
                <p style={{
                  ...s.conquistaDesc,
                  color: desbloqueada ? '#6b7280' : '#d1d5db',
                }}>
                  {desbloqueada ? conquista.desc : 'Complete a etapa anterior'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de lições organizadas por etapa */}
      <p style={s.secao}>LIÇÕES</p>
      {ETAPAS.map(etapa => {
        const licoesEtapa = LICOES.slice((etapa.id - 1) * 10, etapa.id * 10);
        const licoesConcluidasNaEtapa = licoesEtapa.filter(l => concluidas.includes(l.id)).length;
        
        return (
          <div key={etapa.id} style={{ marginBottom: 16 }}>
            <div style={{
              ...s.etapaHeader,
              background: etapa.id === 1 ? '#dcfce7' : etapa.id === 2 ? '#fef3c7' : '#ede9fe',
              borderColor: etapa.cor,
            }}>
              <div style={s.etapaInfo}>
                <span style={{ fontSize: 20 }}>{etapa.icone}</span>
                <div>
                  <h3 style={{ ...s.etapaNome, color: etapa.cor }}>{etapa.nome}</h3>
                  <p style={s.etapaProgresso}>{licoesConcluidasNaEtapa}/{etapa.licoes} lições</p>
                </div>
              </div>
            </div>
            <div style={s.listaCard}>
              {licoesEtapa.map((licao, i) => {
                const feita = concluidas.includes(licao.id);
                return (
                  <div key={licao.id} style={{ ...s.linhaLicao, borderBottom: i < 9 ? '1px solid #dcfce7' : 'none' }}>
                    <span style={{ fontSize: 20 }}>{licao.icone}</span>
                    <div style={{ flex: 1 }}>
                      <div style={s.licaoNome}>{licao.nome}</div>
                      <div style={s.licaoStatus}>
                        {feita ? `+${licao.xp} XP conquistados` : 'Bloqueada até etapa anterior'}
                      </div>
                    </div>
                    <span style={{ fontSize: 18 }}>{feita ? '✅' : '🔒'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </Layout>
  );
}

const s = {
  secao: { fontSize: 12, fontWeight: 800, letterSpacing: 1, color: '#6b7280', marginBottom: 14, textTransform: 'uppercase' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 },
  card: { background: 'white', borderRadius: 16, padding: 16, border: '2px solid #bbf7d0', textAlign: 'center' },
  val: { fontFamily: "'Fredoka One', cursive", fontSize: 26, color: '#16a34a', margin: '4px 0 2px' },
  desc: { fontSize: 12, color: '#6b7280', fontWeight: 700 },
  
  conquistasWrap: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 },
  conquistaCard: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, border: '2px solid' },
  conquistaIcone: { fontSize: 32, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  conquistaNome: { fontSize: 13, fontWeight: 800, margin: 0 },
  conquistaDesc: { fontSize: 11, margin: 0, marginTop: 2 },
  
  etapaHeader: { display: 'flex', alignItems: 'center', padding: 10, borderRadius: 10, border: '2px solid', marginBottom: 8 },
  etapaInfo: { display: 'flex', alignItems: 'center', gap: 8 },
  etapaNome: { fontSize: 12, fontWeight: 800, margin: 0 },
  etapaProgresso: { fontSize: 10, color: '#6b7280', margin: 0, marginTop: 2 },
  
  listaCard: { background: 'white', borderRadius: 16, padding: '8px 16px', border: '2px solid #bbf7d0' },
  linhaLicao: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' },
  licaoNome: { fontSize: 13, fontWeight: 700, color: '#14532d' },
  licaoStatus: { fontSize: 11, color: '#6b7280' },
};
