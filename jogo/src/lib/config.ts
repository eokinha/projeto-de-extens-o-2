import type { TipoVariancia } from "./stats";

/**
 * Fórmula de variância/desvio padrão usada no jogo.
 * "populacional" divide por n; "amostral" divide por n − 1.
 * ⚠️ Confirmar com o professor qual fórmula ele usa em sala e ajustar aqui:
 * todas as respostas da Fase 5 são recalculadas automaticamente.
 */
export const TIPO_VARIANCIA: TipoVariancia = "populacional";
