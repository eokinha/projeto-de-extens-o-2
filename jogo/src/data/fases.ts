// Dados FICTÍCIOS (provisórios) — substituir pelos dados reais do questionário quando houver.
import { TIPO_VARIANCIA } from "@/lib/config";
import {
  acumulada,
  amplitude,
  arred,
  desvioMedio,
  desvioPadrao,
  fmt,
  frequenciaClasses,
  media,
  mediana,
  mediaPonderada,
  percentual,
  rol,
  separatrizAgrupada,
  soma,
  sturges,
  variancia,
} from "@/lib/stats";
import type { Fase } from "./tipos";

export const NEGOCIO = {
  nome: "Açaí do Bairro",
  dono: "seu Jorge",
  tamanhos: ["300 ml", "500 ml", "700 ml"],
  precos: [12, 18, 24],
  custos: [5, 7, 9],
};

export const COR = { acai: "#6b2a7b", verde: "#2f9e44", laranja: "#e8590c", cinza: "#868e96" };

const divisor = TIPO_VARIANCIA === "amostral" ? "n − 1" : "n";

// ---------------------------------------------------------------- Fase 2
const complementos = ["Granola", "Leite em pó", "Banana", "Leite condensado", "Morango", "Paçoca"];
const fiComplementos = [12, 9, 7, 6, 4, 2];
const pctComplementos = percentual(fiComplementos);

const dias30 = [52, 61, 47, 58, 73, 66, 49, 55, 62, 70, 44, 59, 63, 57, 68, 75, 51, 60, 54, 65, 48, 71, 56, 62, 59, 67, 53, 64, 46, 78];
const AT = amplitude(dias30);
const kSturges = sturges(dias30.length);
const k = Math.round(kSturges);
const h = Math.ceil(AT / k);
const inicio = Math.min(...dias30);
const classes = Array.from({ length: k }, (_, i) => `${inicio + i * h} ⊢ ${inicio + (i + 1) * h}`);
const fiClasses = frequenciaClasses(dias30, inicio, h, k);
const FiClasses = acumulada(fiClasses);
const limite56 = classes.findIndex((c) => c.startsWith("56"));
const diasMenos56 = FiClasses[limite56 - 1];
const dias68ouMais = soma(fiClasses.slice(classes.findIndex((c) => c.startsWith("68"))));

