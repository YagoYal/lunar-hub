import { useRef } from "react";
import { motion } from "framer-motion";
import type { FindingSummary } from "../lib/findings";
import SourceBadge from "./SourceBadgeReact";

interface Props {
	entries: FindingSummary[];
}

/**
 * Mobile-first swipeable carousel. Only meant to be mounted below the
 * grid breakpoint (see .findings-carousel-wrapper in FindingsSection) —
 * kept as its own island so the desktop grid never pays for this JS.
 */
export default function FindingsCarousel({ entries }: Props) {
	const trackRef = useRef<HTMLDivElement>(null);

	function scrollByCard(direction: 1 | -1) {
		const track = trackRef.current;
		if (!track) return;
		const card = track.querySelector<HTMLElement>("[data-card]");
		const amount = (card?.offsetWidth ?? 280) + 16;
		track.scrollBy({ left: amount * direction, behavior: "smooth" });
	}

	if (entries.length === 0) {
		return (
			<p style={{ fontStyle: "italic" }}>
				Nenhuma descoberta publicada ainda — o pipeline de revisão está em
				andamento.
			</p>
		);
	}

	return (
		<div className="carousel">
			<div className="track" ref={trackRef}>
				{entries.map((entry) => (
					<motion.article
						key={entry.id}
						data-card
						className="card"
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-20px" }}
						transition={{ duration: 0.35, ease: "easeOut" }}
					>
						<SourceBadge
							organization={entry.sourceOrganization}
							name={entry.sourceName}
						/>
						<h3>
							<a href={entry.detailHref}>{entry.title}</a>
						</h3>
						<p className="summary">{entry.summary}</p>
						<div className="meta">
							<span>{entry.dateLabel}</span>
							<div className="links">
								<a href={entry.detailHref}>Detalhes</a>
								<a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
									Ler fonte →
								</a>
							</div>
						</div>
					</motion.article>
				))}
			</div>
			<div className="controls">
				<motion.button
					type="button"
					aria-label="Anterior"
					whileTap={{ scale: 0.9 }}
					onClick={() => scrollByCard(-1)}
				>
					←
				</motion.button>
				<motion.button
					type="button"
					aria-label="Próximo"
					whileTap={{ scale: 0.9 }}
					onClick={() => scrollByCard(1)}
				>
					→
				</motion.button>
			</div>

			<style>{`
				.carousel { display: flex; flex-direction: column; gap: 0.75rem; }
				.track {
					display: flex;
					gap: 1rem;
					overflow-x: auto;
					scroll-snap-type: x mandatory;
					padding-bottom: 0.25rem;
					-webkit-overflow-scrolling: touch;
				}
				.track::-webkit-scrollbar { height: 6px; }
				.card {
					flex: 0 0 85%;
					scroll-snap-align: start;
					background: var(--surface, #fff);
					border: 1px solid var(--border, #e2e8f0);
					border-radius: var(--radius, 0.75rem);
					padding: 1.25rem;
					display: flex;
					flex-direction: column;
					gap: 0.75rem;
				}
				.card h3 { margin: 0; font-size: 1.0625rem; }
				.card h3 a { color: var(--text, #0f172a); text-decoration: none; }
				.summary { font-size: 0.9375rem; margin: 0; color: var(--text-muted, #475569); flex-grow: 1; }
				.meta { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-size: 0.8125rem; flex-wrap: wrap; color: var(--text-muted, #475569); }
				.links { display: flex; gap: 0.75rem; }
				.links a, .card h3 a { text-decoration: none; }
				.controls { display: flex; justify-content: flex-end; gap: 0.5rem; }
				.controls button {
					width: 2.75rem;
					height: 2.75rem;
					border-radius: 999px;
					border: 1px solid var(--border, #e2e8f0);
					background: var(--surface, #fff);
					color: var(--primary-dark, #0369a1);
					font-size: 1rem;
					cursor: pointer;
				}
			`}</style>
		</div>
	);
}
