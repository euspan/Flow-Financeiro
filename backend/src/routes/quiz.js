const express = require('express');
const router = express.Router();
const { proteger } = require('../middleware/auth');
const Usuario = require('../models/Usuario');

// Lista de quizzes (em produção viria do banco)
const QUIZZES = [
  // ── TRILHA 1 — BASE (Q01–Q10) ─────────────────────────────────────────────
  {
    id: 1, licao: "Orçamento Pessoal", icone: "📋", xp: 15,
    pergunta: "O orçamento pessoal revela para onde o dinheiro vai e permite alocar recursos conscientemente para objetivos.",
    opcoes: [
      { texto: "Ele registra receitas e despesas, guiando decisões financeiras.", correta: true },
      { texto: "Serve apenas para controlar dívidas já existentes.", correta: false },
      { texto: "Só é necessário para quem ganha acima de 5 salários mínimos.", correta: false },
      { texto: "Seu único objetivo é calcular quanto sobra para lazer.", correta: false },
    ],
    explicacao: "Verdadeiro! O orçamento é o ponto de partida do planejamento financeiro. A OECD/INFE (2023) aponta que controlá-lo é o comportamento mais correlacionado com bem-estar financeiro em todos os países pesquisados.",
  },
  {
    id: 2, licao: "Poupança vs Investimento", icone: "🐷", xp: 15,
    pergunta: "Poupança e investimento são sinônimos: ambos consistem em guardar dinheiro com o objetivo de crescimento de capital.",
    opcoes: [
      { texto: "Qualquer reserva de dinheiro é um investimento.", correta: false },
      { texto: "Os bancos usam os dois termos de forma intercambiável.", correta: false },
      { texto: "Poupança prioriza segurança e liquidez; investimento busca crescimento aceitando risco.", correta: true },
      { texto: "Poupança só existe em conta poupança bancária; investimento é qualquer outra coisa.", correta: false },
    ],
    explicacao: "Falso! Poupança = proteção + liquidez (objetivos de curto prazo e emergências). Investimento = crescimento + risco (médio e longo prazo). O ideal é ter ambos.",
  },
  {
    id: 3, licao: "Juros Compostos", icone: "📈", xp: 15,
    pergunta: "Nos juros compostos, os juros incidem sobre o saldo acumulado — e não apenas sobre o capital inicial —, gerando crescimento exponencial no longo prazo.",
    opcoes: [
      { texto: "É o mecanismo de 'juros sobre juros', que cresce exponencialmente.", correta: true },
      { texto: "Juros compostos e simples produzem o mesmo resultado no longo prazo.", correta: false },
      { texto: "Juros compostos só existem em dívidas, nunca em investimentos.", correta: false },
      { texto: "Juros compostos incidem apenas sobre o valor inicial, como os simples.", correta: false },
    ],
    explicacao: "Verdadeiro! Juros compostos = 'juros sobre juros'. Em dívidas (cartão de crédito) crescem muito rápido contra você. Em investimentos, o tempo se torna seu maior aliado.",
  },
  {
    id: 4, licao: "Reserva de Emergência", icone: "🛡️", xp: 15,
    pergunta: "A reserva de emergência deve ter sempre 3 meses de despesas, independentemente do tipo de renda da pessoa.",
    opcoes: [
      { texto: "3 meses é o padrão universal recomendado.", correta: false },
      { texto: "Mais de 3 meses é excessivo e reduz o potencial de investimento.", correta: false },
      { texto: "O tamanho ideal varia: 3–6 meses para CLT e 6–12 meses para autônomos.", correta: true },
      { texto: "A reserva deve ser em ações, pois protege melhor da inflação.", correta: false },
    ],
    explicacao: "Falso! O tamanho ideal depende da estabilidade da renda. Empregado com FGTS: 3–6 meses. Autônomo, MEI ou renda variável: 6–12 meses. Deve ficar em aplicação de alta liquidez como Tesouro Selic.",
  },
  {
    id: 5, licao: "Inflação e Poder de Compra", icone: "💸", xp: 15,
    pergunta: "Guardar dinheiro em conta corrente sem rendimento equivale, na prática, a perder dinheiro, pois a inflação corrói o poder de compra.",
    opcoes: [
      { texto: "A inflação reduz o quanto você consegue comprar com o mesmo valor.", correta: true },
      { texto: "O dinheiro parado nunca perde valor, pois o número na conta não muda.", correta: false },
      { texto: "Só há perda real se a inflação ultrapassar 10% ao ano.", correta: false },
      { texto: "Conta corrente é protegida automaticamente pelo Banco Central contra inflação.", correta: false },
    ],
    explicacao: "Verdadeiro! Com inflação de 5% ao ano, R$100 hoje valem apenas R$48 em poder de compra daqui a 15 anos. Todo investimento precisa render acima do IPCA para preservar riqueza.",
  },
  {
    id: 6, licao: "Score de Crédito", icone: "💳", xp: 15,
    pergunta: "Fazer muitas consultas de crédito em curto período melhora o score porque demonstra interesse ativo em produtos financeiros.",
    opcoes: [
      { texto: "Bancos valorizam quem busca crédito ativamente.", correta: false },
      { texto: "Consultas frequentes indicam movimentação financeira positiva.", correta: false },
      { texto: "Cada consulta adiciona pontos ao histórico de crédito.", correta: false },
      { texto: "Muitas consultas sinalizam risco aos bureaus e pioram o score.", correta: true },
    ],
    explicacao: "Falso! Muitas consultas em pouco tempo sinalizam busca desesperada por crédito — um sinal de risco. O score melhora pagando contas em dia, mantendo cadastro positivo e não acumulando inadimplência.",
  },
  {
    id: 7, licao: "Tesouro Direto", icone: "🏦", xp: 15,
    pergunta: "O Tesouro Selic é o título do Tesouro Direto mais indicado para a reserva de emergência, pois oferece alta liquidez e baixo risco.",
    opcoes: [
      { texto: "A acompanha a Selic, tem liquidez diária e é o mais seguro do Brasil.", correta: true },
      { texto: "O Tesouro IPCA+ é sempre melhor por proteger da inflação.", correta: false },
      { texto: "Tesouro Direto tem carência de 2 anos e não serve para emergências.", correta: false },
      { texto: "O Tesouro Prefixado é o mais indicado por garantir taxa fixa.", correta: false },
    ],
    explicacao: "Verdadeiro! O Tesouro Selic é pós-fixado (acompanha a Selic), tem liquidez diária e é o investimento mais seguro do Brasil. Perfeito para reserva de emergência.",
  },
  {
    id: 8, licao: "Cartão de Crédito", icone: "🃏", xp: 15,
    pergunta: "Pagar o valor mínimo da fatura do cartão de crédito é uma estratégia segura para gerenciar o orçamento sem acumular dívidas significativas.",
    opcoes: [
      { texto: "O mínimo existe justamente para facilitar o pagamento no fim do mês.", correta: false },
      { texto: "Os juros do rotativo são baixos o suficiente para não preocupar.", correta: false },
      { texto: "O rotativo do cartão cobra em média 430% ao ano, dívida que cresce exponencialmente.", correta: true },
      { texto: "Mas apenas para compras parceladas; para à vista o mínimo é seguro.", correta: false },
    ],
    explicacao: "Falso! Pagar só o mínimo ativa o rotativo, com juros médios de 430% ao ano (BCB, 2023). Uma dívida de R$1.000 pode ultrapassar R$5.000 em 12 meses. Regra absoluta: pagar a fatura total.",
  },
  {
    id: 9, licao: "Diversificação", icone: "🧩", xp: 15,
    pergunta: "Combinar ativos com correlação menor que 1 reduz o risco total da carteira sem necessariamente reduzir o retorno esperado — esse é o princípio matemático da diversificação.",
    opcoes: [
      { texto: "É a base da Teoria Moderna de Portfólio de Markowitz.", correta: true },
      { texto: "Diversificar sempre reduz o retorno na mesma proporção em que reduz o risco.", correta: false },
      { texto: "Só faz sentido diversificar quando se tem mais de R$100.000 investidos.", correta: false },
      { texto: "Diversificação elimina todos os riscos, inclusive o risco de mercado.", correta: false },
    ],
    explicacao: "Verdadeiro! Diversificar distribui recursos entre ativos que não se movem juntos. Riscos específicos são eliminados; o risco sistemático (mercado como um todo) permanece. 'Não coloque todos os ovos na mesma cesta' tem fundamento matemático.",
  },
  {
    id: 10, licao: "INSS vs Previdência Privada", icone: "👴", xp: 15,
    pergunta: "O INSS e a previdência privada funcionam da mesma forma: ambos acumulam capital individual do contribuinte em regime de capitalização.",
    opcoes: [
      { texto: "Ambos formam uma conta individual para cada contribuinte.", correta: false },
      { texto: "A diferença é apenas o gestor — governo vs. seguradora.", correta: false },
      { texto: "O INSS opera em regime de repartição (ativos financiam aposentados); previdência privada em capitalização.", correta: true },
      { texto: "A previdência privada também é gerida pelo INSS, mas com teto maior.", correta: false },
    ],
    explicacao: "Falso! INSS = repartição: trabalhadores ativos financiam aposentados do presente. Previdência privada (PGBL/VGBL) = capitalização: você acumula seu próprio fundo. A reforma de 2019 tornou o planejamento complementar ainda mais relevante.",
  },

  // ── TRILHA 2 — MÉDIO (Q11–Q20) ────────────────────────────────────────────
  {
    id: 11, licao: "Tributação de Investimentos", icone: "🧾", xp: 20,
    pergunta: "LCI e LCA são isentas de Imposto de Renda para pessoa física, ao contrário do CDB convencional, que segue tabela regressiva.",
    opcoes: [
      { texto: "LCI/LCA têm isenção de IR; CDB segue tabela regressiva de 22,5% a 15%.", correta: true },
      { texto: "LCI e LCA pagam IR igual ao CDB, sem nenhum benefício fiscal.", correta: false },
      { texto: "O CDB é isento de IR; a LCI é tributada em 15% fixo.", correta: false },
      { texto: "Todos os investimentos de renda fixa pagam exatamente 20% de IR.", correta: false },
    ],
    explicacao: "Verdadeiro! LCI, LCA, CRI, CRA e debêntures incentivadas são isentos de IR para pessoa física. O CDB segue tabela regressiva: 22,5% (até 180 dias) a 15% (acima de 720 dias).",
  },
  {
    id: 12, licao: "CDI como Benchmark", icone: "📉", xp: 20,
    pergunta: "Um CDB que rende 80% do CDI é geralmente inferior ao Tesouro Selic depois de descontadas as taxas de administração.",
    opcoes: [
      { texto: "Produtos abaixo de 100% do CDI raramente compensam após taxas.", correta: true },
      { texto: "O 80% do CDI é um bom rendimento, pois o CDI é muito alto no Brasil.", correta: false },
      { texto: "O Tesouro Selic sempre rende menos que qualquer CDB de banco grande.", correta: false },
      { texto: "O CDI não é uma referência confiável para comparar investimentos.", correta: false },
    ],
    explicacao: "Verdadeiro! CDI ≈ Selic. Um CDB a 100% CDI empata com o Tesouro Selic. Abaixo de 80% CDI, produto provavelmente perde para o Tesouro após taxas. O CDI é a régua mínima da renda fixa.",
  },
  {
    id: 13, licao: "Análise Fundamentalista", icone: "🔍", xp: 20,
    pergunta: "Um P/L (Preço/Lucro) baixo sempre indica que uma ação está barata e representa uma boa oportunidade de compra.",
    opcoes: [
      { texto: "P/L baixo = preço baixo em relação ao lucro = ação barata.", correta: false },
      { texto: "O P/L é o indicador mais completo para decidir comprar uma ação.", correta: false },
      { texto: "Qualquer ação com P/L abaixo de 10 deve ser comprada imediatamente.", correta: false },
      { texto: "P/L baixo pode indicar empresa em decadência; precisa ser analisado com outros indicadores.", correta: true },
    ],
    explicacao: "Falso! P/L baixo pode indicar empresa com crescimento lento ou em declínio. P/L alto não significa caro — empresas de crescimento têm P/L elevado naturalmente. Sempre use múltiplos indicadores: P/VPA, EV/EBITDA, dividend yield.",
  },
  {
    id: 14, licao: "Fundos Imobiliários (FIIs)", icone: "🏢", xp: 20,
    pergunta: "FIIs são obrigados por lei a distribuir 95% do lucro aos cotistas, gerando rendimentos mensais isentos de IR para pessoa física.",
    opcoes: [
      { texto: "Distribuição obrigatória de 95% do lucro, geralmente mensal e isenta de IR.", correta: true },
      { texto: "Os FIIs distribuem dividendos semestralmente e pagam IR de 15%.", correta: false },
      { texto: "A distribuição é opcional; cada FII decide se distribui ou reinveste.", correta: false },
      { texto: "Os rendimentos de FII são isentos somente para quem investe acima de R$50.000.", correta: false },
    ],
    explicacao: "Verdadeiro! A lei obriga os FIIs a distribuir 95% do lucro — na prática, mensalmente. Esses rendimentos são isentos de IR para pessoa física nas condições padrão regulamentadas pela CVM.",
  },
  {
    id: 15, licao: "Perfil de Investidor (Suitability)", icone: "🧭", xp: 20,
    pergunta: "Um investidor com perfil arrojado deve sempre alocar 100% do portfólio em renda variável, independentemente do horizonte de tempo ou objetivos.",
    opcoes: [
      { texto: "Perfil arrojado significa máxima exposição à renda variável.", correta: false },
      { texto: "Quem aceita risco nunca precisa de reserva de emergência.", correta: false },
      { texto: "Suitability considera horizonte de tempo, objetivo e situação financeira além do perfil de risco.", correta: true },
      { texto: "Mas a partir de R$200.000 é obrigatório ter 100% em renda variável.", correta: false },
    ],
    explicacao: "Falso! Perfil é apenas um fator. Mesmo investidores arrojados precisam de reserva de emergência em liquidez e devem diversificar. Ignorar o suitability leva a pânico em quedas e venda no pior momento.",
  },
  {
    id: 16, licao: "Dollar-Cost Averaging", icone: "🔄", xp: 20,
    pergunta: "O dollar-cost averaging (preço médio) elimina a necessidade de acertar o timing do mercado ao investir um valor fixo periodicamente.",
    opcoes: [
      { texto: "Investir um valor fixo periodicamente dilui o preço médio e reduz o impacto da volatilidade.", correta: true },
      { texto: "É mais eficiente esperar a queda do mercado para comprar tudo de uma vez.", correta: false },
      { texto: "O dollar-cost averaging só funciona em mercados em alta constante.", correta: false },
      { texto: "Essa estratégia é exclusiva para investidores institucionais.", correta: false },
    ],
    explicacao: "Verdadeiro! Ao investir R$500/mês independente do preço, você compra mais cotas quando cai e menos quando sobe. Elimina o timing, cria disciplina e reduz o impacto psicológico da volatilidade.",
  },
  {
    id: 17, licao: "Risco de Liquidez", icone: "💧", xp: 20,
    pergunta: "Imóveis físicos e ações de grandes empresas do Ibovespa têm nível de liquidez equivalente, pois ambos podem ser vendidos rapidamente.",
    opcoes: [
      { texto: "Ambos têm mercado ativo e são convertidos em dinheiro rapidamente.", correta: false },
      { texto: "Liquidez depende do valor do ativo, não do tipo.", correta: false },
      { texto: "Imóveis em capitais são tão líquidos quanto ações do Ibovespa.", correta: false },
      { texto: "Ações têm liquidez em segundos; imóveis podem levar meses para vender sem perda.", correta: true },
    ],
    explicacao: "Falso! Ações de grandes empresas têm liquidez imediata (segundos). Imóveis físicos podem levar meses para vender, frequentemente com desconto. Menor liquidez exige maior prêmio de retorno.",
  },
  {
    id: 18, licao: "ETFs vs Gestão Ativa", icone: "📊", xp: 20,
    pergunta: "Evidências empíricas mostram que a maioria dos fundos de gestão ativa não supera seus benchmarks no longo prazo após descontadas as taxas.",
    opcoes: [
      { texto: "O SPIVA Report mostra que +80% dos fundos ativos perdem para o índice em 10 anos.", correta: true },
      { texto: "Gestores ativos sempre superam o índice, pois têm acesso a informações privilegiadas.", correta: false },
      { texto: "ETFs têm taxas maiores que fundos ativos, tornando-os menos eficientes.", correta: false },
      { texto: "Essa comparação é irrelevante; o que importa é o retorno bruto, sem descontar taxas.", correta: false },
    ],
    explicacao: "Verdadeiro! ETFs replicam índices com taxas de 0,05–0,3% ao ano contra 1–2% dos fundos ativos. Mais de 80% dos fundos ativos perdem para o índice em 10 anos. Para pessoa física, ETFs têm a melhor relação custo-benefício no longo prazo.",
  },
  {
    id: 19, licao: "Retorno Real — Fisher", icone: "🧮", xp: 20,
    pergunta: "O retorno real de um investimento é calculado simplesmente subtraindo a taxa de inflação do retorno nominal (ex.: 13% − 5,5% = 7,5% real).",
    opcoes: [
      { texto: "A subtração direta é a fórmula padrão do retorno real.", correta: false },
      { texto: "A diferença entre as fórmulas é irrelevante na prática.", correta: false },
      { texto: "A fórmula correta de Fisher é: (1 + nominal) ÷ (1 + inflação) − 1, dando 7,1%, não 7,5%.", correta: true },
      { texto: "O retorno real não considera inflação; considera apenas o risco do ativo.", correta: false },
    ],
    explicacao: "Falso! A subtração simples é incorreta. Fórmula de Fisher: (1,13 ÷ 1,055) − 1 ≈ 7,1%, não 7,5%. A diferença cresce em análises de longo prazo. Usar o número nominal é uma ilusão monetária.",
  },
  {
    id: 20, licao: "Planejamento Sucessório", icone: "📜", xp: 20,
    pergunta: "O VGBL é frequentemente usado em planejamento sucessório porque não entra em inventário, permitindo transferência direta aos beneficiários.",
    opcoes: [
      { texto: "O VGBL não entra em inventário e permite nomear beneficiários diretamente.", correta: true },
      { texto: "O VGBL obrigatoriamente entra em inventário como qualquer outro patrimônio.", correta: false },
      { texto: "O PGBL é o instrumento correto para sucessão; o VGBL não permite beneficiários.", correta: false },
      { texto: "Investimentos financeiros sempre passam por inventário, sem exceção.", correta: false },
    ],
    explicacao: "Verdadeiro! O VGBL não entra em inventário e permite nomear beneficiários diretamente — transferência ágil, potencialmente sem ITCMD em muitos estados. Sem planejamento, o inventário pode consumir até 20% do patrimônio.",
  },

  // ── TRILHA 3 — AVANÇADO (Q21–Q30) ─────────────────────────────────────────
  {
    id: 21, licao: "Duration Modificada", icone: "⏱️", xp: 25,
    pergunta: "Uma carteira com duration modificada de 5 sofre queda de aproximadamente 5% no valor de mercado caso as taxas de juros subam 1 ponto percentual.",
    opcoes: [
      { texto: "A duration modificada mede exatamente a sensibilidade percentual do preço a variações de 1 p.p. na taxa.", correta: true },
      { texto: "A duration modificada de 5 indica que a carteira vence em 5 anos, sem relação com o preço.", correta: false },
      { texto: "O preço de títulos de renda fixa não é afetado por variações de juros após a emissão.", correta: false },
      { texto: "A queda seria de 0,5%, não 5%, pois a fórmula divide por 10.", correta: false },
    ],
    explicacao: "Verdadeiro! Duration modificada = Macaulay ÷ (1 + taxa). É a sensibilidade percentual do preço a variações de 1 p.p. na taxa de juros. Essencial para imunização de portfólio e gestão de risco de taxa.",
  },
  {
    id: 22, licao: "Viés de Linearidade", icone: "🧠", xp: 25,
    pergunta: "O viés de linearidade (exponential growth bias) faz o cérebro subestimar tanto o crescimento de dívidas compostas quanto o potencial de acumulação de investimentos no longo prazo.",
    opcoes: [
      { texto: "O cérebro humano sistematicamente subestima progressões exponenciais, conforme Stango & Zinman (2009).", correta: true },
      { texto: "O cérebro tende a superestimar juros compostos, gerando ansiedade financeira desnecessária.", correta: false },
      { texto: "O viés de linearidade afeta apenas pessoas sem educação financeira formal.", correta: false },
      { texto: "O viés só se manifesta em decisões de curto prazo, não no planejamento de longo prazo.", correta: false },
    ],
    explicacao: "Verdadeiro! O exponential growth bias (Stango & Zinman, 2009) documenta que o cérebro subestima crescimento exponencial — tanto de riqueza acumulada quanto de erosão de dívidas. Isso impacta diretamente decisões de poupança e aposentadoria.",
  },
  {
    id: 23, licao: "Fronteira Eficiente de Markowitz", icone: "📐", xp: 25,
    pergunta: "Qualquer carteira que apresente retorno positivo está sobre a fronteira eficiente de Markowitz, pois a fronteira inclui todos os portfólios rentáveis.",
    opcoes: [
      { texto: "Qualquer qualquer retorno positivo já qualifica um portfólio como eficiente.", correta: false },
      { texto: "A fronteira eficiente é apenas uma representação visual de portfólios positivos.", correta: false },
      { texto: "Eficiência em Markowitz significa apenas não ter retorno negativo.", correta: false },
      { texto: "A fronteira eficiente contém apenas portfólios que maximizam retorno para dado risco; portfólios positivos podem ser dominados.", correta: true },
    ],
    explicacao: "Falso! A fronteira eficiente é o conjunto de portfólios que maximizam retorno para cada nível de risco. Uma carteira com retorno positivo pode ser dominada por outra com mesmo risco e retorno maior — e estaria abaixo da fronteira.",
  },
  {
    id: 24, licao: "Transmissão da Política Monetária", icone: "🏛️", xp: 25,
    pergunta: "No Brasil, o canal de expectativas é considerado dominante na transmissão da política monetária, com defasagem típica de 6 a 18 meses entre mudança da Selic e efeito pleno na inflação.",
    opcoes: [
      { texto: "O canal de expectativas é dominante no Brasil por conta do histórico de indexação.", correta: true },
      { texto: "A Selic afeta a inflação instantaneamente, sem defasagem relevante.", correta: false },
      { texto: "O canal dominante no Brasil é o cambial, não o de expectativas.", correta: false },
      { texto: "A política monetária no Brasil não tem efeito sobre a inflação; só o fiscal tem.", correta: false },
    ],
    explicacao: "Verdadeiro! O BCB opera via 4 canais: crédito, câmbio, expectativas e riqueza. No Brasil, o canal de expectativas é dominante dado o histórico de indexação. A defasagem de 6–18 meses exige que o Copom aja com antecedência.",
  },
  {
    id: 25, licao: "VaR e Basel III", icone: "⚠️", xp: 25,
    pergunta: "O VaR (Value at Risk) é uma métrica completa e suficiente para gestão de portfólios, razão pela qual Basel III a adotou como medida regulatória central.",
    opcoes: [
      { texto: "Basel III consolidou o VaR como padrão absoluto de risco de mercado.", correta: false },
      { texto: "O VaR captura todas as perdas possíveis, inclusive as caudas extremas.", correta: false },
      { texto: "É a única métrica aprovada pelo BIS para capital regulatório.", correta: false },
      { texto: "O VaR ignora o que está além da cauda; Basel III migrou progressivamente para o Expected Shortfall (CVaR).", correta: true },
    ],
    explicacao: "Falso! O VaR tem limitações críticas: ignora perdas além da cauda, assume distribuição normal (subestima fat tails) e é procíclico. Por isso, Basel III migrou para o Expected Shortfall (CVaR), que mede o tamanho das perdas extremas.",
  },
  {
    id: 26, licao: "Yield Curve Invertida", icone: "📉", xp: 25,
    pergunta: "Uma yield curve invertida — onde juros de curto prazo superam os de longo prazo — tem sido historicamente um dos melhores preditores de recessão nos EUA.",
    opcoes: [
      { texto: "A inversão do spread 2yr/10yr precedeu 8 das últimas 9 recessões americanas.", correta: true },
      { texto: "A curva invertida indica boom econômico, pois reflete expectativa de queda da inflação.", correta: false },
      { texto: "A yield curve não tem poder preditivo comprovado para recessões.", correta: false },
      { texto: "A curva invertida só é relevante no Brasil; nos EUA o mercado é diferente.", correta: false },
    ],
    explicacao: "Verdadeiro! A inversão do spread 2yr/10yr precedeu 8 das últimas 9 recessões nos EUA. Pela teoria das expectativas puras, a taxa longa reflete a média das taxas curtas futuras esperadas.",
  },
  {
    id: 27, licao: "PGBL vs VGBL — Estratégia Fiscal", icone: "📁", xp: 25,
    pergunta: "O PGBL é indicado para qualquer contribuinte de previdência privada, independentemente do modelo de declaração do Imposto de Renda utilizado.",
    opcoes: [
      { texto: "O PGBL tem vantagens fiscais para todos os contribuintes.", correta: false },
      { texto: "A dedução do PGBL vale tanto para declaração simplificada quanto completa.", correta: false },
      { texto: "O PGBL só beneficia quem faz declaração completa; para simplificada, o VGBL é mais adequado.", correta: true },
      { texto: "O PGBL e VGBL têm exatamente o mesmo tratamento fiscal para todos.", correta: false },
    ],
    explicacao: "Falso! O PGBL deduz até 12% da renda bruta apenas na declaração completa. Quem usa declaração simplificada não tem esse benefício e paga IR sobre 100% do valor no resgate. Estratégia ótima: PGBL até 12% da renda + excedente em VGBL.",
  },
  {
    id: 28, licao: "Hipótese dos Mercados Eficientes", icone: "🎲", xp: 25,
    pergunta: "A hipótese dos mercados eficientes (EMH) é plenamente comprovada pela evidência empírica, sendo consenso que nenhum investidor pode superar o mercado sistematicamente.",
    opcoes: [
      { texto: "Fama (1970) provou definitivamente que mercados são sempre eficientes.", correta: false },
      { texto: "Warren Buffett e outros superinvestidores são apenas exceções estatísticas aleatórias.", correta: false },
      { texto: "A EMH é contestada por anomalias (momentum, value premium) e pela hipótese dos mercados adaptativos de Lo (2004).", correta: true },
      { texto: "A EMH foi completamente refutada após a crise de 2008 e abandonada pela academia.", correta: false },
    ],
    explicacao: "Falso! A EMH é contestada por anomalias documentadas: efeito janeiro, momentum (Jegadeesh & Titman), value premium (Fama & French) e bolhas. A resposta atual é a hipótese dos mercados adaptativos (Lo, 2004): eficiência é dinâmica e contexto-dependente.",
  },
  {
    id: 29, licao: "Alavancagem e Margin Call", icone: "⚡", xp: 25,
    pergunta: "Com alavancagem de 10x, uma queda de apenas 10% no ativo elimina 100% do capital próprio investido, demonstrando a assimetria matemática entre ganhos e perdas.",
    opcoes: [
      { texto: "Alavancagem de 10x amplifica ganhos e perdas na mesma proporção; 10% de queda = 100% do capital.", correta: true },
      { texto: "Com alavancagem de 10x, seria necessária uma queda de 100% para perder o capital.", correta: false },
      { texto: "A corretora protege o investidor do margin call automaticamente.", correta: false },
      { texto: "Alavancagem só amplifica ganhos; perdas são sempre limitadas ao capital inicial.", correta: false },
    ],
    explicacao: "Verdadeiro! Alavancagem 10x: queda de 10% no ativo = perda de 100% do capital próprio. A assimetria matemática é crítica: perder 50% exige ganhar 100% para recuperar. O margin call amplificou crises como 1929, 2008 e Archegos (2021).",
  },
  {
    id: 30, licao: "VPL vs TIR", icone: "🏆", xp: 25,
    pergunta: "O VPL é superior à TIR em decisões de projetos mutuamente excludentes com escalas diferentes, pois captura a riqueza absoluta gerada.",
    opcoes: [
      { texto: "O VPL captura a riqueza absoluta; a TIR favorece projetos menores com alto percentual, ignorando escala.", correta: true },
      { texto: "A TIR é sempre superior ao VPL por ser expressa em porcentagem, mais fácil de comparar.", correta: false },
      { texto: "VPL e TIR sempre chegam à mesma decisão de investimento, independentemente da escala.", correta: false },
      { texto: "O VPL é inadequado para projetos com múltiplos fluxos de caixa.", correta: false },
    ],
    explicacao: "Verdadeiro! A TIR tem falhas estruturais: múltiplas TIRs possíveis, pressuposto de reinvestimento irreal e ignora escala. O VPL captura riqueza absoluta e é a métrica primária em finanças corporativas. A TIR modificada (TIRM) resolve o problema do reinvestimento.",
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