const fase2: Fase = {
  id: "organizando-o-caderno",
  numero: 2,
  titulo: "Organizando o caderno",
  resumo: "Transforme as anotações bagunçadas de seu Jorge em tabelas e gráficos.",
  conteudos: ["Dados brutos e rol", "Frequência absoluta, percentual e acumulada", "Classes e fórmula de Sturges"],
  aprendizado: "Organizar os dados revela padrões que a lista bruta esconde.",
  etapas: [
    {
      tipo: "info",
      titulo: "O caderno do seu Jorge",
      texto:
        "Seu Jorge anota tudo num caderno. O problema: as anotações estão bagunçadas e ele não consegue tirar conclusões. Hoje ele vai perguntar a 40 clientes qual complemento eles preferem. Vamos atender e organizar essas respostas?",
    },
    {
      tipo: "empilhar",
      titulo: "Empilhando copos",
      pergunta: "Cada cliente diz o complemento preferido. Coloque o copo na pilha certa!",
      categorias: complementos,
      pedidos: [0, 2, 1, 0, 3, 4, 0, 1, 5, 2],
      totais: fiComplementos,
      explica: `Cada pilha mostra quantos clientes escolheram aquele complemento: é a frequência absoluta (fi). Juntas, as pilhas formam um gráfico de barras. A pilha mais alta (${complementos[0]}, com ${fiComplementos[0]} copos) é a moda.`,
    },
    {
      tipo: "tabela",
      titulo: "Frequência percentual",
      texto: "Agora vamos passar as suas pilhas para uma tabela de frequências.",
      pergunta: "Complete a coluna f% (porcentagem de clientes que preferem cada complemento).",
      rotulo: "Complemento",
      linhas: complementos,
      colunas: [
        { nome: "fi", valores: fiComplementos, editavel: false },
        { nome: "f%", valores: pctComplementos, editavel: true, casas: 1 },
      ],
      tolerancia: 0.1,
      dica: "f% = (fi ÷ total) × 100. O total é 40 clientes.",
      explica: `Granola: 12 ÷ 40 = 0,30 → 30%. Leite em pó: 9 ÷ 40 = 22,5%. A soma de todas as porcentagens sempre dá 100%.`,
    },
    {
      tipo: "escolha",
      titulo: "A moda",
      texto: "Veja o gráfico de barras que você acabou de construir:",
      grafico: {
        tipo: "barras",
        eixoX: "nome",
        dados: complementos.map((c, i) => ({ nome: c, valor: fiComplementos[i] })),
        series: [{ chave: "valor", nome: "Clientes", cor: COR.acai }],
      },
      pergunta: "Qual complemento é a MODA, ou seja, o mais preferido pelos clientes?",
      opcoes: complementos.slice(0, 4),
      correta: 0,
      dica: "A moda é o valor que aparece com maior frequência.",
      explica: "Granola tem a maior frequência (12 clientes, 30%). Por isso é a moda: seu Jorge deve comprar mais granola do que os outros complementos.",
    },
    {
      tipo: "info",
      titulo: "Copos vendidos por dia",
      texto: `Agora seu Jorge anotou quantos copos vendeu em cada um dos últimos 30 dias. Estes são os dados brutos (na ordem em que foram anotados):`,
      tabela: {
        cabecalho: ["Dias 1–10", "Dias 11–20", "Dias 21–30"],
        linhas: Array.from({ length: 10 }, (_, i) => [dias30[i], dias30[i + 10], dias30[i + 20]]),
      },
    },
    {
      tipo: "rol",
      titulo: "Montando o rol",
      pergunta: "Toque nos valores dos 10 primeiros dias em ordem CRESCENTE para montar o rol.",
      valores: dias30.slice(0, 10),
      explica: `Rol é a ordenação dos dados brutos. Com os 30 dias, o rol completo fica: ${rol(dias30).join(", ")}.`,
    },
    {
      tipo: "numero",
      titulo: "Amplitude total",
      texto: `Rol completo dos 30 dias: ${rol(dias30).join(", ")}.`,
      pergunta: "Qual é a amplitude total (AT) das vendas?",
      resposta: AT,
      tolerancia: 0,
      unidade: "copos",
      dica: "AT = maior valor − menor valor.",
      explica: `AT = ${Math.max(...dias30)} − ${Math.min(...dias30)} = ${AT} copos.`,
    },
    {
      tipo: "numero",
      titulo: "Número de classes (Sturges)",
      pergunta: "Usando a fórmula de Sturges, quantas classes a tabela deve ter? (arredonde para o inteiro mais próximo)",
      resposta: k,
      tolerancia: 0,
      unidade: "classes",
      dica: "k = 1 + 3,3 · log n, com n = 30. log 30 ≈ 1,477.",
      explica: `k = 1 + 3,3 · log 30 = 1 + 3,3 · 1,477 ≈ ${fmt(kSturges)} → ${k} classes.`,
    },
    {
      tipo: "numero",
      titulo: "Amplitude de cada classe",
      pergunta: "Qual deve ser a amplitude de cada classe (h)? (arredonde para cima)",
      resposta: h,
      tolerancia: 0,
      dica: "h = AT ÷ k.",
      explica: `h = ${AT} ÷ ${k} ≈ ${fmt(AT / k)} → arredondando para cima, h = ${h}. Começando no menor valor (${inicio}), as classes ficam ${classes.join(", ")}.`,
    },
    {
      tipo: "tabela",
      titulo: "Distribuição de frequência em classes",
      pergunta: "Conte quantos dias caem em cada classe (fi) e complete a frequência acumulada (Fi).",
      texto: `Rol: ${rol(dias30).join(", ")}. Lembre: 44 ⊢ 50 inclui o 44 mas NÃO inclui o 50.`,
      rotulo: "Copos/dia",
      linhas: classes,
      colunas: [
        { nome: "fi", valores: fiClasses, editavel: true, casas: 0 },
        { nome: "Fi", valores: FiClasses, editavel: true, casas: 0 },
      ],
      tolerancia: 0,
      dica: "Fi é a soma de fi da classe com todas as anteriores. A última Fi deve ser 30.",
      explica: `fi = ${fiClasses.join(", ")}. Fi = ${FiClasses.join(", ")}.`,
    },
    {
      tipo: "numero",
      titulo: "Lendo a tabela",
      grafico: {
        tipo: "barras",
        eixoX: "classe",
        dados: classes.map((c, i) => ({ classe: c, dias: fiClasses[i] })),
        series: [{ chave: "dias", nome: "Dias", cor: COR.acai }],
      },
      pergunta: "Em quantos dias seu Jorge vendeu MENOS de 56 copos?",
      resposta: diasMenos56,
      tolerancia: 0,
      unidade: "dias",
      dica: "Use a frequência acumulada (Fi) da classe que termina em 56.",
      explica: `A classe 50 ⊢ 56 tem Fi = ${diasMenos56}: em ${diasMenos56} dias as vendas ficaram abaixo de 56 copos.`,
    },
    {
      tipo: "numero",
      titulo: "Decisão: contratar um ajudante?",
      pergunta: "Seu Jorge precisa de ajudante nos dias em que vende 68 copos ou mais. Em quantos dos 30 dias isso aconteceu?",
      resposta: dias68ouMais,
      tolerancia: 0,
      unidade: "dias",
      dica: "Some as frequências (fi) das classes a partir de 68.",
      explica: `${fiClasses.at(-2)} + ${fiClasses.at(-1)} = ${dias68ouMais} dias (${fmt((dias68ouMais / 30) * 100, 1)}% do mês). Um ajudante em meio período resolve!`,
    },
  ],
};

// ---------------------------------------------------------------- Fase 3
const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const semana = [48, 52, 50, 55, 63, 70, 182];
const semanaComum = semana.slice(0, 6);
const qtdTamanho = [210, 240, 70];
const precoMedio = mediaPonderada(NEGOCIO.precos, qtdTamanho);
const custoMedio = mediaPonderada(NEGOCIO.custos, qtdTamanho);

