import html2pdf from 'html2pdf.js';

export const handleDownloadPdf = (record) => {
  const container = document.createElement("div");
  console.log("container", container);

  try {
    container.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Combination Details</h2>
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr><th>Field</th><th>Value</th></tr>
          <tr><td>Combination ID</td><td>${record.combinationId || "N/A"}</td></tr>
          <tr><td>Solar Capacity (MW)</td><td>${record.solarCapacity ?? "N/A"}</td></tr>
          <tr><td>Wind Capacity (MW)</td><td>${record.windCapacity ?? "N/A"}</td></tr>
          <tr><td>Battery Capacity (MW)</td><td>${record.batteryCapacity ?? "N/A"}</td></tr>
          <tr><td>Per Unit Cost (INR/kWh)</td><td>${record.perUnitCost ?? "N/A"}</td></tr>
          <tr><td>OA Cost (INR/kWh)</td><td>${record.oaCost ?? "N/A"}</td></tr>
          <tr><td>Final Cost (INR/kWh)</td><td>${record.finalCost ?? "N/A"}</td></tr>
          <tr><td>Annual Demand Offset (%)</td><td>${record.annualDemandOffeset ?? "N/A"}</td></tr>
          <tr><td>Annual Demand Met (million units)</td><td>${record.annualDemandMet ?? "N/A"}</td></tr>
          <tr><td>Annual Curtailment (%)</td><td>${record.annualCurtailment ?? "N/A"}</td></tr>
        </table>

        <!-- Summary Table for Array Data -->
        <h3>Hourly Data Summary</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr>
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
          ${generateSummaryRow('Demand Met (MW)', record.demandMetArray)}
          ${generateSummaryRow('Total Demand Met By Allocation (MW)', record.totalDemandMetByAllocationArray)}
        </table>

        <h3>Sample Hourly Data (First 24 Hours)</h3>
        <table border="1" cellpadding="6" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Demand (MW)</th>
              <th>Solar (MW)</th>
              <th>Wind (MW)</th>
              <th>Generation (MW)</th>
              <th>Unmet (MW)</th>
              <th>Curtailment (MW)</th>
              <th>Demand Met (MW)</th>
              <th>Total Met (MW)</th>
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
        <td>${formatNumber(record.demandMetArray?.[index])}</td>
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
  if (numericData.length === 0) {
    return `
      <tr>
        <td>${label}</td>
        <td colspan="4" style="text-align: center;">No numeric data</td>
      </tr>`;
  }

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