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

// Update formatNumber to handle null/undefined better
const formatNumber = (num, decimals = 3) => {
  if (num === undefined || num === null || isNaN(num)) return "N/A";
  const formatted = parseFloat(num).toFixed(decimals);
  return new Intl.NumberFormat("en-US").format(formatted);
};

// Update formatCurrency to handle null/undefined better
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

/**
 * Generate PDF for CombinationPattern page.
 * @param {Object} combinationData - The selected combination object.
 * @param {Object} consumerDetails - The consumer details object.
 */
/**
 * Generate PDF for CombinationPattern page.
 * @param {Object} combinationData - The selected combination object.
 * @param {Object} consumerDetails - The consumer details object.
 */
export const handleDownloadCombinationPatternPDF = (combinationData, consumerDetails, quotationData = {}, isGenerator = false) => {
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

  // Simplified getVal function that focuses on the combination data
  // Update your getVal function to handle NaN values better
const getVal = (obj, ...keys) => {
  if (!obj) return null;
  
  for (let k of keys) {
    // Handle nested properties with dot notation
    if (k.includes('.')) {
      const parts = k.split('.');
      let value = obj;
      for (const part of parts) {
        if (value && value[part] !== undefined && value[part] !== null) {
          value = value[part];
        } else {
          value = undefined;
          break;
        }
      }
      if (value !== undefined && value !== null && value !== "" && !isNaN(value)) 
        return value;
    } else {
      // Handle flat properties
      if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "" && !isNaN(obj[k])) 
        return obj[k];
    }
  }
  
  return null;
};

  // Debug: Log what data we're working with
  console.log("Combination data:", combinationData);
  console.log("Consumer details:", consumerDetails);

  const logo = new window.Image();
  logo.src = EXGLogo;

  logo.onload = () => {

    doc.addImage(logo, "PNG", 160, 10, 30, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(colors.primary);
    doc.text("OPTIMIZED COMBINATION REPORT", 105, 35, { align: "center" });
    doc.setDrawColor(colors.primary);
    doc.setLineWidth(1);
    doc.line(20, 38, 190, 38);
    
    // ===== Consumer/Generator Details =====
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);

    if (isGenerator) {
      doc.text("Generator Details", 20, 50);
      const g = consumerDetails || {};
      const generatorDetailsArr = [
        ["Username", g.username ?? "N/A"],
        ["Company Name", g.company_name ?? "N/A"],
        ["State", g.state ?? "N/A"],
        ["Connectivity", g.connectivity ?? "N/A"],
        ["Voltage Level (kV)", g.voltage_level !== undefined && g.voltage_level !== null ? `${g.voltage_level} ` : "N/A"],
        ["Industry", g.industry ?? "N/A"],
        ["Annual Generation (MWh)", g.annual_generation !== undefined && g.annual_generation !== null ? g.annual_generation : "N/A"],
      ];
      doc.autoTable({
        startY: 55,
        body: generatorDetailsArr,
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
    } else {
      doc.text("Consumer Details", 20, 50);
      const d = consumerDetails || {};
      const consumerDetailsArr = [
        ["Username", d.username ?? "N/A"],
        ["Credit Rating", d.credit_rating ?? "N/A"],
        ["State", d.state ?? "N/A"],
        ["Tariff Category", d.tariff_category ?? "N/A"],
        ["Voltage Level (kV)", d.voltage_level !== undefined && d.voltage_level !== null ? `${d.voltage_level} ` : "N/A"],
        ["Contracted Demand (MW)", d.contracted_demand !== undefined && d.contracted_demand !== null ? `${d.contracted_demand} ` : "N/A"],
        ["Industry", d.industry ?? "N/A"],
        ["Annual Consumption (MWh)", d.annual_consumption !== undefined && d.annual_consumption !== null ? d.annual_consumption : "N/A"],
      ];
      doc.autoTable({
        startY: 55,
        body: consumerDetailsArr,
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
    }

    // ===== Combination Details =====
    doc.setFontSize(14);
    doc.setTextColor(colors.primary);
    doc.text("Combination Details", 20, doc.lastAutoTable.finalY + 12);

    const c = combinationData || {};
    const combinationDetailsArr = [
      ["Combination ID", c.combination ?? "N/A"],
      ["State",typeof c.states === "object"? Object.values(c.states).join(", "): c.states ?? "N/A"],
    //   ["State", typeof c.states === "object" ? JSON.stringify(c.states) : c.states ?? "N/A"],
      ["Connectivity", c.connectivity ?? "N/A"],
      ["COD", c.cod ?? c.greatest_cod ?? "N/A"],
      ["Banking Available", c.banking_available === 1 ? "Yes" : "No"],
      ["Elite Generator", c.elite_generator ? "Yes" : "No"],
    //   ["Status", c.status ?? "N/A"],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 6,
      body: combinationDetailsArr,
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

   
    // ===== Technology Capacities =====
    doc.setFontSize(13);
    doc.setTextColor(colors.primary);
    doc.text("Technology Capacities", 20, doc.lastAutoTable.finalY + 12);

    const techCapacities = [
[`Optimal ${combinationData.technology[0]?.name} Capacity (MW)`, combinationData.technology[0]?.capacity || "N/A"],
[`Optimal ${combinationData.technology[1]?.name} Capacity (MW)`, combinationData.technology[1]?.capacity || "N/A"],
[`Optimal ${combinationData.technology[2]?.name} Capacity (MW)`, combinationData.technology[2]?.capacity || "N/A"],
];

console.log(techCapacities);

// Add this before your metrics array to debug what values are being retrieved
const debugMetrics = {};
[
  "annual_demand_met", "reReplacement", "finalCost", "Per Unit Cost", 
  "OACost", "ISTS_charges", "state_charges", "total_generation",
  "total_demand", "demand_met", "total_unmet", "curtailment",
  "re_replacement", "per_unit_savings", "banking_price", "exceeds",
  "capital_cost_solar", "capital_cost_wind", "capital_cost_ess",
  "minimum_generation_obligation", "voltage_level_of_generation", "Total Cost"
].forEach(key => {
  debugMetrics[key] = getVal(c, key);
});

console.log("Debug metrics values:", debugMetrics);

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Technology", "Capacity"]],
      body: techCapacities,
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
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 80 },
      },
      margin: { left: 20, right: 20 },
      tableWidth: "auto",
      pageBreak: "avoid",
    });

    // ====== OA Cost Section =====
    doc.setFontSize(13);
    doc.setTextColor(colors.primary);
    doc.text("OA Cost Breakdown", 20, doc.lastAutoTable.finalY + 12);
    const oaCostDetails = [
      ["OA Wheeling Losses", combinationData.OA_wheeling_losses ?? "N/A"],
      ["OA Wheeling Charges", combinationData.OA_wheeling_charges ?? "N/A"],
      ["OA Transmission Loss", combinationData.OA_transmission_losses ?? "N/A"],
      ["OA Transmission Charges", combinationData.OA_transmission_charges ?? "N/A"],
      ["OA Standby Charges", combinationData.OA_standby_charges ?? "N/A"],
      ["OA Electricity Tax", combinationData.OA_electricity_tax ?? "N/A"],
      ["OA Cross Subsidy Surcharge", combinationData.OA_cross_subsidy_surcharge ?? "N/A"],
      ["OA Banking Charges", combinationData.OA_banking_charges ?? "N/A"],
      ["OA Additional Surcharge", combinationData.OA_additional_surcharge ?? "N/A"],
    ];

    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 16,
      head: [["Technology", "Capacity"]],
      body: oaCostDetails,
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
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 80 },
      },
      margin: { left: 20, right: 20 },
      tableWidth: "auto",
      pageBreak: "avoid",
    });

     // ===== Performance Summary =====
    doc.addPage(); // <--- Add this line to start Performance Summary on a new page
    doc.setFontSize(13);
    doc.setTextColor(colors.primary);
    doc.text("Performance Summary", 20, 20);

    // Now update your metrics array to use more specific property names