const fase3: Fase = {
  id: "o-dia-tipico",
  numero: 3,
  titulo: "O dia típico",
  resumo: "Descubra quantos copos seu Jorge vende num dia normal — sem se enganar com o dia da festa.",
  conteudos: ["Média aritmética", "Mediana", "Moda", "Média ponderada", "Valores atípicos"],
  aprendizado: "Escolher a medida certa evita produzir demais por causa de um dia fora da curva.",
  etapas: [
    {
      tipo: "info",
      titulo: "Uma semana movimentada",
      texto: "Estas foram as vendas da última semana. No domingo teve festa na praça do bairro e o movimento explodiu!",
      tabela: { cabecalho: diasSemana, linhas: [semana] },
      grafico: {
        tipo: "barras",
        eixoX: "dia",
        dados: diasSemana.map((d, i) => ({ dia: d, copos: semana[i] })),
        series: [{ chave: "copos", nome: "Copos vendidos", cor: COR.acai }],
      },
    },
    {
      tipo: "gangorra",
      titulo: "A gangorra da média",
      texto:
        "Cada copinho na gangorra é um dia da semana, colocado na posição do número de copos vendidos. A média é o ponto de equilíbrio, como o centro de gravidade dos dados.",
      pergunta: "Mova o apoio amarelo até a gangorra ficar reta.",
      valores: semana,
      min: 40,
      max: 190,
      explica: `O ponto de equilíbrio fica em ${fmt(media(semana))}: essa é a média! Repare que o domingo, sozinho lá longe, "puxa" a gangorra e obriga o apoio a ir para a direita, para longe dos outros 6 dias.`,
    },
    {
      tipo: "numero",
      titulo: "Média de vendas",
      fala: "Agora confirma na conta o que a gangorra mostrou!",
      pergunta: "Qual foi a média de copos vendidos por dia nessa semana?",
      resposta: arred(media(semana)),
      tolerancia: 0.05,
      unidade: "copos/dia",
      dica: "Média = soma de todos os valores ÷ quantidade de valores.",
      explica: `x̄ = (${semana.join(" + ")}) ÷ 7 = ${soma(semana)} ÷ 7 ≈ ${fmt(media(semana))} copos por dia.`,
    },
    {
      tipo: "rol",
      titulo: "Organizando para a mediana",
      pergunta: "Toque nas vendas da semana em ordem CRESCENTE.",
      valores: semana,
      explica: `Rol: ${rol(semana).join(", ")}. A mediana é o valor do meio desse rol.`,
    },
    {
      tipo: "numero",
      titulo: "Mediana",
      texto: `Rol: ${rol(semana).join(", ")}`,
      pergunta: "Qual é a mediana das vendas da semana?",
      resposta: mediana(semana),
      tolerancia: 0,
      unidade: "copos",
      dica: "Com 7 valores (n ímpar), a mediana é o 4º valor do rol.",
      explica: `Posição = (n + 1) ÷ 2 = (7 + 1) ÷ 2 = 4ª posição → Md = ${mediana(semana)} copos.`,
    },
    {
      tipo: "numero",
      titulo: "E sem o dia da festa?",
      pergunta: "Calcule a média dos 6 dias SEM o domingo de festa.",
      resposta: arred(media(semanaComum)),
      tolerancia: 0.05,
      unidade: "copos/dia",
      dica: "Some de segunda a sábado e divida por 6.",
      explica: `(${semanaComum.join(" + ")}) ÷ 6 = ${soma(semanaComum)} ÷ 6 ≈ ${fmt(media(semanaComum))}. Um único dia atípico subiu a média de ${fmt(media(semanaComum))} para ${fmt(media(semana))}!`,
    },
    {
      tipo: "atipico",
      titulo: "O dia da festa",
      texto: "Imagine que o domingo foi um dia normal, com 62 copos. Agora arraste o controle e faça a festa acontecer!",
      pergunta: "O que acontece com a média e com a mediana?",
      valores: semana,
      rotulos: diasSemana,
      indice: 6,
      de: 62,
      ate: 182,
      min: 40,
      max: 190,
      explica: `A média saltou de ${fmt(media([...semanaComum, 62]))} para ${fmt(media(semana))}: ela é sensível a valores atípicos. A mediana continuou em ${mediana(semana)}, porque só depende da posição do meio no rol. Por isso dizemos que a mediana é uma medida resistente.`,
    },
    {
      tipo: "escolha",
      titulo: "Qual medida usar?",
      pergunta: "Para planejar um dia COMUM, qual medida da semana completa representa melhor as vendas?",
      opcoes: [`Média (${fmt(media(semana))})`, `Mediana (${mediana(semana)})`, "Maior valor (182)"],
      correta: 1,
      dica: "Qual medida é pouco afetada por um valor muito diferente dos outros?",
      explica: "A mediana é uma medida resistente: o domingo de festa quase não a altera. Já a média é sensível a valores atípicos e ficou acima de 6 dos 7 dias.",
    },
    {
      tipo: "escolha",
      titulo: "O tamanho preferido",
      texto: "Na mesma semana, os 520 copos foram vendidos assim:",
      tabela: {
        cabecalho: ["Tamanho", "Preço", "Copos vendidos"],
        linhas: NEGOCIO.tamanhos.map((t, i) => [t, `R$ ${NEGOCIO.precos[i]},00`, qtdTamanho[i]]),
      },
      pergunta: "Qual é a moda do tamanho do copo?",
      opcoes: NEGOCIO.tamanhos,
      correta: 1,
      dica: "Procure o tamanho com mais copos vendidos.",
      explica: "O copo de 500 ml foi o mais vendido (240 copos), então é a moda. Ele deve estar sempre em destaque no cardápio.",
    },
    {
      tipo: "numero",
      titulo: "Preço médio ponderado",
      pergunta: "Qual foi o preço médio de cada copo vendido? (use a média ponderada)",
      resposta: arred(precoMedio),
      tolerancia: 0.01,
      unidade: "R$",
      dica: "Multiplique cada preço pela quantidade vendida, some tudo e divida pelo total de copos (520).",
      explica: `x̄p = (12·210 + 18·240 + 24·70) ÷ 520 = 8.520 ÷ 520 ≈ R$ ${fmt(precoMedio)}. A média simples dos preços (R$ 18) estaria errada, porque cada tamanho vendeu uma quantidade diferente.`,
    },
    {
      tipo: "simulacao",
      titulo: "Decisão: quanto preparar?",
      texto: "O açaí batido que sobra no fim do dia precisa ser descartado. Se faltar, o cliente vai embora.",
      pergunta: "Quantos copos seu Jorge deve preparar por dia na próxima semana (sem festa)?",
      dias: 6,
      produtos: [
        {
          nome: "Açaí (copo médio)",
          preco: arred(precoMedio),
          custo: arred(custoMedio),
          mu: media(semanaComum),
          sigma: desvioPadrao(semanaComum, TIPO_VARIANCIA),
          estrategias: [
            { nome: "Pela média com festa", producao: Math.round(media(semana)) },
            { nome: "Pela mediana", producao: mediana(semana) },
          ],
        },
      ],
      explica: "Quem planeja pela média com o dia da festa prepara copos demais e joga dinheiro fora. A mediana (ou a média sem o valor atípico) representa melhor um dia comum.",
    },
  ],
};

