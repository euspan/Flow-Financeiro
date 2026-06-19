import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Quizzes locais (em produção viriam do backend via GET /api/quiz)
const QUIZZES = [
  { id: 1, licao: "Orçamento Pessoal", icone: "📋", pergunta: "O orçamento pessoal revela para onde o dinheiro vai e permite alocar recursos conscientemente para objetivos.", opcoes: ["Ele registra receitas e despesas, guiando decisões financeiras.", "Serve apenas para controlar dívidas já existentes.", "Só é necessário para quem ganha acima de 5 salários mínimos.", "Seu único objetivo é calcular quanto sobra para lazer."] },
  { id: 2, licao: "Poupança vs Investimento", icone: "🐷", pergunta: "Poupança e investimento são sinônimos: ambos consistem em guardar dinheiro com o objetivo de crescimento de capital.", opcoes: ["Qualquer reserva de dinheiro é um investimento.", "Os bancos usam os dois termos de forma intercambiável.", "Poupança prioriza segurança e liquidez; investimento busca crescimento aceitando risco.", "Poupança só existe em conta poupança bancária; investimento é qualquer outra coisa."] },
  { id: 3, licao: "Juros Compostos", icone: "📈", pergunta: "Nos juros compostos, os juros incidem sobre o saldo acumulado — e não apenas sobre o capital inicial —, gerando crescimento exponencial no longo prazo.", opcoes: ["É o mecanismo de 'juros sobre juros', que cresce exponencialmente.", "Juros compostos e simples produzem o mesmo resultado no longo prazo.", "Juros compostos só existem em dívidas, nunca em investimentos.", "Juros compostos incidem apenas sobre o valor inicial, como os simples."] },
  { id: 4, licao: "Reserva de Emergência", icone: "🛡️", pergunta: "A reserva de emergência deve ter sempre 3 meses de despesas, independentemente do tipo de renda da pessoa.", opcoes: ["3 meses é o padrão universal recomendado.", "Mais de 3 meses é excessivo e reduz o potencial de investimento.", "O tamanho ideal varia: 3–6 meses para CLT e 6–12 meses para autônomos.", "A reserva deve ser em ações, pois protege melhor da inflação."] },
  { id: 5, licao: "Inflação e Poder de Compra", icone: "💸", pergunta: "Guardar dinheiro em conta corrente sem rendimento equivale, na prática, a perder dinheiro, pois a inflação corrói o poder de compra.", opcoes: ["A inflação reduz o quanto você consegue comprar com o mesmo valor.", "O dinheiro parado nunca perde valor, pois o número na conta não muda.", "Só há perda real se a inflação ultrapassar 10% ao ano.", "Conta corrente é protegida automaticamente pelo Banco Central contra inflação."] },
  { id: 6, licao: "Score de Crédito", icone: "💳", pergunta: "Fazer muitas consultas de crédito em curto período melhora o score porque demonstra interesse ativo em produtos financeiros.", opcoes: ["Bancos valorizam quem busca crédito ativamente.", "Consultas frequentes indicam movimentação financeira positiva.", "Cada consulta adiciona pontos ao histórico de crédito.", "Muitas consultas sinalizam risco aos bureaus e pioram o score."] },
  { id: 7, licao: "Tesouro Direto", icone: "🏦", pergunta: "O Tesouro Selic é o título do Tesouro Direto mais indicado para a reserva de emergência, pois oferece alta liquidez e baixo risco.", opcoes: ["A acompanha a Selic, tem liquidez diária e é o mais seguro do Brasil.", "O Tesouro IPCA+ é sempre melhor por proteger da inflação.", "Tesouro Direto tem carência de 2 anos e não serve para emergências.", "O Tesouro Prefixado é o mais indicado por garantir taxa fixa."] },
  { id: 8, licao: "Cartão de Crédito", icone: "🃏", pergunta: "Pagar o valor mínimo da fatura do cartão de crédito é uma estratégia segura para gerenciar o orçamento sem acumular dívidas significativas.", opcoes: ["O mínimo existe justamente para facilitar o pagamento no fim do mês.", "Os juros do rotativo são baixos o suficiente para não preocupar.", "O rotativo do cartão cobra em média 430% ao ano, dívida que cresce exponencialmente.", "Mas apenas para compras parceladas; para à vista o mínimo é seguro."] },
  { id: 9, licao: "Diversificação", icone: "🧩", pergunta: "Combinar ativos com correlação menor que 1 reduz o risco total da carteira sem necessariamente reduzir o retorno esperado — esse é o princípio matemático da diversificação.", opcoes: ["É a base da Teoria Moderna de Portfólio de Markowitz.", "Diversificar sempre reduz o retorno na mesma proporção em que reduz o risco.", "Só faz sentido diversificar quando se tem mais de R$100.000 investidos.", "Diversificação elimina todos os riscos, inclusive o risco de mercado."] },
  { id: 10, licao: "INSS vs Previdência Privada", icone: "👴", pergunta: "O INSS e a previdência privada funcionam da mesma forma: ambos acumulam capital individual do contribuinte em regime de capitalização.", opcoes: ["Ambos formam uma conta individual para cada contribuinte.", "A diferença é apenas o gestor — governo vs. seguradora.", "O INSS opera em regime de repartição (ativos financiam aposentados); previdência privada em capitalização.", "A previdência privada também é gerida pelo INSS, mas com teto maior."] },
  { id: 11, licao: "Tributação de Investimentos", icone: "🧾", pergunta: "LCI e LCA são isentos de Imposto de Renda para pessoa física, ao contrário do CDB convencional, que segue tabela regressiva.", opcoes: ["LCI/LCA têm isenção de IR; CDB segue tabela regressiva de 22,5% a 15%.", "LCI e LCA pagam IR igual ao CDB, sem nenhum benefício fiscal.", "O CDB é isento de IR; a LCI é tributada em 15% fixo.", "Todos os investimentos de renda fixa pagam exatamente 20% de IR."] },
  { id: 12, licao: "CDI como Benchmark", icone: "📉", pergunta: "Um CDB que rende 80% do CDI é geralmente inferior ao Tesouro Selic depois de descontadas as taxas de administração.", opcoes: ["Produtos abaixo de 100% do CDI raramente compensam após taxas.", "O 80% do CDI é um bom rendimento, pois o CDI é muito alto no Brasil.", "O Tesouro Selic sempre rende menos que qualquer CDB de banco grande.", "O CDI não é uma referência confiável para comparar investimentos."] },
  { id: 13, licao: "Análise Fundamentalista", icone: "🔍", pergunta: "Um P/L (Preço/Lucro) baixo sempre indica que uma ação está barata e representa uma boa oportunidade de compra.", opcoes: ["P/L baixo = preço baixo em relação ao lucro = ação barata.", "O P/L é o indicador mais completo para decidir comprar uma ação.", "Qualquer ação com P/L abaixo de 10 deve ser comprada imediatamente.", "P/L baixo pode indicar empresa em decadência; precisa ser analisado com outros indicadores."] },
  { id: 14, licao: "Fundos Imobiliários (FIIs)", icone: "🏢", pergunta: "FIIs são obrigados por lei a distribuir 95% do lucro aos cotistas, gerando rendimentos mensais isentos de IR para pessoa física.", opcoes: ["Distribuição obrigatória de 95% do lucro, geralmente mensal e isenta de IR.", "Os FIIs distribuem dividendos semestralmente e pagam IR de 15%.", "A distribuição é opcional; cada FII decide se distribui ou reinveste.", "Os rendimentos de FII são isentos somente para quem investe acima de R$50.000."] },
  { id: 15, licao: "Perfil de Investidor (Suitability)", icone: "🧭", pergunta: "Um investidor com perfil arrojado deve sempre alocar 100% do portfólio em renda variável, independentemente do horizonte de tempo ou objetivos.", opcoes: ["Perfil arrojado significa máxima exposição à renda variável.", "Quem aceita risco nunca precisa de reserva de emergência.", "Suitability considera horizonte de tempo, objetivo e situação financeira além do perfil de risco.", "Mas a partir de R$200.000 é obrigatório ter 100% em renda variável."] },
  { id: 16, licao: "Dollar-Cost Averaging", icone: "🔄", pergunta: "O dollar-cost averaging (preço médio) elimina a necessidade de acertar o timing do mercado ao investir um valor fixo periodicamente.", opcoes: ["Investir um valor fixo periodicamente dilui o preço médio e reduz o impacto da volatilidade.", "É mais eficiente esperar a queda do mercado para comprar tudo de uma vez.", "O dollar-cost averaging só funciona em mercados em alta constante.", "Essa estratégia é exclusiva para investidores institucionais."] },
  { id: 17, licao: "Risco de Liquidez", icone: "💧", pergunta: "Imóveis físicos e ações de grandes empresas do Ibovespa têm nível de liquidez equivalente, pois ambos podem ser vendidos rapidamente.", opcoes: ["Ambos têm mercado ativo e são convertidos em dinheiro rapidamente.", "Liquidez depende do valor do ativo, não do tipo.", "Imóveis em capitais são tão líquidos quanto ações do Ibovespa.", "Ações têm liquidez em segundos; imóveis podem levar meses para vender sem perda."] },
  { id: 18, licao: "ETFs vs Gestão Ativa", icone: "📊", pergunta: "Evidências empíricas mostram que a maioria dos fundos de gestão ativa não supera seus benchmarks no longo prazo após descontadas as taxas.", opcoes: ["O SPIVA Report mostra que +80% dos fundos ativos perdem para o índice em 10 anos.", "Gestores ativos sempre superam o índice, pois têm acesso a informações privilegiadas.", "ETFs têm taxas maiores que fundos ativos, tornando-os menos eficientes.", "Essa comparação é irrelevante; o que importa é o retorno bruto, sem descontar taxas."] },
  { id: 19, licao: "Retorno Real — Fisher", icone: "🧮", pergunta: "O retorno real de um investimento é calculado simplesmente subtraindo a taxa de inflação do retorno nominal (ex.: 13% − 5,5% = 7,5% real).", opcoes: ["A subtração direta é a fórmula padrão do retorno real.", "A diferença entre as fórmulas é irrelevante na prática.", "A fórmula correta de Fisher é: (1 + nominal) ÷ (1 + inflação) − 1, dando 7,1%, não 7,5%.", "O retorno real não considera inflação; considera apenas o risco do ativo."] },
  { id: 20, licao: "Planejamento Sucessório", icone: "📜", pergunta: "O VGBL é frequentemente usado em planejamento sucessório porque não entra em inventário, permitindo transferência direta aos beneficiários.", opcoes: ["O VGBL não entra em inventário e permite nomear beneficiários diretamente.", "O VGBL obrigatoriamente entra em inventário como qualquer outro patrimônio.", "O PGBL é o instrumento correto para sucessão; o VGBL não permite beneficiários.", "Investimentos financeiros sempre passam por inventário, sem exceção."] },
  { id: 21, licao: "Duration Modificada", icone: "⏱️", pergunta: "Uma carteira com duration modificada de 5 sofre queda de aproximadamente 5% no valor de mercado caso as taxas de juros subam 1 ponto percentual.", opcoes: ["A duration modificada mede exatamente a sensibilidade percentual do preço a variações de 1 p.p. na taxa.", "A duration modificada de 5 indica que a carteira vence em 5 anos, sem relação com o preço.", "O preço de títulos de renda fixa não é afetado por variações de juros após a emissão.", "A queda seria de 0,5%, não 5%, pois a fórmula divide por 10."] },
  { id: 22, licao: "Viés de Linearidade", icone: "🧠", pergunta: "O viés de linearidade (exponential growth bias) faz o cérebro subestimar tanto o crescimento de dívidas compostas quanto o potencial de acumulação de investimentos no longo prazo.", opcoes: ["O cérebro humano sistematicamente subestima progressões exponenciais, conforme Stango & Zinman (2009).", "O cérebro tende a superestimar juros compostos, gerando ansiedade financeira desnecessária.", "O viés de linearidade afeta apenas pessoas sem educação financeira formal.", "O viés só se manifesta em decisões de curto prazo, não no planejamento de longo prazo."] },
  { id: 23, licao: "Fronteira Eficiente de Markowitz", icone: "📐", pergunta: "Qualquer carteira que apresente retorno positivo está sobre a fronteira eficiente de Markowitz, pois a fronteira inclui todos os portfólios rentáveis.", opcoes: ["Qualquer qualquer retorno positivo já qualifica um portfólio como eficiente.", "A fronteira eficiente é apenas uma representação visual de portfólios positivos.", "Eficiência em Markowitz significa apenas não ter retorno negativo.", "A fronteira eficiente contém apenas portfólios que maximizam retorno para dado risco; portfólios positivos podem ser dominados."] },
  { id: 24, licao: "Transmissão da Política Monetária", icone: "🏛️", pergunta: "No Brasil, o canal de expectativas é considerado dominante na transmissão da política monetária, com defasagem típica de 6 a 18 meses entre mudança da Selic e efeito pleno na inflação.", opcoes: ["O canal de expectativas é dominante no Brasil por conta do histórico de indexação.", "A Selic afeta a inflação instantaneamente, sem defasagem relevante.", "O canal dominante no Brasil é o cambial, não o de expectativas.", "A política monetária no Brasil não tem efeito sobre a inflação; só o fiscal tem."] },
  { id: 25, licao: "VaR e Basel III", icone: "⚠️", pergunta: "O VaR (Value at Risk) é uma métrica completa e suficiente para gestão de portfólios, razão pela qual Basel III a adotou como medida regulatória central.", opcoes: ["Basel III consolidou o VaR como padrão absoluto de risco de mercado.", "O VaR captura todas as perdas possíveis, inclusive as caudas extremas.", "É a única métrica aprovada pelo BIS para capital regulatório.", "O VaR ignora o que está além da cauda; Basel III migrou progressivamente para o Expected Shortfall (CVaR)."] },
  { id: 26, licao: "Yield Curve Invertida", icone: "📉", pergunta: "Uma yield curve invertida — onde juros de curto prazo superam os de longo prazo — tem sido historicamente um dos melhores preditores de recessão nos EUA.", opcoes: ["A inversão do spread 2yr/10yr precedeu 8 das últimas 9 recessões americanas.", "A curva invertida indica boom econômico, pois reflete expectativa de queda da inflação.", "A yield curve não tem poder preditivo comprovado para recessões.", "A curva invertida só é relevante no Brasil; nos EUA o mercado é diferente."] },
  { id: 27, licao: "PGBL vs VGBL — Estratégia Fiscal", icone: "📁", pergunta: "O PGBL é indicado para qualquer contribuinte de previdência privada, independentemente do modelo de declaração do Imposto de Renda utilizado.", opcoes: ["O PGBL tem vantagens fiscais para todos os contribuintes.", "A dedução do PGBL vale tanto para declaração simplificada quanto completa.", "O PGBL só beneficia quem faz declaração completa; para simplificada, o VGBL é mais adequado.", "O PGBL e VGBL têm exatamente o mesmo tratamento fiscal para todos."] },
  { id: 28, licao: "Hipótese dos Mercados Eficientes", icone: "🎲", pergunta: "A hipótese dos mercados eficientes (EMH) é plenamente comprovada pela evidência empírica, sendo consenso que nenhum investidor pode superar o mercado sistematicamente.", opcoes: ["Fama (1970) provou definitivamente que mercados são sempre eficientes.", "Warren Buffett e outros superinvestidores são apenas exceções estatísticas aleatórias.", "A EMH é contestada por anomalias (momentum, value premium) e pela hipótese dos mercados adaptativos de Lo (2004).", "A EMH foi completamente refutada após a crise de 2008 e abandonada pela academia."] },
  { id: 29, licao: "Alavancagem e Margin Call", icone: "⚡", pergunta: "Com alavancagem de 10x, uma queda de apenas 10% no ativo elimina 100% do capital próprio investido, demonstrando a assimetria matemática entre ganhos e perdas.", opcoes: ["Alavancagem de 10x amplifica ganhos e perdas na mesma proporção; 10% de queda = 100% do capital.", "Com alavancagem de 10x, seria necessária uma queda de 100% para perder o capital.", "A corretora protege o investidor do margin call automaticamente.", "Alavancagem só amplifica ganhos; perdas são sempre limitadas ao capital inicial."] },
  { id: 30, licao: "VPL vs TIR", icone: "🏆", pergunta: "O VPL é superior à TIR em decisões de projetos mutuamente excludentes com escalas diferentes, pois captura a riqueza absoluta gerada.", opcoes: ["O VPL captura a riqueza absoluta; a TIR favorece projetos menores com alto percentual, ignorando escala.", "A TIR é sempre superior ao VPL por ser expressa em porcentagem, mais fácil de comparar.", "VPL e TIR sempre chegam à mesma decisão de investimento, independentemente da escala.", "O VPL é inadequado para projetos com múltiplos fluxos de caixa."] },
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
