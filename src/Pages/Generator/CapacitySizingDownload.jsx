import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

export const handleDownloadPdf = (record) => {
  const container = document.createElement("div");
  console.log("container", container);

  try {
    container.innerHTML = `
      <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #669800;">Combination Details</h2>
       <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="background-color: #669800; color: white;">
          <th>Field</th>
          <th>Value</th>
        </tr>
        <tr><td>Combination ID</td><td>${record.combinationId || "N/A"}</td></tr>
        <tr><td>Solar Capacity (MW)</td><td>${record.solarCapacity ?? "N/A"}</td></tr>
        <tr><td>Wind Capacity (MW)</td><td>${record.windCapacity ?? "N/A"}</td></tr>
        <tr><td>Battery Capacity (MWh)</td><td>${record.batteryCapacity ?? "N/A"}</td></tr>
        <tr><td>Per Unit Cost (INR/kWh)</td><td>${record.perUnitCost ?? "N/A"}</td></tr>
        <tr><td>OA Cost (INR/kWh)</td><td>${record.oaCost ?? "N/A"}</td></tr>
        <tr><td>Final Cost (INR/kWh)</td><td>${record.finalCost ?? "N/A"}</td></tr>
        <tr><td>Annual Demand Offset (%)</td><td>${record.annualDemandOffeset ?? "N/A"}</td></tr>
        <tr><td>Annual Demand Met (million units)</td><td>${record.annualDemandMet ?? "N/A"}</td></tr>
        <tr><td>Annual Curtailment (%)</td><td>${record.annualCurtailment ?? "N/A"}</td></tr>
      </table>


        <!-- Summary Table for Array Data -->
        <h3 style="color: #669800;">Hourly Data Summary</h3>
      <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <tr style="background-color: #669800; color: white;">
        <th>Parameter</th>
        <th>Min</th>
        <th>Max</th>
        <th>Average</th>
        <th>Total</th>
      </tr>
      ${generateSummaryRow('Demand (MW)', record.demandArray)}
      ${generateSummaryRow('Solar Allocation (MW)', record.solarAllocationArray)}
      ${generateSummaryRow('Wind Allocation (MW)', record.windAllocationArray)}
      ${generateSummaryRow('Generation (MW)', record.generationArray)}
      ${generateSummaryRow('Unmet Demand (MW)', record.unmetDemandArray)}
      ${generateSummaryRow('Curtailment (MW)', record.curtailmentArray)}
      ${generateSummaryRow('Demand Met', record.demandMetArray)}
      ${generateSummaryRow('Total Demand Met By Allocation (MW)', record.totalDemandMetByAllocationArray)}
    </table>

       <h3 style="color: #669800;">Sample Hourly Data (First 2000 Hours)</h3>
       <h5>Note: The data in this table is aggregated — every 2 hours of original data is combined into 1 hour. As a result, the table contains a total of 1000 rows.</h5>
       <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
           <thead style="background-color: #669800; color: white;">
            <tr>
              <th>Hour</th>
              <th>Demand (MW)</th>
              <th>Solar Allocation (MW)</th>
              <th>Wind Allocation (MW)</th>
              <th>Generation (MW)</th>
              <th>Unmet Demand (MW)</th>
              <th>Curtailment (MW)</th>
              <th>Demand Met ?</th>
              <th>Total Demand Met By Allocation (MW)</th>
            </tr>
          </thead>
          <tbody>
            ${generateSampleRows(record, 1000) || '<tr><td colspan="9" style="text-align: center;">No data available</td></tr>'}
          </tbody>
        </table>

      
    </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `Combination_${record.combinationId || "Details"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        useCORS: true,
        allowTaint: true
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait"
      },
      pagebreak: { mode: 'avoid-all' } // Try changing or removing this
    };

    html2pdf()
      .set(opt)
      .from(container)
      .save()
      .then(() => {
        console.log("PDF downloaded successfully");
      })
      .catch((error) => {
        console.error("Error downloading PDF:", error);
      });
  } catch (error) {
    console.error("Error generating PDF content:", error);
  }
};

