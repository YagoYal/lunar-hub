# Lunar Hub

Divulgação de pesquisas científicas sobre a Lua a partir de fontes públicas (NASA, ESA, JAXA, ISRO, arXiv e outros), sempre com crédito e link para a fonte original. Construído em [Astro](https://astro.build).

**Antes de mexer no projeto, leia `docs/ROTINA.md`.** O risco real aqui não é técnico — é sustentar a revisão de conteúdo. Mais código sem essa rotina rodando é fuga, não progresso.

## Estrutura

```text
/
├── docs/
│   ├── ROTINA.md              # cadência semanal, métrica única, critério de morte — leia primeiro
│   ├── ROADMAP.md             # plano por milestone (v1 + Fase 2)
│   ├── study-notes/           # decisões de arquitetura e notas sobre cada fonte de dados
│   └── sessions/              # memória/contexto de sessões de trabalho anteriores
├── scripts/
│   ├── fetch-sources/         # ingestão (roda via GitHub Actions, não é backend)
│   ├── gen-icons.mjs          # gera os PNGs do PWA a partir de public/icons/*.svg
│   └── gen-moon-model.mjs     # gera o modelo 3D placeholder (public/models/moon.glb)
├── public/                    # ícones, manifest PWA, service worker, modelo 3D
├── src/
│   ├── content.config.ts      # schema da collection "findings"
│   ├── content/findings/      # itens publicados + _drafts/ (não revisados)
│   ├── layouts/ components/   # BaseLayout, Header/Hero/Footer, cards, ilhas React
│   └── pages/                 # home + /findings/[slug]/
└── package.json
```

Veja `docs/ROADMAP.md` para o plano completo e `docs/study-notes/decisions.md` para o porquê de cada escolha técnica.

## Comandos

| Comando                 | Ação                                                            |
| :----------------------- | :---------------------------------------------------------------- |
| `npm install`             | Instala as dependências                                            |
| `npm run dev`              | Servidor local em `localhost:4321`                                  |
| `npm run build`            | Build de produção em `./dist/`                                     |
| `npm run preview`          | Preview do build antes de publicar                                  |
| `npm run fetch:sources`    | Roda os scripts de ingestão (gera rascunhos em `_drafts/`)          |
| `npm run gen:icons`        | Regenera os ícones PNG do PWA a partir de `public/icons/*.svg`      |
| `npm run gen:model`        | Regenera o modelo 3D placeholder (`public/models/moon.glb`)         |
| `npm run astro ...`        | Comandos da CLI do Astro (`astro add`, `astro check`, etc.)         |

## Como o conteúdo chega ao site

1. `npm run fetch:sources` (local ou via GitHub Actions agendado) busca em fontes públicas e escreve **rascunhos** em `src/content/findings/_drafts/`.
2. Um humano revisa o conteúdo de verdade (não só o título — o filtro por palavra-chave deixa passar falso positivo) e confirma atribuição/licença.
3. O rascunho aprovado é movido para fora de `_drafts/`, com `reviewStatus: "published"`, `reviewedBy` e `reviewedAt` preenchidos; o resto é deletado.

Nada é publicado automaticamente — ver `docs/study-notes/decisions.md` e a rotina semanal em `docs/ROTINA.md`.

## Deploy

Recomendado: [Vercel](https://vercel.com) (tier gratuito, zero-config para o build estático do Astro). `vercel.json` já configura cabeçalhos de segurança (CSP, X-Frame-Options etc.). O cron de ingestão roda via GitHub Actions (`.github/workflows/fetch-findings.yml`), independente da hospedagem — configure o secret `NASA_API_KEY` no repositório (aba **Secrets**, não Variables) para usá-lo nos runs agendados.

## Mobile

v1 é um PWA instalável (grátis, funciona em Android/iOS) — essa é a versão mobile definitiva do projeto. Não há plano de publicar nas lojas (Play Store/App Store): decisão consciente para não gastar tempo/dinheiro em distribuição antes de validar se o conteúdo tem leitor. Ver `docs/study-notes/decisions.md`.

## Modelo 3D

O modelo da Lua no Hero (`public/models/moon.glb`) é um **placeholder estilizado gerado proceduralmente** (esfera com crateras via `three.js`, sem textura) — não é dado real de terreno lunar da NASA. Ver `scripts/gen-moon-model.mjs` e a nota em `docs/study-notes/decisions.md`.

## Licença

Código e conteúdo próprio sob **CC BY-NC 4.0** (uso acadêmico/não comercial). Conteúdo de terceiros segue a licença de cada fonte original — ver `LICENSE`.
