export const metadata = { title: "Sobre" };

const ods = [
  ["ODS 4", "Educação de qualidade", "Ensina Estatística de forma prática e acessível para a comunidade."],
  ["ODS 8", "Trabalho decente e crescimento econômico", "Ajuda pequenos empreendedores a tomar decisões baseadas em dados."],
  ["ODS 10", "Redução das desigualdades", "Leva conhecimento de gestão a bairros com menos acesso a capacitação."],
  ["ODS 12", "Consumo e produção responsáveis", "Mostra como planejar a produção para reduzir o desperdício."],
];

export default function Sobre() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-acai-escuro">Sobre o projeto</h1>
      <p className="leading-relaxed text-zinc-700">
        <strong>Meu Negócio em Números</strong> é um jogo desenvolvido no Projeto de Extensão III do curso de
        Sistemas de Informação (2026.2), na disciplina de Estatística, com o tema <em>Aplicações da Estatística na
        Resolução de Problemas</em>. O cenário foi inspirado numa açaiteria de bairro de Salvador entrevistada pela
        equipe.
      </p>
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">
        Os dados usados no jogo são fictícios e serão substituídos pelos dados reais coletados no questionário.
      </p>
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold">Objetivos de Desenvolvimento Sustentável</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {ods.map(([n, t, d]) => (
            <div key={n} className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
              <p className="text-xs font-bold text-acai uppercase">{n}</p>
              <h3 className="font-extrabold">{t}</h3>
              <p className="text-sm text-zinc-600">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-extrabold">Equipe</h2>
        <p className="text-zinc-700">[Preencher com os nomes da equipe]</p>
      </section>
    </div>
  );
}
