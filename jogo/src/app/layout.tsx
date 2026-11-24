import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: { default: "Meu Negócio em Números", template: "%s · Meu Negócio em Números" },
  description: "Jogo de Estatística para pequenos empreendedores — Projeto de Extensão, Sistemas de Informação.",
};

export const viewport: Viewport = { themeColor: "#6b2a7b" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.variable} min-h-dvh font-sans antialiased`}>
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur">
          <nav className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="font-extrabold text-acai">
              Meu Negócio em Números
            </Link>
            <div className="flex gap-4 text-sm font-semibold text-zinc-600">
              <Link href="/aprender">Aprender</Link>
              <Link href="/sobre">Sobre</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6 pb-16">{children}</main>
      </body>
    </html>
  );
}
