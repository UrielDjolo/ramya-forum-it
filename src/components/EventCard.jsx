import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

export default function EventCard() {
  const revealRef = useReveal();

  return (
    <section id="business-connect" className="py-12 relative z-20 scroll-mt-24">
      <div
        ref={revealRef}
        className="max-w-container-max mx-auto px-6 md:px-margin-desktop transition-all duration-1000 opacity-0 translate-y-10 ease-premium"
      >
        <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-on-surface/5 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary-container flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-4xl">calendar_today</span>
            </div>
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Marahoué Business Connect 2026</h2>
              <p className="text-on-surface-variant">Bouaflé, Côte d'Ivoire • 30 &amp; 31 Juillet 2026</p>
            </div>
          </div>
          <div className="h-px md:h-16 w-full md:w-px bg-on-surface/10"></div>
          <div className="text-center md:text-left">
            <p className="text-label-sm text-primary uppercase mb-2">Thème de l'événement</p>
            <p className="font-headline-lg text-headline-lg text-on-surface leading-tight">
              Investir localement,
              <br />
              <span className="text-primary-container">impacter durablement</span>
            </p>
          </div>
        </div>
        <div className="text-center mt-6">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-primary font-bold text-label-sm hover:gap-4 transition-all"
          >
            PRENDRE RENDEZ-VOUS AVEC NOTRE ÉQUIPE
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
