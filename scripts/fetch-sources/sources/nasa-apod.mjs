import { mentionsMoon, truncate } from "../lib/normalize.mjs";

/**
 * NASA APOD (Astronomy Picture of the Day). Not every day is about the
 * Moon, so we filter by keyword. DEMO_KEY works for local testing but has
 * a low rate limit — use a real key (NASA_API_KEY env var, free at
 * api.nasa.gov) for scheduled/CI runs. See docs/study-notes/sources.md.
 */
export async function fetchNasaApod({ days = 8 } = {}) {
	const apiKey = process.env.NASA_API_KEY ?? "DEMO_KEY";
	const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${days}&thumbs=true`;

	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`NASA APOD request failed: ${response.status} ${response.statusText}`);
	}

	/** @type {Array<Record<string, any>>} */
	const items = await response.json();

	return items
		.filter((item) => mentionsMoon(item.title ?? "", item.explanation ?? ""))
		.map((item) => ({
			title: item.title,
			summary: truncate(item.explanation ?? "", 400),
			sourceName: "NASA APOD",
			sourceUrl: `https://apod.nasa.gov/apod/ap${formatApodDate(item.date)}.html`,
			sourceOrganization: "NASA",
			publishedDate: new Date(item.date),
			tags: ["apod"],
			image:
				item.media_type === "image"
					? {
							src: item.url,
							alt: item.title,
							credit: item.copyright ?? "NASA",
							licenseNote: item.copyright
								? "Verificar direitos do autor antes de publicar."
								: "Domínio público (NASA), a menos que indicado o contrário.",
						}
					: undefined,
		}));
}

/** "2026-09-04" -> "260904" (APOD's permalink date format). */
function formatApodDate(isoDate) {
	return isoDate.replace(/-/g, "").slice(2);
}
