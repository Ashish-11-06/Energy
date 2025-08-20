// Import dependencies
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import EXGLogo from "../../../src/assets/EXG_green.png?base64";

// HEX → RGB helper
const hexToRgb = (hex) => {
  if (!hex || typeof hex !== "string" || !hex.startsWith("#")) return [0, 0, 0];
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
};

// Formatters
const formatNumber = (num, decimals = 3) => {
  if (num === undefined || num === null) return "N/A";
  const formatted = parseFloat(num).toFixed(decimals);
  return new Intl.NumberFormat("en-US").format(formatted);
};

const superscriptMap = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

const normalizeNumber = (val) => {
  if (val === undefined || val === null) return null;
  let s = String(val)
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (m) => superscriptMap[m])
    .replace(/[^\d.-]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const formatCurrency = (amount) => {
  const n = normalizeNumber(amount);
  if (n === null) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
};

// ==============================
// PDF GENERATOR
// ==============================
export const handleDownloadPDF = (
  annualSavingResponse,
  selectedRequirementId,
  monthlyData = []
) => {
  const doc = new jsPDF();

  const colors = {
    primary: "#669800",
    textDark: "#323232",
    textLight: "#FFFFFF",
    borderDark: "#BDC3C7",
    primaryRgb: hexToRgb("#669800"),
    textDarkRgb: hexToRgb("#323232"),
    borderDarkRgb: hexToRgb("#BDC3C7"),
  };

  const logo = new Image();
  logo.src = EXGLogo;

  logo.onload = () => {
    // ===== HEADER =====
    doc.addImage(logo, "PNG", 160, 10, 30, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(colors.primary);
    doc.text("SOLAR ROOFTOP ANALYSIS REPORT", 95, 35, { align: "center" });
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(1);
    doc.line(20, 38, 190, 38);

    // ===== REQUIREMENT DETAILS =====
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text("Requirement Details", 20, 50);

    // Use annualSavingResponse directly as the requirement object (flat structure)
    const req = annualSavingResponse || {};

    console.log("Requirement Data:", req);

    const requirementData = [
      ["State", req.state || "N/A"],
      ["Roof Area", req.roof_area ? `${req.roof_area} square meters` : "N/A"],
      [
        "Existing Solar Rooftop Capacity",
        req.solar_rooftop_capacity !== null && req.solar_rooftop_capacity !== undefined
          ? `${req.solar_rooftop_capacity} kWp`
          : "N/A",
      ],
      [
      "Annual Consumption",
      req.annual_electricity_consumption
        ? `${req.annual_electricity_consumption} MWh`
        : "N/A",
      ],
      [
        "Contracted Demand",
        req.contracted_demand ? `${req.contracted_demand} MW` : "N/A",
      ],
      ["Location", req.location || "N/A"],
      ["Voltage", req.voltage_level ? `${req.voltage_level} kV` : "N/A"],
      // ["Procurement Date", req.procurement_date || "N/A"],
      // [
      //   "Date",
      //   new Date().toLocaleDateString("en-US", {
      //     year: "numeric",
      //     month: "long",
      //     day: "numeric",
      //   }),
      // ],
    ];

    doc.autoTable({
      startY: 55,
      body: requirementData,
      theme: "grid",
      styles: { fontSize: 8, textColor: colors.textDarkRgb, cellPadding: 1.5 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 80 },
      },
      margin: { left: 20, right: 20 },
      tableWidth: "auto",
      pageBreak: "avoid",
    });

    // ===== PERFORMANCE SUMMARY =====
    doc.setFontSize(13);
    doc.setTextColor(colors.primary);
    doc.text("Performance Summary", 20, doc.lastAutoTable.finalY + 12);

    // Use the root object for Rooftop page
    const energyReplaced = req.energyReplaced ?? req.energy_replaced ?? "";
    const totalSavings = req.totalSavings ?? req.total_savings ?? "";
    const capacitySolar =
      req.capacitySolar ??
      req.capacity_of_solar_rooftop ??
      req.existing_rooftop_capacity ??
      "";

    const metrics = [
      [
        "Total Energy Replaced (%)",
        energyReplaced !== undefined &&
          energyReplaced !== null &&
          energyReplaced !== ""
          ? `${energyReplaced} %`
          : "N/A",
      ],
      [
        "Total Annual Savings (INR)",
        totalSavings !== undefined &&
          totalSavings !== null &&
          totalSavings !== ""
          ? `${formatCurrency(totalSavings)}`
          : "N/A",
      ],
      [
        "Capacity of Solar Rooftop (kWp)",
        capacitySolar !== undefined &&
          capacitySolar !== null &&
          capacitySolar !== ""
          ? formatNumber(capacitySolar, 4)
          : "N/A",
      ],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Metric", "Value"]],
      body: metrics,
      theme: "grid",
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.textLight,
        fontStyle: "bold",
        fontSize: 8,
        cellPadding: 1.5,
      },
      bodyStyles: { textColor: colors.textDark, fontSize: 8, cellPadding: 1.5 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 80 },
      },
      margin: { left: 20, right: 20 },
      tableWidth: "auto",
      pageBreak: "avoid",
    });

    // ===== MONTHLY GENERATION DATA =====
    doc.setFontSize(13);
    doc.setTextColor(colors.primary);
    doc.text("Monthly Summary Of Replacement", 20, doc.lastAutoTable.finalY + 12);

    // Use monthlyData directly
    const monthlyArr =
      Array.isArray(monthlyData) && monthlyData.length > 0 ? monthlyData : [];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 16,
      head: [
        ["Month", "Generation (kWh)", "Savings(INR)", "Energy Replaced (%)"],
      ],
      body:
        monthlyArr.length > 0
          ? monthlyArr.map((item) => [
            item.month || "",
            item.generation !== undefined && item.generation !== null
              ? formatNumber(item.generation, 2)
              : "",
            item.savings !== undefined && item.savings !== null
              ? formatCurrency(item.savings)
              : "",
            item.energy_replaced !== undefined &&
              item.energy_replaced !== null
              ? formatCurrency(item.energy_replaced)
              : "N/A",
          ])
          : [["No data available", "", "", ""]],
      theme: "grid",
      headStyles: {
        fillColor: colors.primary,
        textColor: colors.textLight,
        fontSize: 8,
        fontStyle: "bold",
        halign: "center",
        cellPadding: 1.5,
      },
      bodyStyles: { textColor: colors.textDark, fontSize: 8, cellPadding: 1.5 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 20, right: 20 },
      styles: { halign: "center", valign: "middle", overflow: "linebreak" },
      columnStyles: {
        0: { halign: "left", cellWidth: 35 },
        1: { cellWidth: 38 },
        2: { cellWidth: 38 },
        3: { cellWidth: 38 },
      },
      tableWidth: "auto",
      pageBreak: "avoid",
    });

    // ===== FOOTER =====
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 20, 190, pageHeight - 20);

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "To start your energy transition and know your exact savings, subscribe to EXG Global - EXT platform.",
      105,
      pageHeight - 15,
      { align: "center", maxWidth: 170 }
    );

    // Draw "For more details, please contact at " in green, then clickable email in blue
    const infoText = "For more details, please contact at ";
    const email = "info@exgglobal.com";
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(9);

    // Calculate widths for centering
    doc.setTextColor(colors.primary);
    const infoTextWidth = doc.getTextWidth(infoText);
    const emailWidth = doc.getTextWidth(email);
    const totalWidth = infoTextWidth + emailWidth;
    const startX = (pageWidth - totalWidth) / 2;

    // Draw the info text
    doc.text(infoText, startX, pageHeight - 8);

    // Draw the clickable email right after the info text
    doc.setTextColor(0, 102, 204); // blue color for link
    doc.textWithLink(email, startX + infoTextWidth, pageHeight - 8, {
      url: "mailto:info@exgglobal.com",
    });

    // ===== SAVE =====
    doc.save(
      `Solar_Analysis_${req.state || "Report"}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  }; // END logo.onload
};
