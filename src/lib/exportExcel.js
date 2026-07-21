import ExcelJS from "exceljs";
import { formatDate, formatType, formatStatus } from "./submissionFields";

const COLUMNS = [
  { header: "Date", key: "date", width: 18 },
  { header: "Statut", key: "statut", width: 14 },
  { header: "Type", key: "type", width: 16 },
  { header: "Entreprise", key: "entreprise", width: 22 },
  { header: "Secteur d'activité", key: "secteur", width: 18 },
  { header: "Nom et prénom", key: "nom", width: 20 },
  { header: "Fonction", key: "fonction", width: 18 },
  { header: "Téléphone", key: "telephone", width: 16 },
  { header: "WhatsApp", key: "whatsapp", width: 16 },
  { header: "Email", key: "email", width: 24 },
  { header: "Ville", key: "ville", width: 14 },
  { header: "Commune", key: "commune", width: 14 },
  { header: "Quartier", key: "quartier", width: 16 },
  { header: "Adresse complète", key: "adresse", width: 26 },
  { header: "Services recherchés", key: "services", width: 30 },
  { header: "Besoin décrit", key: "besoin", width: 40 },
  { header: "Observations", key: "observations", width: 30 },
];

export async function exportSubmissionsToExcel(submissions) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "RAMYA TECHNOLOGIE & INNOVATION";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Demandes de contact");
  sheet.columns = COLUMNS;

  sheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF75E2D" } };
    cell.alignment = { vertical: "middle" };
  });
  sheet.views = [{ state: "frozen", ySplit: 1 }];

  for (const s of submissions) {
    sheet.addRow({
      date: formatDate(s.created_at),
      statut: formatStatus(s.status),
      type: formatType(s.type),
      entreprise: s.entreprise_nom || "",
      secteur: s.secteur || "",
      nom: s.nom_prenom || "",
      fonction: s.fonction || "",
      telephone: s.telephone || "",
      whatsapp: s.whatsapp || "",
      email: s.email || "",
      ville: s.ville || "",
      commune: s.commune || "",
      quartier: s.quartier || "",
      adresse: s.adresse || "",
      services: s.services?.join(", ") || "",
      besoin: s.besoin || "",
      observations: s.observations || "",
    });
  }

  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { ...cell.alignment, wrapText: true, vertical: "top" };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ramya-demandes-${new Date().toISOString().slice(0, 10)}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
}
