# Rotina e critério de continuidade

Este arquivo existe porque construir o site não é o risco real deste projeto — manter a revisão de conteúdo por semanas/meses é. Sem um compromisso escrito e um critério de morte, a tendência natural é o projeto apodrecer em silêncio como a maioria dos side projects de curadoria.

## Rotina mínima

- **1x por semana**, dia fixo (defina o seu: ex. domingo à noite), ~15 minutos:
  1. `npm run fetch:sources`
  2. Revisar o que caiu em `src/content/findings/_drafts/` — deletar o que não for realmente sobre a Lua da Terra, promover o resto (mover pra fora de `_drafts/`, marcar `reviewStatus: "published"`, `reviewedBy`, `reviewedAt`)
  3. Commit + push (ou abrir/mergear o PR se estiver vindo do GitHub Actions)
- Nada além disso é obrigatório. Sem essa rotina, todo o resto (deploy, 3D, PWA) é cenário vazio.

## Métrica única

**Findings publicados por semana.** Não visitas, não estrelas no GitHub, não "quantas features tem o roadmap". Se esse número for zero por 2 semanas seguidas, isso é o sinal de alerta abaixo.

Log simples (atualize à mão a cada revisão semanal):

| Semana | Findings publicados | Findings descartados (falso positivo) |
| ------ | -------------------- | --------------------------------------- |
| 2026-09-04 (sessão inicial) | 10 | 8 |
| 2026-09-04 (fora do ciclo — 2 fontes de arquitetura lunar adicionadas manualmente, não veio do `fetch:sources`) | +2 (total: 12) | 0 |

## Critério de morte

Se em **6 semanas** a linha acima não crescer em pelo menos 2 semanas separadas (ou seja, você pulou a rotina 4+ semanas), o projeto vira arquivo morto: pare de tratá-lo como ativo, não invista mais tempo de engenharia nele, e decida conscientemente arquivar ou reiniciar — em vez de deixar apodrecer sem admitir.

## O que NÃO fazer antes de validar

Não adicionar mais fontes de ingestão, não redesenhar o visual, não voltar pro modelo 3D, não montar app nativo — nada disso resolve o risco real (constância humana + existência de leitor). Só depois de sustentar a rotina acima por pelo meno 4-6 semanas com conteúdo real publicado é que faz sentido revisitar qualquer um desses itens.
