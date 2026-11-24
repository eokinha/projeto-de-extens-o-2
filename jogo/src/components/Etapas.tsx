"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type {
  Etapa,
  EtapaClassificar,
  EtapaEscolha,
  EtapaNumero,
  EtapaRol,
  EtapaSimulacao,
  EtapaTabela,
} from "@/data/tipos";
import { simularPeriodo, sortearDemandas } from "@/lib/simulacao";
import { fmt, reais, rol } from "@/lib/stats";
import { Cabecalho, Rodape, useTentativas, type Props } from "./base";
import { NumeroAnimado } from "./jogo/Hud";
import { useJogo } from "./jogo/Contexto";
import { Balcao } from "./minijogos/Balcao";
import { Bandeirinhas } from "./minijogos/Bandeirinhas";
import { Empilhar } from "./minijogos/Empilhar";
import { Atipico, Gangorra } from "./minijogos/Gangorra";
import { Botao, Explica, Feedback, lerNumero, Tabela } from "./ui";

export { PONTOS_MAX } from "./base";

// ------------------------------------------------------------------ Info
function Info({ etapa, onConcluir }: Props<Etapa>) {
  return (
    <div className="space-y-6">
      <Cabecalho etapa={etapa} />
      <Botao onClick={() => onConcluir(0)}>Continuar →</Botao>
    </div>
  );
}

// ------------------------------------------------------------------ Número
function Numero({ etapa, onConcluir }: Props<EtapaNumero>) {
  const [valor, setValor] = useState("");
  const t = useTentativas(onConcluir);
  const n = lerNumero(valor);
  const verificar = () => n !== null && t.verificar(Math.abs(n - etapa.resposta) <= etapa.tolerancia + 1e-9);
  return (
    <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); verificar(); }}>
      <Cabecalho etapa={etapa} />
      <label className="block space-y-2">
        <span className="text-lg font-bold">{etapa.pergunta}</span>
        <div className="flex items-center gap-2">
          {etapa.unidade === "R$" && <span className="font-bold">R$</span>}
          <input
            inputMode="decimal"
            value={t.revelado ? fmt(etapa.resposta) : valor}
            onChange={(e) => setValor(e.target.value)}
            disabled={t.concluido}
            className={`min-h-12 w-40 rounded-xl border-2 px-3 text-lg focus:border-acai focus:outline-none ${
              t.status === "certo" ? "border-green-500 bg-green-50" : "border-zinc-300"
            }`}
            placeholder="0"
          />
          {etapa.unidade && etapa.unidade !== "R$" && <span className="text-zinc-600">{etapa.unidade}</span>}
        </div>
      </label>
      <Feedback status={t.status} dica={etapa.dica} tentativa={t.erros} />
      <Rodape t={t} explica={etapa.explica} podeVerificar={n !== null} onVerificar={verificar} />
    </form>
  );
}

// ------------------------------------------------------------------ Escolha
function Escolha({ etapa, onConcluir }: Props<EtapaEscolha>) {
  const [sel, setSel] = useState<number | null>(null);
  const t = useTentativas(onConcluir);
  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>
      <div className="grid gap-2">
        {etapa.opcoes.map((o, i) => {
          const marcadoCerto = t.concluido && i === etapa.correta;
          return (
            <motion.button
              key={o}
              whileTap={{ scale: 0.97 }}
              disabled={t.concluido}
              onClick={() => setSel(i)}
              className={`min-h-12 rounded-xl px-4 py-3 text-left font-semibold ring-2 transition ${
                marcadoCerto
                  ? "bg-green-50 ring-green-500"
                  : sel === i
                    ? "bg-acai-claro ring-acai"
                    : "bg-white ring-zinc-200 hover:ring-acai/50"
              }`}
            >
              {marcadoCerto && "✅ "}
              {o}
            </motion.button>
          );
        })}
      </div>
      <Feedback status={t.status} dica={etapa.dica} tentativa={t.erros} />
      <Rodape t={t} explica={etapa.explica} podeVerificar={sel !== null} onVerificar={() => t.verificar(sel === etapa.correta)} />
    </div>
  );
}

