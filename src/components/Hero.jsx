import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const SLIDES = [
  {
    id: 1,
    title: "Marahoué Business Connect 2026",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDulysvpo1l2vPXYe9T4DasfsqCKQb2tf6d7ufOtawtosQi8Hs8F8p4fKmzqtWI6d4Ht_T5jDqCV_caLR2nO88_w4wzEgFaBguL3Nr7n6nts87urC-jOBBht0IgYJW6lpCBa2tusPhs8Nnj-wAGM5PZbLhA7tK5dE9XU4s1EE6VCz_6tPT9fPjnUHOFYZrRV8U6Ws__EaTruoA1-yFsVCVaw76HsrRgZu-4xo_kzxIT_1OOSs3b1eqVTTlszh7E4X-r2A",
    fit: "cover",
  },
  { id: 2, title: "Vidéosurveillance", image: "/produits/2.jpg", fit: "cover" },
  { id: 3, title: "Clôture électrique", image: "/produits/video-surveillance-2898.jpg", fit: "cover" },
  { id: 4, title: "Portails automatisés", image: "/produits/produit-1.jpg", fit: "cover" },
  { id: 5, title: "Poignées intelligentes", image: "/produits/images.jpg", fit: "cover" },
  { id: 6, title: "Contrôle d'accès & Pointage biométrique", image: "/produits/1.jpg", fit: "cover" },
  { id: 7, title: "Coffres-forts", image: "/produits/300-big.jpg", fit: "cover" },
  { id: 8, title: "Tracking véhicule", image: "/produits/fffww.jpg", fit: "cover" },
  { id: 10, title: "Sécurité incendie (SSI)", image: "/produits/incendie.png", fit: "cover" },
  { id: 11, title: "RAMYA Technologie & Innovation", image: "/logo_ramya.png", fit: "contain" },
];

export default function Hero() {
  const revealRef = useReveal();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden hero-mesh">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface"></div>
      </div>
      <div
        ref={revealRef}
        className="container mx-auto px-6 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 transition-all duration-1000 opacity-0 translate-y-10 ease-premium"
      >
        <div className="space-y-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 opacity-0"
            style={{ animation: "fadeInUp 0.7s ease-out 0.1s forwards" }}
          >
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="text-label-sm uppercase tracking-widest text-primary">
              En direct du Marahoué Business Connect 2026
            </span>
          </div>
          <h1
            className="font-display-lg text-display-lg leading-tight opacity-0"
            style={{ animation: "fadeInUp 0.7s ease-out 0.3s forwards" }}
          >
            Bienvenue au stand de <span className="text-primary-container">RAMYA</span> !
          </h1>
          <p
            className="text-body-lg text-on-surface-variant max-w-lg leading-relaxed opacity-0"
            style={{ animation: "fadeInUp 0.7s ease-out 0.5s forwards" }}
          >
            Merci de votre visite. Notre équipe est présente sur place pour vous présenter nos solutions
            électroniques et vous accompagner dans vos projets de sécurité et de connectivité.
          </p>
          <div
            className="pt-4 opacity-0"
            style={{ animation: "fadeInUp 0.7s ease-out 0.7s forwards" }}
          >
            <a
              href="#solutions"
              className="px-8 py-4 bg-primary-container text-white rounded-full font-bold text-body-md hover:brightness-110 hover:scale-105 transition-all ease-premium inline-flex items-center justify-center gap-2"
            >
              Découvrir nos solutions
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
          <div
            className="pt-6 space-y-4 opacity-0"
            style={{ animation: "fadeInUp 0.7s ease-out 0.9s forwards" }}
          >
            <p className="flex items-center gap-2 text-secondary font-bold text-xl sm:text-2xl">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">support_agent</span>
              Envie d'un accompagnement ?
            </p>
            <p className="text-on-surface-variant text-sm max-w-md">
              Cliquez sur le bouton ci-dessous pour nous décrire votre besoin.
            </p>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-10 py-5 bg-secondary text-on-secondary rounded-full font-extrabold text-lg sm:text-xl hover:brightness-110 hover:scale-105 transition-all ease-premium flex items-center justify-center gap-3 shadow-2xl shadow-secondary/20"
            >
              Exprimer mon besoin
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </Link>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full transition-all group-hover:bg-primary/20"></div>
          <div className="relative glass rounded-3xl overflow-hidden border border-on-surface/10 shadow-2xl aspect-[4/5]">
            {SLIDES.map((slide, i) => (
              <img
                key={slide.id}
                alt={slide.title}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                  slide.fit === "contain" ? "object-contain bg-white p-12" : "object-cover"
                } ${i === index ? "opacity-100" : "opacity-0"}`}
                src={slide.image}
              />
            ))}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-12 flex items-center justify-between gap-3">
              <p className="text-white font-bold text-sm">{SLIDES[index].title}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                {SLIDES.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Aller à la diapositive ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-primary-container" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
