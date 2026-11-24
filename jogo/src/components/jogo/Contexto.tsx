"use client";
// Estado lúdico da fase: moedas no caixa, combo de acertos e o humor/fala do seu Jorge.
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Humor = "neutro" | "feliz" | "triste" | "festa";

const FALAS_ACERTO = [
  "Boa! Mandou bem!",
  "Isso aí! Tá virando gerente!",
  "Perfeito! 🍇",
  "Show! Os números não mentem.",
  "Arrasou! Já pode abrir sua própria açaiteria.",
  "É isso! Tô aprendendo junto com você.",
];
const FALAS_ERRO = [
  "Hmm, acho que não é bem isso…",
  "Quase! Dá uma olhada na dica.",
  "Calma, vamos de novo. Errar faz parte!",
  "Opa, deixa eu conferir… não bateu.",
];
const sortear = (xs: string[]) => xs[Math.floor(Math.random() * xs.length)];

export async function soltarConfete(intenso = false) {
  const confetti = (await import("canvas-confetti")).default;
  const cores = ["#6b2a7b", "#a855f7", "#2f9e44", "#fcc419", "#e8590c"];
  if (intenso) {
    confetti({ particleCount: 140, spread: 100, origin: { y: 0.6 }, colors: cores });
    setTimeout(() => confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0 }, colors: cores }), 250);
    setTimeout(() => confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1 }, colors: cores }), 400);
  } else {
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 }, colors: cores, scalar: 0.9 });
  }
}

type Estado = {
  moedas: number;
  combo: number;
  humor: Humor;
  fala: string | null;
  ganho: { valor: number; id: number } | null;
};

type Api = Estado & {
  /** Registra um acerto/erro: atualiza combo, moedas, humor e fala. */
  reagir: (acertou: boolean, opcoes?: { pontos?: number; confete?: boolean; fala?: string }) => void;
  comemorar: (fala?: string) => void;
  /** Volta o seu Jorge ao normal (ao mudar de etapa). */
  limpar: () => void;
};

const Ctx = createContext<Api | null>(null);

export function JogoProvider({ children }: { children: ReactNode }) {
  const [e, setE] = useState<Estado>({ moedas: 0, combo: 0, humor: "neutro", fala: null, ganho: null });

  const reagir = useCallback<Api["reagir"]>((acertou, op = {}) => {
    if (acertou) {
      setE((s) => {
        const combo = s.combo + 1;
        const bonus = combo >= 3 ? (combo - 2) * 2 : 0;
        const valor = (op.pontos ?? 0) + bonus;
        return {
          moedas: s.moedas + valor,
          combo,
          humor: "feliz",
          fala: op.fala ?? (combo >= 3 ? `Combo de ${combo}! 🔥 +${bonus} de bônus!` : sortear(FALAS_ACERTO)),
          ganho: valor > 0 ? { valor, id: Date.now() } : s.ganho,
        };
      });
      if (op.confete !== false) soltarConfete();
    } else {
      setE((s) => ({ ...s, combo: 0, humor: "triste", fala: op.fala ?? sortear(FALAS_ERRO) }));
    }
  }, []);

  const comemorar = useCallback((fala?: string) => {
    setE((s) => ({ ...s, humor: "festa", fala: fala ?? "Uhuu! Que trabalho! 🎉" }));
    soltarConfete(true);
  }, []);

  const limpar = useCallback(() => setE((s) => ({ ...s, humor: "neutro", fala: null })), []);

  const api = useMemo(() => ({ ...e, reagir, comemorar, limpar }), [e, reagir, comemorar, limpar]);
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useJogo() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useJogo precisa estar dentro de <JogoProvider>");
  return c;
}
