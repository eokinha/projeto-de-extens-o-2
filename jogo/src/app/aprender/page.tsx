import { TIPO_VARIANCIA } from "@/lib/config";

export const metadata = { title: "Aprender" };

const div = TIPO_VARIANCIA === "amostral" ? "(n − 1)" : "n";

const topicos = [
  { grupo: "Organização dos dados", itens: [
    ["Dados brutos", "Os dados do jeito que foram anotados, sem nenhuma organização."],
    ["Rol", "Os dados colocados em ordem crescente (ou decrescente)."],
    ["Frequência absoluta (fi)", "Quantas vezes um valor ou categoria aparece."],
    ["Frequência percentual (f%)", "f% = (fi ÷ n) × 100"],
    ["Frequência acumulada (Fi)", "Soma da fi da linha com todas as anteriores."],
    ["Amplitude total (AT)", "AT = maior valor − menor valor"],
    ["Fórmula de Sturges", "k = 1 + 3,3 · log n (número de classes)"],
    ["Amplitude de classe (h)", "h = AT ÷ k"],
  ]},
  { grupo: "Medidas de tendência central", itens: [
    ["Média aritmética", "x̄ = Σx ÷ n (soma de todos os valores dividida pela quantidade)"],
    ["Média ponderada", "x̄p = Σ(x · p) ÷ Σp (cada valor tem um peso)"],
    ["Mediana (Md)", "Valor do meio do rol. n ímpar: posição (n + 1) ÷ 2. n par: média dos dois valores centrais."],
    ["Moda (Mo)", "Valor que mais se repete."],
    ["Valor atípico", "Um valor muito diferente dos outros. Afeta muito a média, mas pouco a mediana."],
  ]},
  { grupo: "Medidas de dispersão", itens: [
    ["Amplitude", "Maior valor − menor valor"],
    ["Desvio médio (DM)", "DM = Σ|x − x̄| ÷ n"],
    ["Variância", `s² = Σ(x − x̄)² ÷ ${div}`],
    ["Desvio padrão", "s = √s² — quanto, em média, os dados se afastam da média."],
  ]},
];

export default function Aprender() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-acai-escuro">Aprender</h1>
      <p className="text-zinc-700">Todas as fórmulas usadas no jogo, baseadas nas aulas de Estatística Descritiva.</p>
      {topicos.map((t) => (
        <section key={t.grupo} className="space-y-3">
          <h2 className="text-xl font-extrabold">{t.grupo}</h2>
          <dl className="divide-y divide-zinc-100 rounded-2xl bg-white ring-1 ring-zinc-200">
            {t.itens.map(([termo, def]) => (
              <div key={termo} className="p-4">
                <dt className="font-bold text-acai">{termo}</dt>
                <dd className="text-zinc-700">{def}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
