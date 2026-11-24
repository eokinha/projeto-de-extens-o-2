"use client";
import { AnimatePresence, motion } from "motion/react";
import type { Humor } from "./Contexto";

const BOCAS: Record<Humor, string> = {
  neutro: "M31 53 Q40 57 49 53",
  feliz: "M29 51 Q40 62 51 51",
  triste: "M31 57 Q40 50 49 57",
  festa: "M28 50 Q40 66 52 50 Z",
};

/** Avatar do seu Jorge, dono da açaiteria. */
export function RostoJorge({ humor, tamanho = 64 }: { humor: Humor; tamanho?: number }) {
  return (
    <svg viewBox="0 0 80 80" width={tamanho} height={tamanho} aria-hidden>
      <circle cx="40" cy="44" r="26" fill="#a8693f" />
      {/* boné */}
      <path d="M14 38 Q16 14 40 14 Q64 14 66 38 Z" fill="#6b2a7b" />
      <path d="M40 38 L72 38 Q72 33 66 33 L40 33 Z" fill="#4a1a56" />
      <circle cx="40" cy="24" r="4" fill="#fcc419" />
      {/* sobrancelhas */}
      {humor === "triste" ? (
        <>
          <path d="M26 41 L35 39" stroke="#2b1a10" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M45 39 L54 41" stroke="#2b1a10" strokeWidth="2.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M26 39 Q30 37 35 39" stroke="#2b1a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M45 39 Q50 37 54 39" stroke="#2b1a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* olhos */}
      {humor === "festa" ? (
        <>
          <path d="M27 45 Q30.5 41 34 45" stroke="#2b1a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M46 45 Q49.5 41 53 45" stroke="#2b1a10" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="30.5" cy="45" r="2.8" fill="#2b1a10" />
          <circle cx="49.5" cy="45" r="2.8" fill="#2b1a10" />
        </>
      )}
      {/* bigode */}
      <path d="M30 50 Q35 46 40 49 Q45 46 50 50 Q45 52 40 51 Q35 52 30 50 Z" fill="#2b1a10" />
      <path
        d={BOCAS[humor]}
        stroke="#5c1f1f"
        strokeWidth="2.5"
        fill={humor === "festa" ? "#5c1f1f" : "none"}
        strokeLinecap="round"
      />
      {(humor === "feliz" || humor === "festa") && (
        <>
          <circle cx="24" cy="51" r="3.5" fill="#e8590c" opacity=".35" />
          <circle cx="56" cy="51" r="3.5" fill="#e8590c" opacity=".35" />
        </>
      )}
    </svg>
  );
}

export function Jorge({ humor, fala }: { humor: Humor; fala: string }) {
  return (
    <div className="flex items-end gap-3">
      <motion.div
        key={humor + fala}
        initial={{ y: 0 }}
        animate={humor === "triste" ? { x: [0, -5, 5, -3, 0] } : { y: [0, -10, 0] }}
        transition={{ duration: 0.45 }}
        className="shrink-0"
      >
        <RostoJorge humor={humor} />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.p
          key={fala}
          initial={{ opacity: 0, scale: 0.9, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative mb-3 rounded-2xl rounded-bl-sm bg-white px-4 py-3 font-semibold shadow-sm ring-1 ring-zinc-200"
        >
          {fala}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
