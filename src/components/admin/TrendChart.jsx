import { useMemo, useState } from "react";

const WIDTH = 600;
const HEIGHT = 160;

function formatDay(date) {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function buildPath(points, max) {
  const stepX = WIDTH / Math.max(points.length - 1, 1);
  return points
    .map((p, i) => {
      const x = i * stepX;
      const y = HEIGHT - (p / Math.max(max, 1)) * HEIGHT;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function TrendChart({ data }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const max = useMemo(
    () => Math.max(1, ...data.map((d) => Math.max(d.visits, d.submissions))),
    [data]
  );

  const visitsPath = useMemo(() => buildPath(data.map((d) => d.visits), max), [data, max]);
  const submissionsPath = useMemo(() => buildPath(data.map((d) => d.submissions), max), [data, max]);
  const areaPath = `${visitsPath} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  const stepX = WIDTH / Math.max(data.length - 1, 1);
  const active = hoverIndex !== null ? data[hoverIndex] : null;

  return (
    <div className="glass border border-white/10 rounded-2xl p-5 mb-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <p className="font-bold">Tendance sur 30 jours</p>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container" /> Visites
          </span>
          <span className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Demandes
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f75e2d" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f75e2d" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={WIDTH}
            y1={HEIGHT * f}
            y2={HEIGHT * f}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="url(#trendFill)" stroke="none" />
        <path d={visitsPath} fill="none" stroke="#f75e2d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={submissionsPath}
          fill="none"
          stroke="#a9cdce"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 3"
        />
        {hoverIndex !== null && (
          <line x1={hoverIndex * stepX} x2={hoverIndex * stepX} y1="0" y2={HEIGHT} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        )}
        {data.map((_, i) => (
          <rect
            key={i}
            x={i * stepX - stepX / 2}
            y={0}
            width={stepX}
            height={HEIGHT}
            fill="transparent"
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex((cur) => (cur === i ? null : cur))}
          />
        ))}
      </svg>

      <div className="flex items-center justify-between text-[10px] text-on-surface-variant mt-1">
        <span>{formatDay(data[0].label)}</span>
        <span>{formatDay(data[data.length - 1].label)}</span>
      </div>

      <p className="text-xs text-on-surface-variant mt-2 h-4">
        {active && (
          <>
            {formatDay(active.label)} — <span className="text-primary font-semibold">{active.visits} visite(s)</span>,{" "}
            <span className="text-secondary font-semibold">{active.submissions} demande(s)</span>
          </>
        )}
      </p>
    </div>
  );
}
