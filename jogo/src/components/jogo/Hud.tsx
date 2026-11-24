"use client";
import { animate, AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";

/** Número que "rola" até o novo valor. */
export function NumeroAnimado({ valor }: { valor: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const anterior = useRef(valor);
  useEffect(() => {
    const c = animate(anterior.current, valor, {
      duration: 0.7,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString("pt-BR");
      },
    });
    anterior.current = valor;
    return () => c.stop();
  }, [valor]);
  return <span ref={ref}>{valor.toLocaleString("pt-BR")}</span>;
}

export function Caixa({ moedas, ganho }: { moedas: number; ganho: { valor: number; id: number } | null }) {
  return (
    <div className="relative flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 font-extrabold text-amber-900 ring-1 ring-amber-300">
      <span aria-hidden>🪙</span>
      <NumeroAnimado valor={moedas} />
      <span className="sr-only">moedas</span>
      <AnimatePresence>
        {ganho && (
          <motion.span
            key={ganho.id}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -28 }}
            transition={{ duration: 1.1 }}
            className="pointer-events-none absolute -top-2 right-0 text-sm font-black text-green-600"
          >
            +{ganho.valor}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Combo({ combo }: { combo: number }) {
  return (
    <AnimatePresence>
      {combo >= 2 && (
        <motion.span
          key={combo}
          initial={{ scale: 1.6, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className="rounded-full bg-orange-100 px-3 py-1 font-extrabold text-orange-700 ring-1 ring-orange-300"
        >
          🔥 x{combo}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