// ---------------------------------------------------------------- Fase 5
const tradicional = [40, 42, 38, 41, 39, 40];
const morango = [20, 65, 30, 55, 25, 45];
const dpTrad = desvioPadrao(tradicional, TIPO_VARIANCIA);
const dpMor = desvioPadrao(morango, TIPO_VARIANCIA);
const desviosMor = morango.map((x) => x - media(morango));

const fase5: Fase = {
  id: "planejando-sem-desperdicio",
  numero: 5,
  titulo: "Planejando sem desperdício",
  resumo: "Dois sabores com a mesma média de vendas… mas será que dá para confiar igual nos dois?",
  conteudos: ["Amplitude", "Desvio médio", "Variância", "Desvio padrão"],
  aprendizado: "A média diz \"quanto\"; o desvio padrão diz \"o quanto posso confiar\" nela.",
  etapas: [
    {
      tipo: "info",
      titulo: "Tradicional × Morango",
      texto: "Seu Jorge vende açaí tradicional e açaí com morango fresco. O morango estraga rápido: o que sobra vai para o lixo. Veja as vendas de 6 dias:",
      tabela: {
        cabecalho: ["Dia", "1", "2", "3", "4", "5", "6"],
        linhas: [
          ["Tradicional", ...tradicional],
          ["Com morango", ...morango],
        ],
      },
      grafico: {
        tipo: "linhas",
        eixoX: "dia",
        dados: tradicional.map((t, i) => ({ dia: `Dia ${i + 1}`, trad: t, mor: morango[i] })),
        series: [
          { chave: "trad", nome: "Tradicional", cor: COR.acai },
          { chave: "mor", nome: "Com morango", cor: COR.laranja },
        ],
      },
    },
    {
      tipo: "numero",
      titulo: "As médias",
      pergunta: "Calcule a média de vendas do açaí COM MORANGO.",
      resposta: media(morango),
      tolerancia: 0,
      unidade: "porções/dia",
      dica: "Some os 6 dias e divida por 6.",
      explica: `(${morango.join(" + ")}) ÷ 6 = ${soma(morango)} ÷ 6 = ${media(morango)}. O tradicional também tem média ${media(tradicional)}! Pela média, os dois parecem iguais.`,
    },
    {
      tipo: "numero",
      titulo: "Amplitude",
      pergunta: "Qual é a amplitude das vendas do açaí com morango?",
      resposta: amplitude(morango),
      tolerancia: 0,
      dica: "Maior valor − menor valor.",
      explica: `${Math.max(...morango)} − ${Math.min(...morango)} = ${amplitude(morango)}. No tradicional a amplitude é só ${amplitude(tradicional)}.`,
    },
    {
      tipo: "numero",
      titulo: "Desvio médio",
      tabela: {
        cabecalho: ["Dia", "1", "2", "3", "4", "5", "6"],
        linhas: [
          ["Vendas (x)", ...morango],
          ["x − x̄", ...desviosMor],
        ],
      },
      texto: "A tabela mostra quanto cada dia ficou longe da média (40).",
      pergunta: "Qual é o desvio médio do açaí com morango?",
      resposta: desvioMedio(morango),
      tolerancia: 0.01,
      dica: "DM = soma dos desvios em módulo (sem sinal) ÷ n.",
      explica: `DM = (${desviosMor.map((d) => Math.abs(d)).join(" + ")}) ÷ 6 = ${soma(desviosMor.map((d) => Math.abs(d)))} ÷ 6 = ${desvioMedio(morango)}. No tradicional, DM = ${desvioMedio(tradicional)}.`,
    },
    {
      tipo: "numero",
      titulo: "Variância",
      pergunta: `Calcule a variância do açaí com morango (dividindo por ${divisor}).`,
      resposta: arred(variancia(morango, TIPO_VARIANCIA)),
      tolerancia: 0.05,
      dica: `Eleve cada desvio (x − x̄) ao quadrado, some e divida por ${divisor}.`,
      explica: `Desvios ao quadrado: ${desviosMor.map((d) => d ** 2).join(" + ")} = ${soma(desviosMor.map((d) => d ** 2))}. Dividindo por ${divisor}: ${fmt(variancia(morango, TIPO_VARIANCIA))}.`,
    },
    {
      tipo: "numero",
      titulo: "Desvio padrão",
      pergunta: "Agora o desvio padrão do açaí com morango.",
      resposta: arred(dpMor),
      tolerancia: 0.05,
      dica: "O desvio padrão é a raiz quadrada da variância.",
      explica: `s = √${fmt(variancia(morango, TIPO_VARIANCIA))} ≈ ${fmt(dpMor)}. Ele volta para a mesma unidade dos dados (porções). No tradicional, s ≈ ${fmt(dpTrad)}.`,
    },
    {
      tipo: "escolha",
      titulo: "Qual é mais previsível?",
      tabela: {
        cabecalho: ["Medida", "Tradicional", "Com morango"],
        linhas: [
          ["Média", media(tradicional), media(morango)],
          ["Amplitude", amplitude(tradicional), amplitude(morango)],
          ["Desvio médio", desvioMedio(tradicional), desvioMedio(morango)],
          ["Desvio padrão", fmt(dpTrad), fmt(dpMor)],
        ],
      },
      pergunta: "Qual dos dois sabores tem vendas mais previsíveis?",
      opcoes: ["Tradicional", "Com morango", "São iguais, pois têm a mesma média"],
      correta: 0,
      dica: "Quanto menor a dispersão, mais os dados ficam perto da média.",
      explica: "O tradicional tem desvio padrão bem menor: as vendas ficam quase sempre perto de 40. O morango varia muito, então é mais arriscado planejar só pela média.",
    },
    {
      tipo: "simulacao",
      titulo: "Decisão: a produção da semana",
      texto: "Defina quantas porções preparar por dia de cada sabor. O jogo vai sortear as vendas de 6 dias seguindo a média e o desvio padrão de cada um.",
      pergunta: "Quantas porções preparar por dia?",
      dias: 6,
      produtos: [
        {
          nome: "Tradicional",
          preco: 18,
          custo: 7,
          mu: media(tradicional),
          sigma: dpTrad,
          estrategias: [{ nome: "Pela média", producao: media(tradicional) }],
        },
        {
          nome: "Com morango",
          preco: 20,
          custo: 9,
          mu: media(morango),
          sigma: dpMor,
          estrategias: [
            { nome: "Pela média", producao: media(morango) },
            { nome: "Média + 1 desvio padrão", producao: Math.round(media(morango) + dpMor) },
          ],
        },
      ],
      explica: "No tradicional, preparar pela média quase não gera sobra nem falta, porque a dispersão é pequena. No morango, qualquer escolha tem risco: com desvio padrão alto, sempre sobra ou falta. Produzir acima da média só compensa quando o lucro de cada venda é bem maior que o prejuízo de cada sobra.",
    },
  ],
};