const metrics = [
  ["Annual Demand Met (%)", getVal(c, "annual_demand_met")],
  ["Annual Demand Offset (%)", getVal(c, "reReplacement")],
  ["Final Cost (INR/kWh)", formatCurrency(getVal(c, "totalCost"))],
  ["Per Unit Cost (INR/kWh)", formatCurrency(getVal(c, "perUnitCost", "Per Unit Cost"))],
  ["OA Cost (INR/kWh)", formatCurrency(getVal(c, "OACost", "OA_cost"))],
  ["ISTS Charges", formatCurrency(getVal(c, "ISTSCharges", "ISTS_charges"))],
  ["State Charges", formatCurrency(getVal(c, "stateCharges", "state_charges"))],
//   ["Total Generation (MWh)", formatNumber(getVal(c, "total_generation"), 2)],
//   ["Total Demand (MWh)", formatNumber(getVal(c, "total_demand"), 2)],
  ["Demand Met (MWh)", formatNumber(getVal(c, "annual_demand_met"), 2)],
//   ["Total Unmet (MWh)", formatNumber(getVal(c, "total_unmet"), 2)],
//   ["Curtailment", formatNumber(getVal(c, "curtailment"), 2)],
  ["RE Replacement (%)", getVal(c, "reReplacement")],
//   ["Per Unit Savings (INR/kWh)", formatCurrency(getVal(c, "per_unit_savings"))],
  ["Banking Price", formatCurrency(getVal(c, "banking_available"))],
//   ["Exceeds", getVal(c, "exceeds")],
//   ["Capital Cost Solar", formatCurrency(getVal(c, "capital_cost_solar"))],
//   ["Capital Cost Wind", formatCurrency(getVal(c, "capital_cost_wind"))],
//   ["Capital Cost ESS", formatCurrency(getVal(c, "capital_cost_ess"))],
//   ["Minimum Generation Obligation", getVal(c, "minimum_generation_obligation")],
//   ["Voltage Level of Generation", getVal(c, "voltage_level_of_generation")],
  ["Total Cost", formatCurrency(getVal(c, "totalCost"))],
//   ["Total Demand met by allocation", Array.isArray(c["Total Demand met by allocation"]) ? 
//     c["Total Demand met by allocation"].map(formatNumber).join(", ") : 
//     getVal(c, "Total Demand met by allocation")],
//   ["Unmet demand", Array.isArray(c["Unmet demand"]) ? 
//     c["Unmet demand"].map(formatNumber).join(", ") : 
//     getVal(c, "Unmet demand")],
];


console.log("data keys:", Object.keys(c));
// console.log("Solar capacity properties:", {
//   "Optimal Solar Capacity (MW)": c["Optimal Solar Capacity (MW)"],
//   "s_capacity": c.s_capacity,
//   "Solar Capacity": c["Solar Capacity"]
// });

    doc.autoTable({
      startY: 24,
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
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 80 },
      },
      margin: { left: 20, right: 20 },
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

    const infoText = "For more details, please contact at ";
    const email = "info@exgglobal.com";
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(9);

    doc.setTextColor(colors.primary);
    const infoTextWidth = doc.getTextWidth(infoText);
    const emailWidth = doc.getTextWidth(email);
    const totalWidth = infoTextWidth + emailWidth;
    const startX = (pageWidth - totalWidth) / 2;

    doc.text(infoText, startX, pageHeight - 8);
    doc.setTextColor(0, 102, 204); // blue color for link
    doc.textWithLink(email, startX + infoTextWidth, pageHeight - 8, {
      url: "mailto:info@exgglobal.com",
    });

    doc.save(
      `Combination_${c.combination || "Report"}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`
    );
  };

  // If the image is cached, logo.onload may not fire, so call manually if already loaded
  if (logo.complete) {
    logo.onload();
  }
};