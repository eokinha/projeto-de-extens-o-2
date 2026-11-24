import { describe, expect, it } from "vitest";
import {
  acumulada,
  amplitude,
  desvioMedio,
  desvioPadrao,
  frequenciaClasses,
  media,
  mediana,
  mediaPonderada,
  moda,
  percentual,
  separatrizAgrupada,
  sturges,
  variancia,
} from "./stats";

// Valores conferidos no documento "PLANEJAMENTO - Fases do Jogo.md".
const dias30 = [52, 61, 47, 58, 73, 66, 49, 55, 62, 70, 44, 59, 63, 57, 68, 75, 51, 60, 54, 65, 48, 71, 56, 62, 59, 67, 53, 64, 46, 78];
const semana = [48, 52, 50, 55, 63, 70, 182];

describe("Fase 2 — frequências", () => {
  it("percentual dos complementos", () => {
    expect(percentual([12, 9, 7, 6, 4, 2])).toEqual([30, 22.5, 17.5, 15, 10, 5]);
  });
  it("amplitude, Sturges e classes", () => {
    expect(amplitude(dias30)).toBe(34);
    expect(sturges(30)).toBeCloseTo(5.87, 2);
    const fi = frequenciaClasses(dias30, 44, 6, 6);
    expect(fi).toEqual([5, 5, 7, 7, 4, 2]);
    expect(acumulada(fi)).toEqual([5, 10, 17, 24, 28, 30]);
  });
});

describe("Fase 3 — tendência central", () => {
  it("média, mediana e efeito do valor atípico", () => {
    expect(media(semana)).toBeCloseTo(74.29, 2);
    expect(mediana(semana)).toBe(55);
    expect(media(semana.slice(0, 6))).toBeCloseTo(56.33, 2);
    expect(mediana([23, 34, 48, 51, 51, 76])).toBe(49.5); // exemplo dos slides (n par)
  });
  it("média ponderada do preço", () => {
    expect(mediaPonderada([12, 18, 24], [210, 240, 70])).toBeCloseTo(16.38, 2);
  });
  it("moda", () => {
    expect(moda([1, 2, 2, 3])).toEqual([2]);
    expect(moda([1, 2, 3])).toEqual([]);
  });
});

describe("Fase 4 — separatrizes (dados agrupados)", () => {
  const li = [30, 40, 50, 60, 70, 80];
  const fi = [4, 8, 12, 9, 5, 2];
  it("o rol dos 40 dias é coerente com a tabela de classes", async () => {
    const { ROL_40_DIAS, CLASSES_40_DIAS } = await import("../data/fases");
    expect(ROL_40_DIAS).toHaveLength(40);
    expect(ROL_40_DIAS).toEqual([...ROL_40_DIAS].sort((a, b) => a - b));
    expect(frequenciaClasses(ROL_40_DIAS, 30, 10, 6)).toEqual(CLASSES_40_DIAS.fi);
  });
  it("quartis e P90", () => {
    expect(separatrizAgrupada(li, fi, 10, 10)).toBeCloseTo(47.5, 2);
    expect(separatrizAgrupada(li, fi, 10, 20)).toBeCloseTo(56.67, 2);
    expect(separatrizAgrupada(li, fi, 10, 30)).toBeCloseTo(66.67, 2);
    expect(separatrizAgrupada(li, fi, 10, 36)).toBeCloseTo(76, 2);
  });
});

describe("Fase 5 — dispersão", () => {
  const trad = [40, 42, 38, 41, 39, 40];
  const morango = [20, 65, 30, 55, 25, 45];
  it("desvio médio, variância e desvio padrão", () => {
    expect(desvioMedio(trad)).toBe(1);
    expect(desvioMedio(morango)).toBe(15);
    expect(variancia(morango, "populacional")).toBeCloseTo(266.67, 2);
    expect(variancia(morango, "amostral")).toBeCloseTo(320, 2);
    expect(desvioPadrao(trad, "populacional")).toBeCloseTo(1.29, 2);
    expect(desvioPadrao(morango, "populacional")).toBeCloseTo(16.33, 2);
    expect(desvioPadrao(morango, "amostral")).toBeCloseTo(17.89, 2);
  });
});
