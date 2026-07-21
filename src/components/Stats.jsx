import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const stats = [
  { value: "100%", label: "Fiabilité" },
  { value: "500+", label: "Clients" },
  { value: "< 1h", label: "Réponse" },
  { value: "24/24", label: "Surveillance" },
];

export default function Stats() {
  const revealRef = useReveal();

  return (
    <section className="py-24 relative">
      <div
        ref={revealRef}
        className="container mx-auto px-6 md:px-margin-desktop transition-all duration-1000 opacity-0 translate-y-10 ease-premium"
      >
        <div className="glass p-12 md:p-20 rounded-[3rem] border border-on-surface/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {stats.map((stat) => (
              <div className="space-y-4" key={stat.label}>
                <div className="text-primary-container font-display-md text-display-md">{stat.value}</div>
                <div className="text-on-surface uppercase tracking-widest text-label-sm font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-container text-white rounded-full font-bold text-body-md hover:brightness-110 hover:scale-105 transition-all ease-premium"
            >
              De quoi avez-vous besoin ?
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
