import useReveal from "../hooks/useReveal";

export default function Partners() {
  const revealRef = useReveal();

  return (
    <section className="py-24 bg-surface-container-lowest">
      <div
        ref={revealRef}
        className="container mx-auto px-6 md:px-margin-desktop transition-all duration-1000 opacity-0 translate-y-10 ease-premium"
      >
        <div className="mb-12 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-primary font-bold tracking-widest text-label-sm uppercase">Nos partenaires</span>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full"></div>
          <div className="relative glass rounded-3xl overflow-hidden border border-on-surface/10 shadow-2xl">
            <img
              alt="Nos partenaires : MAPHA, SOGEA SATOM, Assemblées de Dieu, AOBA, SICOM, SIFCA, Comef, Continental, Institut Pasteur, ALLEGRA Finance, Salem Entreprises, EGCOB, mcK Africa, Optimum International, F.S.D.P, MQash, World Agroforestry, Presti Mex"
              className="w-full h-auto object-cover"
              src="/pt.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
