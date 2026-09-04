# Sessão 2026-09-04 — Plano inicial

## O que foi feito

- Definido o plano de arquitetura completo da v1 (ver `docs/study-notes/decisions.md` e `docs/ROADMAP.md`).
- Decisões fechadas com o usuário: pipeline de conteúdo com revisão humana (rascunhos em `_drafts/`), PWA em v1 (apps nativos/lojas viram Fase 2), 3D adiado para Fase 2, Framer Motion via ilhas React pontuais.
- Criada estrutura de `docs/` (ROADMAP, study-notes, sessions).
- Licença definida: CC BY-NC 4.0 (uso acadêmico, não comercial).
- Iniciada implementação do milestone 1 (fundação: tokens CSS, `BaseLayout`, `Header`/`Hero`/`Footer` com âncoras).

## Estado do projeto no início da sessão

Astro 7 quase vazio — só `src/pages/index.astro` com página "em breve", sem componentes/layouts/content collections/Tailwind/React.

## Pendente / próximos passos

- Concluir milestone 1 e seguir a ordem do Roadmap (milestone 2 em diante: content collection `findings`, componentes estáticos, ilhas React, PWA, scripts de ingestão, CI/CD, polimento).
- Ao implementar o milestone 6 (scripts de ingestão), verificar as URLs/endpoints marcados **[verificar]** em `docs/study-notes/sources.md` — não confiar de memória, testar na hora.
