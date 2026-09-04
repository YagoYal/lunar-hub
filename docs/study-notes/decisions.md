# Decisões de arquitetura (ADR curto)

Registro das decisões relevantes do projeto e o porquê, para retomar contexto sem re-explorar tudo.

## 2026-09-04 — Plano inicial v1

**Formato do site**: home em long-scroll com âncoras + página de detalhe estática por finding (`/findings/[...slug]/`), em vez de SPA pura ou portal de notícias clássico.
Porquê: âncoras atendem ao pedido de "SPA com âncoras"; a página de detalhe dá URL permanente/compartilhável por pesquisa sem custo real (Astro gera via content collection), e evita empilhar textos longos na home.

**Rascunho = pasta (`_drafts/`), não só flag `draft: true`**.
Porquê: garante que nada não revisado entre no build mesmo se alguém esquecer de mudar um campo — o filtro é estrutural (`!id.startsWith('_drafts/')`), não depende de lembrar de setar um boolean. Promoção de rascunho = mover arquivo, ação auditável no Git.

**Sem Tailwind, CSS puro com custom properties**.
Porquê: projeto pequeno (~10 componentes em v1), já havia tokens (`--bg/--surface/--primary/--text`) em `index.astro`. Tailwind adicionaria tooling sem ganho real nesse tamanho. Revisitar se o nº de componentes crescer (ver Roadmap Fase 2).

**React só em duas ilhas** (`FindingsCarousel.tsx`, `RevealOnScroll.tsx`), resto do site Astro puro.
Porquê: Framer Motion exige React, mas queremos manter o site majoritariamente estático/leve. `client:visible` para adiar hidratação.

**Deploy: Vercel (free/Hobby)**.
Porquê: zero-config para output estático do Astro, preview deployment por PR — combina com o fluxo "ingestão de conteúdo abre PR". Cloudflare Pages e Netlify são alternativas equivalentes (Cloudflare tem mais banda grátis).

**Pipeline de conteúdo não é 100% automático**.
Porquê: credibilidade científica pede revisão humana antes de publicar. Scripts em GitHub Actions só escrevem rascunhos e abrem PR — nunca commitam direto em `main`.

**Apps mobile: PWA em v1, Capacitor/lojas em Fase 2**.
Porquê: PWA é grátis e cobre "versão mobile" pedida. Lojas têm custo real (Play Store US$25 único, App Store US$99/ano) e processo de submissão — não faz sentido antes do conteúdo/design estarem validados.

**Modelos 3D adiados para Fase 2**.
Porquê: performance mobile em v1 é prioridade; 3D entra depois via `<model-viewer>` (mais leve que react-three-fiber para o caso de uso).

**Tailwind: reavaliado, mantém-se CSS puro**.
Porquê: mesmo depois da v1 completa, o projeto tem ~16 componentes e nenhum sinal de dor de produtividade com CSS puro/custom properties — o critério original ("revisitar se o nº de componentes crescer muito") ainda não foi atingido. Revisitar de novo se/quando o site ganhar bem mais telas ou um segundo dev entrar no projeto.

**UI de revisão de rascunhos além de PR no GitHub: adiada**.
Porquê: construir uma UI de revisão própria (aprovar/editar/mover rascunho pela web) exigiria autenticação e escrita no repositório a partir do navegador — ou um backend próprio, ou chamadas à API do GitHub com um token do lado do cliente (risco de segurança real: um token com permissão de escrita não deve viver em JS público). Isso vai contra a decisão de manter o site sem backend tradicional (ver seção de Segurança). O fluxo via PR do GitHub já cobre a necessidade real (revisão humana obrigatória, histórico auditável) sem esse risco. Revisitar só se o volume de rascunhos crescer a ponto de revisar por PR virar o gargalo de verdade.

**Sem app nas lojas — PWA é a "versão mobile" definitiva**.
Porquê: decisão do usuário em 2026-09-04, revertendo o plano original de Capacitor + Fase 2 de lojas. Simplifica bastante — sem toolchain nativo (Android Studio/JDK/SDK, e iOS nem seria possível nesta máquina Windows sem um Mac/Xcode), sem custo de loja. O trabalho de "Fase 2 mobile" virou polimento do PWA existente: ícones PNG reais (`npm run gen:icons`, via `@resvg/resvg-js`), prompt de instalação (`InstallPrompt.astro`), safe areas para notch/home indicator, alvos de toque maiores.

