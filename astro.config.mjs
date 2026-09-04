// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	// React is scoped to two interactive islands (carousel + scroll reveal) —
	// the rest of the site stays plain Astro. See docs/study-notes/decisions.md.
	integrations: [react()],
});
