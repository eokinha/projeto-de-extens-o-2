export type Grafico = {
  tipo: "barras" | "linhas";
  dados: Record<string, string | number>[];
  eixoX: string;
  series: { chave: string; nome: string; cor: string }[];
};

export type TabelaSimples = {
  cabecalho: string[];
  linhas: (string | number)[][];
};

type Base = {
  titulo: string;
  texto?: string;
  tabela?: TabelaSimples;
  grafico?: Grafico;
  /** O que o seu Jorge fala no balão (se omitido, usa uma fala padrão do tipo). */
  fala?: string;
};

// ----- Mini-jogos -----

/** Fichas chegam no balcão e o jogador arrasta cada uma para o pote certo. */
export type EtapaBalcao = Base & {
  tipo: "balcao";
  pergunta: string;
  potes: { nome: string; emoji: string }[];
  itens: { texto: string; pote: number; porque: string }[];
  explica: string;
};

/** Clientes pedem complementos; o jogador empilha copos e constrói um gráfico de barras. */
export type EtapaEmpilhar = Base & {
  tipo: "empilhar";
  pergunta: string;
  categorias: string[];
  /** Pedidos que o jogador atende (índices em `categorias`). */
  pedidos: number[];
  /** Frequência final de cada categoria (o resto é preenchido automaticamente). */
  totais: number[];
  explica: string;
};

/** Gangorra: mover o apoio até equilibrar = encontrar a média. */
export type EtapaGangorra = Base & {
  tipo: "gangorra";
  pergunta: string;
  valores: number[];
  min: number;
  max: number;
  explica: string;
};

/** Arrastar um valor para longe e ver média e mediana reagirem. */
export type EtapaAtipico = Base & {
  tipo: "atipico";
  pergunta: string;
  valores: number[];
  rotulos: string[];
  indice: number;
  de: number;
  ate: number;
  min: number;
  max: number;
  explica: string;
};

/** Colocar bandeirinhas que dividem o rol em partes iguais (quartis). */
export type EtapaBandeirinhas = Base & {
  tipo: "bandeirinhas";
  pergunta: string;
  /** Valores já em rol. */
  valores: number[];
  partes: number;
  explica: string;
};

export type EtapaInfo = Base & { tipo: "info" };

export type EtapaNumero = Base & {
  tipo: "numero";
  pergunta: string;
  resposta: number;
  tolerancia: number;
  unidade?: string;
  dica: string;
  explica: string;
};

export type EtapaEscolha = Base & {
  tipo: "escolha";
  pergunta: string;
  opcoes: string[];
  correta: number;
  dica: string;
  explica: string;
};

export type EtapaRol = Base & {
  tipo: "rol";
  pergunta: string;
  valores: number[];
  explica: string;
};

export type EtapaTabela = Base & {
  tipo: "tabela";
  pergunta: string;
  /** Primeira coluna (rótulos das linhas). */
  rotulo: string;
  linhas: string[];
  colunas: { nome: string; valores: number[]; editavel: boolean; casas?: number }[];
  tolerancia: number;
  dica: string;
  explica: string;
};

export type EtapaClassificar = Base & {
  tipo: "classificar";
  pergunta: string;
  categorias: string[];
  /** categoria = índice em `categorias`. */
  itens: { texto: string; categoria: number }[];
  dica: string;
  explica: string;
};

export type ProdutoSimulado = {
  nome: string;
  preco: number;
  custo: number;
  /** Parâmetros da demanda sorteada. */
  mu: number;
  sigma: number;
  /** Estratégias de referência mostradas na comparação. */
  estrategias: { nome: string; producao: number }[];
};

export type EtapaSimulacao = Base & {
  tipo: "simulacao";
  pergunta: string;
  dias: number;
  produtos: ProdutoSimulado[];
  explica: string;
};

export type Etapa =
  | EtapaInfo
  | EtapaNumero
  | EtapaEscolha
  | EtapaRol
  | EtapaTabela
  | EtapaClassificar
  | EtapaSimulacao
  | EtapaBalcao
  | EtapaEmpilhar
  | EtapaGangorra
  | EtapaAtipico
  | EtapaBandeirinhas;

export type Fase = {
  id: string;
  numero: number;
  titulo: string;
  resumo: string;
  conteudos: string[];
  aprendizado: string;
  etapas: Etapa[];
};
