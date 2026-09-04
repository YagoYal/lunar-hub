/** Shared helpers for turning raw source payloads into finding candidates. */

/** Simple ASCII slug: lowercase, non-alphanumerics to hyphens, trimmed. */
export function slugify(text) {
	return text
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "") // strip accents (combining diacritics after NFKD)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
		.slice(0, 80);
}

/** Truncate to a max length on a word boundary, appending an ellipsis if cut. */
export function truncate(text, maxLength) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (clean.length <= maxLength) return clean;
	const cut = clean.slice(0, maxLength);
	const lastSpace = cut.lastIndexOf(" ");
	return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`;
}

const LUNAR_KEYWORDS = ["lunar", "moon", "moon's", "lua"];

/** Loose keyword filter — good enough for a first pass, humans review anyway. */
export function mentionsMoon(...texts) {
	const haystack = texts.join(" ").toLowerCase();
	return LUNAR_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

/**
 * @typedef {Object} FindingCandidate
 * @property {string} title
 * @property {string} summary
 * @property {string} sourceName
 * @property {string} sourceUrl
 * @property {"NASA"|"ESA"|"JAXA"|"ISRO"|"CNSA"|"University"|"arXiv"|"Other"} sourceOrganization
 * @property {Date} publishedDate
 * @property {string[]} [tags]
 * @property {{src: string, alt: string, credit: string, licenseNote?: string}} [image]
 */

/** Builds the frontmatter + body for a draft Markdown file from a candidate. */
export function toDraftFile(candidate) {
	const retrievedAt = new Date();
	const frontmatter = {
		title: candidate.title,
		summary: truncate(candidate.summary, 400),
		sourceName: candidate.sourceName,
		sourceUrl: candidate.sourceUrl,
		sourceOrganization: candidate.sourceOrganization,
		publishedDate: candidate.publishedDate.toISOString().slice(0, 10),
		retrievedAt: retrievedAt.toISOString(),
		tags: candidate.tags ?? [],
		reviewStatus: "draft",
	};

	const lines = ["---"];
	for (const [key, value] of Object.entries(frontmatter)) {
		if (Array.isArray(value)) {
			lines.push(`${key}: [${value.map((v) => JSON.stringify(v)).join(", ")}]`);
		} else {
			lines.push(`${key}: ${JSON.stringify(value)}`);
		}
	}
	if (candidate.image) {
		lines.push("image:");
		lines.push(`  src: ${JSON.stringify(candidate.image.src)}`);
		lines.push(`  alt: ${JSON.stringify(candidate.image.alt)}`);
		lines.push(`  credit: ${JSON.stringify(candidate.image.credit)}`);
		if (candidate.image.licenseNote) {
			lines.push(`  licenseNote: ${JSON.stringify(candidate.image.licenseNote)}`);
		}
	}
	lines.push("---", "");
	lines.push(
		"<!-- Rascunho gerado automaticamente. Revise o resumo, confirme a atribuição -->",
		"<!-- e a licença antes de mover este arquivo para fora de _drafts/. -->",
		"",
		candidate.summary,
	);

	return lines.join("\n") + "\n";
}
