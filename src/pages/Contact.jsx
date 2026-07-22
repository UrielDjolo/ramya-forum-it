import { useState } from "react";
import { useLocation } from "react-router-dom";
import useReveal from "../hooks/useReveal";
import MultiSelectSearch from "../components/contact/MultiSelectSearch";
import SuccessScreen from "../components/contact/SuccessScreen";
import { saveContactSubmission } from "../lib/saveContactSubmission";

const SECTEURS = [
  "PME",
  "Grande entreprise",
  "Administration",
  "Industrie",
  "Commerce",
  "Banque",
  "Assurance",
  "Éducation",
  "Santé",
  "Hôtellerie",
  "BTP",
  "Autre",
];

const SERVICES = [
  "Systèmes de vidéo surveillance",
  "Système de Contrôle d'accès",
  "Système de Pointage biométrique du personnel",
  "Clôture Électrique",
  "Portes Blindées",
  "Portier vidéo",
  "Systèmes de Sécurité incendie (SSI)",
  "Poignées intelligentes",
  "Alarme anti-intrusion",
  "Autocommutateurs numériques et analogiques",
  "Portiques de Détecteur de métaux",
  "Portes et portails automatisés",
  "Coffres-forts",
  "Fournitures informatique",
  "SAS de sécurité",
  "Tracking véhicule",
  "Maintenance",
  "Infographie",
  "Autre",
];

const initialFormData = {
  type: "",
  entrepriseNom: "",
  secteur: "",
  fonction: "",
  nomPrenom: "",
  telephone: "",
  whatsapp: "",
  email: "",
  ville: "",
  commune: "",
  quartier: "",
  adresse: "",
  services: [],
  autreService: "",
  besoin: "",
  observations: "",
};

const inputClass =
  "w-full bg-on-surface/5 border border-on-surface/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all placeholder:text-on-surface-variant/60";
const labelClass = "block text-sm font-semibold text-on-surface mb-2";
const errorClass = "text-error text-xs mt-1.5";

function Card({ children }) {
  const revealRef = useReveal();
  return (
    <div
      ref={revealRef}
      className="glass p-6 md:p-10 rounded-3xl border border-on-surface/10 space-y-6 transition-all duration-700 opacity-0 translate-y-10 ease-premium"
    >
      {children}
    </div>
  );
}

