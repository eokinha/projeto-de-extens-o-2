"use client";
// Mapa do bairro: as fases são paradas numa rua; cada fase concluída "acende" uma loja.
import Link from "next/link";
import { motion } from "motion/react";
import { FASES, FASES_PLANEJADAS } from "@/data/fases";
import { apagarProgresso, useProgresso } from "@/lib/progresso";

const PARADAS: Record<number, { emoji: string; lugar: string }> = {
  1: { emoji: "📒", lugar: "O balcão" },
  2: { emoji: "🥤", lugar: "A vitrine" },
  3: { emoji: "⚖️", lugar: "A gangorra da praça" },
  4: { emoji: "🚩", lugar: "O calendário" },
  5: { emoji: "🍓", lugar: "A cozinha" },
  6: { emoji: "🏆", lugar: "A doceria da Dona Cida" },
};

export function ListaFases() {
  const progresso = useProgresso();
  const todas = [
    ...FASES.map((f) => ({ ...f, disponivel: true })),
    ...FASES_PLANEJADAS.map((f) => ({ ...f, id: `em-breve-${f.numero}`, resumo: "Em breve.", disponivel: false })),
  ].sort((a, b) => a.numero - b.numero);
  const proxima = todas.find((f) => f.disponivel && !progresso[f.id]);
  const estrelas = Object.values(progresso).reduce((a, p) => a + p.estrelas, 0);
  const moedas = Object.values(progresso).reduce((a, p) => a + (p.moedas ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <span className="rounded-full bg-amber-100 px-3 py-1 font-extrabold text-amber-900 ring-1 ring-amber-300">⭐ {estrelas}/{FASES.length * 3}</span>
        <span className="rounded-full bg-amber-100 px-3 py-1 font-extrabold text-amber-900 ring-1 ring-amber-300">🪙 {moedas}</span>
      </div>

      <div className="relative py-2">
        {/* a rua */}
        <div className="absolute top-0 bottom-0 left-1/2 w-10 -translate-x-1/2 rounded-full bg-zinc-300" aria-hidden />
        <div
          className="absolute top-0 bottom-0 left-1/2 w-1 -translate-x-1/2 bg-[repeating-linear-gradient(to_bottom,white_0,white_14px,transparent_14px,transparent_28px)]"
          aria-hidden
        />
        <ol className="relative space-y-6">
          {todas.map((f, i) => {
            const p = f.disponivel ? progresso[f.id] : undefined;
            const parada = PARADAS[f.numero];
            const esquerda = i % 2 === 0;
            const ehProxima = proxima?.id === f.id;
            const cartao = (
              <div
                className={`w-full rounded-2xl p-3 ring-1 transition ${
                  p ? "bg-white ring-acai/30" : f.disponivel ? "bg-white ring-zinc-200 hover:ring-2 hover:ring-acai" : "bg-white/60 ring-zinc-200"
                }`}
              >
                <p className="text-[11px] font-bold tracking-wide text-acai uppercase">
                  Fase {f.numero} · {parada.lugar}
                </p>
                <h3 className="leading-tight font-extrabold">{f.titulo}</h3>
                {p ? (
                  <p className="text-amber-500" aria-label={`${p.estrelas} estrelas`}>
                    {"★".repeat(p.estrelas)}
                    <span className="text-zinc-300">{"★".repeat(3 - p.estrelas)}</span>
                  </p>
                ) : !f.disponivel ? (
                  <p className="text-xs font-bold text-zinc-500">🔒 Em breve</p>
                ) : (
                  <p className="text-xs text-zinc-500">{f.conteudos.slice(0, 3).join(" · ")}</p>
                )}
              </div>
            );
            const icone = (
              <motion.span
                animate={ehProxima ? { scale: [1, 1.15, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-3xl ring-4 ${
                  p
                    ? "bg-acai ring-amber-300 shadow-[0_0_24px_rgba(252,196,25,.7)]"
                    : ehProxima
                      ? "bg-white ring-acai"
                      : f.disponivel
                        ? "bg-white ring-zinc-300"
                        : "bg-zinc-100 ring-zinc-200 grayscale"
                }`}
              >
                {parada.emoji}
                {ehProxima && (
                  <span className="absolute -top-7 rounded-full bg-acai px-2 py-0.5 text-[10px] font-black whitespace-nowrap text-white">
                    JOGUE AQUI
                  </span>
                )}
              </motion.span>
            );
            const conteudo = (
              <div className={`flex items-center gap-3 ${esquerda ? "flex-row" : "flex-row-reverse"}`}>
                <div className="flex-1">{cartao}</div>
                {icone}
                <div className="flex-1" />
              </div>
            );
            return (
              <motion.li key={f.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                {f.disponivel ? (
                  <Link href={`/fase/${f.id}`} className="block">
                    {conteudo}
                  </Link>
                ) : (
                  conteudo
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>

      {Object.keys(progresso).length > 0 && (
        <button onClick={apagarProgresso} className="text-sm text-zinc-500 underline">
          Apagar meu progresso
        </button>
      )}
    </div>
  );
}
