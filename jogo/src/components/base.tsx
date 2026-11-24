"use client";
// Peças comuns a todas as etapas (perguntas e mini-jogos).
import { useState } from "react";
import type { Etapa } from "@/data/tipos";
import { Grafico } from "./Grafico";
import { useJogo } from "./jogo/Contexto";
import { Botao, Explica, Tabela } from "./ui";

export const PONTOS_MAX = 10;
/** Pontos conforme a tentativa em que acertou. */
export const pontosPorTentativa = (erros: number) => [10, 6, 3][erros] ?? 3;

export type Props<E> = { etapa: E; onConcluir: (pontos: number) => void };

export function Cabecalho({ etapa }: { etapa: Etapa }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold text-acai-escuro">{etapa.titulo}</h2>
      {etapa.texto && <p className="leading-relaxed text-zinc-700">{etapa.texto}</p>}
      {etapa.tabela && <Tabela tabela={etapa.tabela} />}
      {etapa.grafico && <Grafico grafico={etapa.grafico} />}
    </div>
  );
}

/** Controle de tentativas: dica após o 1º erro, "ver resposta" após o 2º. Avisa o seu Jorge. */
export function useTentativas(onConcluir: (p: number) => void) {
  const jogo = useJogo();
  const [erros, setErros] = useState(0);
  const [status, setStatus] = useState<"erro" | "certo" | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [pontos, setPontos] = useState(0);
  const concluido = status === "certo" || revelado;
  return {
    erros,
    status,
    revelado,
    concluido,
    verificar(acertou: boolean) {
      if (concluido) return;
      if (acertou) {
        const p = pontosPorTentativa(erros);
        setStatus("certo");
        setPontos(p);
        jogo.reagir(true, { pontos: p });
      } else {
        setStatus("erro");
        setErros((e) => e + 1);
        jogo.reagir(false);
      }
    },
    revelar() {
      setRevelado(true);
      setStatus(null);
      setPontos(0);
      jogo.reagir(false, { fala: "Sem problema! Olha a explicação com calma." });
    },
    avancar: () => onConcluir(pontos),
  };
}

export function Rodape({
  t,
  explica,
  podeVerificar,
  onVerificar,
  textoVerificar = "Verificar",
}: {
  t: ReturnType<typeof useTentativas>;
  explica: string;
  podeVerificar: boolean;
  onVerificar: () => void;
  textoVerificar?: string;
}) {
  return (
    <div className="space-y-4">
      {t.concluido && <Explica texto={explica} aberto />}
      <div className="flex flex-wrap gap-3">
        {!t.concluido ? (
          <>
            <Botao disabled={!podeVerificar} onClick={onVerificar}>
              {textoVerificar}
            </Botao>
            {t.erros >= 2 && (
              <Botao variante="secundario" onClick={t.revelar}>
                Ver resposta
              </Botao>
            )}
          </>
        ) : (
          <Botao onClick={t.avancar}>Continuar →</Botao>
        )}
      </div>
    </div>
  );
}
