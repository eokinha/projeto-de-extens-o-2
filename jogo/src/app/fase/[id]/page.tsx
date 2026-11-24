import { notFound } from "next/navigation";
import { FaseRunner } from "@/components/FaseRunner";
import { buscarFase, FASES } from "@/data/fases";

export const generateStaticParams = () => FASES.map((f) => ({ id: f.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const fase = buscarFase((await params).id);
  return { title: fase ? `Fase ${fase.numero}: ${fase.titulo}` : "Fase" };
}

export default async function PaginaFase({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!buscarFase(id)) notFound();
  return <FaseRunner faseId={id} />;
}
