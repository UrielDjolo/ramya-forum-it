import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-xl border-b border-white/10 shadow-sm">
      <div className="grid grid-cols-2 lg:grid-cols-3 items-center px-6 md:px-margin-desktop h-24 max-w-container-max mx-auto">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img alt="RAMYA Logo" className="h-20 w-auto shrink-0" src="/logo_ramya.png" />
          <span className="hidden md:flex flex-col leading-tight whitespace-nowrap">
            <span className="font-display-md text-xl font-bold text-primary tracking-tight">RAMYA</span>
            <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-semibold">
              Technologie et Innovation
            </span>
          </span>
        </Link>
        <div className="hidden lg:flex gap-6 xl:gap-8 items-center justify-self-center whitespace-nowrap">
          <a className="text-primary border-b-2 border-primary pb-1 font-body-md whitespace-nowrap" href="/#solutions">
            Solutions
          </a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-md whitespace-nowrap" href="/#innovations">
            Innovations
          </a>
          <a className="text-on-surface-variant hover:text-on-surface transition-colors font-body-md whitespace-nowrap" href="/#business-connect">
            Business Connect
          </a>
          <Link className="text-on-surface-variant hover:text-on-surface transition-colors font-body-md whitespace-nowrap" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