// ---------------------------------------------------------------- Fase 1
const TIPOS = ["Qualitativa nominal", "Qualitativa ordinal", "Quantitativa discreta", "Quantitativa contínua"];

const fase1: Fase = {
  id: "conhecendo-o-negocio",
  numero: 1,
  titulo: "Conhecendo o negócio",
  resumo: "Antes de calcular, é preciso saber que tipo de informação seu Jorge está anotando.",
  conteudos: ["População e amostra", "Variáveis qualitativas", "Variáveis quantitativas"],
  aprendizado: "O tipo da variável define qual tabela, gráfico e medida fazem sentido.",
  etapas: [
    {
      tipo: "info",
      titulo: "Bem-vindo ao Açaí do Bairro!",
      texto:
        "Seu Jorge tem uma açaiteria num bairro de Salvador. Ele quer conhecer melhor os clientes e começou a anotar várias informações num caderno. Antes de fazer qualquer conta, vamos entender que tipo de dado é cada informação.",
      tabela: {
        cabecalho: ["Tipo de variável", "O que é", "Exemplo"],
        linhas: [
          ["Qualitativa nominal", "Categorias sem ordem", "Sabor, bairro"],
          ["Qualitativa ordinal", "Categorias com ordem natural", "Tamanho P/M/G, satisfação"],
          ["Quantitativa discreta", "Números de contagem (inteiros)", "Nº de copos vendidos"],
          ["Quantitativa contínua", "Números de medida", "Peso, tempo, temperatura"],
        ],
      },
    },
    {
      tipo: "escolha",
      titulo: "População e amostra",
      texto: "Num mês, o Açaí do Bairro atende cerca de 1.500 clientes. Seu Jorge entrevistou 40 deles.",
      pergunta: "Os 40 clientes entrevistados são…",
      opcoes: ["A população", "A amostra", "Uma variável"],
      correta: 1,
      dica: "A população é o grupo inteiro que se quer estudar. Uma parte dela é…",
      explica:
        "Os 1.500 clientes do mês são a população. Os 40 entrevistados são uma amostra: uma parte da população, usada para tirar conclusões sobre o todo sem precisar entrevistar todo mundo.",
    },
    {
      tipo: "balcao",
      titulo: "Balcão de pedidos: aquecimento",
      fala: "Chegaram as fichas do caderno! Coloca cada uma no pote certo. Acertos seguidos dão combo! 🔥",
      pergunta: "Qualitativa ou quantitativa?",
      potes: [
        { nome: "Qualitativa", emoji: "🏷️" },
        { nome: "Quantitativa", emoji: "🔢" },
      ],
      itens: [
        { texto: "Complemento preferido", pote: 0, porque: "A resposta é um nome (granola, banana…), não um número." },
        { texto: "Nº de copos vendidos no dia", pote: 1, porque: "A resposta é um número de contagem." },
        { texto: "Bairro onde o cliente mora", pote: 0, porque: "A resposta é um nome de lugar, uma categoria." },
        { texto: "Tempo de espera na fila (min)", pote: 1, porque: "A resposta é um número medido no relógio." },
        { texto: "Forma de pagamento", pote: 0, porque: "Pix, dinheiro ou cartão são categorias." },
        { texto: "Valor gasto pelo cliente (R$)", pote: 1, porque: "A resposta é um valor em reais: um número." },
      ],
      explica:
        "Complemento, bairro e forma de pagamento são categorias: qualitativas. Copos vendidos, tempo de espera e valor gasto são números: quantitativas.",
    },
    {
      tipo: "balcao",
      titulo: "Balcão de pedidos: modo profissional",
      fala: "Agora são 4 potes! Pensa: tem ordem? É contagem ou medida?",
      pergunta: "Qual é o tipo de cada variável?",
      potes: [
        { nome: TIPOS[0], emoji: "🏷️" },
        { nome: TIPOS[1], emoji: "📶" },
        { nome: TIPOS[2], emoji: "🧮" },
        { nome: TIPOS[3], emoji: "⚖️" },
      ],
      itens: [
        { texto: "Complemento preferido", pote: 0, porque: "É uma categoria sem ordem: granola não é \"maior\" que banana." },
        { texto: "Tamanho do copo (300/500/700 ml)", pote: 1, porque: "É uma categoria com ordem natural: pequeno → médio → grande." },
        { texto: "Nº de clientes por hora", pote: 2, porque: "Vem de uma contagem: só números inteiros." },
        { texto: "Peso do açaí no copo (g)", pote: 3, porque: "Vem de uma medição na balança e pode ter casas decimais." },
        { texto: "Satisfação (ruim → ótima)", pote: 1, porque: "É uma categoria com ordem: ruim < regular < boa < ótima." },
        { texto: "Bairro onde o cliente mora", pote: 0, porque: "É uma categoria sem ordem natural." },
        { texto: "Tempo de espera na fila (min)", pote: 3, porque: "Vem de uma medição no relógio: pode ser 4,5 minutos." },
        { texto: "Nº de copos vendidos no dia", pote: 2, porque: "Vem de uma contagem: ninguém vende 52,5 copos." },
      ],
      explica:
        "Nominal: complemento e bairro (não há ordem). Ordinal: tamanho do copo e satisfação (há ordem). Discreta: clientes por hora e copos por dia (contagem, só inteiros). Contínua: peso e tempo (medidas, podem ter casas decimais).",
    },
    {
      tipo: "escolha",
      titulo: "Contar ou medir?",
      pergunta: "Seu Jorge pesou um copo e deu 487,5 g. Por que o peso é uma variável CONTÍNUA?",
      opcoes: [
        "Porque é um número grande",
        "Porque vem de uma medição e pode ter qualquer valor num intervalo",
        "Porque cada copo tem um peso diferente",
      ],
      correta: 1,
      dica: "Pense na diferença entre contar (1, 2, 3…) e medir com uma balança.",
      explica:
        "Variáveis contínuas vêm de medições (peso, tempo, altura) e podem assumir qualquer valor num intervalo, inclusive com casas decimais. Já as discretas vêm de contagens e só assumem valores inteiros: ninguém vende 52,5 copos.",
    },
    {
      tipo: "escolha",
      titulo: "Qual medida usar?",
      pergunta: "Para resumir o COMPLEMENTO PREFERIDO dos clientes (qualitativa nominal), qual medida faz sentido?",
      opcoes: ["Média", "Mediana", "Moda"],
      correta: 2,
      dica: "Dá para somar \"granola + banana\"? Dá para colocar sabores em ordem?",
      explica:
        "Não dá para calcular a média de sabores nem colocá-los em ordem para achar a mediana. Para variáveis nominais, a medida certa é a moda: a categoria mais frequente. Para variáveis quantitativas, como copos vendidos, podemos usar média, mediana e moda.",
    },
    {
      tipo: "escolha",
      titulo: "Decisão: o questionário",
      texto: "Seu Jorge quer descobrir em qual horário deve chamar um ajudante.",
      pergunta: "Qual pergunta ele deve incluir no questionário dos clientes?",
      opcoes: [
        "Você gosta de açaí?",
        "Em qual horário você costuma vir à açaiteria?",
        "Qual é a sua cor favorita?",
      ],
      correta: 1,
      dica: "A pergunta precisa gerar dados que ajudem a responder o problema do horário.",
      explica:
        "Uma boa pesquisa começa com um problema claro. Perguntar o horário de visita gera dados que, organizados numa tabela de frequência, mostram os horários de pico. As outras perguntas não ajudam a decidir.",
    },
  ],
};

