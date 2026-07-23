import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { exportSubmissionToPdf, exportAllSubmissionsToPdf } from "../lib/exportPdf";
import { exportSubmissionsToExcel } from "../lib/exportExcel";
import Calendar from "../components/admin/Calendar";
import ServicesChart from "../components/admin/ServicesChart";
import Toast from "../components/admin/Toast";
import Traffic from "../components/admin/Traffic";

function dateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const STATUSES = [
  { value: "nouveau", label: "Nouveau", badgeClass: "bg-primary-container/20 text-primary" },
  { value: "contacte", label: "Contacté", badgeClass: "bg-secondary/20 text-secondary" },
  { value: "en_cours", label: "En cours", badgeClass: "bg-tertiary/30 text-on-surface" },
  { value: "converti", label: "Converti", badgeClass: "bg-[#22c55e]/20 text-[#4ade80]" },
  { value: "perdu", label: "Perdu", badgeClass: "bg-error/20 text-error" },
];

function statusConfig(status) {
  return STATUSES.find((s) => s.value === status) || STATUSES[0];
}

// Buckets submissions into date-based sections, preserving incoming (already sorted) order.
function groupByPeriod(items) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfToday.getDay() + 6) % 7));

  const buckets = { "Aujourd'hui": [], Hier: [], "Cette semaine": [], "Plus ancien": [] };
  for (const item of items) {
    const d = new Date(item.created_at);
    if (d >= startOfToday) buckets["Aujourd'hui"].push(item);
    else if (d >= startOfYesterday) buckets["Hier"].push(item);
    else if (d >= startOfWeek) buckets["Cette semaine"].push(item);
    else buckets["Plus ancien"].push(item);
  }
  return Object.entries(buckets).filter(([, list]) => list.length > 0);
}

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all placeholder:text-on-surface-variant/60";

