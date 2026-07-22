import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useReveal from "../hooks/useReveal";

const SLIDES = [
  { id: 12, title: "Marahoué Business Connect 2026", image: "/evenement/marahoue-1.jpg", fit: "cover" },
  { id: 13, title: "Marahoué Business Connect", image: "/evenement/marahoue-2.jpg", fit: "cover" },
  { id: 14, title: "Marahoué Business Connect", image: "/evenement/marahoue-3.jpg", fit: "cover" },
  { id: 15, title: "Marahoué Business Connect 2026", image: "/evenement/marahoue-4.jpg", fit: "cover" },
  { id: 16, title: "Marahoué Business Connect 2026", type: "video", video: "/evenement/marahoue-video.mp4" },
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
            {SLIDES.map((slide, i) =>
              slide.type === "video" ? (
                <video
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                  src={slide.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  key={slide.id}
                  alt={slide.title}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                    slide.fit === "contain" ? "object-contain bg-white p-12" : "object-cover"
                  } ${i === index ? "opacity-100" : "opacity-0"}`}
                  src={slide.image}
                />
              )
            )}
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
