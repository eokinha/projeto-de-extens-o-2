"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { TabelaSimples } from "@/data/tipos";

export function Botao({
  children,
  onClick,
  variante = "primario",
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variante?: "primario" | "secundario";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const estilo =
    variante === "primario"
      ? "bg-acai text-white shadow-[0_4px_0_#4a1a56] hover:bg-acai-escuro active:translate-y-1 active:shadow-none"
      : "bg-white text-acai ring-1 ring-acai/40 hover:bg-acai-claro";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-12 rounded-xl px-5 font-bold transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${estilo}`}
    >
      {children}
    </button>
  );
}

export function Tabela({ tabela }: { tabela: TabelaSimples }) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-zinc-200">
      <table className="w-full border-collapse bg-white text-center text-sm">
        <thead className="bg-acai-claro text-acai-escuro">
          <tr>
            {tabela.cabecalho.map((c) => (
              <th key={c} className="px-3 py-2 font-bold whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabela.linhas.map((l, i) => (
            <tr key={i} className="border-t border-zinc-100">
              {l.map((v, j) => (
                <td key={j} className={`px-3 py-2 whitespace-nowrap ${j === 0 ? "font-semibold" : ""}`}>
                  {typeof v === "number" ? v.toLocaleString("pt-BR", { maximumFractionDigits: 2 }) : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** "Me explica": a explicação aparece frase por frase, como uma conta sendo feita no quadro. */
export function Explica({ texto, aberto }: { texto: string; aberto?: boolean }) {
  const passos = texto.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ú0-9"(])/);
  return (
    <details open={aberto} className="rounded-xl bg-amber-50 p-4 text-sm ring-1 ring-amber-200">
      <summary className="cursor-pointer font-bold text-amber-800">💡 Me explica</summary>
      <ol className="mt-2 space-y-1.5 leading-relaxed text-amber-950">
        {passos.map((p, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.45 }}
          >
            {p}
          </motion.li>
        ))}
      </ol>
    </details>
  );
}

export function Feedback({ status, dica, tentativa = 0 }: { status: "erro" | "certo" | null; dica?: string; tentativa?: number }) {
  if (!status) return null;
  return status === "certo" ? (
    <motion.p
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-xl bg-green-50 p-3 font-semibold text-green-800 ring-1 ring-green-200"
    >
      ✅ Isso mesmo!
    </motion.p>
  ) : (
    <motion.p
      key={tentativa}
      animate={{ x: [0, -10, 10, -6, 6, 0] }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-red-50 p-3 text-red-800 ring-1 ring-red-200"
    >
      <strong>Ainda não.</strong> {dica}
    </motion.p>
  );
}

/** Converte texto digitado ("16,38", "R$ 16.38") em número. */
export function lerNumero(s: string): number | null {
  const limpo = s.replace(/[^\d,.-]/g, "").replace(",", ".");
  if (limpo === "" || limpo === "-" || limpo === ".") return null;
  const n = Number(limpo);
  return Number.isFinite(n) ? n : null;
}
