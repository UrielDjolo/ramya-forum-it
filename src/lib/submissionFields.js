export const STATUS_LABELS = {
  nouveau: "Nouveau",
  contacte: "Contacté",
  en_cours: "En cours",
  converti: "Converti",
  perdu: "Perdu",
};

export function formatDate(isoString) {
  return new Date(isoString).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

export function formatType(type) {
  return type === "entreprise" ? "Entreprise / Organisation" : "Particulier";
}

export function formatStatus(status) {
  return STATUS_LABELS[status] || STATUS_LABELS.nouveau;
}

export function formatLocalisation(submission) {
  return [submission.quartier, submission.commune, submission.ville, submission.adresse].filter(Boolean).join(", ") || "—";
}

export function formatServices(submission) {
  return submission.services?.length ? submission.services.join(", ") : "—";
}

// Ordered list of every field to appear in exports (PDF fiche + Excel columns).
export function getSubmissionSections(submission) {
  return [
    {
      title: "Profil",
      rows: [
        ["Statut", formatStatus(submission.status)],
        ["Type", formatType(submission.type)],
        ["Nom de l'entreprise", submission.entreprise_nom || "—"],
        ["Secteur d'activité", submission.secteur || "—"],
        ["Nom et prénom du contact", submission.nom_prenom || "—"],
        ["Fonction", submission.fonction || "—"],
      ],
    },
    {
      title: "Coordonnées",
      rows: [
        ["Téléphone", submission.telephone || "—"],
        ["WhatsApp", submission.whatsapp || "—"],
        ["Adresse e-mail", submission.email || "—"],
      ],
    },
    {
      title: "Situation géographique",
      rows: [
        ["Ville", submission.ville || "—"],
        ["Commune", submission.commune || "—"],
        ["Quartier", submission.quartier || "—"],
        ["Adresse complète", submission.adresse || "—"],
      ],
    },
    {
      title: "Solution recherchée",
      rows: [["Services", formatServices(submission)]],
    },
    {
      title: "Description du besoin",
      rows: [["Besoin", submission.besoin || "—"]],
    },
    {
      title: "Observations",
      rows: [["Observations", submission.observations || "—"]],
    },
  ];
}
