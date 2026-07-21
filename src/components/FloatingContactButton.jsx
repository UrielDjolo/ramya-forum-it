import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function FloatingContactButton() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 500);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  if (location.pathname === "/contact" || !visible) return null;

  return (
    <Link
      to="/contact"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-4 bg-primary-container text-white rounded-full font-bold text-sm shadow-2xl shadow-primary-container/30 hover:brightness-110 hover:scale-105 transition-all ease-premium animate-[fadeIn_0.3s_ease-premium]"
    >
      <span className="material-symbols-outlined">edit_note</span>
      <span className="hidden sm:inline">Exprimer mon besoin</span>
    </Link>
  );
}
