import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingContactButton from "./FloatingContactButton";
import { trackVisit } from "../lib/trackVisit";

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname);
  }, [location.pathname]);

  return (
    <div className="font-body-md text-body-md selection:bg-primary-container selection:text-white">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
      <FloatingContactButton />
    </div>
  );
}
