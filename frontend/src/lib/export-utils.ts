import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Export data to PDF using jsPDF + AutoTable.
 * @param columns - Array of column header strings
 * @param rows    - Array of row data (each row is an array of values)
 * @param title   - Title displayed at the top of the PDF
 * @param filename - Output filename (without extension)
 */
export function exportToPDF(
  columns: string[],
  rows: (string | number | null | undefined)[][],
  title: string,
  filename: string
) {
  const doc = new jsPDF({ orientation: "landscape" });

  const printDate = format(new Date(), "dd MMMM yyyy, HH:mm", { locale: id });

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(title, 14, 18);

  // Subtitle / print date
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Dicetak pada: ${printDate}`, 14, 25);

  // Reset text color
  doc.setTextColor(0, 0, 0);

  autoTable(doc, {
    head: [columns],
    body: rows.map((row) =>
      row.map((cell) => (cell === null || cell === undefined ? "-" : String(cell)))
    ),
    startY: 30,
    headStyles: {
      fillColor: [79, 70, 229], // indigo-600
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [248, 247, 255],
    },
    bodyStyles: {
      fontSize: 9,
    },
    styles: {
      cellPadding: 4,
      overflow: "linebreak",
    },
    margin: { top: 30, left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}

/**
 * Export data to Excel (.xlsx) using the xlsx library.
 * @param headers  - Array of header strings
 * @param rows     - Array of row data arrays
 * @param filename - Output filename (without extension)
 * @param sheetName - Sheet name (default: "Data")
 */
export function exportToExcel(
  headers: string[],
  rows: (string | number | null | undefined)[][],
  filename: string,
  sheetName: string = "Data"
) {
  const worksheetData = [
    headers,
    ...rows.map((row) =>
      row.map((cell) => (cell === null || cell === undefined ? "-" : cell))
    ),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Style header row (set bold via column widths at minimum)
  const colWidths = headers.map((h, i) => {
    const maxDataLength = Math.max(
      h.length,
      ...rows.map((r) => String(r[i] ?? "").length)
    );
    return { wch: Math.min(Math.max(maxDataLength + 4, 12), 50) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
