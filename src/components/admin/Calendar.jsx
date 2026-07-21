import { useMemo, useState } from "react";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Monday-first day-of-week index (0 = Monday ... 6 = Sunday).
function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

export default function Calendar({ submissions, selectedDay, onSelectDay }) {
  const [monthDate, setMonthDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const countsByDay = useMemo(() => {
    const map = {};
    for (const s of submissions) {
      const key = dateKey(new Date(s.created_at));
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [submissions]);

  const maxCount = useMemo(() => Math.max(1, ...Object.values(countsByDay)), [countsByDay]);

  const cells = useMemo(() => {
    const firstOfMonth = new Date(monthDate);
    const leadingBlanks = mondayIndex(firstOfMonth);
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();

    const result = [];
    for (let i = 0; i < leadingBlanks; i++) result.push(null);
    for (let day = 1; day <= daysInMonth; day++) {
      result.push(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
    }
    return result;
  }, [monthDate]);

  function goToMonth(offset) {
    setMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  function intensity(count) {
    if (!count) return 0;
    return Math.min(0.18 + (count / maxCount) * 0.62, 0.8);
  }

  const todayKey = dateKey(new Date());

  return (
    <div className="glass border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-bold">
          {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goToMonth(-1)}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const d = new Date();
              d.setDate(1);
              setMonthDate(d);
            }}
            className="px-3 h-8 rounded-full border border-white/10 text-xs font-semibold hover:border-primary/50 transition-colors"
          >
            Aujourd'hui
          </button>
          <button
            type="button"
            onClick={() => goToMonth(1)}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-primary/50 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;
          const key = dateKey(date);
          const count = countsByDay[key] || 0;
          const isSelected = selectedDay === key;
          const isToday = key === todayKey;
          return (
            <button
              key={key}
              type="button"
              disabled={count === 0}
              onClick={() => onSelectDay(isSelected ? null : key)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative transition-all ${
                count === 0 ? "text-on-surface-variant/40 cursor-default" : "font-semibold hover:scale-105 cursor-pointer"
              } ${isSelected ? "ring-2 ring-primary" : ""} ${isToday ? "border border-primary/60" : ""}`}
              style={count > 0 ? { backgroundColor: `rgba(247, 94, 45, ${intensity(count)})` } : undefined}
              title={count > 0 ? `${count} demande(s)` : undefined}
            >
              {date.getDate()}
              {count > 0 && <span className="text-[9px] leading-none mt-0.5">{count}</span>}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <button
          type="button"
          onClick={() => onSelectDay(null)}
          className="mt-4 text-xs text-primary font-semibold hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">close</span>
          Effacer le filtre du {selectedDay}
        </button>
      )}
    </div>
  );
}