**PWA: service worker e manifest escritos à mão, sem `@vite-pwa/astro`**.
Porquê: na hora de instalar, `@vite-pwa/astro@1.2.0` (última versão) só suporta Astro até `^5.0.0` — o projeto está no Astro 7. Em vez de forçar uma instalação incompatível, foi feito manualmente: `public/manifest.webmanifest`, `public/sw.js` (network-first para páginas, cache-first para assets) e registro do SW em `BaseLayout.astro`. Ícones do manifest são SVG (`public/icons/icon.svg` e `icon-maskable.svg`) reaproveitando a marca do favicon — **pendente**: gerar PNGs reais (192/512) antes da Fase 2 (empacotamento com Capacitor), já que `apple-touch-icon` em SVG não é totalmente confiável no iOS. Revisitar `@vite-pwa/astro` se/quando lançar suporte ao Astro 7.

**Content collections: `src/content.config.ts` (raiz de `src/`) com `loader: glob(...)`, não `src/content/config.ts` com `type: 'content'`**.
Porquê: Astro 7 removeu de vez as content collections "legacy" (que ainda existiam como modo de compatibilidade em versões anteriores) — só a Content Layer API (loaders) funciona agora. Erro visto: `LegacyContentConfigError`. Detalhes: https://docs.astro.build/en/guides/upgrade-to/v6/#removed-legacy-content-collections. Import de `render()` também mudou: agora é `import { render } from "astro:content"` e `const { Content } = await render(entry)`, em vez de `entry.render()`.

**Modelo 3D da Lua: placeholder procedural, gerado localmente, não é dado real de terreno**.
Porquê: nenhum modelo GLB real (ex. NASA 3D Resources) foi baixado/atribuído nesta sessão. Em vez disso, `scripts/gen-moon-model.mjs` gera uma esfera com "crateras" via deslocamento de vértices (PRNG determinístico, sem textura/imagem) e exporta um `.glb` binário (`npm run gen:model`, ~180KB) usando `three.js` + `GLTFExporter`. Isso mantém a promessa do site (dados reais e atribuídos) — o Hero deixa explícito, em legenda, que é um modelo ilustrativo, não terreno real. Duas armadilhas técnicas encontradas: (1) `GLTFExporter` no caminho binário espera um `FileReader` de navegador — precisa de um polyfill mínimo em Node (só `readAsArrayBuffer`/`readAsDataURL` disparando `onloadend`); (2) `@google/model-viewer@4.3.1` trava a versão de `three` via peer dependency (`^0.183.0`), então `three` (usado só como devDependency, pelo script gerador) precisa ficar nessa faixa. `<model-viewer>` respeita `prefers-reduced-motion` (desativa `auto-rotate`, mantém `camera-controls`). Upgrade futuro: substituir pelo modelo real do NASA 3D Resources com atribuição, se fizer sentido.

**Findings relacionados: pontuação por tags/fonte compartilhada, nunca dado inventado**.
Porquê: a página de detalhe agora mostra até 3 "descobertas relacionadas" via `getRelatedFindings()` (`src/lib/findings.ts`) — pontua por nº de tags em comum (peso maior) e mesma `sourceOrganization` como desempate/fallback, nunca preenche com itens sem nenhuma relação real. Também expõe `tags`, `retrievedAt` (rotulado como "coletado por nós", distinto de "publicado pela fonte") e `reviewedBy`/`reviewedAt` quando existentes. Deliberadamente **não** foram adicionados gráficos/estatísticas — o schema não tem dados numéricos reais por finding, e inventar visualizações violaria a premissa de credibilidade do site.

**Licença: CC BY-NC 4.0** para conteúdo/código do site (uso acadêmico, não comercial).
Porquê: site não será vendido inicialmente. Conteúdo de terceiros (textos/imagens de agências) segue a licença de cada fonte, não a licença do repositório — daí o campo `licenseNote` no schema de `findings`.
