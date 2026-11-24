// Simulação da demanda dos próximos dias (distribuição normal com média e desvio padrão).

/** Gerador pseudoaleatório com semente (mulberry32). */
export function criarRng(semente: number) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Amostra de uma normal (Box–Muller). */
function normal(rng: () => number, mu: number, sigma: number) {
  const u = 1 - rng();
  const v = rng();
  return mu + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function sortearDemandas(dias: number, mu: number, sigma: number, semente: number) {
  const rng = criarRng(semente);
  return Array.from({ length: dias }, () => Math.max(0, Math.round(normal(rng, mu, sigma))));
}

export type ResultadoDia = {
  demanda: number;
  vendidos: number;
  sobras: number;
  perdidas: number;
  lucro: number;
};

/** Lucro = receita das vendas − custo de tudo o que foi produzido. */
export function resultadoDia(producao: number, demanda: number, preco: number, custo: number): ResultadoDia {
  const vendidos = Math.min(producao, demanda);
  return {
    demanda,
    vendidos,
    sobras: Math.max(0, producao - demanda),
    perdidas: Math.max(0, demanda - producao),
    lucro: vendidos * preco - producao * custo,
  };
}

export function simularPeriodo(producao: number, demandas: number[], preco: number, custo: number) {
  const dias = demandas.map((d) => resultadoDia(producao, d, preco, custo));
  const total = (k: keyof ResultadoDia) => dias.reduce((a, d) => a + d[k], 0);
  return {
    dias,
    lucro: total("lucro"),
    sobras: total("sobras"),
    perdidas: total("perdidas"),
    vendidos: total("vendidos"),
  };
}
