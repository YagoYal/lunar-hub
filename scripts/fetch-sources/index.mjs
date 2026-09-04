#!/usr/bin/env node
import { fetchNasaApod } from "./sources/nasa-apod.mjs";
import { fetchArxiv } from "./sources/arxiv.mjs";
import { loadExistingSourceUrls } from "./lib/dedupe.mjs";
import { writeDraft } from "./lib/write-draft.mjs";

// Active sources only. esa-rss.mjs / jaxa-rss.mjs exist as documented
// stubs (see their files) — add them here once their endpoints are
// verified, per docs/study-notes/sources.md.
const SOURCES = [
	{ name: "NASA APOD", fetch: fetchNasaApod },
	{ name: "arXiv (astro-ph.EP)", fetch: fetchArxiv },
];

async function main() {
	const existingUrls = await loadExistingSourceUrls();
	console.log(`Rascunhos/publicados existentes: ${existingUrls.size} sourceUrl(s) conhecidos.`);

	let written = 0;
	let skipped = 0;

	for (const source of SOURCES) {
		console.log(`\n→ ${source.name}`);
		let candidates;
		try {
			candidates = await source.fetch();
		} catch (error) {
			console.error(`  ✗ Falha ao buscar: ${error.message}`);
			continue;
		}

		console.log(`  ${candidates.length} candidato(s) encontrados.`);

		for (const candidate of candidates) {
			if (existingUrls.has(candidate.sourceUrl)) {
				skipped++;
				continue;
			}
			const filePath = await writeDraft(candidate);
			existingUrls.add(candidate.sourceUrl); // avoid duplicates within this same run
			written++;
			console.log(`  ✓ Rascunho criado: ${filePath}`);
		}
	}

	console.log(`\nResumo: ${written} rascunho(s) novo(s), ${skipped} já existente(s) ignorado(s).`);
	console.log(
		written > 0
			? "Revise os arquivos em src/content/findings/_drafts/ antes de publicar."
			: "Nada novo desta vez.",
	);
}

main().catch((error) => {
	console.error("Erro fatal no pipeline de ingestão:", error);
	process.exitCode = 1;
});