// Helper function to generate sample rows (first 24 hours)
function generateSampleRows(record, count = 1000) {
  if (!record.demandArray || !record.demandArray.length) return null;

  return Array.from({ length: Math.min(count, record.demandArray.length) }, (_, index) => {
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${formatNumber(record.demandArray?.[index])}</td>
        <td>${formatNumber(record.solarAllocationArray?.[index])}</td>
        <td>${formatNumber(record.windAllocationArray?.[index])}</td>
        <td>${formatNumber(record.generationArray?.[index])}</td>
        <td>${formatNumber(record.unmetDemandArray?.[index])}</td>
        <td>${formatNumber(record.curtailmentArray?.[index])}</td>
        <td>${record.demandMetArray?.[index]}</td>
        <td>${formatNumber(record.totalDemandMetByAllocationArray?.[index])}</td>
      </tr>
    `;
  }).join("");
}


// Helper function to format numbers
function formatNumber(value) {
  if (value === undefined || value === null) return "N/A";
  const num = Number(value);
  return isNaN(num) ? "N/A" : num.toFixed(2);
}

// Helper function to generate summary table rows
function generateSummaryRow(label, dataArray) {
  if (!Array.isArray(dataArray)) {
    return `
      <tr>
        <td>${label}</td>
        <td colspan="4" style="text-align: center;">No data available</td>
      </tr>`;
  }

  const numericData = dataArray.filter(val => typeof val === 'number');
  if (label.includes('Demand Met') && dataArray.some(val => val === 'Yes' || val === 'NO')) {
    const yesCount = dataArray.filter(val => val === 'Yes').length;
    const noCount = dataArray.filter(val => val === 'NO').length;
    const total = dataArray.length;

    return `
      <tr>
        <td>${label}</td>
        <td colspan="2">YES: ${yesCount} (${((yesCount / total) * 100).toFixed(1)}%)</td>
        <td colspan="2">NO: ${noCount} (${((noCount / total) * 100).toFixed(1)}%)</td>
      </tr>
    `;
  }

  if (numericData.length === 0) {
    return `
      <tr>
        <td>${label}</td>
        <td colspan="4" style="text-align: center;">No numeric data</td>
      </tr>`;
  }

  // Special handling for Demand Met if it contains YES/NO values


  const min = Math.min(...numericData).toFixed(2);
  const max = Math.max(...numericData).toFixed(2);
  const sum = numericData.reduce((a, b) => a + b, 0);
  const avg = (sum / numericData.length).toFixed(2);

  return `
    <tr>
      <td>${label}</td>
      <td>${min}</td>
      <td>${max}</td>
      <td>${avg}</td>
      <td>${sum.toFixed(2)}</td>
    </tr>`;
}



export const handleDownloadExcel = (record) => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // 1. Create Combination Details sheet
    const detailsData = [
      ["Combination Details"],
      ["Field", "Value"],
      ["Combination ID", record.combinationId || "N/A"],
      ["Solar Capacity (MW)", record.solarCapacity ?? "N/A"],
      ["Wind Capacity (MW)", record.windCapacity ?? "N/A"],
      ["Battery Capacity (MWh)", record.batteryCapacity ?? "N/A"],
      ["Per Unit Cost (INR/kWh)", record.perUnitCost ?? "N/A"],
      ["OA Cost (INR/kWh)", record.oaCost ?? "N/A"],
      ["Final Cost (INR/kWh)", record.finalCost ?? "N/A"],
      ["Annual Demand Offset (%)", record.annualDemandOffeset ?? "N/A"],
      ["Annual Demand Met (million units)", record.annualDemandMet ?? "N/A"],
      ["Annual Curtailment (%)", record.annualCurtailment ?? "N/A"]
    ];

    const detailsWS = XLSX.utils.aoa_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(wb, detailsWS, "Combination Details");

    // 2. Create Hourly Data Summary sheet
    const summaryData = [
      ["Hourly Data Summary"],
      ["Parameter", "Min", "Max", "Average", "Total"],
      ...generateExcelSummaryRow('Demand (MW)', record.demandArray),
      ...generateExcelSummaryRow('Solar Allocation (MW)', record.solarAllocationArray),
      ...generateExcelSummaryRow('Wind Allocation (MW)', record.windAllocationArray),
      ...generateExcelSummaryRow('Generation (MW)', record.generationArray),
      ...generateExcelSummaryRow('Unmet Demand (MW)', record.unmetDemandArray),
      ...generateExcelSummaryRow('Curtailment (MW)', record.curtailmentArray),
      ...generateExcelSummaryRow('Demand Met', record.demandMetArray),
      ...generateExcelSummaryRow('Total Demand Met By Allocation (MW)', record.totalDemandMetByAllocationArray)
    ];

    const summaryWS = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWS, "Hourly Summary");

    // 3. Create Sample Hourly Data sheet
    const hourlyHeaders = [
      "Hour",
      "Demand (MW)",
      "Solar Allocation (MW)",
      "Wind Allocation (MW)",
      "Generation (MW)",
      "Unmet Demand (MW)",
      "Curtailment (MW)",
      "Demand Met ?",
      "Total Demand Met By Allocation (MW)"
    ];

    const hourlyData = [hourlyHeaders];
    if (record.demandArray && record.demandArray.length) {
      const rowCount = Math.min(1000, record.demandArray.length);
      for (let i = 0; i < rowCount; i++) {
        hourlyData.push([
          i + 1,
          formatExcelNumber(record.demandArray?.[i]),
          formatExcelNumber(record.solarAllocationArray?.[i]),
          formatExcelNumber(record.windAllocationArray?.[i]),
          formatExcelNumber(record.generationArray?.[i]),
          formatExcelNumber(record.unmetDemandArray?.[i]),
          formatExcelNumber(record.curtailmentArray?.[i]),
          record.demandMetArray?.[i] || "N/A",
          formatExcelNumber(record.totalDemandMetByAllocationArray?.[i])
        ]);
      }
    } else {
      hourlyData.push(["No data available"]);
    }

    const hourlyWS = XLSX.utils.aoa_to_sheet(hourlyData);
    XLSX.utils.book_append_sheet(wb, hourlyWS, "Hourly Data");

    // Generate Excel file
    const fileName = `Combination_${record.combinationId || "Details"}.xlsx`;
    XLSX.writeFile(wb, fileName);

  } catch (error) {
    console.error("Error generating Excel file:", error);
  }
};

// Helper functions
function formatExcelNumber(value) {
  if (value === undefined || value === null) return "N/A";
  const num = Number(value);
  return isNaN(num) ? "N/A" : num;
}

function generateExcelSummaryRow(label, dataArray) {
  if (!Array.isArray(dataArray)) {
    return [[label, "No data available", "", "", ""]];
  }

  if (label.includes('Demand Met') && dataArray.some(val => val === 'Yes' || val === 'NO')) {
    const yesCount = dataArray.filter(val => val === 'Yes').length;
    const noCount = dataArray.filter(val => val === 'NO').length;
    const total = dataArray.length;
    
    return [
      [label, `YES: ${yesCount} (${((yesCount / total) * 100).toFixed(1)}%)`, `NO: ${noCount} (${((noCount / total) * 100).toFixed(1)}%)`, "", ""]
    ];
  }

  const numericData = dataArray.filter(val => typeof val === 'number');
  if (numericData.length === 0) {
    return [[label, "No numeric data", "", "", ""]];
  }

  const min = Math.min(...numericData);
  const max = Math.max(...numericData);
  const sum = numericData.reduce((a, b) => a + b, 0);
  const avg = sum / numericData.length;

  return [
    [label, min, max, avg, sum]
  ];
}