"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { EtapaBalcao } from "@/data/tipos";
import { Cabecalho, PONTOS_MAX, type Props } from "../base";
import { useJogo } from "../jogo/Contexto";
import { Botao, Explica } from "../ui";
import { Alvo, AreaArrastar, Arrastavel } from "./Arrastar";

/** Balcão de pedidos: fichas chegam uma a uma e vão para o pote certo. */
export function Balcao({ etapa, onConcluir }: Props<EtapaBalcao>) {
  const jogo = useJogo();
  const [atual, setAtual] = useState(0);
  const [acertosDePrimeira, setAcertos] = useState(0);
  const [errouEsta, setErrouEsta] = useState(false);
  const [tremor, setTremor] = useState(0);
  const [aviso, setAviso] = useState<string | null>(null);
  const [nosPotes, setNosPotes] = useState<string[][]>(etapa.potes.map(() => []));
  const total = etapa.itens.length;
  const fim = atual >= total;
  const item = etapa.itens[atual];

  function soltar(pote: number) {
    if (fim) return;
    if (pote === item.pote) {
      const primeira = !errouEsta;
      if (primeira) setAcertos((a) => a + 1);
      setNosPotes((p) => p.map((xs, i) => (i === pote ? [...xs, item.texto] : xs)));
      setErrouEsta(false);
      setAviso(null);
      const proximo = atual + 1;
      setAtual(proximo);
      if (proximo >= total) jogo.comemorar("Balcão organizado! Tudo no pote certo. 🎉");
      else jogo.reagir(true, { pontos: primeira ? 2 : 1, confete: false });
    } else {
      setErrouEsta(true);
      setTremor((t) => t + 1);
      setAviso(`Não é ${etapa.potes[pote].nome}. ${item.porque}`);
      jogo.reagir(false);
    }
  }

  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">{etapa.pergunta}</p>
        <span className="shrink-0 rounded-full bg-acai-claro px-3 py-1 text-sm font-bold text-acai-escuro">
          {Math.min(atual + 1, total)}/{total}
        </span>
      </div>

      <AreaArrastar onSoltar={(id) => soltar(Number(id.replace("pote-", "")))}>
        <div className="flex min-h-28 items-center justify-center rounded-2xl bg-[repeating-linear-gradient(45deg,#f3e8f6,#f3e8f6_12px,#faf7fb_12px,#faf7fb_24px)] p-4">
          <AnimatePresence mode="wait">
            {!fim ? (
              <motion.div
                key={atual}
                initial={{ y: -40, opacity: 0, rotate: -6 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.4, opacity: 0, y: 60 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <motion.div key={tremor} animate={tremor ? { x: [0, -12, 12, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
                  <Arrastavel id="ficha">
                    <div className="rounded-xl border-2 border-dashed border-acai/40 bg-white px-5 py-4 text-center shadow-md">
                      <p className="text-xs font-bold text-zinc-400 uppercase">📝 Ficha do caderno</p>
                      <p className="text-lg font-extrabold">{item.texto}</p>
                    </div>
                  </Arrastavel>
                </motion.div>
              </motion.div>
            ) : (
              <motion.p key="fim" initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="text-xl font-extrabold text-acai">
                Todas as fichas no lugar! ✨
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {aviso && (
          <motion.p key={tremor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-red-50 p-3 text-sm text-red-800 ring-1 ring-red-200">
            {aviso}
          </motion.p>
        )}

        <p className="text-center text-xs text-zinc-500">Arraste a ficha até o pote — ou toque no pote.</p>
        <div className={`grid gap-3 ${etapa.potes.length > 2 ? "grid-cols-2" : "grid-cols-2"}`}>
          {etapa.potes.map((p, i) => (
            <Alvo key={p.nome} id={`pote-${i}`} onToque={() => soltar(i)} className="text-left">
              {(sobre) => (
                <motion.div
                  animate={{ scale: sobre ? 1.06 : 1 }}
                  className={`flex h-full min-h-28 flex-col rounded-2xl border-2 p-3 transition ${
                    sobre ? "border-acai bg-acai-claro" : "border-zinc-200 bg-white"
                  }`}
                >
                  <span className="text-3xl">{p.emoji}</span>
                  <span className="font-extrabold leading-tight">{p.nome}</span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {nosPotes[i].map((t) => (
                      <motion.span
                        key={t}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="rounded bg-acai/10 px-1.5 py-0.5 text-[10px] font-semibold text-acai-escuro"
                      >
                        {t}
                      </motion.span>
                    ))}
                  </span>
                </motion.div>
              )}
            </Alvo>
          ))}
        </div>
      </AreaArrastar>

      {fim && (
        <div className="space-y-4">
          <p className="font-bold">
            Você acertou {acertosDePrimeira} de {total} de primeira!
          </p>
          <Explica texto={etapa.explica} aberto />
          <Botao onClick={() => onConcluir(Math.round((PONTOS_MAX * acertosDePrimeira) / total))}>Continuar →</Botao>
        </div>
      )}
    </div>
  );
}
