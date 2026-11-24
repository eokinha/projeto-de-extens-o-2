# Meu Negócio em Números — Planejamento das Fases

> Dados **fictícios** (provisórios). Substituir pelos dados reais do questionário quando houver.

**Cenário principal:** *Açaí do Bairro* — açaiteria de seu Jorge, num bairro de Salvador
(inspirada no estabelecimento entrevistado pela equipe).

| Tamanho | Preço | Custo |
|---|---|---|
| Copo 300 ml | R$ 12,00 | R$ 5,00 |
| Copo 500 ml | R$ 18,00 | R$ 7,00 |
| Copo 700 ml | R$ 24,00 | R$ 9,00 |

Complementos: granola, leite em pó, banana, leite condensado, morango, paçoca.

**Estrutura de cada fase:** Situação → Dados → Desafios (3 a 5) → Decisão → Resultado + "Me explica".
**Pontuação:** lucro fictício acumulado + 1 a 3 estrelas por fase.

---

## Fase 1 — "Conhecendo o negócio" (Introdução à Estatística)
**Conteúdo:** população × amostra; variáveis qualitativas (nominal/ordinal) e quantitativas (discreta/contínua).
**Situação:** seu Jorge quer entender melhor os clientes e começa a anotar informações.

**Desafio — classificar as variáveis (arrastar para a caixa certa):**

| Informação | Resposta |
|---|---|
| Complemento preferido | Qualitativa nominal |
| Bairro onde o cliente mora | Qualitativa nominal |
| Tamanho do copo (300 / 500 / 700 ml) | Qualitativa ordinal |
| Satisfação (ruim / regular / boa / ótima) | Qualitativa ordinal |
| Nº de copos vendidos no dia | Quantitativa discreta |
| Nº de clientes atendidos por hora | Quantitativa discreta |
| Peso do açaí no copo (g) | Quantitativa contínua |
| Tempo de espera na fila (min) | Quantitativa contínua |

**Pergunta:** "Num mês ele atende uns 1.500 clientes e entrevistou 40 deles. Os 40 são…?" → **amostra** (a população são os 1.500).
**Decisão:** escolher 3 perguntas para o questionário de satisfação.
**Aprendizado:** o tipo da variável define qual tabela, gráfico e medida usar.

---

## Fase 2 — "Organizando o caderno" (Aula 2: Distribuição de frequências)
**Conteúdo:** dados brutos, rol, fi, fr, f%, Fi; dados sem classes e com classes; Sturges, amplitude total e de classe.

**Parte A — complementos preferidos (40 clientes, qualitativa):**

| Complemento | fi | f% |
|---|---|---|
| Granola | 12 | 30,0% |
| Leite em pó | 9 | 22,5% |
| Banana | 7 | 17,5% |
| Leite condensado | 6 | 15,0% |
| Morango | 4 | 10,0% |
| Paçoca | 2 | 5,0% |
| **Total** | **40** | **100%** |

Desafio: completar a coluna f% → gráfico de barras/pizza aparece. Moda = **granola**.

**Parte B — copos vendidos por dia durante 30 dias (dados brutos):**
`52, 61, 47, 58, 73, 66, 49, 55, 62, 70, 44, 59, 63, 57, 68, 75, 51, 60, 54, 65, 48, 71, 56, 62, 59, 67, 53, 64, 46, 78`

Desafios:
1. Montar o **rol**: 44, 46, 47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 59, 59, 60, 61, 62, 62, 63, 64, 65, 66, 67, 68, 70, 71, 73, 75, 78.
2. Amplitude total: AT = 78 − 44 = **34**.
3. Nº de classes (Sturges): k = 1 + 3,3·log 30 ≈ 5,87 → **6**.
4. Amplitude de classe: h = 34 / 6 ≈ 5,67 → **6**.
5. Completar a tabela:

| Classe | fi | Fi | f% |
|---|---|---|---|
| 44 ⊢ 50 | 5 | 5 | 16,7% |
| 50 ⊢ 56 | 5 | 10 | 16,7% |
| 56 ⊢ 62 | 7 | 17 | 23,3% |
| 62 ⊢ 68 | 7 | 24 | 23,3% |
| 68 ⊢ 74 | 4 | 28 | 13,3% |
| 74 ⊢ 80 | 2 | 30 | 6,7% |

**Decisão:** "Qual complemento comprar em maior quantidade?" (granola) e "Em quantos dias ele vendeu menos de 56 copos?" (10 dias, lido em Fi).
**Aprendizado:** organizar os dados revela padrões que a lista bruta esconde.

---

## Fase 3 — "O dia típico" (Aulas 3 e 4: Média, Mediana e Moda)
**Conteúdo:** média aritmética simples e ponderada; mediana; moda; efeito de valores atípicos.

**Situação:** vendas de uma semana. No domingo houve uma festa no bairro (valor atípico).

| Seg | Ter | Qua | Qui | Sex | Sáb | Dom (festa) |
|---|---|---|---|---|---|---|
| 48 | 52 | 50 | 55 | 63 | 70 | 182 |

Vendas da semana por tamanho: 300 ml = 210 copos, 500 ml = 240 copos, 700 ml = 70 copos (total 520).

Desafios e respostas:
1. Média de copos por dia: 520 / 7 = **74,29**.
2. Mediana (rol: 48, 50, 52, **55**, 63, 70, 182) = **55**.
3. Média sem o domingo: 338 / 6 = **56,33** → mostra o quanto um único dia "puxou" a média.
4. Moda do tamanho = **500 ml**.
5. Preço médio ponderado: (210·12 + 240·18 + 70·24) / 520 = 8.520 / 520 = **R$ 16,38**.
6. Faturamento da semana: **R$ 8.520,00**.

