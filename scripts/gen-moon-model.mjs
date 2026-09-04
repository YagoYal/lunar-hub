#!/usr/bin/env node
// Generates public/models/moon.glb: a lightweight *stylized placeholder*
// sphere with procedurally displaced craters (seeded PRNG, no textures,
// no external assets) — NOT real NASA lunar terrain/DEM data. A real
// DEM-based model is a possible future upgrade — see
// docs/study-notes/decisions.md. Rerun after tweaking the crater params
// below (npm run gen:model).
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// GLTFExporter's binary path (`{ binary: true }`) reads the result through
// a browser FileReader (to turn a Blob into an ArrayBuffer) — Node has
// global Blob but not FileReader, so it fails with
// "ReferenceError: FileReader is not defined" without this minimal polyfill.
// It only needs to support readAsArrayBuffer and fire `onloadend` (the
// event GLTFExporter actually listens for, not `onload`).
if (typeof globalThis.FileReader === "undefined") {
	globalThis.FileReader = class FileReader {
		#finish(result) {
			this.result = result;
			if (typeof this.onload === "function") this.onload({ target: this });
			if (typeof this.onloadend === "function") this.onloadend({ target: this });
		}

		#fail(err) {
			if (typeof this.onerror === "function") this.onerror(err);
			if (typeof this.onloadend === "function") this.onloadend({ target: this });
		}

		readAsArrayBuffer(blob) {
			blob.arrayBuffer().then((buf) => this.#finish(buf)).catch((err) => this.#fail(err));
		}

		readAsDataURL(blob) {
			blob
				.arrayBuffer()
				.then((buf) => {
					const base64 = Buffer.from(buf).toString("base64");
					this.#finish(`data:${blob.type || "application/octet-stream"};base64,${base64}`);
				})
				.catch((err) => this.#fail(err));
		}
	};
}

const OUT_DIR = path.resolve(import.meta.dirname, "../public/models");
const RADIUS = 1;
const SEGMENTS = 64;

/** Deterministic seeded PRNG so the model is reproducible across runs. */
function mulberry32(seed) {
	return function () {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function buildMoonGeometry() {
	const geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS);
	const rand = mulberry32(1969); // Apollo 11 year — arbitrary but memorable seed

	const craters = Array.from({ length: 40 }, () => {
		const theta = rand() * Math.PI * 2;
		const phi = Math.acos(2 * rand() - 1);
		const center = new THREE.Vector3(
			Math.sin(phi) * Math.cos(theta),
			Math.sin(phi) * Math.sin(theta),
			Math.cos(phi),
		).normalize();
		return { center, radius: 0.08 + rand() * 0.22, depth: 0.015 + rand() * 0.045 };
	});

	const position = geometry.attributes.position;
	const vertex = new THREE.Vector3();
	const normal = new THREE.Vector3();

	for (let i = 0; i < position.count; i++) {
		vertex.fromBufferAttribute(position, i);
		normal.copy(vertex).normalize();

		let displacement = 0;
		for (const crater of craters) {
			const angularDist = normal.angleTo(crater.center);
			if (angularDist < crater.radius) {
				const t = angularDist / crater.radius;
				const bowl = -crater.depth * (1 - t * t);
				const rim = crater.depth * 0.35 * Math.exp(-(((t - 1) * 6) ** 2));
				displacement += bowl + rim;
			}
		}
		displacement += (rand() - 0.5) * 0.006; // fine surface noise

		const newPos = normal.clone().multiplyScalar(RADIUS + displacement);
		position.setXYZ(i, newPos.x, newPos.y, newPos.z);
	}

	position.needsUpdate = true;
	geometry.computeVertexNormals();
	return geometry;
}

async function main() {
	const geometry = buildMoonGeometry();
	const material = new THREE.MeshStandardMaterial({
		color: 0xb8b6b2,
		roughness: 0.95,
		metalness: 0,
	});
	const mesh = new THREE.Mesh(geometry, material);
	mesh.name = "MoonPlaceholder";

	const exporter = new GLTFExporter();
	const glb = await new Promise((resolve, reject) => {
		exporter.parse(mesh, resolve, reject, { binary: true });
	});

	await mkdir(OUT_DIR, { recursive: true });
	const outPath = path.join(OUT_DIR, "moon.glb");
	await writeFile(outPath, Buffer.from(glb));
	console.log(`✓ ${outPath} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
}

main().catch((error) => {
	console.error("Falha ao gerar o modelo da Lua:", error);
	process.exitCode = 1;
});
