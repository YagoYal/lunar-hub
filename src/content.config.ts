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
		// Optional — only for findings with real, independently-verifiable
		// secondary coverage (e.g. a widely-reported mission milestone). Never
		// filled just to pad the field; most findings won't have this.
		relatedSources: z
			.array(
				z.object({
					name: z.string(),
					url: z.string().url(),
				}),
			)
			.optional(),
	}),
});

export const collections = { findings };
