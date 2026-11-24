import { RostoJorge } from "@/components/jogo/Jorge";
import { ListaFases } from "@/components/ListaFases";
import { NEGOCIO } from "@/data/fases";

export default function Inicio() {
  return (
    <div className="space-y-8">
      <section className="space-y-3 rounded-3xl bg-acai p-6 text-white">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-white/90 p-1">
            <RostoJorge humor="feliz" tamanho={56} />
          </span>
          <p className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm font-bold text-acai-escuro">
            Oi! Eu sou o {NEGOCIO.dono}, dono do {NEGOCIO.nome}. Me ajuda?
          </p>
        </div>
        <h1 className="text-3xl leading-tight font-extrabold">Ajude {NEGOCIO.dono} a cuidar do {NEGOCIO.nome}</h1>
        <p className="text-white/85">
          Use a Estatística para organizar as vendas, descobrir o que os clientes preferem e decidir quanto preparar
          sem desperdício. Cada fase ensina um conteúdo e termina com uma decisão de verdade.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-extrabold">🗺️ O caminho pelo bairro</h2>
        <ListaFases />
      </section>
    </div>
  );
}
