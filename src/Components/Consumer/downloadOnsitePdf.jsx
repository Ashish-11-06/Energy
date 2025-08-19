// Import dependencies at the top of your file
import jsPDF from "jspdf";
import "jspdf-autotable";

// HEX to RGB helper
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

// Formatting functions
const formatNumber = (num, decimals = 3) => {
  if (num === undefined || num === null) return "N/A";
  const formatted = parseFloat(num).toFixed(decimals);
  return new Intl.NumberFormat("en-US").format(formatted);
};

// Convert superscript digits to normal digits
const superscriptMap = { '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9' };

const normalizeNumber = (val) => {
  if (val === undefined || val === null) return null;
  let s = String(val);
  // 1) normalize superscripts, 2) keep only digits, dot, minus
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, m => superscriptMap[m])
       .replace(/[^\d.-]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const formatCurrency = (amount, asSymbol = true) => {
  const n = normalizeNumber(amount);
  if (n === null) return "N/A";
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
  // Use "INR " to avoid missing ₹ glyph in jsPDF core fonts
  return (asSymbol ? "" : "") + formatted;
};

export const handleDownloadPDF = (
  userData,
  selectedRequirement,
  capacitySolar,
  submittedType,
  energyReplaced,
  totalSavings,
  sortedMonthlyData = []
) => {
  const doc = new jsPDF();

  // Colors
  const colors = {
    primary: "#669800",
    accent: "#669800",
    success: "#669800",
    textDark: "#323232",
    textLight: "#FFFFFF",
    borderDark: "#BDC3C7",
    // RGB
    primaryRgb: hexToRgb("#669800"),
    accentRgb: hexToRgb("#669800"),
    successRgb: hexToRgb("#669800"),
    textDarkRgb: hexToRgb("#323232"),
    textLightRgb: hexToRgb("#FFFFFF"),
    borderDarkRgb: hexToRgb("#BDC3C7"),
  };

  // ===== HEADER =====
  doc.setFillColor(...colors.primaryRgb);
  doc.rect(0, 0, 210, 40, "F");

  // doc.setFont("helvetica", "bold", 700);
  // After
doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...colors.textLightRgb);
  doc.text("SOLAR ROOFTOP ANALYSIS REPORT", 105, 25, { align: "center" });

  // Decorative line
  doc.setDrawColor(...colors.primaryRgb);
  doc.setLineWidth(1.5);
  doc.line(20, 45, 190, 45);

  // ===== METADATA =====
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...colors.textDarkRgb);
  doc.text(`Report generated for: ${userData?.name || "N/A"}`, 20, 55);
  doc.text(
    `Date: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    20,
    60
  );
  doc.text(`Project ID: ${selectedRequirement?.id || "N/A"}`, 190, 55, {
    align: "right",
  });
  doc.text("Report Version: 1.0", 190, 60, { align: "right" });

  // ===== REQUIREMENT DETAILS =====
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("REQUIREMENT DETAILS", 20, 80);
  doc.setDrawColor(...colors.primaryRgb);
  doc.setLineWidth(0.5);
  doc.line(20, 82, 60, 82);

  const requirementData = [
    ["Location:", selectedRequirement?.location || "N/A"],
    ["State:", selectedRequirement?.state || "N/A"],
    [
      "Roof Area:",
      selectedRequirement?.roof_area
        ? `${selectedRequirement.roof_area} sq m`
        : "N/A",
    ],
    [
      "Solar Capacity:",
      capacitySolar ? `${parseFloat(capacitySolar).toFixed(4)} kWp` : "N/A",
    ],
    [
      "System Type:",
      submittedType === "grid_connected"
        ? "Grid Connected"
        : "Behind The Meter",
    ],
  ];

  let reqTableY =
    doc.autoTable({
      startY: 85,
      head: [["Property", "Value"]],
      body: requirementData,
      theme: "grid",
      headStyles: {
        fillColor: colors.primaryRgb,
        textColor: colors.textLightRgb,
        fontSize: 10,
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: colors.textDarkRgb,
        fontSize: 10,
        cellPadding: 5,
      },
      margin: { left: 20 },
      columnStyles: {
        0: {
          cellWidth: 50,
          fontStyle: "bold",
          halign: "left",
        },
        1: {
          cellWidth: 120,
          halign: "left",
        },
      },
      styles: {
        lineColor: colors.borderDarkRgb,
        lineWidth: 0.2,
      },
    }).finalY || 115;

  // ===== PERFORMANCE SUMMARY =====
  const perfStart = reqTableY + 55;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.textDarkRgb);
  doc.text("PERFORMANCE SUMMARY", 20, perfStart);
  doc.setDrawColor(...colors.primaryRgb);
  doc.line(20, perfStart + 2, 80, perfStart + 2);

  // Performance metrics (card style)
  const metrics = [
    {
      label: "Energy Replaced",
      value: `${formatNumber(energyReplaced)} MWh`,
      colorRgb: colors.accentRgb,
    },
    {
      label: "Annual Savings",
      value: formatCurrency(totalSavings),
      colorRgb: colors.successRgb,
    },
    {
      label: "System Capacity",
      value: `${formatNumber(capacitySolar, 4)} kWp`,
      colorRgb: colors.primaryRgb,
    },
  ];
  metrics.forEach((metric, i) => {
    const x = 20 + i * 63;
    const cardY = perfStart + 8;
    // Card box
    doc.setFillColor(...metric.colorRgb);
    doc.roundedRect(x, cardY, 60, 30, 3, 3, "F");
    // Card text
    doc.setFontSize(11);
    doc.setTextColor(...colors.textLightRgb);
    doc.setFont("helvetica", "normal");
    doc.text(metric.label, x + 30, cardY + 10, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(metric.value, x + 30, cardY + 20, { align: "center" });
  });

  // ===== MONTHLY DATA TABLE =====
  const monthlyStart = perfStart + 50;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.textDarkRgb);
  doc.text("MONTHLY GENERATION DATA", 20, monthlyStart);
  doc.setDrawColor(...colors.primaryRgb);
  doc.line(20, monthlyStart + 2, 100, monthlyStart + 2);

  const monthlyTableData =
    Array.isArray(sortedMonthlyData) && sortedMonthlyData.length > 0
      ? sortedMonthlyData.map((item) => [
          item.month || "",
          formatNumber(item.generation, 2) || "",
          formatCurrency(item.savings, false) || "",
          item.replacement || "N/A",
        ])
      : [["No data available", "", "", ""]];

  doc.autoTable({
    startY: monthlyStart + 8,
    head: [["Month", "Generation (kWh)", "Savings", "RE Replacement"]],
    body: monthlyTableData,
    theme: "grid",
    headStyles: {
      fillColor: colors.primaryRgb,
      textColor: colors.textLightRgb,
      fontSize: 10,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      textColor: colors.textDarkRgb,
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { left: 20 },
    styles: {
      halign: "center",
      valign: "middle",
    },
    columnStyles: {
      0: { halign: "left", cellWidth: 45 },
      1: { cellWidth: 45 },
      2: { cellWidth: 45 },
      3: { cellWidth: 45 },
    },
  });

  // ===== FOOTER =====
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 15;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, footerY, 190, footerY);

  doc.setFontSize(8);
  doc.setTextColor(...colors.textDarkRgb);
  doc.setFont("helvetica", "italic");
  doc.text(
    "This report was automatically generated by Solar Analytics Platform",
    105,
    footerY + 5,
    { align: "center" }
  );
  doc.text(
    `© ${new Date().getFullYear()} All rights reserved`,
    105,
    footerY + 10,
    { align: "center" }
  );
  doc.text(
    `Page ${doc.internal.getNumberOfPages()} of ${doc.internal.getNumberOfPages()}`,
    190,
    footerY + 5,
    { align: "right" }
  );

  // ===== SAVE PDF =====
  doc.save(
    `Solar_Analysis_${userData?.name || "Report"}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
};
