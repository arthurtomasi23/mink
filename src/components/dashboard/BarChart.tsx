type Datum = { label: string; value: number };

/**
 * Lightweight, dependency-free SVG bar chart for time-series data.
 * Designed for small footprints (signups per day for the last N days).
 */
export function BarChart({
  data,
  height = 160,
  formatTooltip,
}: {
  data: Datum[];
  height?: number;
  formatTooltip?: (d: Datum) => string;
}) {
  if (data.length === 0) {
    return (
      <div className="grid h-40 place-items-center text-sm text-(--mink-text-muted)">
        No data yet.
      </div>
    );
  }

  const max = Math.max(1, ...data.map((d) => d.value));
  const barW = 100 / data.length;
  const pad = barW * 0.18;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${data.length * 14} / ${height}` }}>
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Signups per day"
      >
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1="0"
            x2="100"
            y1={height - height * p + 4}
            y2={height - height * p + 4}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {data.map((d, i) => {
          const h = (d.value / max) * (height - 12);
          const x = i * barW + pad;
          const y = height - h - 4;
          return (
            <g key={`${d.label}-${i}`}>
              <rect
                x={x}
                y={y}
                width={barW - pad * 2}
                height={Math.max(h, 0.6)}
                rx="1.5"
                fill={d.value > 0 ? "url(#mink-bar)" : "rgba(255,255,255,0.06)"}
              >
                <title>
                  {formatTooltip ? formatTooltip(d) : `${d.label}: ${d.value}`}
                </title>
              </rect>
            </g>
          );
        })}

        <defs>
          <linearGradient id="mink-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a259f7" />
            <stop offset="100%" stopColor="#7B2CBF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
