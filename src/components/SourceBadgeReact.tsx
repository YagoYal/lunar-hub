interface Props {
	organization: string;
	name: string;
}

const ORG_COLORS: Record<string, string> = {
	NASA: "#0369a1",
	ESA: "#1d4ed8",
	JAXA: "#7c3aed",
	ISRO: "#b45309",
	arXiv: "#b91c1c",
};

/**
 * React counterpart to SourceBadge.astro — only needed because
 * FindingsCarousel.tsx is a React island and can't import an .astro
 * component. Keep both in sync if the badge design changes.
 */
export default function SourceBadge({ organization, name }: Props) {
	const color = ORG_COLORS[organization] ?? "var(--primary-dark, #0369a1)";
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: "0.375rem",
				fontSize: "0.75rem",
				fontWeight: 600,
				letterSpacing: "0.01em",
				color,
				background: "color-mix(in srgb, var(--primary, #0ea5e9) 12%, var(--surface, #fff))",
				border: "1px solid color-mix(in srgb, var(--primary, #0ea5e9) 25%, var(--border, #e2e8f0))",
				borderRadius: "999px",
				padding: "0.25rem 0.625rem",
				width: "fit-content",
			}}
		>
			<span
				aria-hidden="true"
				style={{
					width: "0.4rem",
					height: "0.4rem",
					borderRadius: "50%",
					background: "var(--primary, #0ea5e9)",
				}}
			/>
			{name}
		</span>
	);
}
