import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Published findings only — anything under `_drafts/` is unreviewed and
 * must never reach the built site. The folder boundary is the real gate;
 * `reviewStatus` in frontmatter is kept as an audit trail on top of it.
 */
export async function getPublishedFindings(): Promise<
	CollectionEntry<"findings">[]
> {
	const entries = await getCollection(
		"findings",
		(entry) => !entry.id.startsWith("_drafts/"),
	);
	return entries.sort(
		(a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf(),
	);
}

/**
 * Ranks other published findings by relevance to `current`:
 * shared tags first (case-insensitive match count), same `sourceOrganization`
 * as a smaller tiebreaker/fallback so items still surface when tags don't
 * overlap at all. Purely structural — no fabricated relevance score, just
 * counting real overlapping fields. Degrades to an empty array when nothing
 * scores above zero (never throws, never pads with unrelated items).
 */
export function getRelatedFindings(
	current: CollectionEntry<"findings">,
	allFindings: CollectionEntry<"findings">[],
	{ limit = 3 }: { limit?: number } = {},
): CollectionEntry<"findings">[] {
	const currentTags = new Set(
		current.data.tags.map((tag) => tag.toLowerCase()),
	);

	const scored = allFindings
		.filter((entry) => entry.id !== current.id)
		.map((entry) => {
			const sharedTags = entry.data.tags.filter((tag) =>
				currentTags.has(tag.toLowerCase()),
			).length;
			const sameOrg =
				entry.data.sourceOrganization === current.data.sourceOrganization;
			// Shared tags matter far more than a shared org; org is only a
			// fallback so an entry with zero tag overlap can still surface.
			const score = sharedTags * 10 + (sameOrg ? 1 : 0);
			return { entry, score };
		})
		.filter(({ score }) => score > 0)
		.sort((a, b) => {
			if (b.score !== a.score) return b.score - a.score;
			return (
				b.entry.data.publishedDate.valueOf() -
				a.entry.data.publishedDate.valueOf()
			);
		});

	return scored.slice(0, limit).map(({ entry }) => entry);
}

export interface FindingSummary {
	id: string;
	title: string;
	summary: string;
	sourceName: string;
	sourceOrganization: string;
	sourceUrl: string;
	dateLabel: string;
	detailHref: string;
}

/** Plain, JSON-serializable shape — for handing findings to a React island as props. */
export function toFindingSummary(
	entry: CollectionEntry<"findings">,
): FindingSummary {
	const { data } = entry;
	return {
		id: entry.id,
		title: data.title,
		summary: data.summary,
		sourceName: data.sourceName,
		sourceOrganization: data.sourceOrganization,
		sourceUrl: data.sourceUrl,
		dateLabel: data.publishedDate.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}),
		detailHref: `/findings/${entry.id}/`,
	};
}