**Pergunta-chave:** "Para planejar um dia comum, qual medida representa melhor?" → **mediana** (resistente ao valor atípico).
**Decisão:** quantos copos preparar num dia comum. Se escolher ~74 (média) → sobra; ~55 (mediana) → ideal.
**Aprendizado:** escolher a medida certa evita desperdício.

---

## Fase 4 — "Dias fortes e dias fracos" (Aulas 5 e 6: Separatrizes)
**Conteúdo:** quartis, decis e percentis em dados agrupados em classes.
Fórmula (slides): Qk = linf + [(k·n/4 − Fant) / f] · h

**Situação:** copos vendidos por dia em 40 dias:

| Classe | fi | Fi |
|---|---|---|
| 30 ⊢ 40 | 4 | 4 |
| 40 ⊢ 50 | 8 | 12 |
| 50 ⊢ 60 | 12 | 24 |
| 60 ⊢ 70 | 9 | 33 |
| 70 ⊢ 80 | 5 | 38 |
| 80 ⊢ 90 | 2 | 40 |

Desafios e respostas (h = 10):
1. **Q1**: posição 10 → classe 40⊢50 → 40 + (10 − 4)/8 · 10 = **47,5**.
2. **Q2 (mediana)**: posição 20 → classe 50⊢60 → 50 + (20 − 12)/12 · 10 ≈ **56,67**.
3. **Q3**: posição 30 → classe 60⊢70 → 60 + (30 − 24)/9 · 10 ≈ **66,67**.
4. **D1**: posição 4 → classe 30⊢40 → 30 + (4 − 0)/4 · 10 = **40**.
5. **P90**: posição 36 → classe 70⊢80 → 70 + (36 − 33)/5 · 10 = **76** → "em 90% dos dias vendeu até 76 copos".

**Média por dia da semana** (para a decisão): Seg 42 · Ter 45 · Qua 50 · Qui 55 · Sex 68 · Sáb 75 · Dom 62.
Classificação: abaixo de Q1 (47,5) = **dia fraco** (Seg, Ter); acima de Q3 (66,67) = **dia forte** (Sex, Sáb).
**Decisão:** em quais dias fazer promoção e em quais chamar um ajudante.
**Aprendizado:** separatrizes dividem o negócio em faixas úteis para planejar.

---

## Fase 5 — "Planejando sem desperdício" (Medidas de dispersão)
**Conteúdo:** amplitude, desvio médio, variância e desvio padrão; comparar a estabilidade de dois produtos.

**Situação:** o açaí tradicional e o açaí com morango têm a **mesma média**, mas o morango estraga se sobrar.

| Dia | 1 | 2 | 3 | 4 | 5 | 6 | Média |
|---|---|---|---|---|---|---|---|
| Tradicional | 40 | 42 | 38 | 41 | 39 | 40 | 40 |
| Com morango | 20 | 65 | 30 | 55 | 25 | 45 | 40 |

Respostas:

| Medida | Tradicional | Com morango |
|---|---|---|
| Amplitude | 4 | 45 |
| Desvio médio | 1,00 | 15,00 |
| Variância (populacional, ÷n) | 1,67 | 266,67 |
| Desvio padrão (populacional) | 1,29 | 16,33 |
| Variância (amostral, ÷n−1) | 2,00 | 320,00 |
| Desvio padrão (amostral) | 1,41 | 17,89 |

> ⚠️ Confirmar com o professor qual fórmula usar (÷n ou ÷n−1) e exibir só ela no jogo.

**Pergunta:** "Qual produto tem venda mais previsível?" → **tradicional**.
**Decisão + simulação:** o jogador define quantas porções de morango preparar na próxima semana.
O jogo sorteia a demanda (média 40, desvio ≈ 16) e mostra lucro, sobras e vendas perdidas.
Sugestão do "Me explica": preparar entre média e média + 1 desvio padrão (40 a 56).
**Aprendizado:** a média diz "quanto"; o desvio padrão diz "o quanto posso confiar".

---

## Fase 6 — "Desafio do Empreendedor" (revisão geral, sem dicas)
**Situação:** um novo negócio, a **Doceria da Dona Cida**. O jogador aplica tudo sozinho.

Bolos de chocolate vendidos numa semana: `8, 10, 9, 12, 15, 18, 12`

Respostas: média **12**; mediana **12**; moda **12**; amplitude 10; desvio médio 2,57;
desvio padrão 3,25 (pop.) / 3,51 (amostral).
**Mecânica:** 4 semanas seguidas de decisão de produção, com o lucro acumulado como placar.

---

## Elementos transversais
- **"Me explica"** em todo desafio: fórmula e exemplo resolvido no estilo dos slides do professor.
- **Página Aprender:** glossário com as fórmulas (média, ponderada, mediana, moda, quartis, Sturges, desvio padrão).
- **Página Sobre:** projeto de extensão, comunidade atendida (açaiteria) e ODS 4, 8 e 10.
- **Linguagem simples, feita para o celular**, pensada para pequenos empreendedores.

## Prioridade para 30/11 (MVP)
1. Fases 2, 3 e 5 (tabelas, gráficos, tendência central e dispersão: as exigências do projeto).
2. Fases 1 e 4.
3. Fase 6 (se faltar tempo, entra no relatório como trabalho futuro).
