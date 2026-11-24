"use client";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Grafico as G } from "@/data/tipos";

export function Grafico({ grafico }: { grafico: G }) {
  const { tipo, dados, eixoX, series } = grafico;
  const comum = (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" vertical={false} />
      <XAxis dataKey={eixoX} tick={{ fontSize: 12 }} interval={0} />
      <YAxis tick={{ fontSize: 12 }} width={32} allowDecimals={false} />
      <Tooltip />
      {series.length > 1 && <Legend />}
    </>
  );
  return (
    <div className="h-64 w-full rounded-xl bg-white p-2 ring-1 ring-zinc-200">
      <ResponsiveContainer width="100%" height="100%">
        {tipo === "barras" ? (
          <BarChart data={dados}>
            {comum}
            {series.map((s) => (
              <Bar key={s.chave} dataKey={s.chave} name={s.nome} fill={s.cor} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        ) : (
          <LineChart data={dados}>
            {comum}
            {series.map((s) => (
              <Line key={s.chave} dataKey={s.chave} name={s.nome} stroke={s.cor} strokeWidth={3} dot={{ r: 4 }} />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
