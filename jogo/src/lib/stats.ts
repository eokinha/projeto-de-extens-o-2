// Funções estatísticas usadas pelo jogo (conteúdo das aulas de Estatística Descritiva).

export type TipoVariancia = "populacional" | "amostral";

export const soma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export const media = (xs: number[]) => soma(xs) / xs.length;

export const mediaPonderada = (valores: number[], pesos: number[]) =>
  soma(valores.map((v, i) => v * pesos[i])) / soma(pesos);

/** Rol: dados em ordem crescente. */
export const rol = (xs: number[]) => [...xs].sort((a, b) => a - b);

export function mediana(xs: number[]) {
  const s = rol(xs);
  const n = s.length;
  const m = Math.floor(n / 2);
  return n % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Retorna todos os valores modais (vazio se a série for amodal). */
export function moda<T>(xs: T[]): T[] {
  const cont = new Map<T, number>();
  xs.forEach((x) => cont.set(x, (cont.get(x) ?? 0) + 1));
  const max = Math.max(...cont.values());
  if (max === 1 && xs.length > 1) return [];
  return [...cont.entries()].filter(([, c]) => c === max).map(([v]) => v);
}

/** Moda a partir de uma tabela de frequências (categoria → fi). */
export const modaTabela = (categorias: string[], fi: number[]) =>
  categorias.filter((_, i) => fi[i] === Math.max(...fi));

export const amplitude = (xs: number[]) => Math.max(...xs) - Math.min(...xs);

/** Fórmula de Sturges: k = 1 + 3,3·log n */
export const sturges = (n: number) => 1 + 3.3 * Math.log10(n);

export const acumulada = (fi: number[]) =>
  fi.map((_, i) => soma(fi.slice(0, i + 1)));

export const relativa = (fi: number[]) => fi.map((f) => f / soma(fi));

export const percentual = (fi: number[]) => relativa(fi).map((f) => f * 100);

/** Conta as frequências por classe no formato [li ⊢ ls). */
export function frequenciaClasses(xs: number[], inicio: number, h: number, k: number) {
  return Array.from({ length: k }, (_, i) => {
    const li = inicio + i * h;
    return xs.filter((x) => x >= li && x < li + h).length;
  });
}

export const desvioMedio = (xs: number[]) => {
  const m = media(xs);
  return media(xs.map((x) => Math.abs(x - m)));
};

export function variancia(xs: number[], tipo: TipoVariancia) {
  const m = media(xs);
  const sq = soma(xs.map((x) => (x - m) ** 2));
  return sq / (tipo === "amostral" ? xs.length - 1 : xs.length);
}

export const desvioPadrao = (xs: number[], tipo: TipoVariancia) =>
  Math.sqrt(variancia(xs, tipo));

/** Separatriz para dados agrupados: linf + ((pos − Fant) / f) · h */
export function separatrizAgrupada(
  limitesInferiores: number[],
  fi: number[],
  h: number,
  posicao: number,
) {
  const Fi = acumulada(fi);
  const i = Fi.findIndex((F) => F >= posicao);
  const Fant = i > 0 ? Fi[i - 1] : 0;
  return limitesInferiores[i] + ((posicao - Fant) / fi[i]) * h;
}

export const arred = (x: number, casas = 2) => {
  const f = 10 ** casas;
  return Math.round(x * f) / f;
};

/** Formata número no padrão brasileiro (vírgula decimal). */
export const fmt = (x: number, casas = 2) =>
  x.toLocaleString("pt-BR", { maximumFractionDigits: casas });

export const reais = (x: number) =>
  x.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
