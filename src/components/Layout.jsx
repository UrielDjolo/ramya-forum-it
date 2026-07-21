import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingContactButton from "./FloatingContactButton";

export default function Layout({ children }) {
  return (
    <div className="font-body-md text-body-md selection:bg-primary-container selection:text-white">
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
      <FloatingContactButton />
    </div>
  );
}
