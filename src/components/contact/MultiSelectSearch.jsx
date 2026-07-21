import { useEffect, useRef, useState } from "react";

export default function MultiSelectSearch({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));

  function toggleOption(option) {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  }

  function removeOption(option) {
    onChange(value.filter((item) => item !== option));
  }

  return (
    <div className="relative" ref={containerRef}>
      <div
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className="min-h-[3.25rem] w-full bg-on-surface/5 border border-on-surface/10 rounded-xl px-4 py-2.5 flex flex-wrap items-center gap-2 cursor-text focus-within:ring-2 focus-within:ring-primary/50 transition-all"
      >
        {value.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 max-w-full bg-primary-container/20 text-primary text-sm px-3 py-1 rounded-full border border-primary/30"
          >
            <span className="break-words">{item}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeOption(item);
              }}
              className="material-symbols-outlined text-sm hover:text-error transition-colors"
            >
              close
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-on-surface-variant/60 py-1"
        />
        <span className="material-symbols-outlined text-on-surface-variant text-lg">
          {open ? "expand_less" : "expand_more"}
        </span>
      </div>

      {open && (
        <div className="relative mt-2 w-full rounded-2xl border border-on-surface/10 shadow-2xl max-h-64 overflow-y-auto py-2 bg-surface-container-high">
          {filtered.length === 0 && (
            <p className="px-4 py-3 text-sm text-on-surface-variant">Aucun service trouvé.</p>
          )}
          {filtered.map((option) => {
            const selected = value.includes(option);
            return (
              <button
                type="button"
                key={option}
                onClick={() => toggleOption(option)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-on-surface/5 ${
                  selected ? "text-primary" : "text-on-surface"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    selected ? "bg-primary-container border-primary-container" : "border-on-surface/20"
                  }`}
                >
                  {selected && <span className="material-symbols-outlined text-sm text-white">check</span>}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
