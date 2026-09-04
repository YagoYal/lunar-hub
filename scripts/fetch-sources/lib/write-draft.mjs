import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { slugify, toDraftFile } from "./normalize.mjs";

const DRAFTS_DIR = path.resolve(
	import.meta.dirname,
	"../../../src/content/findings/_drafts",
);

/** Writes one candidate as a new draft Markdown file. Returns the file path. */
export async function writeDraft(candidate) {
	await mkdir(DRAFTS_DIR, { recursive: true });
	const dateStamp = candidate.publishedDate.toISOString().slice(0, 10);
	const filename = `${dateStamp}-${slugify(candidate.title)}.md`;
	const filePath = path.join(DRAFTS_DIR, filename);
	await writeFile(filePath, toDraftFile(candidate), "utf8");
	return filePath;
}
