import { Link } from "react-router-dom";

export default function SuccessScreen({ onNewRequest }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8 animate-[fadeIn_0.6s_ease-premium]">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
          <div className="relative w-24 h-24 rounded-full bg-primary-container flex items-center justify-center text-white scale-0 animate-[popIn_0.5s_cubic-bezier(0.16,1,0.3,1)_0.1s_forwards]">
            <span className="material-symbols-outlined text-5xl">check</span>
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Merci pour votre confiance</h2>
          <p className="text-on-surface-variant text-body-lg leading-relaxed">
            Votre demande a bien été enregistrée. Un conseiller RAMYA TECHNOLOGIE &amp; INNOVATION vous contactera
            dans les meilleurs délais.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            to="/"
            className="px-8 py-4 bg-primary-container text-white rounded-full font-bold text-body-md hover:brightness-110 hover:scale-105 transition-all ease-premium"
          >
            Retour à l'accueil
          </Link>
          <button
            onClick={onNewRequest}
            className="px-8 py-4 border border-secondary text-secondary rounded-full font-bold text-body-md hover:bg-secondary/10 transition-all ease-premium"
          >
            Nouvelle demande
          </button>
        </div>
      </div>
    </div>
  );
}
