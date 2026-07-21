import { supabase, supabaseConfigured } from "./supabaseClient";

export async function saveContactSubmission(formData) {
  if (!supabaseConfigured) {
    throw new Error(
      "Supabase non configuré : renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans un fichier .env"
    );
  }

  const services = formData.services.map((service) =>
    service === "Autre" && formData.autreService ? `Autre : ${formData.autreService}` : service
  );

  const { error } = await supabase.from("contact_submissions").insert({
    type: formData.type,
    entreprise_nom: formData.entrepriseNom || null,
    secteur: formData.secteur || null,
    fonction: formData.fonction || null,
    nom_prenom: formData.nomPrenom,
    telephone: formData.telephone,
    whatsapp: formData.whatsapp || null,
    email: formData.email || null,
    ville: formData.ville || null,
    commune: formData.commune || null,
    quartier: formData.quartier || null,
    adresse: formData.adresse || null,
    services,
    besoin: formData.besoin || null,
    observations: formData.observations || null,
  });

  if (error) throw error;
}
