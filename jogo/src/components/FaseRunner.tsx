"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { buscarFase, FASES } from "@/data/fases";
import { calcularEstrelas, salvarFase } from "@/lib/progresso";
import { EtapaView, falaPadrao, PONTOS_MAX, pontuavel } from "./Etapas";
import { JogoProvider, useJogo } from "./jogo/Contexto";
import { Caixa, Combo } from "./jogo/Hud";
import { Jorge } from "./jogo/Jorge";

export function FaseRunner({ faseId }: { faseId: string }) {
  return (
    <JogoProvider>
      <Fase faseId={faseId} />
    </JogoProvider>
  );
}

function Fase({ faseId }: { faseId: string }) {
  const fase = buscarFase(faseId)!;
  const jogo = useJogo();
  const [indice, setIndice] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [fim, setFim] = useState(false);
  const maximo = fase.etapas.filter(pontuavel).length * PONTOS_MAX;
  const total = fase.etapas.length;
  const etapa = fase.etapas[indice];

  function concluir(p: number) {
    const novo = pontos + p;
    setPontos(novo);
    if (indice + 1 < total) {
      setIndice(indice + 1);
      jogo.limpar();
    } else {
      const estrelas = calcularEstrelas(novo, maximo);
      salvarFase(fase.id, { pontos: novo, maximo, estrelas, moedas: jogo.moedas });
      setFim(true);
      jogo.comemorar(estrelas === 3 ? "Três estrelas! Você é fera nos números! 🌟" : "Fase concluída! Bora para a próxima?");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (fim) {
    const estrelas = calcularEstrelas(pontos, maximo);
    const proxima = FASES[FASES.findIndex((f) => f.id === fase.id) + 1];
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <Jorge humor="festa" fala={jogo.fala ?? "Fase concluída!"} />
        </div>
        <div className="flex justify-center gap-2 text-6xl" aria-label={`${estrelas} de 3 estrelas`}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.35, type: "spring" }}
              className={i < estrelas ? "text-amber-400" : "text-zinc-300"}
            >
              ★
            </motion.span>
          ))}
        </div>
        <h2 className="text-3xl font-extrabold text-acai-escuro">Fase {fase.numero} concluída!</h2>
        <div className="flex justify-center gap-3 text-lg">
          <span className="rounded-xl bg-white px-4 py-2 ring-1 ring-zinc-200">
            <strong>{pontos}</strong>/{maximo} pontos
          </span>
          <span className="rounded-xl bg-amber-100 px-4 py-2 font-bold text-amber-900 ring-1 ring-amber-300">🪙 {jogo.moedas}</span>
        </div>
        <p className="rounded-xl bg-acai-claro p-4 text-acai-escuro">
          <strong>O que você aprendeu:</strong> {fase.aprendizado}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {proxima && (
            <Link href={`/fase/${proxima.id}`} className="min-h-12 rounded-xl bg-acai px-5 py-3 font-bold text-white shadow-[0_4px_0_#4a1a56]">
              Próxima fase →
            </Link>
          )}
          <Link href="/" className="min-h-12 rounded-xl bg-white px-5 py-3 font-bold text-acai ring-1 ring-acai/40">
            🗺️ Voltar ao mapa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 text-sm font-semibold text-zinc-600">
          <span className="truncate">
            Fase {fase.numero} · {fase.titulo}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <Combo combo={jogo.combo} />
            <Caixa moedas={jogo.moedas} ganho={jogo.ganho} />
          </div>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-zinc-200">
          <motion.div className="h-full rounded-full bg-acai" animate={{ width: `${(indice / total) * 100}%` }} />
        </div>
      </div>
      <Jorge humor={jogo.humor} fala={jogo.fala ?? falaPadrao(etapa)} />
      <motion.div key={indice} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <EtapaView etapa={etapa} onConcluir={concluir} />
      </motion.div>
    </div>
  );
}