// ---------------------------------------------------------------- Fase 4
const li4 = [30, 40, 50, 60, 70, 80];
const h4 = 10;
const fi4 = [4, 8, 12, 9, 5, 2];
const Fi4 = acumulada(fi4);
const n4 = soma(fi4);
const classes4 = li4.map((l) => `${l} ⊢ ${l + h4}`);
const sep = (pos: number) => separatrizAgrupada(li4, fi4, h4, pos);
const classeDe = (pos: number) => Fi4.findIndex((F) => F >= pos);
const passoSep = (nome: string, pos: number) => {
  const i = classeDe(pos);
  const Fant = i > 0 ? Fi4[i - 1] : 0;
  return `${nome}: posição = ${fmt(pos)} → classe ${classes4[i]} (Fant = ${Fant}, f = ${fi4[i]}). ${nome} = ${li4[i]} + [(${fmt(pos)} − ${Fant}) ÷ ${fi4[i]}] · ${h4} ≈ ${fmt(sep(pos))}.`;
};
const Q1 = sep(n4 / 4);
const Q3 = sep((3 * n4) / 4);
const mediasDia = [
  { dia: "Segunda", v: 42 },
  { dia: "Terça", v: 45 },
  { dia: "Quarta", v: 50 },
  { dia: "Quinta", v: 55 },
  { dia: "Sexta", v: 68 },
  { dia: "Sábado", v: 75 },
  { dia: "Domingo", v: 62 },
];
const faixa = (v: number) => (v < Q1 ? 0 : v > Q3 ? 2 : 1);
/** Rol dos 40 dias (coerente com a tabela de classes acima — conferido nos testes). */
export const ROL_40_DIAS = [
  33, 35, 37, 39, 41, 42, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 55, 56,
  57, 58, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 69, 71, 72, 74, 76, 78, 82, 86,
];
export const CLASSES_40_DIAS = { li: li4, h: h4, fi: fi4 };
const tabela4 = {
  cabecalho: ["Copos/dia", "fi", "Fi"],
  linhas: classes4.map((c, i) => [c, fi4[i], Fi4[i]]),
};

