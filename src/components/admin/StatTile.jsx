import useCountUp from "../../hooks/useCountUp";

function Sparkline({ points, color }) {
  if (!points || points.length < 2 || points.every((p) => p === 0)) return null;
  const width = 64;
  const height = 24;
  const max = Math.max(1, ...points);
  const stepX = width / (points.length - 1);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${(i * stepX).toFixed(1)},${(height - (p / max) * height).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-16 h-6 shrink-0" aria-hidden="true">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function StatTile({ icon, value, label, trend, trendColor = "#f75e2d" }) {
  const isNumeric = typeof value === "number";
  const display = useCountUp(isNumeric ? value : 0);

  return (
    <div className="glass border border-white/10 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display-md text-2xl font-bold leading-none">{isNumeric ? display : value}</p>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">{label}</p>
      </div>
      <Sparkline points={trend} color={trendColor} />
    </div>
  );
}
