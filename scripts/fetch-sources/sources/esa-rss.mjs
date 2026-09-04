/**
 * ESA (European Space Agency) — NOT YET IMPLEMENTED.
 *
 * The exact RSS/feed URL for ESA's Moon exploration news wasn't verified
 * against a live response while building this pipeline (see the
 * "[verificar]" note in docs/study-notes/sources.md) — writing a fetcher
 * against a guessed endpoint would silently break or, worse, misattribute
 * content. Implement this once the real feed URL and item shape are
 * confirmed by hand, then wire it into index.mjs's `sources` list.
 */
export async function fetchEsaRss() {
	throw new Error(
		"fetchEsaRss não implementado — confirme o endpoint RSS da ESA antes de ativar esta fonte (ver docs/study-notes/sources.md).",
	);
}