const fase4: Fase = {
  id: "dias-fortes-e-fracos",
  numero: 4,
  titulo: "Dias fortes e dias fracos",
  resumo: "Divida as vendas em faixas para saber quando fazer promoção e quando chamar reforço.",
  conteudos: ["Quartis", "Decis", "Percentis", "Dados agrupados em classes"],
  aprendizado: "Separatrizes dividem as vendas em faixas úteis para planejar o negócio.",
  etapas: [
    {
      tipo: "info",
      titulo: "Dois meses de vendas",
      texto:
        "Seu Jorge juntou as vendas de 40 dias numa tabela com classes. Agora ele quer saber: o que é um dia fraco? E um dia forte? As separatrizes (quartis, decis e percentis) dividem os dados ordenados em partes iguais e ajudam a responder isso.",
      tabela: { cabecalho: ["Copos/dia", "Nº de dias (fi)"], linhas: classes4.map((c, i) => [c, fi4[i]]) },
      grafico: {
        tipo: "barras",
        eixoX: "classe",
        dados: classes4.map((c, i) => ({ classe: c, dias: fi4[i] })),
        series: [{ chave: "dias", nome: "Dias", cor: COR.acai }],
      },
    },
    {
      tipo: "bandeirinhas",
      titulo: "Bandeirinhas no calendário",
      texto: "Aqui estão os 40 dias em rol (do dia mais fraco para o mais forte).",
      pergunta: "Coloque 3 bandeirinhas para dividir os 40 dias em 4 grupos IGUAIS.",
      valores: ROL_40_DIAS,
      partes: 4,
      explica: `Com 40 dias, cada grupo tem 10. As bandeirinhas ficam depois do 10º, do 20º e do 30º dia. Elas são os quartis! Q1 fica entre o 10º e o 11º dia (${ROL_40_DIAS[9]} e ${ROL_40_DIAS[10]}). Q2, a mediana, fica entre o 20º e o 21º (${ROL_40_DIAS[19]} e ${ROL_40_DIAS[20]}). Q3 fica entre o 30º e o 31º (${ROL_40_DIAS[29]} e ${ROL_40_DIAS[30]}). Quando os dados estão agrupados em classes, usamos uma fórmula para estimar esses valores. É o que vamos fazer agora.`,
    },
    {
      tipo: "tabela",
      titulo: "Frequência acumulada",
      pergunta: "Para achar os quartis, primeiro complete a frequência acumulada (Fi).",
      rotulo: "Copos/dia",
      linhas: classes4,
      colunas: [
        { nome: "fi", valores: fi4, editavel: false },
        { nome: "Fi", valores: Fi4, editavel: true, casas: 0 },
      ],
      tolerancia: 0,
      dica: "Fi = fi da classe + Fi da classe anterior. A última deve dar 40.",
      explica: `Fi = ${Fi4.join(", ")}. A Fi mostra quantos dias ficaram até o fim de cada classe.`,
    },
    {
      tipo: "info",
      titulo: "Como calcular um quartil",
      texto: `Os quartis dividem os dados em 4 partes iguais: Q1 deixa 25% dos dias abaixo dele, Q2 (a mediana) deixa 50% e Q3 deixa 75%. Para dados em classes: 1) calcule a posição: k·n/4; 2) ache a classe em que a Fi alcança essa posição; 3) aplique Qk = linf + [(posição − Fant) ÷ f] · h, onde linf é o limite inferior da classe, Fant é a Fi da classe anterior, f é a fi da classe e h = ${h4}.`,
      tabela: tabela4,
    },
    {
      tipo: "numero",
      titulo: "Posição do 1º quartil",
      tabela: tabela4,
      pergunta: "Qual é a posição do 1º quartil (Q1)?",
      resposta: n4 / 4,
      tolerancia: 0,
      dica: "Posição de Q1 = 1 · n ÷ 4, com n = 40.",
      explica: `Posição = 1 · 40 ÷ 4 = ${n4 / 4}. A Fi alcança 10 na classe ${classes4[classeDe(n4 / 4)]} (Fi = ${Fi4[classeDe(n4 / 4)]}), então essa é a classe do Q1.`,
    },
    {
      tipo: "numero",
      titulo: "1º quartil (Q1)",
      tabela: tabela4,
      pergunta: "Calcule o valor de Q1.",
      resposta: arred(Q1),
      tolerancia: 0.05,
      unidade: "copos",
      dica: `Classe 40 ⊢ 50: linf = 40, Fant = 4, f = 8, h = 10.`,
      explica: `${passoSep("Q1", n4 / 4)} Em 25% dos dias, seu Jorge vendeu menos de ${fmt(Q1)} copos.`,
    },
    {
      tipo: "numero",
      titulo: "2º quartil (a mediana)",
      tabela: tabela4,
      pergunta: "Calcule Q2 (que é igual à mediana).",
      resposta: arred(sep(n4 / 2)),
      tolerancia: 0.05,
      unidade: "copos",
      dica: "Posição = 2 · 40 ÷ 4 = 20. Procure a classe em que a Fi alcança 20.",
      explica: `${passoSep("Q2", n4 / 2)} Metade dos dias ficou abaixo desse valor e metade acima.`,
    },
    {
      tipo: "numero",
      titulo: "3º quartil (Q3)",
      tabela: tabela4,
      pergunta: "Calcule Q3.",
      resposta: arred(Q3),
      tolerancia: 0.05,
      unidade: "copos",
      dica: "Posição = 3 · 40 ÷ 4 = 30.",
      explica: `${passoSep("Q3", (3 * n4) / 4)} Só 25% dos dias passaram de ${fmt(Q3)} copos.`,
    },
    {
      tipo: "numero",
      titulo: "Percentil 90",
      tabela: tabela4,
      texto: "Os percentis dividem os dados em 100 partes. O P90 deixa 90% dos dias abaixo dele.",
      pergunta: "Calcule o P90. (posição = 90 · n ÷ 100)",
      resposta: arred(sep((90 * n4) / 100)),
      tolerancia: 0.05,
      unidade: "copos",
      dica: "Posição = 90 · 40 ÷ 100 = 36.",
      explica: `${passoSep("P90", (90 * n4) / 100)} Se seu Jorge preparar ${fmt(sep(36))} copos, atende toda a demanda em 90% dos dias.`,
    },
    {
      tipo: "numero",
      titulo: "1º decil",
      tabela: tabela4,
      texto: "Os decis dividem os dados em 10 partes. O D1 deixa 10% dos dias abaixo dele.",
      pergunta: "Calcule o D1. (posição = 1 · n ÷ 10)",
      resposta: arred(sep(n4 / 10)),
      tolerancia: 0.05,
      unidade: "copos",
      dica: "Posição = 1 · 40 ÷ 10 = 4. A Fi alcança 4 já na primeira classe (Fant = 0).",
      explica: `${passoSep("D1", n4 / 10)} Nos 10% piores dias, as vendas não passaram de ${fmt(sep(4))} copos.`,
    },
    {
      tipo: "classificar",
      titulo: "Classificando os dias da semana",
      texto: `Média de vendas de cada dia da semana. Use os quartis: abaixo de Q1 (${fmt(Q1)}) é dia fraco; acima de Q3 (${fmt(Q3)}) é dia forte; entre os dois é dia normal.`,
      pergunta: "Classifique cada dia da semana.",
      categorias: ["Fraco", "Normal", "Forte"],
      itens: mediasDia.map((d) => ({ texto: `${d.dia}: ${d.v} copos`, categoria: faixa(d.v) })),
      dica: `Compare cada valor com Q1 = ${fmt(Q1)} e Q3 = ${fmt(Q3)}.`,
      explica: `Fracos: ${mediasDia.filter((d) => faixa(d.v) === 0).map((d) => d.dia).join(" e ")}. Fortes: ${mediasDia.filter((d) => faixa(d.v) === 2).map((d) => d.dia).join(" e ")}. Os outros são normais.`,
    },
    {
      tipo: "escolha",
      titulo: "Decisão: promoção e reforço",
      pergunta: "Qual é o melhor plano para a próxima semana?",
      opcoes: [
        "Promoção na sexta e no sábado; ajudante na segunda e na terça",
        "Promoção na segunda e na terça; ajudante na sexta e no sábado",
        "Promoção e ajudante todos os dias",
      ],
      correta: 1,
      dica: "Promoção serve para atrair clientes quando o movimento é fraco. O ajudante é necessário quando o movimento é forte.",
      explica:
        "Nos dias fracos (abaixo de Q1), a promoção atrai clientes. Nos dias fortes (acima de Q3), o ajudante evita fila e perda de vendas. Fazer as duas coisas todos os dias custaria caro sem necessidade.",
    },
  ],
};

export const FASES: Fase[] = [fase1, fase2, fase3, fase4, fase5];

export const FASES_PLANEJADAS = [
  { numero: 6, titulo: "Desafio do Empreendedor", conteudos: ["Revisão geral", "Doceria da Dona Cida"] },
];

export const buscarFase = (id: string) => FASES.find((f) => f.id === id);
