"use client";
// Progresso salvo no navegador (sem banco de dados).
import { useMemo, useSyncExternalStore } from "react";

export type ProgressoFase = { estrelas: number; pontos: number; maximo: number; moedas?: number };
type Progresso = Record<string, ProgressoFase>;

const CHAVE = "meu-negocio-em-numeros:progresso";
const EVENTO = "progresso-atualizado";

function ler(): string {
  try {
    return localStorage.getItem(CHAVE) ?? "{}";
  } catch {
    return "{}";
  }
}

function assinar(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENTO, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENTO, cb);
  };
}

export function useProgresso(): Progresso {
  const bruto = useSyncExternalStore(assinar, ler, () => "{}");
  return useMemo(() => {
    try {
      return JSON.parse(bruto) as Progresso;
    } catch {
      return {};
    }
  }, [bruto]);
}

export function salvarFase(id: string, dados: ProgressoFase) {
  try {
    const atual = JSON.parse(ler()) as Progresso;
    const anterior = atual[id];
    if (!anterior || dados.pontos >= anterior.pontos) atual[id] = dados;
    localStorage.setItem(CHAVE, JSON.stringify(atual));
    window.dispatchEvent(new Event(EVENTO));
  } catch {
    /* navegador sem armazenamento: o jogo continua funcionando */
  }
}

export function apagarProgresso() {
  try {
    localStorage.removeItem(CHAVE);
    window.dispatchEvent(new Event(EVENTO));
  } catch {}
}

export const calcularEstrelas = (pontos: number, maximo: number) => {
  const p = maximo ? pontos / maximo : 0;
  return p >= 0.85 ? 3 : p >= 0.6 ? 2 : 1;
};