function AdminShell({ children }) {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col hero-mesh">
      <header className="flex items-center justify-between gap-3 px-6 py-4 border-b border-white/10 bg-surface/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img alt="RAMYA Logo" className="h-10 w-auto" src="/logo_ramya.png" />
          <div>
            <p className="font-bold text-sm leading-none">RAMYA</p>
            <p className="text-on-surface-variant text-[10px] uppercase tracking-widest">Espace Admin</p>
          </div>
        </div>
        <Link
          to="/"
          className="text-on-surface-variant text-sm hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="hidden sm:inline">Retour au site</span>
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function LoginScreen({ onLogin, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 glass p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="text-center space-y-1">
          <img alt="RAMYA Logo" className="h-24 w-auto mx-auto mb-4" src="/logo_ramya.png" />
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-container/20 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-3xl text-primary">lock</span>
          </div>
          <h1 className="font-headline-lg text-xl font-bold">Connexion administrateur</h1>
          <p className="text-on-surface-variant text-sm">Accès réservé à l'équipe RAMYA.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            required
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Mot de passe</label>
          <input
            type="password"
            required
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-error text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-container text-white rounded-full font-bold hover:brightness-110 hover:scale-[1.02] transition-all disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

function StatTile({ icon, value, label }) {
  return (
    <div className="glass border border-white/10 rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="font-display-md text-2xl font-bold leading-none">{value}</p>
        <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}

function SubmissionCard({ submission, onOpen, onStatusChange, selected, onToggleSelect }) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const isEntreprise = submission.type === "entreprise";
  const isUnread = submission.read === false;
  const date = new Date(submission.created_at).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  function toggleOpen() {
    setOpen((v) => !v);
    if (isUnread) onOpen(submission.id);
  }

  async function handleExport(e) {
    e.stopPropagation();
    setExporting(true);
    try {
      await exportSubmissionToPdf(submission);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div
      className={`glass border-l-4 border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:-translate-y-0.5 transition-all ease-premium relative ${
        isEntreprise ? "border-l-secondary" : "border-l-primary"
      } ${isUnread ? "ring-1 ring-primary/40" : ""} ${selected ? "ring-2 ring-primary" : ""}`}
    >
      {isUnread && <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary-container" title="Non lu" />}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(submission.id);
          }}
          className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
            selected ? "bg-primary-container border-primary-container" : "border-white/20 hover:border-primary/50"
          }`}
          aria-label={selected ? "Désélectionner" : "Sélectionner"}
        >
          {selected && <span className="material-symbols-outlined text-sm text-white">check</span>}
        </button>
        <button type="button" onClick={toggleOpen} className="flex-1 flex items-center gap-4 text-left min-w-0">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
              isEntreprise ? "bg-secondary/20 text-secondary" : "bg-primary-container/20 text-primary"
            }`}
          >
            {(submission.nom_prenom || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={isUnread ? "font-extrabold" : "font-bold"}>{submission.nom_prenom}</span>
              <span
                className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                  isEntreprise ? "bg-secondary/20 text-secondary" : "bg-primary-container/20 text-primary"
                }`}
              >
                {isEntreprise ? submission.entreprise_nom || "Entreprise" : "Particulier"}
              </span>
            </div>
            <p className="text-on-surface-variant text-sm mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">call</span>
                {submission.telephone}
              </span>
              {submission.email && (
                <span className="flex items-center gap-1 truncate">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  {submission.email}
                </span>
              )}
            </p>
            <p className="text-on-surface-variant text-xs mt-1.5 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">schedule</span>
              {date}
            </p>
          </div>
          <span className="material-symbols-outlined shrink-0">{open ? "expand_less" : "expand_more"}</span>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={submission.status || "nouveau"}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onStatusChange(submission.id, e.target.value)}
            className={`text-[11px] uppercase tracking-widest font-bold px-3 py-2 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${statusConfig(submission.status).badgeClass}`}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {submission.telephone && (
            <a
              href={`tel:${submission.telephone.replace(/\s/g, "")}`}
              onClick={(e) => e.stopPropagation()}
              title="Appeler"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-lg">call</span>
            </a>
          )}
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            title="Exporter cette fiche en PDF"
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-lg">{exporting ? "hourglass_top" : "picture_as_pdf"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {submission.entreprise_nom && (
            <div>
              <p className="text-on-surface-variant text-xs">Entreprise</p>
              <p>{submission.entreprise_nom}</p>
            </div>
          )}
          {submission.secteur && (
            <div>
              <p className="text-on-surface-variant text-xs">Secteur</p>
              <p>{submission.secteur}</p>
            </div>
          )}
          {submission.fonction && (
            <div>
              <p className="text-on-surface-variant text-xs">Fonction</p>
              <p>{submission.fonction}</p>
            </div>
          )}
          {submission.whatsapp && (
            <div>
              <p className="text-on-surface-variant text-xs">WhatsApp</p>
              <p>{submission.whatsapp}</p>
            </div>
          )}
          <div className="sm:col-span-2">
            <p className="text-on-surface-variant text-xs">Localisation</p>
            <p>
              {[submission.quartier, submission.commune, submission.ville, submission.adresse]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-on-surface-variant text-xs">Services recherchés</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {submission.services?.length ? (
                submission.services.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary-container/20 text-primary font-semibold"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span>—</span>
              )}
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="text-on-surface-variant text-xs">Besoin décrit</p>
            <p className="whitespace-pre-wrap">{submission.besoin || "—"}</p>
          </div>
          {submission.observations && (
            <div className="sm:col-span-2">
              <p className="text-on-surface-variant text-xs">Observations</p>
              <p className="whitespace-pre-wrap">{submission.observations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Dashboard({ userEmail, onLogout }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDay, setSelectedDay] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [exportingSelectionPdf, setExportingSelectionPdf] = useState(false);
  const [exportingSelectionExcel, setExportingSelectionExcel] = useState(false);
  const [tab, setTab] = useState("demandes");

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    else setSubmissions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Live notifications: new submissions appear instantly while the dashboard is open.
  useEffect(() => {
    const channel = supabase
      .channel("contact_submissions_inserts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions" },
        (payload) => {
          setSubmissions((prev) => [payload.new, ...prev]);
          setToasts((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              message: `${payload.new.nom_prenom} — ${payload.new.telephone}`,
            },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const unread = submissions.filter((s) => s.read === false).length;
    document.title = unread > 0 ? `(${unread}) Demandes — RAMYA Admin` : "RAMYA Admin";
    return () => {
      document.title = "RAMYA Admin";
    };
  }, [submissions]);

  function dismissToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function markAsRead(id) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, read: true } : s)));
    await supabase.from("contact_submissions").update({ read: true }).eq("id", id);
  }

  async function updateStatus(id, status) {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    await supabase.from("contact_submissions").update({ status }).eq("id", id);
  }

  async function markAllAsRead() {
    const unreadIds = submissions.filter((s) => s.read === false).map((s) => s.id);
    if (unreadIds.length === 0) return;
    setSubmissions((prev) => prev.map((s) => (unreadIds.includes(s.id) ? { ...s, read: true } : s)));
    await supabase.from("contact_submissions").update({ read: true }).in("id", unreadIds);
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function selectAllVisible() {
    const visibleIds = filteredSubmissions.map((s) => s.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : visibleIds);
  }

  async function handleExportSelectionPdf() {
    setExportingSelectionPdf(true);
    try {
      if (selectedIds.length === 1) {
        await exportSubmissionToPdf(submissions.find((s) => s.id === selectedIds[0]));
      } else {
        await exportAllSubmissionsToPdf(submissions.filter((s) => selectedIds.includes(s.id)));
      }
    } finally {
      setExportingSelectionPdf(false);
    }
  }

  async function handleExportSelectionExcel() {
    setExportingSelectionExcel(true);
    try {
      await exportSubmissionsToExcel(submissions.filter((s) => selectedIds.includes(s.id)));
    } finally {
      setExportingSelectionExcel(false);
    }
  }

  async function handleExportAllPdf() {
    setExportingPdf(true);
    try {
      await exportAllSubmissionsToPdf(filteredSubmissions);
    } finally {
      setExportingPdf(false);
    }
  }

  async function handleExportExcel() {
    setExportingExcel(true);
    try {
      await exportSubmissionsToExcel(filteredSubmissions);
    } finally {
      setExportingExcel(false);
    }
  }

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: submissions.length,
      entreprises: submissions.filter((s) => s.type === "entreprise").length,
      particuliers: submissions.filter((s) => s.type !== "entreprise").length,
      today: submissions.filter((s) => new Date(s.created_at).toDateString() === today).length,
      unread: submissions.filter((s) => s.read === false).length,
    };
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return submissions.filter((s) => {
      if (typeFilter !== "all" && s.type !== typeFilter) return false;
      if (statusFilter !== "all" && (s.status || "nouveau") !== statusFilter) return false;
      if (selectedDay && dateKey(s.created_at) !== selectedDay) return false;
      if (!query) return true;
      return [s.nom_prenom, s.entreprise_nom, s.telephone, s.email]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(query));
    });
  }, [submissions, search, typeFilter, statusFilter, selectedDay]);

  const groupedSubmissions = useMemo(() => groupByPeriod(filteredSubmissions), [filteredSubmissions]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined">notifications</span>
            </div>
            {stats.unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-on-error text-[10px] font-bold flex items-center justify-center">
                {stats.unread}
              </span>
            )}
          </div>
          <div>
            <h1 className="font-headline-lg text-2xl font-bold">Demandes reçues</h1>
            <p className="text-on-surface-variant text-sm">
              Connecté en tant que {userEmail}
              {stats.unread > 0 && <span className="text-primary font-semibold"> • {stats.unread} non lue(s)</span>}
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {stats.unread > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-full border border-white/10 text-sm font-semibold hover:border-primary/50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base">done_all</span>
              Tout marquer lu
            </button>
          )}
          <button
            type="button"
            onClick={fetchSubmissions}
            className="px-4 py-2 rounded-full border border-white/10 text-sm font-semibold hover:border-primary/50 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Actualiser
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 rounded-full border border-white/10 text-sm font-semibold hover:border-error/50 hover:text-error transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8 p-1 rounded-full border border-white/10 w-fit">
        {[
          { value: "demandes", label: "Demandes", icon: "inbox" },
          { value: "trafic", label: "Trafic", icon: "monitoring" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTab(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
              tab === option.value
                ? "bg-primary-container text-white"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-base">{option.icon}</span>
            {option.label}
          </button>
        ))}
      </div>

      {tab === "trafic" ? (
        <Traffic />
      ) : (
        <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile icon="inbox" value={stats.total} label="Total demandes" />
        <StatTile icon="domain" value={stats.entreprises} label="Entreprises" />
        <StatTile icon="person" value={stats.particuliers} label="Particuliers" />
        <StatTile icon="today" value={stats.today} label="Aujourd'hui" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Calendar submissions={submissions} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        <ServicesChart submissions={submissions} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">
            search
          </span>
          <input
            type="text"
            placeholder="Rechercher par nom, entreprise, téléphone, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputClass} pl-11`}
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tous" },
            { value: "particulier", label: "Particuliers" },
            { value: "entreprise", label: "Entreprises" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTypeFilter(option.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap ${
                typeFilter === option.value
                  ? "bg-primary-container/20 border-primary text-primary"
                  : "border-white/10 text-on-surface-variant hover:border-white/30"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-6">
        <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold mr-1">Statut :</span>
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${
            statusFilter === "all"
              ? "bg-primary-container/20 border-primary text-primary"
              : "border-white/10 text-on-surface-variant hover:border-white/30"
          }`}
        >
          Tous
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setStatusFilter(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${
              statusFilter === s.value ? `${s.badgeClass} border-transparent` : "border-white/10 text-on-surface-variant hover:border-white/30"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <button
          type="button"
          onClick={selectAllVisible}
          className="px-4 py-2 rounded-full border border-white/10 text-sm font-semibold hover:border-primary/50 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">
            {filteredSubmissions.length > 0 && filteredSubmissions.every((s) => selectedIds.includes(s.id))
              ? "check_box"
              : "check_box_outline_blank"}
          </span>
          {selectedIds.length > 0 ? `${selectedIds.length} sélectionné(s)` : "Tout sélectionner (cette liste)"}
        </button>
        {selectedIds.length > 0 && (
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-on-surface-variant text-sm hover:text-primary transition-colors"
          >
            Annuler la sélection
          </button>
        )}
      </div>

      {selectedIds.length > 0 ? (
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            type="button"
            onClick={handleExportSelectionPdf}
            disabled={exportingSelectionPdf}
            className="px-5 py-3 rounded-full bg-primary-container text-white text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            {exportingSelectionPdf
              ? "Génération..."
              : selectedIds.length === 1
              ? "Exporter ce client en PDF"
              : `Exporter la sélection (${selectedIds.length}) en PDF`}
          </button>
          <button
            type="button"
            onClick={handleExportSelectionExcel}
            disabled={exportingSelectionExcel}
            className="px-5 py-3 rounded-full border border-secondary text-secondary text-sm font-bold hover:bg-secondary/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">grid_on</span>
            {exportingSelectionExcel ? "Génération..." : `Exporter la sélection (${selectedIds.length}) en Excel`}
          </button>
        </div>
      ) : (
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            type="button"
            onClick={handleExportAllPdf}
            disabled={exportingPdf || filteredSubmissions.length === 0}
            className="px-5 py-3 rounded-full bg-primary-container text-white text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            {exportingPdf ? "Génération..." : `Exporter tous (${filteredSubmissions.length}) en PDF`}
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exportingExcel || filteredSubmissions.length === 0}
            className="px-5 py-3 rounded-full border border-secondary text-secondary text-sm font-bold hover:bg-secondary/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">grid_on</span>
            {exportingExcel ? "Génération..." : `Exporter tous (${filteredSubmissions.length}) en Excel`}
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-on-surface-variant py-10 justify-center">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Chargement...
        </div>
      )}
      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error rounded-2xl px-5 py-4 text-sm">
          {error}
        </div>
      )}
      {!loading && !error && submissions.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
          <p>Aucune demande reçue pour le moment.</p>
        </div>
      )}
      {!loading && !error && submissions.length > 0 && filteredSubmissions.length === 0 && (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
          <p>Aucun résultat pour cette recherche.</p>
        </div>
      )}

      <div className="space-y-8">
        {groupedSubmissions.map(([period, items]) => (
          <div key={period}>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold mb-3">
              {period} <span className="text-on-surface-variant/60">({items.length})</span>
            </p>
            <div className="space-y-4">
              {items.map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  onOpen={markAsRead}
                  onStatusChange={updateStatus}
                  selected={selectedIds.includes(submission.id)}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!supabaseConfigured) {
      setCheckingSession(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogin(email, password) {
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError("Email ou mot de passe incorrect.");
    setAuthLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (!supabaseConfigured) {
    return (
      <AdminShell>
        <div className="max-w-lg mx-auto px-6 py-20 text-center space-y-3">
          <span className="material-symbols-outlined text-4xl text-error">error</span>
          <h1 className="font-headline-lg text-xl font-bold">Supabase non configuré</h1>
          <p className="text-on-surface-variant text-sm">
            Renseignez <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans un fichier{" "}
            <code>.env</code> à la racine du projet, puis relancez le serveur.
          </p>
        </div>
      </AdminShell>
    );
  }

  if (checkingSession) {
    return (
      <AdminShell>
        <div className="min-h-[80vh] flex items-center justify-center text-on-surface-variant">Chargement...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {session ? (
        <Dashboard userEmail={session.user.email} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} loading={authLoading} error={authError} />
      )}
    </AdminShell>
  );
}
