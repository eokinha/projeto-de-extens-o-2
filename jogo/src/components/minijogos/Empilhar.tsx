"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { EtapaEmpilhar } from "@/data/tipos";
import { Cabecalho, PONTOS_MAX, type Props } from "../base";
import { useJogo } from "../jogo/Contexto";
import { Botao, Explica } from "../ui";
import { Alvo, AreaArrastar, Arrastavel } from "./Arrastar";

const EMOJI_CLIENTE = ["🧑🏾", "👩🏽", "👨🏿", "👧🏾", "👵🏽", "🧔🏾", "👩🏿", "👦🏽"];

/** Empilhando copos: cada pedido vira um copo na pilha certa; as pilhas viram um gráfico de barras. */
export function Empilhar({ etapa, onConcluir }: Props<EtapaEmpilhar>) {
  const jogo = useJogo();
  const [contagem, setContagem] = useState<number[]>(etapa.categorias.map(() => 0));
  const [atual, setAtual] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [errouEste, setErrouEste] = useState(false);
  const [tremor, setTremor] = useState(0);
  const [modo, setModo] = useState<"jogando" | "auto" | "fim">("jogando");
  const totalGeral = etapa.totais.reduce((a, b) => a + b, 0);
  const atendidos = contagem.reduce((a, b) => a + b, 0);
  const maior = Math.max(...etapa.totais);
  const pedido = etapa.pedidos[atual];
  const acabouManual = atual >= etapa.pedidos.length;

  function soltar(cat: number) {
    if (modo !== "jogando" || acabouManual) return;
    if (cat === pedido) {
      if (!errouEste) setAcertos((a) => a + 1);
      jogo.reagir(true, { pontos: errouEste ? 1 : 2, confete: false });
      setContagem((c) => c.map((x, i) => (i === cat ? x + 1 : x)));
      setErrouEste(false);
      setAtual((a) => a + 1);
    } else {
      setErrouEste(true);
      setTremor((t) => t + 1);
      jogo.reagir(false, { fala: `Ops! O cliente pediu ${etapa.categorias[pedido]}, não ${etapa.categorias[cat]}.` });
    }
  }

  // Seu Jorge anota o resto dos pedidos rapidinho (animação).
  const [fila, setFila] = useState<number[]>([]);
  function anotarResto() {
    const faltando = etapa.totais.map((t, i) => t - contagem[i]);
    const q: number[] = [];
    while (faltando.some((f) => f > 0)) {
      const i = faltando.indexOf(Math.max(...faltando));
      q.push(i);
      faltando[i]--;
    }
    setFila(q);
    setModo("auto");
  }
  const { comemorar } = jogo;
  useEffect(() => {
    if (modo !== "auto") return;
    let k = 0;
    const id = setInterval(() => {
      if (k < fila.length) {
        const cat = fila[k++];
        setContagem((c) => c.map((x, j) => (j === cat ? x + 1 : x)));
      } else {
        clearInterval(id);
        setModo("fim");
        comemorar("Olha só: as pilhas viraram um gráfico de barras! 📊");
      }
    }, 90);
    return () => clearInterval(id);
  }, [modo, fila, comemorar]);

  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>

      <AreaArrastar onSoltar={(id) => soltar(Number(id.replace("pilha-", "")))}>
        <div className="flex min-h-24 items-center justify-center rounded-2xl bg-acai-claro/60 p-3">
          <AnimatePresence mode="wait">
            {modo === "jogando" && !acabouManual ? (
              <motion.div
                key={atual}
                initial={{ x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0, scale: 0.5 }}
                className="flex items-center gap-3"
              >
                <span className="text-4xl">{EMOJI_CLIENTE[atual % EMOJI_CLIENTE.length]}</span>
                <motion.div key={tremor} animate={tremor ? { x: [0, -10, 10, -6, 0] } : {}}>
                  <Arrastavel id="copo">
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-md ring-1 ring-zinc-200">
                      <p className="text-xs text-zinc-500">Cliente {atual + 1} pede:</p>
                      <p className="font-extrabold">🥤 “Quero com {etapa.categorias[pedido]}!”</p>
                    </div>
                  </Arrastavel>
                </motion.div>
              </motion.div>
            ) : modo === "jogando" ? (
              <motion.div key="pronto" initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="space-y-2 text-center">
                <p className="font-bold">Você atendeu {etapa.pedidos.length} clientes! Ainda faltam {totalGeral - atendidos}.</p>
                <Botao onClick={anotarResto}>⏩ Seu Jorge anota o resto</Botao>
              </motion.div>
            ) : (
              <motion.p key="auto" className="font-bold text-acai">
                {modo === "auto" ? `Anotando… ${atendidos}/${totalGeral}` : `${totalGeral} clientes atendidos! 🎉`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        {modo === "jogando" && !acabouManual && (
          <p className="text-center text-xs text-zinc-500">Arraste o pedido até a pilha certa — ou toque na pilha.</p>
        )}

        {/* As pilhas: um gráfico de barras construído pelo jogador */}
        <div className="grid grid-cols-6 items-end gap-1.5 rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
          {etapa.categorias.map((c, i) => {
            const destaque = modo === "fim" && etapa.totais[i] === maior;
            return (
              <Alvo key={c} id={`pilha-${i}`} onToque={() => soltar(i)} className="flex h-full flex-col justify-end">
                {(sobre) => (
                  <div className={`flex flex-col items-center gap-1 rounded-lg p-1 transition ${sobre ? "bg-acai-claro" : ""}`}>
                    <span className="h-5 text-lg">{destaque ? "👑" : ""}</span>
                    <span className="text-sm font-black text-acai-escuro">{contagem[i]}</span>
                    <div className="flex h-52 w-full flex-col-reverse items-center gap-0.5">
                      {Array.from({ length: contagem[i] }, (_, k) => (
                        <motion.span
                          key={k}
                          initial={{ y: -30, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className={`block h-3.5 w-full max-w-9 rounded-sm ${destaque ? "bg-green-600" : "bg-acai"}`}
                        />
                      ))}
                    </div>
                    <span className="min-h-8 text-center text-[11px] leading-tight font-bold">{c}</span>
                  </div>
                )}
              </Alvo>
            );
          })}
        </div>
      </AreaArrastar>

      {modo === "fim" && (
        <div className="space-y-4">
          <Explica texto={etapa.explica} aberto />
          <Botao onClick={() => onConcluir(Math.round((PONTOS_MAX * acertos) / etapa.pedidos.length))}>Continuar →</Botao>
        </div>
      )}
    </div>
  );
}
