# Roadmap — Lunar Hub

Site de divulgação científica sobre pesquisas lunares, com dados reais e públicos (NASA, ESA, JAXA, ISRO, arXiv etc.), sempre creditando a fonte. Ver o plano completo de arquitetura em `docs/study-notes/decisions.md`.

## v1 (em andamento)

- [x] 1. Fundação — tokens CSS globais, `BaseLayout`, `Header`/`Hero`/`Footer` com âncoras
- [x] 2. Modelo de conteúdo — `src/content.config.ts` (Content Layer API, loader `glob`), `_drafts/`, 4 findings de exemplo
- [x] 3. Renderização estática — `FindingCard`, `FindingsGrid`, `SourceBadge`, `BySourceFilter`, `MethodologySection`, `SecurityBackendSection`, página de detalhe `/findings/[...slug]/`
- [x] 4. Ilhas React — `@astrojs/react` + `framer-motion`, `FindingsCarousel.tsx` (mobile) + `RevealOnScroll.tsx` (grid desktop), ambos `client:visible`
- [x] 5. PWA — manifest + service worker escritos à mão (`@vite-pwa/astro` ainda não suporta Astro 7), ícones SVG. Pendente: gerar PNGs reais antes da Fase 2
- [x] 6. Scripts de ingestão — NASA APOD + arXiv (astro-ph.EP) implementados e testados fim a fim; ESA/JAXA ficam como stubs documentados até confirmar endpoints reais
- [x] 7. CI/CD — `.github/workflows/fetch-findings.yml` (cron diário, abre PR via peter-evans/create-pull-request), `vercel.json` com headers de segurança
- [x] 8. Polimento — nav responsivo (quebra em telas pequenas), `scroll-margin-top` para âncoras não ficarem atrás do header sticky, `astro check` sem erros, build de produção limpo. Auditoria formal de Lighthouse fica para quando o site estiver publicado (precisa de ambiente real, não só `astro dev`)

## Fase 2 (em andamento)

**Decisão (2026-09-04): não vamos publicar nas lojas (Play Store/App Store).** O "app mobile" é o próprio PWA — sem Capacitor, sem taxa de loja, sem processo de submissão. Fase 2 foca em polir essa experiência mobile.

- [x] Ícones PNG reais do PWA (192/512/maskable/apple-touch-icon), gerados de `public/icons/*.svg` via `npm run gen:icons`
- [x] Prompt de instalação (`InstallPrompt.astro`) — botão nativo via `beforeinstallprompt` no Android/Chrome, instrução manual no iOS Safari
- [x] Safe areas (notch/home indicator) no header sticky e no prompt de instalação, `viewport-fit=cover`
- [x] Alvos de toque ≥44px nos controles do carrossel
- [ ] Testar instalação/offline em um Android e um iPhone reais (dev server + build local não substitui teste em dispositivo)
- [x] `<model-viewer>` com modelo 3D da Lua no Hero — esfera com crateras geradas proceduralmente (`npm run gen:model`), placeholder estilizado, não é dado real de terreno; rotação automática desativada com `prefers-reduced-motion`
- [x] Páginas de detalhe mais ricas por finding — seção "Descobertas relacionadas" (por tags/fonte, `getRelatedFindings`), tags visíveis, data de coleta (`retrievedAt`) além da data de publicação. Sem gráficos/estatísticas inventadas — só dados reais já existentes no schema
- [x] Reavaliar Tailwind — decisão: manter CSS puro por enquanto (ver `docs/study-notes/decisions.md`)
- [x] UI de revisão de rascunhos além de PR no GitHub — decisão: adiar (ver `docs/study-notes/decisions.md`)

### Descartado

- ~~Capacitor + publicação nas lojas~~ — decisão do usuário em 2026-09-04: ficamos só com o PWA.

## Ideias soltas (não priorizadas)

- Newsletter/RSS do próprio site
- i18n (en-US) além do pt-BR
- Página "sobre as fontes" com status de cada integração (última sincronização, nº de itens)
