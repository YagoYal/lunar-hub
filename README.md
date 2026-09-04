# Lunar Hub

Divulgação de pesquisas científicas sobre a Lua a partir de fontes públicas (NASA, ESA, JAXA, ISRO, arXiv e outros), sempre com crédito e link para a fonte original. Construído em [Astro](https://astro.build).

## Estrutura

```text
/
├── docs/                    # roadmap, notas de estudo/decisões, memória de sessões
├── scripts/fetch-sources/   # scripts de ingestão (rodam via GitHub Actions, não é backend)
├── public/                  # ícones, manifest PWA, service worker
├── src/
│   ├── content.config.ts    # schema da collection "findings"
│   ├── content/findings/    # itens publicados + _drafts/ (não revisados)
│   ├── layouts/ components/ # BaseLayout, Header/Hero/Footer, cards, ilhas React
│   └── pages/                # home + /findings/[slug]/
└── package.json
```

Veja `docs/ROADMAP.md` para o plano completo e `docs/study-notes/decisions.md` para o porquê de cada escolha técnica.

## Comandos

| Comando                   | Ação                                                     |
| :------------------------ | :-------------------------------------------------------- |
| `npm install`              | Instala as dependências                                    |
| `npm run dev`               | Servidor local em `localhost:4321`                          |
| `npm run build`             | Build de produção em `./dist/`                              |
| `npm run preview`           | Preview do build antes de publicar                          |
| `npm run fetch:sources`     | Roda os scripts de ingestão (gera rascunhos em `_drafts/`)   |
| `npm run gen:icons`         | Regenera os ícones PNG do PWA a partir de `public/icons/*.svg` |
| `npm run astro ...`         | Comandos da CLI do Astro (`astro add`, `astro check`, etc.) |

## Como o conteúdo chega ao site

1. `npm run fetch:sources` (local ou via GitHub Actions agendado) busca em fontes públicas e escreve **rascunhos** em `src/content/findings/_drafts/`.
2. Um humano revisa resumo, atribuição e licença.
3. O rascunho é movido para fora de `_drafts/` e vira uma publicação.

Nada é publicado automaticamente — ver `docs/study-notes/decisions.md`.

## Deploy

Recomendado: [Vercel](https://vercel.com) (tier gratuito, zero-config para o build estático do Astro). `vercel.json` já configura cabeçalhos de segurança (CSP, X-Frame-Options etc.). O cron de ingestão roda via GitHub Actions (`.github/workflows/fetch-findings.yml`), independente da hospedagem — configure o secret `NASA_API_KEY` no repositório para usá-lo nos runs agendados.

## Mobile

v1 é um PWA instalável (grátis, funciona em Android/iOS). Empacotamento nativo (Capacitor) e publicação nas lojas (Play Store/App Store, com custo) ficam para a Fase 2 — ver `docs/ROADMAP.md`.

## Licença

Código e conteúdo próprio sob **CC BY-NC 4.0** (uso acadêmico/não comercial). Conteúdo de terceiros segue a licença de cada fonte original — ver `LICENSE`.
