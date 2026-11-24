# Próximos passos — Meu Negócio em Números

> Atualizado em 24/11/2026. **Entrega final: 30/11/2026** (Desafio 5 — Termo de Validação).
> Leia este arquivo antes de retomar o projeto.

## 1. Onde paramos

| Item | Situação |
|---|---|
| Cronograma (Desafio 1) | ✅ `materiais/Projeto de Extensão/Desafio 1 - Cronograma Extensão (preenchido).docx` — falta o nome da equipe |
| Planejamento das fases | ✅ `materiais/Projeto de Extensão/PLANEJAMENTO - Fases do Jogo.md` |
| Fases 1 a 5 | ✅ jogáveis, com perguntas, "Me explica" e pontuação |
| Camada lúdica | ✅ seu Jorge (humor e falas), moedas, combo 🔥, confete, mapa do bairro |
| Mini-jogos | ✅ Balcão de pedidos (F1), Empilhando copos (F2), Gangorra e Dia da festa (F3), Bandeirinhas (F4), Semana ao vivo (F3 e F5) |
| Fase 6 | ⏳ não iniciada (aparece como "Em breve" no mapa) |
| Deploy | ⏳ não publicado |
| Dados reais | ⏳ jogo usa dados fictícios |

## 2. Decisões pendentes (dependem da equipe/professor)

- [ ] **Fórmula da variância:** o jogo divide por **n** (populacional). Se o professor usar **n − 1**, trocar em `jogo/src/lib/config.ts` (`TIPO_VARIANCIA = "amostral"`). As respostas da Fase 5 se ajustam sozinhas.
- [ ] **Nomes da equipe:** preencher em `jogo/src/app/sobre/page.tsx` e no cronograma (.docx).
- [ ] **Nome da açaiteria:** "Açaí do Bairro" / "seu Jorge" são fictícios. Para usar o nome real, pedir autorização ao dono e alterar `NEGOCIO` em `jogo/src/data/fases.ts`.
- [ ] **Repositório público:** decidir se mantém slides/listas do professor e o `padrao.rar` (projeto Angular de outra disciplina) no repositório.

## 3. Plano até 30/11 (por prioridade)

### Prioridade 1 — necessário para a entrega
1. **Publicar na Vercel** (gratuito): `cd jogo && npx vercel` → login com a conta da equipe → gerar QR code do link para a apresentação.
2. **Teste com pessoas da comunidade** (2 ou 3 empreendedores): observar onde travam, anotar feedback para o relatório.
3. **Teste no celular**: jogar todas as fases num celular real (arrastar, gangorra, bandeirinhas).
4. **Preencher pendências da seção 2.**

### Prioridade 2 — Fase 6 "Desafio do Empreendedor"
Revisão geral, sem dicas, num negócio novo: **Doceria da Dona Cida**.
- **Mecânica:** 4 semanas seguidas. Em cada semana: o jogador recebe as vendas, responde 2 ou 3 perguntas rápidas (média, mediana, moda, desvio padrão) e decide a produção. A semana roda na "Semana ao vivo".
- **Eventos aleatórios** entre semanas: "Vai chover!" (demanda −30%), "Festa na praça!" (valor atípico), "Concorrente abriu na rua" (média cai).
- **Placar:** lucro acumulado das 4 semanas; estrelas por faixa de lucro.
- **Dados já planejados:** bolos de chocolate na semana `8, 10, 9, 12, 15, 18, 12` → média 12, mediana 12, moda 12, amplitude 10, DM 2,57, DP 3,25 (pop.) / 3,51 (amostral).
- **Onde mexer:** criar `fase6` em `jogo/src/data/fases.ts`, adicionar em `FASES` e remover de `FASES_PLANEJADAS`. Provavelmente um novo tipo de etapa `campanha` (várias semanas) reaproveitando o componente `Simulacao` de `jogo/src/components/Etapas.tsx`.

