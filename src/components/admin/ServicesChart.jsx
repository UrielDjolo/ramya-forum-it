import { useMemo } from "react";

export default function ServicesChart({ submissions }) {
  const rows = useMemo(() => {
    const counts = {};
    for (const s of submissions) {
      for (const service of s.services || []) {
        counts[service] = (counts[service] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [submissions]);

  const max = Math.max(1, ...rows.map((r) => r.value));

  if (rows.length === 0) {
    return (
      <div className="glass border border-white/10 rounded-2xl p-5">
        <p className="font-bold mb-1">Services les plus demandés</p>
        <p className="text-on-surface-variant text-sm py-6 text-center">Aucune donnée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="glass border border-white/10 rounded-2xl p-5">
      <p className="font-bold mb-4">Services les plus demandés</p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <p className="w-36 sm:w-44 shrink-0 text-xs text-on-surface-variant truncate" title={row.label}>
              {row.label}
            </p>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-3 bg-primary-container rounded-r"
                  style={{ width: `${Math.max((row.value / max) * 100, 4)}%` }}
                />
              </div>
              <span className="text-xs font-bold w-6 text-right shrink-0">{row.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
