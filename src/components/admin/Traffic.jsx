import { useMemo, useState } from "react";
import StatTile from "./StatTile";
import { dailyCounts } from "../../lib/dateBuckets";

const DEVICE_ICONS = {
  Mobile: "smartphone",
  Tablette: "tablet_mac",
  Ordinateur: "computer",
};

const SEARCH_ENGINES = ["google.", "bing.", "yahoo.", "duckduckgo.", "ecosia.", "qwant."];
const SOCIAL_NETWORKS = [
  "facebook.", "instagram.", "twitter.", "x.com", "linkedin.", "tiktok.", "whatsapp.", "t.co", "youtube.",
];

function BreakdownCard({ title, rows }) {
  const max = Math.max(1, ...rows.map((r) => r.value));

  if (rows.length === 0) {
    return (
      <div className="glass border border-white/10 rounded-2xl p-5">
        <p className="font-bold mb-1">{title}</p>
        <p className="text-on-surface-variant text-sm py-6 text-center">Aucune donnée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="glass border border-white/10 rounded-2xl p-5">
      <p className="font-bold mb-4">{title}</p>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-3">
            <p className="w-28 sm:w-32 shrink-0 text-xs text-on-surface-variant truncate" title={row.label}>
              {row.label}
            </p>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-3 bg-primary-container rounded-r"
                  style={{ width: `${Math.max((row.value / max) * 100, 4)}%` }}
                />
              </div>
              <span className="text-xs font-bold w-8 text-right shrink-0">{row.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function referrerLabel(referrer) {
  if (!referrer) return "Accès direct";
  try {
    return new URL(referrer).hostname;
  } catch {
    return referrer;
  }
}

function categorizeReferrer(referrer) {
  if (!referrer) return "Accès direct";
  let hostname;
  try {
    hostname = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "Autres sites";
  }
  if (typeof window !== "undefined" && hostname === window.location.hostname) return "Navigation interne";
  if (SEARCH_ENGINES.some((s) => hostname.includes(s))) return "Recherche";
  if (SOCIAL_NETWORKS.some((s) => hostname.includes(s))) return "Réseaux sociaux";
  return "Autres sites";
}

function countBy(items, key) {
  const counts = {};
  for (const item of items) {
    const label = item[key] || "Inconnu";
    counts[label] = (counts[label] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

export default function Traffic({ visits, loading, error, onRefresh, onReset }) {
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    const confirmed = window.confirm(
      "Réinitialiser tout le trafic ? Cette action supprime définitivement toutes les visites enregistrées."
    );
    if (!confirmed) return;
    setResetting(true);
    try {
      await onReset();
    } finally {
      setResetting(false);
    }
  }

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: visits.length,
      unique: new Set(visits.map((v) => v.visitor_id)).size,
      today: visits.filter((v) => new Date(v.created_at).toDateString() === today).length,
      mobile: visits.filter((v) => v.device_type === "Mobile").length,
    };
  }, [visits]);

  const visitsTrend = useMemo(() => dailyCounts(visits, 7), [visits]);

  const byDevice = useMemo(() => countBy(visits, "device_type"), [visits]);
  const byBrowser = useMemo(() => countBy(visits, "browser").slice(0, 6), [visits]);
  const byOs = useMemo(() => countBy(visits, "os").slice(0, 6), [visits]);
  const byPage = useMemo(() => countBy(visits, "path").slice(0, 8), [visits]);
  const byDeviceName = useMemo(
    () => countBy(visits.filter((v) => v.device_name), "device_name").slice(0, 8),
    [visits]
  );
  const bySource = useMemo(
    () => countBy(visits.map((v) => ({ source: categorizeReferrer(v.referrer) })), "source"),
    [visits]
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <h2 className="font-headline-lg text-xl font-bold">Trafic du site</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={onRefresh}
            className="px-4 py-2 rounded-full border border-white/10 text-sm font-semibold hover:border-primary/50 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Actualiser
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || visits.length === 0}
            className="px-4 py-2 rounded-full border border-white/10 text-sm font-semibold hover:border-error/50 hover:text-error transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">delete_sweep</span>
            {resetting ? "Réinitialisation..." : "Réinitialiser le trafic"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile icon="visibility" value={stats.total} label="Pages vues" trend={visitsTrend} trendColor="#f75e2d" />
        <StatTile icon="group" value={stats.unique} label="Visiteurs uniques" />
        <StatTile icon="today" value={stats.today} label="Aujourd'hui" />
        <StatTile icon="smartphone" value={stats.mobile} label="Via mobile" />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-on-surface-variant py-10 justify-center">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Chargement...
        </div>
      )}
      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error rounded-2xl px-5 py-4 text-sm mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <BreakdownCard title="Appareils" rows={byDevice} />
            <BreakdownCard title="Navigateurs" rows={byBrowser} />
            <BreakdownCard title="Systèmes" rows={byOs} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <BreakdownCard title="Sources de trafic" rows={bySource} />
            <BreakdownCard title="Modèles de téléphone/tablette" rows={byDeviceName} />
            <BreakdownCard title="Pages les plus visitées" rows={byPage} />
          </div>

          <div className="glass border border-white/10 rounded-2xl overflow-hidden">
            <p className="font-bold p-5 pb-3">Visites récentes</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-on-surface-variant text-xs uppercase tracking-widest border-t border-white/10">
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Page</th>
                    <th className="px-5 py-3 font-semibold">Appareil</th>
                    <th className="px-5 py-3 font-semibold">Navigateur</th>
                    <th className="px-5 py-3 font-semibold">Système</th>
                    <th className="px-5 py-3 font-semibold">Provenance</th>
                  </tr>
                </thead>
                <tbody>
                  {visits.slice(0, 100).map((v) => (
                    <tr key={v.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap text-on-surface-variant">
                        {new Date(v.created_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">{v.path}</td>
                      <td className="px-5 py-3 whitespace-nowrap flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-primary">
                          {DEVICE_ICONS[v.device_type] || "devices_other"}
                        </span>
                        {v.device_name || v.device_type || "—"}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">{v.browser || "—"}</td>
                      <td className="px-5 py-3 whitespace-nowrap">{v.os || "—"}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-on-surface-variant truncate max-w-[180px]">
                        {referrerLabel(v.referrer)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visits.length === 0 && (
              <div className="text-center py-16 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2">travel_explore</span>
                <p>Aucune visite enregistrée pour le moment.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