### Prioridade 3 — mini-jogos restantes (item 3 da proposta)
| Fase | Mini-jogo | Ideia | Substitui |
|---|---|---|---|
| 1 | **A fila de clientes** | Grade com 1.500 bonequinhos; tocar para sortear 40 → mostra população × amostra | escolha "População e amostra" |
| 2 | **Arrumando a prateleira** | Arrastar cartões de venda para ordenar (rol) | etapa `rol` de tocar em ordem |
| 2 | **Fatiando a régua** | Slider com nº de classes; histograma se reorganiza ao vivo; marca o valor de Sturges | perguntas de k e h |
| 3 | **Caixa registradora** | Registrar copos por tamanho; preço médio ponderado se forma | pergunta da média ponderada |
| 4 | **Calendário colorido** | Pintar dias da semana de vermelho/amarelo/verde | etapa `classificar` dos dias |
| 5 | **Réguas elásticas** | Esticar a distância de cada dia até a linha da média → desvio médio/desvio padrão | perguntas de DM e DP |

### Prioridade 4 — melhorias (se sobrar tempo)
- Sons opcionais (acerto, erro, moedas) com botão de mudo.
- Modo apresentação (para projetar na assembleia comunitária): fontes maiores, sem tempo.
- Trocar os dados fictícios pelos dados reais do questionário (basta alterar os arrays em `jogo/src/data/fases.ts`; as respostas são calculadas automaticamente).
- Exportar um resumo das respostas do jogador (para o relatório).

## 4. Guia técnico rápido

```bash
cd jogo
npm install
npm run dev      # http://localhost:3000
npm test         # testes das fórmulas (vitest)
npm run lint
npm run build
```

- **Versões:** Node 26 LTS, Next 16.4.6, React 19.3, Tailwind 4, ESLint 10. **Não atualizar o TypeScript para 7.x** ainda: o ESLint do Next não suporta.
- **Bibliotecas:** `recharts` (gráficos), `@dnd-kit/core` (arrastar), `motion` (animações), `canvas-confetti`.
- **Sem banco de dados e sem login.** O progresso fica no `localStorage` (`jogo/src/lib/progresso.ts`).

### Como o jogo é organizado
| Arquivo | Papel |
|---|---|
| `src/data/fases.ts` | Dados, textos, perguntas e respostas de todas as fases (respostas calculadas por `stats.ts`) |
| `src/data/tipos.ts` | Tipos de etapa (`info`, `numero`, `escolha`, `rol`, `tabela`, `classificar`, `simulacao`, `balcao`, `empilhar`, `gangorra`, `atipico`, `bandeirinhas`) |
| `src/components/Etapas.tsx` | Componentes das perguntas + "Semana ao vivo" + roteador `EtapaView` + falas padrão do seu Jorge |
| `src/components/minijogos/` | Mini-jogos (cada um é um tipo de etapa) |
| `src/components/base.tsx` | `useTentativas` (dica, ver resposta, pontos), `Cabecalho`, `Rodape` |
| `src/components/jogo/` | Seu Jorge, moedas/combo, confete (`Contexto.tsx`) |
| `src/components/FaseRunner.tsx` | Motor da fase: avança etapas, soma pontos, salva progresso, tela de estrelas |
| `src/lib/stats.ts` + `stats.test.ts` | Fórmulas estatísticas e testes |

### Para criar um novo mini-jogo
1. Adicionar o tipo em `src/data/tipos.ts` e incluí-lo na união `Etapa`.
2. Criar o componente em `src/components/minijogos/` usando `useTentativas` (ou `useJogo().reagir`) e chamando `onConcluir(pontos)` (0 a 10).
3. Registrar no `switch` de `EtapaView` e uma fala em `FALAS_PADRAO` (`Etapas.tsx`). Se não valer pontos, incluir em `pontuavel`.
4. Usar a etapa em `src/data/fases.ts`.
5. Rodar `npx tsc --noEmit`, `npm run lint`, `npm test` e jogar a fase no navegador.