function CardTitle({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-headline-lg text-lg text-on-surface break-words">{title}</h3>
        {subtitle && <p className="text-on-surface-variant text-xs mt-0.5 break-words">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function Contact() {
  const location = useLocation();
  const [formData, setFormData] = useState(() => {
    const preselectServices = location.state?.preselectServices;
    if (preselectServices?.length) {
      return { ...initialFormData, services: preselectServices };
    }
    return initialFormData;
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState("");
  const headerRef = useReveal();

  function updateField(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate() {
    const nextErrors = {};

    if (!formData.type) nextErrors.type = "Veuillez indiquer si vous êtes un particulier ou une entreprise.";
    if (formData.type === "entreprise") {
      if (!formData.entrepriseNom.trim()) nextErrors.entrepriseNom = "Le nom de l'entreprise est requis.";
      if (!formData.secteur) nextErrors.secteur = "Le secteur d'activité est requis.";
      if (!formData.fonction.trim()) nextErrors.fonction = "La fonction est requise.";
    }
    if (!formData.nomPrenom.trim()) nextErrors.nomPrenom = "Le nom et prénom sont requis.";
    if (!formData.telephone.trim()) nextErrors.telephone = "Le téléphone est requis.";
    if (!formData.whatsapp.trim()) nextErrors.whatsapp = "Le numéro WhatsApp est requis.";
    if (!formData.email.trim()) {
      nextErrors.email = "L'adresse e-mail est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "L'adresse e-mail n'est pas valide.";
    }
    if (!formData.ville.trim()) nextErrors.ville = "La ville est requise.";
    if (!formData.commune.trim()) nextErrors.commune = "La commune est requise.";
    if (!formData.quartier.trim()) nextErrors.quartier = "Le quartier est requis.";
    if (!formData.adresse.trim()) nextErrors.adresse = "L'adresse complète est requise.";
    if (formData.services.length === 0) nextErrors.services = "Sélectionnez au moins un service.";
    if (formData.services.includes("Autre") && !formData.autreService.trim()) {
      nextErrors.autreService = "Merci de préciser le service recherché.";
    }
    if (!formData.besoin.trim()) nextErrors.besoin = "Merci de décrire votre besoin.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setStatus("loading");
    setSubmitError("");
    try {
      await saveContactSubmission(formData);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("idle");
      setSubmitError(err.message || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    }
  }

  function handleNewRequest() {
    setFormData(initialFormData);
    setErrors({});
    setStatus("idle");
    setSubmitError("");
  }

  if (status === "success") {
    return <SuccessScreen onNewRequest={handleNewRequest} />;
  }

  return (
    <div>
      <section className="relative py-20 overflow-hidden hero-mesh">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/40 to-surface"></div>
        </div>
        <div
          ref={headerRef}
          className="container mx-auto px-6 md:px-margin-desktop max-w-2xl text-center space-y-6 relative z-10 transition-all duration-1000 opacity-0 translate-y-10 ease-premium"
        >
          <span className="text-primary font-bold tracking-widest text-label-sm uppercase">
            RAMYA TECHNOLOGIE &amp; INNOVATION
          </span>
          <h1 className="font-display-md text-display-md leading-tight">Formulaire de prise de contact</h1>
          <p className="text-on-surface-variant text-body-lg leading-relaxed">
            Merci de votre visite sur notre stand. Veuillez renseigner les informations ci-dessous afin que notre
            équipe puisse vous recontacter et vous proposer une solution adaptée à vos besoins.
          </p>
        </div>
      </section>

      <section className="py-16">
        <form
          id="contact-form"
          onSubmit={handleSubmit}
          className="container mx-auto px-6 md:px-margin-desktop max-w-3xl space-y-8"
        >
          <p className="text-on-surface-variant text-sm">
            <span className="text-error">*</span> Champs obligatoires
          </p>

          {/* Type de contact */}
          <Card>
            <CardTitle icon="badge" title="Vous êtes" subtitle="Sélectionnez votre profil pour adapter le formulaire." />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { value: "particulier", label: "Un particulier", icon: "person" },
                { value: "entreprise", label: "Une entreprise / organisation", icon: "domain" },
              ].map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => updateField("type", option.value)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all ease-premium ${
                    formData.type === option.value
                      ? "border-primary bg-primary-container/15 text-primary"
                      : "border-on-surface/10 text-on-surface-variant hover:border-on-surface/30"
                  }`}
                >
                  <span className="material-symbols-outlined">{option.icon}</span>
                  <span className="font-semibold text-sm">{option.label}</span>
                </button>
              ))}
            </div>
            {errors.type && <p className={errorClass}>{errors.type}</p>}
          </Card>

          {/* Informations entreprise + contact */}
          <Card>
            <CardTitle
              icon="contact_page"
              title={formData.type === "entreprise" ? "Informations sur l'entreprise" : "Vos informations"}
            />

            {formData.type === "entreprise" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Nom de l'entreprise *</label>
                  <input
                    className={inputClass}
                    value={formData.entrepriseNom}
                    onChange={(e) => updateField("entrepriseNom", e.target.value)}
                    placeholder="Ex: RAMYA SARL"
                  />
                  {errors.entrepriseNom && <p className={errorClass}>{errors.entrepriseNom}</p>}
                </div>
                <div>
                  <label className={labelClass}>Secteur d'activité *</label>
                  <select
                    className={inputClass}
                    value={formData.secteur}
                    onChange={(e) => updateField("secteur", e.target.value)}
                  >
                    <option value="">Sélectionner...</option>
                    {SECTEURS.map((secteur) => (
                      <option key={secteur} value={secteur}>
                        {secteur}
                      </option>
                    ))}
                  </select>
                  {errors.secteur && <p className={errorClass}>{errors.secteur}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>
                  {formData.type === "entreprise" ? "Nom et prénom du contact *" : "Nom et prénom *"}
                </label>
                <input
                  className={inputClass}
                  value={formData.nomPrenom}
                  onChange={(e) => updateField("nomPrenom", e.target.value)}
                  placeholder="Ex: Konan Yao"
                />
                {errors.nomPrenom && <p className={errorClass}>{errors.nomPrenom}</p>}
              </div>
              {formData.type === "entreprise" && (
                <div>
                  <label className={labelClass}>Fonction *</label>
                  <input
                    className={inputClass}
                    value={formData.fonction}
                    onChange={(e) => updateField("fonction", e.target.value)}
                    placeholder="Ex: Directeur technique"
                  />
                  {errors.fonction && <p className={errorClass}>{errors.fonction}</p>}
                </div>
              )}
            </div>
          </Card>

          {/* Coordonnées */}
          <Card>
            <CardTitle icon="call" title="Coordonnées" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Téléphone *</label>
                <input
                  className={inputClass}
                  value={formData.telephone}
                  onChange={(e) => updateField("telephone", e.target.value)}
                  placeholder="Ex: 07 00 00 00 00"
                />
                {errors.telephone && <p className={errorClass}>{errors.telephone}</p>}
              </div>
              <div>
                <label className={labelClass}>WhatsApp *</label>
                <input
                  className={inputClass}
                  value={formData.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  placeholder="Ex: 07 00 00 00 00"
                />
                {errors.whatsapp && <p className={errorClass}>{errors.whatsapp}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Adresse e-mail *</label>
                <input
                  type="email"
                  className={inputClass}
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Ex: contact@exemple.com"
                />
                {errors.email && <p className={errorClass}>{errors.email}</p>}
              </div>
            </div>
          </Card>

          {/* Situation géographique */}
          <Card>
            <CardTitle icon="location_on" title="Situation géographique" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Ville *</label>
                <input
                  className={inputClass}
                  value={formData.ville}
                  onChange={(e) => updateField("ville", e.target.value)}
                  placeholder="Ex: Bouaflé"
                />
                {errors.ville && <p className={errorClass}>{errors.ville}</p>}
              </div>
              <div>
                <label className={labelClass}>Commune *</label>
                <input
                  className={inputClass}
                  value={formData.commune}
                  onChange={(e) => updateField("commune", e.target.value)}
                />
                {errors.commune && <p className={errorClass}>{errors.commune}</p>}
              </div>
              <div>
                <label className={labelClass}>Quartier *</label>
                <input
                  className={inputClass}
                  value={formData.quartier}
                  onChange={(e) => updateField("quartier", e.target.value)}
                />
                {errors.quartier && <p className={errorClass}>{errors.quartier}</p>}
              </div>
              <div>
                <label className={labelClass}>Adresse complète *</label>
                <input
                  className={inputClass}
                  value={formData.adresse}
                  onChange={(e) => updateField("adresse", e.target.value)}
                />
                {errors.adresse && <p className={errorClass}>{errors.adresse}</p>}
              </div>
            </div>
          </Card>

          {/* Solution recherchée */}
          <Card>
            <CardTitle icon="settings_suggest" title="Solution recherchée *" subtitle="Vous pouvez sélectionner plusieurs services." />
            <MultiSelectSearch
              options={SERVICES}
              value={formData.services}
              onChange={(services) => updateField("services", services)}
              placeholder="Rechercher un service..."
            />
            {errors.services && <p className={errorClass}>{errors.services}</p>}
            {formData.services.includes("Autre") && (
              <div className="mt-4">
                <label className={labelClass}>Précisez le service recherché *</label>
                <input
                  className={inputClass}
                  value={formData.autreService}
                  onChange={(e) => updateField("autreService", e.target.value)}
                  placeholder="Ex: Vidéosurveillance connectée"
                />
                {errors.autreService && <p className={errorClass}>{errors.autreService}</p>}
              </div>
            )}
          </Card>

          {/* Description du besoin */}
          <Card>
            <CardTitle icon="description" title="Description du besoin *" />
            <div>
              <textarea
                className={`${inputClass} min-h-[140px] resize-none`}
                value={formData.besoin}
                maxLength={1000}
                onChange={(e) => updateField("besoin", e.target.value)}
                placeholder="Décrivez votre projet, votre besoin ou les difficultés que vous souhaitez résoudre."
              />
              <div className="flex items-center justify-between mt-1.5">
                {errors.besoin ? <p className={errorClass}>{errors.besoin}</p> : <span />}
                <p className="text-xs text-on-surface-variant">{formData.besoin.length}/1000</p>
              </div>
            </div>
          </Card>

          {/* Observations */}
          <Card>
            <CardTitle icon="chat" title="Observations" subtitle="Facultatif" />
            <textarea
              className={`${inputClass} min-h-[100px] resize-none`}
              value={formData.observations}
              onChange={(e) => updateField("observations", e.target.value)}
              placeholder="Informations complémentaires."
            />
          </Card>

          {submitError && (
            <div className="bg-error-container/20 border border-error/30 text-error rounded-2xl px-5 py-4 text-sm">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full sm:w-auto px-10 py-4 bg-primary-container text-white rounded-full font-bold text-body-md hover:brightness-110 hover:scale-105 transition-all ease-premium flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:scale-100"
          >
            {status === "loading" ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                Envoi en cours...
              </>
            ) : (
              <>
                Envoyer ma demande
                <span className="material-symbols-outlined">send</span>
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
