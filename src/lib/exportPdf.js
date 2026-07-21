import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { loadImageAsBase64 } from "./loadImageAsBase64";
import { formatDate, formatType, formatLocalisation, formatServices, getSubmissionSections } from "./submissionFields";

const PRIMARY_RGB = [247, 94, 45];
const TEXT_RGB = [30, 30, 30];
const MUTED_RGB = [110, 110, 110];

async function addHeader(doc, title, subtitle) {
  let logo = null;
  try {
    logo = await loadImageAsBase64("/logo_ramya.png");
  } catch {
    logo = null;
  }

  if (logo) {
    doc.addImage(logo, "PNG", 15, 12, 18, 18);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...TEXT_RGB);
  doc.text("RAMYA TECHNOLOGIE & INNOVATION", 38, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED_RGB);
  doc.text(title, 38, 27);

  if (subtitle) {
    doc.setFontSize(9);
    doc.text(subtitle, 38, 32);
  }

  doc.setDrawColor(...PRIMARY_RGB);
  doc.setLineWidth(0.8);
  doc.line(15, 38, 195, 38);

  return 46;
}

function addFooter(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED_RGB);
    doc.text(
      `Exporté le ${new Date().toLocaleString("fr-FR")} — Page ${i}/${pageCount}`,
      15,
      doc.internal.pageSize.getHeight() - 10
    );
  }
}

export async function exportSubmissionToPdf(submission) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = await addHeader(doc, "Fiche de demande de contact", submission.nom_prenom);

  const sections = getSubmissionSections(submission);
  for (const section of sections) {
    autoTable(doc, {
      startY: y,
      margin: { left: 15, right: 15 },
      head: [[section.title, ""]],
      body: section.rows,
      theme: "grid",
      headStyles: { fillColor: PRIMARY_RGB, textColor: 255, fontStyle: "bold", fontSize: 10 },
      bodyStyles: { fontSize: 9, textColor: TEXT_RGB },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 }, 1: { cellWidth: "auto" } },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  addFooter(doc);
  doc.save(`ramya-demande-${(submission.nom_prenom || "client").replace(/\s+/g, "-").toLowerCase()}.pdf`);
}

export async function exportAllSubmissionsToPdf(submissions) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const y = await addHeader(doc, "Rapport des demandes de contact", `${submissions.length} demande(s) au total`);

  autoTable(doc, {
    startY: y,
    margin: { left: 10, right: 10 },
    head: [["Date", "Type", "Nom", "Entreprise", "Téléphone", "Email", "Localisation", "Services", "Besoin"]],
    body: submissions.map((s) => [
      formatDate(s.created_at),
      formatType(s.type),
      s.nom_prenom || "—",
      s.entreprise_nom || "—",
      s.telephone || "—",
      s.email || "—",
      formatLocalisation(s),
      formatServices(s),
      s.besoin || "—",
    ]),
    theme: "grid",
    headStyles: { fillColor: PRIMARY_RGB, textColor: 255, fontStyle: "bold", fontSize: 9 },
    bodyStyles: { fontSize: 8, textColor: TEXT_RGB, overflow: "linebreak" },
    tableWidth: 277,
    columnStyles: {
      0: { cellWidth: 24 },
      1: { cellWidth: 24 },
      2: { cellWidth: 26 },
      3: { cellWidth: 26 },
      4: { cellWidth: 22 },
      5: { cellWidth: 34 },
      6: { cellWidth: 40 },
      7: { cellWidth: 35 },
      8: { cellWidth: 46 },
    },
  });

  addFooter(doc);
  doc.save(`ramya-demandes-${new Date().toISOString().slice(0, 10)}.pdf`);
}
