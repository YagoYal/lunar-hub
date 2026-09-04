import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const findings = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/findings" }),
	schema: z.object({
		title: z.string(),
		summary: z.string().max(400),
		sourceName: z.string(),
		sourceUrl: z.string().url(),
		sourceOrganization: z.enum([
			"NASA",
			"ESA",
			"JAXA",
			"ISRO",
			"CNSA",
			"University",
			"arXiv",
			"Other",
		]),
		publishedDate: z.coerce.date(),
		retrievedAt: z.coerce.date(),
		tags: z.array(z.string()).default([]),
		image: z
			.object({
				src: z.string(),
				alt: z.string(),
				credit: z.string(),
				licenseNote: z.string().optional(),
			})
			.optional(),
		reviewStatus: z.enum(["draft", "approved", "published"]).default("draft"),
		reviewedBy: z.string().optional(),
		reviewedAt: z.coerce.date().optional(),
	}),
});

export const collections = { findings };
