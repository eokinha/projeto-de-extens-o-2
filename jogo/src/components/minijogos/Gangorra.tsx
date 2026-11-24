"use client";
import { useState } from "react";
import type { EtapaAtipico, EtapaGangorra } from "@/data/tipos";
import { fmt, media, mediana } from "@/lib/stats";
import { Cabecalho, Rodape, useTentativas, type Props } from "../base";
import { useJogo } from "../jogo/Contexto";
import { Botao, Explica, Feedback } from "../ui";

const W = 360;
const X0 = 26;
const X1 = 334;

function escala(min: number, max: number) {
  return (v: number) => X0 + ((v - min) / (max - min)) * (X1 - X0);
}

/** Agrupa valores próximos em pilhas para não sobrepor os copinhos. */
function pilhas(valores: number[], distancia: number) {
  const ord = [...valores].sort((a, b) => a - b);
  const grupos: number[][] = [];
  for (const v of ord) {
    const g = grupos.at(-1);
    if (g && v - g[0] <= distancia) g.push(v);
    else grupos.push([v]);
  }
  return grupos;
}

function Regua({ min, max, y }: { min: number; max: number; y: number }) {
  const x = escala(min, max);
  const passo = max - min > 100 ? 25 : 10;
  const ticks: number[] = [];
  for (let t = Math.ceil(min / passo) * passo; t <= max; t += passo) ticks.push(t);
  return (
    <g>
      <line x1={X0} x2={X1} y1={y} y2={y} stroke="#adb5bd" strokeWidth="1.5" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={y - 4} y2={y + 4} stroke="#adb5bd" />
          <text x={x(t)} y={y + 16} textAnchor="middle" fontSize="10" fill="#868e96">
            {t}
          </text>
        </g>
      ))}
    </g>
  );
}

/** Gangorra da média: arraste o apoio até a gangorra ficar reta. */
export function Gangorra({ etapa, onConcluir }: Props<EtapaGangorra>) {
  const t = useTentativas(onConcluir);
  const [apoio, setApoio] = useState(etapa.min + (etapa.max - etapa.min) * 0.12);
  const m = media(etapa.valores);
  const faixa = etapa.max - etapa.min;
  const x = escala(etapa.min, etapa.max);
  const final = t.concluido ? m : apoio;
  const angulo = Math.max(-14, Math.min(14, ((m - final) / faixa) * 80));
  const fx = x(final);
  const BEAM = 120;
  const tolerancia = faixa * 0.015;
  const dica =
    apoio < m
      ? "A gangorra está pendendo para a DIREITA. Mova o apoio para a direita."
      : "A gangorra está pendendo para a ESQUERDA. Mova o apoio para a esquerda.";
  const grupos = pilhas(etapa.valores, faixa * 0.06);

  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>
      <div className="rounded-2xl bg-sky-50 p-2 ring-1 ring-sky-100">
        <svg viewBox={`0 0 ${W} 210`} className="w-full" role="img" aria-label="Gangorra com os copos vendidos em cada dia">
          <g style={{ transform: `rotate(${angulo}deg)`, transformOrigin: `${fx}px ${BEAM}px`, transition: "transform .5s cubic-bezier(.3,1.4,.6,1)" }}>
            <rect x={X0 - 14} y={BEAM - 4} width={X1 - X0 + 28} height="8" rx="4" fill="#8d5524" />
            {grupos.map((g) => (
              <g key={g.join("-")}>
                {g.map((v, k) => (
                  <g key={k} transform={`translate(${x(v)} ${BEAM - 13 - k * 15})`}>
                    <path d="M-6 -6 L6 -6 L4.5 7 L-4.5 7 Z" fill="#6b2a7b" />
                    <ellipse cx="0" cy="-6" rx="6.5" ry="2" fill="#a855f7" />
                  </g>
                ))}
                <text x={x(g[0])} y={BEAM - 26 - (g.length - 1) * 15} textAnchor="middle" fontSize="10" fontWeight="700" fill="#4a1a56">
                  {g.length > 1 ? `${g[0]}–${g.at(-1)}` : g[0]}
                </text>
              </g>
            ))}
          </g>
          {/* apoio */}
          <path d={`M${fx} ${BEAM + 4} L${fx - 22} ${BEAM + 44} L${fx + 22} ${BEAM + 44} Z`} fill="#fcc419" stroke="#e67700" strokeWidth="2" />
          <text x={fx} y={BEAM + 36} textAnchor="middle" fontSize="11" fontWeight="800" fill="#7c4a03">
            {fmt(final, 1)}
          </text>
          <Regua min={etapa.min} max={etapa.max} y={180} />
        </svg>
        <label className="block px-2 pb-2">
          <span className="text-sm font-semibold text-zinc-600">◀ Mova o apoio ▶</span>
          <input
            type="range"
            min={etapa.min}
            max={etapa.max}
            step={0.1}
            value={final}
            disabled={t.concluido}
            onChange={(e) => setApoio(Number(e.target.value))}
            className="w-full accent-acai"
          />
        </label>
      </div>
      <p className="text-center text-sm font-semibold text-zinc-600">
        {Math.abs(apoio - m) <= tolerancia ? "⚖️ Parece equilibrada!" : angulo > 0 ? "↘ Pendendo para a direita" : "↙ Pendendo para a esquerda"}
      </p>
      <Feedback status={t.status} dica={dica} tentativa={t.erros} />
      <Rodape
        t={t}
        explica={etapa.explica}
        podeVerificar
        textoVerificar="⚖️ Equilibrei!"
        onVerificar={() => t.verificar(Math.abs(apoio - m) <= tolerancia)}
      />
    </div>
  );
}

