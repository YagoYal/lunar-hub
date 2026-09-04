import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const FINDINGS_DIR = path.resolve(
	import.meta.dirname,
	"../../../src/content/findings",
);

/** Reads every existing finding (published + drafts) and returns the set of source URLs already known. */
export async function loadExistingSourceUrls() {
	const urls = new Set();
	for (const filePath of await walkMarkdownFiles(FINDINGS_DIR)) {
		const raw = await readFile(filePath, "utf8");
		const match = raw.match(/^sourceUrl:\s*"(.*)"\s*$/m);
		if (match) urls.add(match[1]);
	}
	return urls;
}

async function walkMarkdownFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walkMarkdownFiles(full)));
		} else if (entry.isFile() && entry.name.endsWith(".md")) {
			files.push(full);
		}
	}
	return files;
}
