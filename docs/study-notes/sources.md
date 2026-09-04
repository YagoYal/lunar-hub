# Notas sobre fontes de dados

Fontes candidatas para os scripts de ingestão (`scripts/fetch-sources/`). Itens marcados **[verificar]** precisam de confirmação/teste manual antes de codar contra eles — endpoints e formatos de API mudam, e é melhor confirmar na hora de implementar cada fonte (milestone 6) do que confiar de memória.

## NASA

- **APOD (Astronomy Picture of the Day)** — `https://api.nasa.gov/planetary/apod`. Precisa de API key (`DEMO_KEY` funciona para testes, mas tem rate limit baixo; pegar chave grátis em api.nasa.gov para uso real). Retorna imagem/vídeo do dia + explicação em inglês. Útil, mas nem todo dia é sobre a Lua — o script precisa filtrar por palavra-chave (`moon`, `lunar`) no título/explicação antes de gerar rascunho.
- **NASA Image and Video Library** — `images-api.nasa.gov` **[verificar]**, permite busca por termo (`moon`, `Artemis`, `lunar`) e retorna metadados + créditos de imagem. Bom candidato para preencher o campo `image.credit`.
- **RSS de notícias** — NASA mantém feeds RSS por tópico (ex. `https://www.nasa.gov/feed/`, feeds específicos de missão) **[verificar URL exata no momento da implementação, NASA reorganiza o site com frequência]**. Filtrar por Artemis/LRO/exploração lunar.
- **Licença**: conteúdo da NASA é, em geral, domínio público (não sujeito a copyright nos EUA), mas confirmar caso a caso (imagens de parceiros/contratados às vezes têm restrição). Ainda assim, sempre preencher `sourceUrl` + `credit`.

## arXiv

- **API** — `http://export.arxiv.org/api/query`, sem necessidade de key. Buscar por categoria `astro-ph.EP` (Earth and Planetary Astrophysics) combinada com palavras-chave (`lunar`, `moon`, `regolith`, `Artemis`) no título/abstract.
- Retorna abstract, autores, data, link para o PDF/abstract page — usar o abstract como base do `summary` (resumido/truncado), nunca reproduzir o paper inteiro.
- **Licença**: papers no arXiv têm licenças variadas por autor (alguns CC BY, outros "arXiv non-exclusive license"); nunca copiar texto extenso, só citar + linkar. Preencher `licenseNote` quando a licença do paper permitir menos que um resumo curto.

## ESA (European Space Agency)

- **[verificar]** ESA costuma ter feeds RSS por seção (ex. exploração, ciência) em `esa.int`. Confirmar URLs na implementação.
- **Licença**: ESA geralmente usa "ESA Standard Licence" (não é domínio público como a NASA) — atribuição obrigatória, uso comercial pode ter restrição. Sempre preencher `licenseNote`.

## JAXA (Agência Espacial Japonesa)

- **[verificar]** Site institucional tem seção de notícias, possivelmente com RSS ou só HTML (pode exigir scraping cuidadoso em vez de RSS/API estruturada). Conteúdo majoritariamente em japonês com versão em inglês em parte das páginas — script deve extrair só a versão em inglês quando disponível.
- **Licença**: verificar termos de uso do site antes de reutilizar texto/imagens.

## ISRO / CNSA / Universidades

- Sem integração planejada para o milestone 6 inicial (começa com NASA + arXiv). ISRO e CNSA entram depois se houver fonte estruturada (RSS/API) confiável — scraping de HTML sem API é mais frágil e deve ser evitado quando possível.
- Notícias de universidades (ex. resultado de pesquisa lunar publicado por um departamento) tendem a vir via press release — considerar agregadores como EurekAlert (tem RSS por categoria) **[verificar]** em vez de rastrear universidades individualmente.

## Regras gerais para qualquer fonte nova

1. Preferir API/RSS estruturado a scraping de HTML.
2. Sempre gravar `sourceUrl` apontando para a página original (não para a API).
3. Resumo curto/derivado, nunca reprodução integral do texto-fonte.
4. Registrar rate limit e frequência de poll recomendada aqui nesta nota ao implementar a fonte.
5. Chaves de API só em GitHub Actions Secrets, nunca commitadas.