// ------------------------------------------------------------------ Rol (tocar em ordem)
function Rol({ etapa, onConcluir }: Props<EtapaRol>) {
  const [ordem, setOrdem] = useState<number[]>([]);
  const t = useTentativas(onConcluir);
  const correto = rol(etapa.valores);
  const completo = ordem.length === etapa.valores.length;
  const mostrar = t.revelado ? correto : ordem.map((i) => etapa.valores[i]);
  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>
      <div className="flex min-h-14 flex-wrap gap-2 rounded-xl bg-acai-claro p-3">
        {mostrar.length === 0 && <span className="text-sm text-acai-escuro/70">A prateleira está vazia… toque nos números abaixo.</span>}
        {mostrar.map((v, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="rounded-lg bg-acai px-3 py-2 font-bold text-white"
          >
            {v}
          </motion.span>
        ))}
      </div>
      {!t.concluido && (
        <div className="flex flex-wrap gap-2">
          {etapa.valores.map((v, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              disabled={ordem.includes(i)}
              onClick={() => setOrdem((o) => [...o, i])}
              className="min-h-12 min-w-12 rounded-lg bg-white px-3 font-bold ring-2 ring-zinc-200 hover:ring-acai disabled:opacity-25"
            >
              {v}
            </motion.button>
          ))}
          <Botao variante="secundario" onClick={() => setOrdem([])}>
            Limpar
          </Botao>
        </div>
      )}
      <Feedback status={t.status} dica="Algum valor ficou fora de ordem. Toque em Limpar e tente de novo, começando pelo menor." tentativa={t.erros} />
      <Rodape
        t={t}
        explica={etapa.explica}
        podeVerificar={completo}
        onVerificar={() => t.verificar(ordem.every((idx, i) => etapa.valores[idx] === correto[i]))}
      />
    </div>
  );
}

