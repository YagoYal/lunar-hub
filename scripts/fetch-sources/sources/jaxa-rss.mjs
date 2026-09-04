/**
 * JAXA — NOT YET IMPLEMENTED.
 *
 * Same reasoning as esa-rss.mjs: JAXA's news structure (RSS availability,
 * English-vs-Japanese content) wasn't verified live while building this
 * pipeline (see docs/study-notes/sources.md). Implement once confirmed.
 */
export async function fetchJaxaRss() {
	throw new Error(
		"fetchJaxaRss não implementado — confirme a fonte estruturada da JAXA antes de ativar (ver docs/study-notes/sources.md).",
	);
}
