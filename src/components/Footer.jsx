import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest py-16 border-t border-on-surface/5 mt-20">
      <div className="flex flex-col items-center text-center gap-6 px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img alt="RAMYA Logo" className="h-16 w-auto" src="/logo_ramya.png" />
          <span className="flex flex-col items-start leading-tight">
            <span className="font-headline-lg text-xl font-bold text-on-surface">RAMYA</span>
            <span className="text-on-surface-variant text-[11px] uppercase tracking-widest font-semibold whitespace-nowrap">
              Technologie et Innovation
            </span>
          </span>
        </Link>
        <p className="text-on-surface-variant text-sm leading-relaxed max-w-md">
          Leader en Côte d'Ivoire pour les solutions électroniques avancées et la sécurité intelligente.
        </p>
      </div>
      <div className="mt-12 pt-6 border-t border-on-surface/5 text-center px-6 max-w-2xl mx-auto space-y-3">
        <p className="text-on-surface-variant/70 text-[11px] leading-relaxed">
          Société à responsabilité limitée au capital social de 1.000.000 FCFA, inscrite au S.A.R.L — Siège social :
          Abidjan/Cocody-Abatta, BP 813 Bingerville — Tel :{" "}
          {["27 222 044 98", "07 095 002 43", "07 476 820 27", "05 65 51 59 76"].map((phone, index) => (
            <span key={phone}>
              {index > 0 && " / "}
              <a className="hover:text-primary transition-colors" href={`tel:${phone.replace(/\s/g, "")}`}>
                {phone}
              </a>
            </span>
          ))}
        </p>
        <p className="text-on-surface-variant text-xs">© 2026 RAMYA TECHNOLOGIE &amp; INNOVATION. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