// ------------------------------------------------------------------ Tabela para completar
function TabelaCompletar({ etapa, onConcluir }: Props<EtapaTabela>) {
  const [vals, setVals] = useState<Record<string, string>>({});
  const t = useTentativas(onConcluir);
  const chave = (c: number, l: number) => `${c}-${l}`;
  const editaveis = etapa.colunas.flatMap((col, c) => (col.editavel ? etapa.linhas.map((_, l) => chave(c, l)) : []));
  const preenchido = editaveis.every((k) => lerNumero(vals[k] ?? "") !== null);
  const celulaCerta = (c: number, l: number) => {
    const n = lerNumero(vals[chave(c, l)] ?? "");
    return n !== null && Math.abs(n - etapa.colunas[c].valores[l]) <= etapa.tolerancia + 1e-9;
  };
  const verificar = () =>
    t.verificar(etapa.colunas.every((col, c) => !col.editavel || etapa.linhas.every((_, l) => celulaCerta(c, l))));

  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>
      <div className="overflow-x-auto rounded-xl ring-1 ring-zinc-200">
        <table className="w-full bg-white text-center text-sm">
          <thead className="bg-acai-claro text-acai-escuro">
            <tr>
              <th className="px-3 py-2">{etapa.rotulo}</th>
              {etapa.colunas.map((c) => (
                <th key={c.nome} className="px-3 py-2">
                  {c.nome}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {etapa.linhas.map((linha, l) => (
              <tr key={linha} className="border-t border-zinc-100">
                <td className="px-3 py-2 font-semibold whitespace-nowrap">{linha}</td>
                {etapa.colunas.map((col, c) => (
                  <td key={col.nome} className="px-2 py-1">
                    {col.editavel ? (
                      <input
                        inputMode="decimal"
                        aria-label={`${col.nome} de ${linha}`}
                        disabled={t.concluido}
                        value={t.revelado ? fmt(col.valores[l], col.casas ?? 2) : (vals[chave(c, l)] ?? "")}
                        onChange={(e) => setVals((v) => ({ ...v, [chave(c, l)]: e.target.value }))}
                        className={`h-10 w-20 rounded-lg border-2 text-center focus:border-acai focus:outline-none ${
                          t.status === "certo"
                            ? "border-green-500 bg-green-50"
                            : t.status === "erro" && !celulaCerta(c, l)
                              ? "border-red-400 bg-red-50"
                              : "border-zinc-300"
                        }`}
                      />
                    ) : (
                      fmt(col.valores[l])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Feedback status={t.status} dica={`${etapa.dica} As células em vermelho estão erradas.`} tentativa={t.erros} />
      <Rodape t={t} explica={etapa.explica} podeVerificar={preenchido} onVerificar={verificar} />
    </div>
  );
}

// ------------------------------------------------------------------ Classificar itens em categorias
function Classificar({ etapa, onConcluir }: Props<EtapaClassificar>) {
  const [escolhas, setEscolhas] = useState<(number | null)[]>(etapa.itens.map(() => null));
  const t = useTentativas(onConcluir);
  const completo = escolhas.every((e) => e !== null);
  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>
      <ul className="space-y-3">
        {etapa.itens.map((item, i) => {
          const atual = t.revelado ? item.categoria : escolhas[i];
          const errado = t.status === "erro" && escolhas[i] !== item.categoria;
          return (
            <motion.li
              key={item.texto}
              animate={errado ? { x: [0, -8, 8, -4, 0] } : {}}
              transition={{ duration: 0.35 }}
              className={`space-y-2 rounded-xl bg-white p-3 ring-1 ${errado ? "ring-2 ring-red-400" : "ring-zinc-200"}`}
            >
              <p className="font-semibold">{item.texto}</p>
              <div className="flex flex-wrap gap-2">
                {etapa.categorias.map((cat, c) => (
                  <button
                    key={cat}
                    disabled={t.concluido}
                    onClick={() => setEscolhas((v) => v.map((x, j) => (j === i ? c : x)))}
                    className={`min-h-10 rounded-lg px-3 text-sm font-semibold ring-1 transition ${
                      atual === c
                        ? t.concluido
                          ? "bg-green-600 text-white ring-green-600"
                          : "bg-acai text-white ring-acai"
                        : "bg-white ring-zinc-300 hover:ring-acai"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.li>
          );
        })}
      </ul>
      <Feedback status={t.status} dica={`${etapa.dica} Os itens com borda vermelha estão errados.`} tentativa={t.erros} />
      <Rodape
        t={t}
        explica={etapa.explica}
        podeVerificar={completo}
        onVerificar={() => t.verificar(etapa.itens.every((it, i) => escolhas[i] === it.categoria))}
      />
    </div>
  );
}

// ------------------------------------------------------------------ Semana ao vivo (decisão + simulação animada)
type ResultadoProduto = {
  produto: EtapaSimulacao["produtos"][number];
  producao: number;
  demandas: number[];
  jogador: ReturnType<typeof simularPeriodo>;
  refs: { nome: string; producao: number; r: ReturnType<typeof simularPeriodo> }[];
};

/** Vitrine de um dia: copos vendidos, sobras indo para o lixo e clientes que ficaram sem açaí. */
function VitrineDoDia({ r, dia }: { r: ResultadoProduto; dia: number }) {
  const d = r.jogador.dias[dia];
  const icones = [
    ...Array.from({ length: d.vendidos }, () => "vendido" as const),
    ...Array.from({ length: d.sobras }, () => "sobra" as const),
    ...Array.from({ length: d.perdidas }, () => "falta" as const),
  ];
  return (
    <div className="space-y-2 rounded-xl bg-white p-3 ring-1 ring-zinc-200">
      <div className="flex items-baseline justify-between">
        <h3 className="font-extrabold text-acai-escuro">{r.produto.nome}</h3>
        <span className="text-sm text-zinc-600">
          {d.demanda} clientes · você preparou {r.producao}
        </span>
      </div>
      <div className="flex flex-wrap gap-0.5">
        {icones.map((tipo, k) => (
          <motion.span
            key={`${dia}-${k}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: k * 0.012 }}
            className={`flex h-4 w-4 items-center justify-center rounded-[3px] text-[10px] ${
              tipo === "vendido" ? "bg-acai" : tipo === "sobra" ? "bg-zinc-300" : "bg-transparent"
            }`}
          >
            {tipo === "falta" ? "😞" : ""}
          </motion.span>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs font-bold">
        <span className="text-acai">■ vendidos {d.vendidos}</span>
        <span className="text-zinc-500">🗑️ sobras {d.sobras}</span>
        <span className="text-orange-600">😞 faltou {d.perdidas}</span>
        <span className={d.lucro >= 0 ? "text-green-700" : "text-red-600"}>💰 {reais(d.lucro)}</span>
      </div>
    </div>
  );
}

function Simulacao({ etapa, onConcluir }: Props<EtapaSimulacao>) {
  const jogo = useJogo();
  const [entradas, setEntradas] = useState<string[]>(etapa.produtos.map(() => ""));
  const [semente, setSemente] = useState<number | null>(null);
  const [dia, setDia] = useState(0); // dias já mostrados
  const producoes = entradas.map((e) => lerNumero(e));
  const valido = producoes.every((p) => p !== null && p >= 0 && p <= 500 && Number.isInteger(p));

  const resultados: ResultadoProduto[] | null =
    semente === null
      ? null
      : etapa.produtos.map((p, i) => {
          const demandas = sortearDemandas(etapa.dias, p.mu, p.sigma, semente + i * 7919);
          return {
            produto: p,
            producao: producoes[i]!,
            demandas,
            jogador: simularPeriodo(producoes[i]!, demandas, p.preco, p.custo),
            refs: p.estrategias.map((s) => ({ ...s, r: simularPeriodo(s.producao, demandas, p.preco, p.custo) })),
          };
        });

  const lucroJogador = resultados?.reduce((a, r) => a + r.jogador.lucro, 0) ?? 0;
  const melhorRef = resultados?.reduce((a, r) => a + Math.max(...r.refs.map((x) => x.r.lucro)), 0) ?? 0;
  const pontos = lucroJogador >= melhorRef * 0.97 ? 10 : lucroJogador >= melhorRef * 0.85 ? 6 : 3;
  const acabou = resultados !== null && dia >= etapa.dias;
  const lucroAteAgora =
    resultados?.reduce((a, r) => a + r.jogador.dias.slice(0, dia).reduce((s, d) => s + d.lucro, 0), 0) ?? 0;

  // A semana "passa" dia a dia.
  const { comemorar, reagir } = jogo;
  useEffect(() => {
    if (semente === null) return;
    let d = 1;
    const id = setInterval(() => {
      d++;
      setDia((atual) => Math.max(atual, d));
      if (d >= etapa.dias) clearInterval(id);
    }, 1400);
    return () => clearInterval(id);
  }, [semente, etapa.dias]);

  useEffect(() => {
    if (!acabou) return;
    if (pontos === 10) comemorar("Semana fechada no lucro! Você é um gerente de primeira! 🎉");
    else reagir(pontos >= 6, { pontos: 0, confete: false, fala: "Semana fechada! Compare sua escolha com as outras estratégias." });
  }, [acabou, pontos, comemorar, reagir]);

  function simular() {
    setDia(1);
    setSemente(Math.floor(Math.random() * 1e9));
  }

  return (
    <div className="space-y-5">
      <Cabecalho etapa={etapa} />
      <p className="text-lg font-bold">{etapa.pergunta}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {etapa.produtos.map((p, i) => (
          <label key={p.nome} className="space-y-1 rounded-xl bg-white p-4 ring-1 ring-zinc-200">
            <span className="block font-bold">{p.nome}</span>
            <span className="block text-xs text-zinc-500">
              Venda {reais(p.preco)} · Custo {reais(p.custo)} por unidade
            </span>
            <input
              inputMode="numeric"
              disabled={semente !== null}
              value={entradas[i]}
              onChange={(e) => setEntradas((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
              className="mt-2 min-h-12 w-32 rounded-xl border-2 border-zinc-300 px-3 text-lg focus:border-acai focus:outline-none"
              placeholder="por dia"
            />
          </label>
        ))}
      </div>

      {!resultados ? (
        <Botao disabled={!valido} onClick={simular}>
          🎬 Abrir a açaiteria ({etapa.dias} dias)
        </Botao>
      ) : (
        <div className="space-y-5">
          {/* Semana ao vivo */}
          <div className="space-y-3 rounded-2xl bg-acai-claro/60 p-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {Array.from({ length: etapa.dias }, (_, i) => (
                  <span
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                      i < dia ? "bg-acai text-white" : "bg-white text-zinc-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                ))}
              </div>
              <span className={`text-lg font-black ${lucroAteAgora >= 0 ? "text-green-700" : "text-red-600"}`}>
                💰 R$ <NumeroAnimado valor={Math.round(lucroAteAgora)} />
              </span>
            </div>
            <motion.div
              key={Math.min(dia, etapa.dias)}
              initial={{ opacity: 0.3, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <p className="font-extrabold">☀️ Dia {Math.min(dia, etapa.dias)}</p>
              {resultados.map((r) => (
                <VitrineDoDia key={r.produto.nome} r={r} dia={Math.min(dia, etapa.dias) - 1} />
              ))}
            </motion.div>
            {!acabou && (
              <button onClick={() => setDia(etapa.dias)} className="text-sm font-semibold text-acai underline">
                ⏭ Pular para o fim da semana
              </button>
            )}
          </div>

          {acabou && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {resultados.map((r) => (
                <div key={r.produto.nome} className="space-y-3 rounded-xl bg-white p-4 ring-1 ring-zinc-200">
                  <h3 className="font-extrabold text-acai-escuro">Resumo: {r.produto.nome}</h3>
                  <Tabela
                    tabela={{
                      cabecalho: ["Dia", ...r.demandas.map((_, i) => String(i + 1)), "Total"],
                      linhas: [
                        ["Clientes queriam", ...r.demandas, r.demandas.reduce((a, b) => a + b, 0)],
                        ["Vendidos", ...r.jogador.dias.map((d) => d.vendidos), r.jogador.vendidos],
                        ["Sobras 🗑️", ...r.jogador.dias.map((d) => d.sobras), r.jogador.sobras],
                        ["Faltou 😞", ...r.jogador.dias.map((d) => d.perdidas), r.jogador.perdidas],
                      ],
                    }}
                  />
                  <p className="text-sm font-bold">E se tivesse produzido de outro jeito (com os mesmos clientes)?</p>
                  <Tabela
                    tabela={{
                      cabecalho: ["Estratégia", "Produção/dia", "Sobras", "Faltou", "Lucro"],
                      linhas: [
                        ["⭐ Sua escolha", r.producao, r.jogador.sobras, r.jogador.perdidas, reais(r.jogador.lucro)],
                        ...r.refs.map((s) => [s.nome, s.producao, s.r.sobras, s.r.perdidas, reais(s.r.lucro)]),
                      ],
                    }}
                  />
                </div>
              ))}
              <p className="rounded-xl bg-acai p-4 text-lg font-bold text-white">Seu lucro na semana: {reais(lucroJogador)}</p>
              <Explica texto={etapa.explica} aberto />
              <div className="flex flex-wrap gap-3">
                <Botao onClick={() => onConcluir(pontos)}>Concluir fase →</Botao>
                <Botao
                  variante="secundario"
                  onClick={() => {
                    setSemente(null);
                    setDia(0);
                  }}
                >
                  Tentar outra quantidade
                </Botao>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}

const FALAS_PADRAO: Record<Etapa["tipo"], string> = {
  info: "Dá uma olhada nisso aqui comigo!",
  numero: "Me ajuda com essa conta?",
  escolha: "O que você acha?",
  rol: "Me ajuda a arrumar a prateleira em ordem?",
  tabela: "Bora completar essa tabela!",
  classificar: "Me ajuda a separar essas informações?",
  simulacao: "Hora de decidir! Depois a gente vê a semana acontecer.",
  balcao: "Chegaram fichas no balcão! Coloca cada uma no pote certo.",
  empilhar: "Chegou cliente! Empilha o copo na fileira do complemento que ele pediu.",
  gangorra: "Será que você consegue equilibrar a gangorra?",
  atipico: "Olha o que acontece no dia da festa!",
  bandeirinhas: "Coloca as bandeirinhas para dividir os dias em partes iguais!",
};
export const falaPadrao = (e: Etapa) => e.fala ?? FALAS_PADRAO[e.tipo];

export function EtapaView(props: Props<Etapa>) {
  const { etapa, onConcluir } = props;
  switch (etapa.tipo) {
    case "info":
      return <Info {...props} />;
    case "numero":
      return <Numero etapa={etapa} onConcluir={onConcluir} />;
    case "escolha":
      return <Escolha etapa={etapa} onConcluir={onConcluir} />;
    case "rol":
      return <Rol etapa={etapa} onConcluir={onConcluir} />;
    case "tabela":
      return <TabelaCompletar etapa={etapa} onConcluir={onConcluir} />;
    case "classificar":
      return <Classificar etapa={etapa} onConcluir={onConcluir} />;
    case "simulacao":
      return <Simulacao etapa={etapa} onConcluir={onConcluir} />;
    case "balcao":
      return <Balcao etapa={etapa} onConcluir={onConcluir} />;
    case "empilhar":
      return <Empilhar etapa={etapa} onConcluir={onConcluir} />;
    case "gangorra":
      return <Gangorra etapa={etapa} onConcluir={onConcluir} />;
    case "atipico":
      return <Atipico etapa={etapa} onConcluir={onConcluir} />;
    case "bandeirinhas":
      return <Bandeirinhas etapa={etapa} onConcluir={onConcluir} />;
  }
}

export const pontuavel = (e: Etapa) => e.tipo !== "info" && e.tipo !== "atipico";
