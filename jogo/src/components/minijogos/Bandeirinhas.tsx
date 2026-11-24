"use client";
import { motion } from "motion/react";
import { useState } from "react";
import type { EtapaBandeirinhas } from "@/data/tipos";
import { Cabecalho, Rodape, useTentativas, type Props } from "../base";
import { Feedback } from "../ui";

const CORES = ["bg-red-200 text-red-900", "bg-amber-200 text-amber-900", "bg-sky-200 text-sky-900", "bg-green-200 text-green-900"];

/** Bandeirinhas: dividir o rol em partes iguais (quartis). Toque num bloco para pôr uma bandeirinha depois dele. */
export function Bandeirinhas({ etapa, onConcluir }: Props<EtapaBandeirinhas>) {
  const t = useTentativas(onConcluir);
  const n = etapa.valores.length;
  const tamanho = n / etapa.partes;
  const corretas = Array.from({ length: etapa.partes - 1 }, (_, k) => (k + 1) * tamanho - 1);
  const [flags, setFlags] = useState<number[]>([]);
  const mostradas = t.revelado ? corretas : flags;
  const ordenadas = [...mostradas].sort((a, b) => a - b);
  const grupoDe = (i: number) => ordenadas.filter((f) => f < i).length;
  const tamanhos = Array.from({ length: ordenadas.length + 1 }, (_, g) => {
    const ini = g === 0 ? 0 : ordenadas[g - 1] + 1;
    const fim = g === ordenadas.length ? n : ordenadas[g] + 1;
    return fim - ini;
  });

  function alternar(i: number) {
    if (t.concluido || i === n - 1) return;
    setFlags((f) => (f.includes(i) ? f.filter((x) => x !== i) : f.length < etapa.partes - 1 ? [...f, i] : f));
  }

  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>
      <p className="text-sm text-zinc-600">
        Toque num dia para colocar 🚩 logo depois dele. Toque de novo para tirar. Bandeirinhas: {mostradas.length}/{etapa.partes - 1}
      </p>
      <div className="grid grid-cols-8 gap-1.5">
        {etapa.valores.map((v, i) => (
          <motion.button
            key={i}
            layout
            onClick={() => alternar(i)}
            whileTap={{ scale: 0.9 }}
            className={`relative flex h-11 flex-col items-center justify-center rounded-lg text-sm font-extrabold ring-1 ring-black/5 ${CORES[grupoDe(i) % CORES.length]}`}
          >
            <span className="text-[9px] font-semibold opacity-60">{i + 1}º</span>
            {v}
            {mostradas.includes(i) && (
              <motion.span initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} className="absolute -top-3 -right-2 text-xl">
                🚩
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-sm font-bold">
        {tamanhos.map((tam, g) => (
          <span key={g} className={`rounded-full px-3 py-1 ${CORES[g % CORES.length]}`}>
            Grupo {g + 1}: {tam} dias
          </span>
        ))}
      </div>
      <Feedback
        status={t.status}
        dica={`Cada um dos ${etapa.partes} grupos precisa ter ${tamanho} dias. Confira o tamanho dos grupos acima.`}
        tentativa={t.erros}
      />
      <Rodape
        t={t}
        explica={etapa.explica}
        podeVerificar={flags.length === etapa.partes - 1}
        textoVerificar="🚩 Conferir divisão"
        onVerificar={() => t.verificar(ordenadas.every((f, k) => f === corretas[k]))}
      />
    </div>
  );
}
