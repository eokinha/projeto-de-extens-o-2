# Meu Negócio em Números

Jogo web de Estatística para pequenos empreendedores (Projeto de Extensão III, Sistemas de Informação, 2026.2).

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # testes das fórmulas estatísticas
npm run build    # build de produção
```

## Onde mexer

| O quê | Arquivo |
|---|---|
| Dados, perguntas e respostas das fases | `src/data/fases.ts` |
| Fórmula da variância (÷n ou ÷n−1) | `src/lib/config.ts` |
| Funções estatísticas (+ testes) | `src/lib/stats.ts`, `src/lib/stats.test.ts` |
| Simulação da demanda | `src/lib/simulacao.ts` |
| Tipos de etapa (número, escolha, rol, tabela, simulação) | `src/components/Etapas.tsx` |

As respostas das perguntas são calculadas pelas funções de `stats.ts` a partir dos dados.
Para trocar os dados fictícios pelos reais do questionário, basta alterar os arrays em `fases.ts`.
O progresso fica salvo no navegador (`localStorage`). Não há banco de dados nem login.
