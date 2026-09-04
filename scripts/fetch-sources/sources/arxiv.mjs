import { XMLParser } from "fast-xml-parser";
import { truncate } from "../lib/normalize.mjs";

const ENDPOINT = "http://export.arxiv.org/api/query";

/**
 * arXiv API — no key required. astro-ph.EP (Earth and Planetary
 * Astrophysics) filtered to abstracts mentioning "lunar" or "moon".
 * See docs/study-notes/sources.md for licensing notes (varies per paper).
 */
export async function fetchArxiv({ maxResults = 10 } = {}) {
	const searchQuery =
		"cat:astro-ph.EP AND (abs:lunar OR abs:moon)";
	const params = new URLSearchParams({
		search_query: searchQuery,
		sortBy: "submittedDate",
		sortOrder: "descending",
		max_results: String(maxResults),
	});

	const response = await fetch(`${ENDPOINT}?${params}`);
	if (!response.ok) {
		throw new Error(`arXiv request failed: ${response.status} ${response.statusText}`);
	}

	const xml = await response.text();
	const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
	const feed = parser.parse(xml);

	const rawEntries = feed?.feed?.entry;
	const entries = Array.isArray(rawEntries) ? rawEntries : rawEntries ? [rawEntries] : [];

	return entries.map((entry) => {
		const authors = Array.isArray(entry.author) ? entry.author : [entry.author];
		const firstAuthor = authors?.[0]?.name ?? "Autor não identificado";
		const authorLabel = authors.length > 1 ? `${firstAuthor} et al.` : firstAuthor;

		return {
			title: (entry.title ?? "").replace(/\s+/g, " ").trim(),
			summary: truncate(entry.summary ?? "", 400),
			sourceName: `arXiv — ${authorLabel}`,
			sourceUrl: entry.id,
			sourceOrganization: "arXiv",
			publishedDate: new Date(entry.published),
			tags: ["arxiv", "astro-ph.EP"],
		};
	});
}
