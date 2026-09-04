import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

/**
 * Thin Framer Motion wrapper used to animate a card's entrance as it
 * scrolls into view. Kept intentionally dumb — it doesn't know anything
 * about findings, just fades/slides whatever is passed as children (which
 * can be static Astro-rendered markup, e.g. a <FindingCard />).
 */
export default function RevealOnScroll({ children }: PropsWithChildren) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			style={{ height: "100%" }}
		>
			{children}
		</motion.div>
	);
}