/** Dia atípico: arraste um valor para longe e veja a média correr atrás dele, enquanto a mediana fica parada. */
export function Atipico({ etapa, onConcluir }: Props<EtapaAtipico>) {
  const jogo = useJogo();
  const [v, setV] = useState(etapa.de);
  const [visto, setVisto] = useState(false);
  const valores = etapa.valores.map((x, i) => (i === etapa.indice ? v : x));
  const m = media(valores);
  const md = mediana(valores);
  const x = escala(etapa.min, etapa.max);
  const mInicial = media(etapa.valores.map((x, i) => (i === etapa.indice ? etapa.de : x)));
  const mdInicial = mediana(etapa.valores.map((x, i) => (i === etapa.indice ? etapa.de : x)));

  function mover(n: number) {
    setV(n);
    if (!visto && n >= etapa.ate - 1) {
      setVisto(true);
      jogo.reagir(true, { pontos: 0, fala: "Viu só? A média correu atrás da festa, mas a mediana nem se mexeu!" });
    }
  }

  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>
      <div className="rounded-2xl bg-white p-2 ring-1 ring-zinc-200">
        <svg viewBox={`0 0 ${W} 182`} className="w-full" role="img" aria-label="Linha com as vendas, a média e a mediana">
          {/* média */}
          <g style={{ transform: `translateX(${x(m)}px)`, transition: "transform .3s ease-out" }}>
            <text y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#6b2a7b">
              Média {fmt(m, 1)}
            </text>
            <path d="M-7 28 L7 28 L0 40 Z" fill="#6b2a7b" />
            <line y1="40" y2="80" stroke="#6b2a7b" strokeDasharray="3 3" />
          </g>
          {/* pontos */}
          <line x1={X0} x2={X1} y1="80" y2="80" stroke="#dee2e6" strokeWidth="2" />
          {valores.map((val, i) => (
            <g key={i} style={{ transform: `translateX(${x(val)}px)`, transition: i === etapa.indice ? "none" : undefined }}>
              <circle cy="80" r={i === etapa.indice ? 9 : 7} fill={i === etapa.indice ? "#e8590c" : "#a855f7"} stroke="white" strokeWidth="2" />
              {i === etapa.indice && (
                <text y="68" textAnchor="middle" fontSize="10" fontWeight="800" fill="#e8590c">
                  🎉 {etapa.rotulos[i]}
                </text>
              )}
            </g>
          ))}
          {/* mediana */}
          <g style={{ transform: `translateX(${x(md)}px)`, transition: "transform .3s ease-out" }}>
            <line y1="80" y2="118" stroke="#2f9e44" strokeDasharray="3 3" />
            <path d="M-7 130 L7 130 L0 118 Z" fill="#2f9e44" />
            <text y="146" textAnchor="middle" fontSize="11" fontWeight="800" fill="#2f9e44">
              Mediana {fmt(md, 1)}
            </text>
          </g>
          <Regua min={etapa.min} max={etapa.max} y={158} />
        </svg>
        <label className="block px-2 pb-2">
          <span className="text-sm font-semibold text-zinc-600">
            Vendas do {etapa.rotulos[etapa.indice]}: <strong className="text-orange-600">{v} copos</strong>
          </span>
          <input
            type="range"
            min={etapa.de}
            max={etapa.ate}
            step={1}
            value={v}
            onChange={(e) => mover(Number(e.target.value))}
            className="w-full accent-orange-600"
          />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-acai-claro p-3">
          <p className="text-xs font-bold text-acai uppercase">Média andou</p>
          <p className="text-2xl font-black text-acai-escuro">+{fmt(m - mInicial, 1)}</p>
        </div>
        <div className="rounded-xl bg-green-50 p-3">
          <p className="text-xs font-bold text-green-700 uppercase">Mediana andou</p>
          <p className="text-2xl font-black text-green-800">+{fmt(md - mdInicial, 1)}</p>
        </div>
      </div>
      {visto ? (
        <div className="space-y-4">
          <Explica texto={etapa.explica} aberto />
          <Botao onClick={() => onConcluir(0)}>Continuar →</Botao>
        </div>
      ) : (
        <p className="text-center text-sm text-zinc-500">Arraste o controle laranja até o fim para ver a festa acontecer. 🎉</p>
      )}
    </div>
  );
}
