#!/usr/bin/env node
// One-off/rerunnable dev tool: rasterizes the SVG icons in public/icons/
// into the real PNG sizes browsers/OSes actually want for a PWA. Rerun
// after changing icon.svg or icon-maskable.svg.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const ICONS_DIR = path.resolve(import.meta.dirname, "../public/icons");

const targets = [
	{ src: "icon.svg", out: "icon-192.png", size: 192 },
	{ src: "icon.svg", out: "icon-512.png", size: 512 },
	{ src: "icon.svg", out: "apple-touch-icon.png", size: 180 },
	{ src: "icon-maskable.svg", out: "icon-maskable-192.png", size: 192 },
	{ src: "icon-maskable.svg", out: "icon-maskable-512.png", size: 512 },
];

for (const target of targets) {
	const svg = await readFile(path.join(ICONS_DIR, target.src), "utf8");
	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: target.size } });
	const png = resvg.render().asPng();
	await writeFile(path.join(ICONS_DIR, target.out), png);
	console.log(`✓ ${target.out} (${target.size}x${target.size})`);
}
