import html2pdf from 'html2pdf.js'; // Import html2pdf.js

export const generatePDF = (pdfElement, requirementId, reportResponse) => {
  console.log(reportResponse);
  const options = {
    margin: [0.5, 0.5],
    filename: `Annual_Savings_Report_${requirementId || 'default'}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(pdfElement).set(options).save();
};

export const createPdfContent = (annualSavingResponse) => {
  console.log(annualSavingResponse);

  return `
  <body style="font-family: 'Inter', sans-serif; background-color: #F5F6FB; margin: 0; padding: 0;">
    <div style="width: 100%; margin: 0 auto; padding: 20px; border: 1px solid #E6E8F1; box-sizing: border-box; background-color: #fff;">
      <div style="position: absolute; top: 10px; right: 20px; font-size: 12px; text-align: right; color: #669800;">
        EXG Branding
      </div>
      <h1 style="text-align: center; margin-bottom: 20px; font-size: 28px; color: #669800;">Annual Savings Report</h1>

      <div>
        <p style="color: #669800;"><strong>Background</strong></p>
        <ul style="padding-left: 20px; font-size: 14px;">
          <li>Consumer Company Name: ${annualSavingResponse?.consumer_company_name || 'N/A'}</li>
          <li>Consumption Unit Name, State: ${annualSavingResponse?.consumption_unit_name || 'N/A'}</li>
          <li>Connected Voltage (kV), Tariff Category: ${annualSavingResponse?.connected_voltage || 'N/A'} kV, ${annualSavingResponse?.tariff_category || 'N/A'}</li>
          <li>Annual Electricity Consumption (MWh): ${annualSavingResponse?.annual_electricity_consumption || 'N/A'}</li>
        </ul>
      </div>

      <div>
        <h2 style="font-size: 20px; color: #669800;">Analysis</h2>
        <p style="font-size: 14px;">Potential savings under Group Captive Transaction Structure for your existing Contracted Demand of ${annualSavingResponse?.contracted_demand || 'N/A'} MW</p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #F5F6FB;">
              <th style="border: 1px solid #E6E8F1; padding: 10px; text-align: left; color: #669800;">Particulars</th>
              <th style="border: 1px solid #E6E8F1; padding: 10px; text-align: left; color: #669800;">Units</th>
              <th style="border: 1px solid #E6E8F1; padding: 10px; text-align: left; color: #669800;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">Your Electricity Tariff (Energy charge as per regulations)</td>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">INR/kWh</td>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">${annualSavingResponse?.electricity_tariff || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">Potential RE Tariff Available (A)</td>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">INR/kWh</td>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">${annualSavingResponse?.potential_re_tariff || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">ISTS Charges (B)</td>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">INR/kWh</td>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">${annualSavingResponse?.ISTS_charges || 'N/A'}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">State Charges (C)</td>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">INR/kWh</td>
              <td style="border: 1px solid #E6E8F1; padding: 10px; text-align: left;">${annualSavingResponse?.state_charges || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 style="font-size: 18px; color: #669800;">Group Captive Requirements:</h3>
        <p style="font-size: 14px;">You can hold 26% equity in the project and consume electricity under the group captive route in Open Access. You pay the required ISTS and State charges without Cross Subsidy surcharge and Additional Surcharge.</p>
      </div>

      <p style="font-size: 14px; color: #9A8406;">This savings is based on average available industry offers on the platform. To start your energy transition and know your exact savings, subscribe to EXG Global - EXT platform.</p>
    </div>

    <script>
      function adjustFontSize() {
        if (window.innerWidth <= 768) {
          document.querySelector('h1').style.fontSize = '24px';
          document.querySelector('h2').style.fontSize = '18px';
          document.querySelector('p').style.fontSize = '12px';
          document.querySelector('ul').style.fontSize = '12px';
          document.querySelector('table').style.fontSize = '12px';
        } else if (window.innerWidth <= 480) {
          document.querySelector('h1').style.fontSize = '20px';
          document.querySelector('h2').style.fontSize = '16px';
          document.querySelector('p').style.fontSize = '10px';
          document.querySelector('ul').style.fontSize = '10px';
          document.querySelector('table').style.fontSize = '10px';
        }
      }
      window.addEventListener('resize', adjustFontSize);
      adjustFontSize();
    </script>
  </body>
  `;
};


// import html2pdf from 'html2pdf.js'; // Import html2pdf.js

// export const generatePDF = (pdfElement, requirementId, reportResponse) => {

//   console.log(reportResponse);
//   const options = {
//     margin: [0.5, 0.5],
//     filename: `Annual_Savings_Report_${requirementId || 'default'}.pdf`,
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
//   };

//   html2pdf().from(pdfElement).set(options).save();
// };

// export const createPdfContent = (annualSavingResponse) => {
//   console.log(annualSavingResponse);

//   return `
//      <body>
//   <div style="width: 100%; margin: 0 auto; padding: 20px; border: 1px solid #ccc; box-sizing: border-box;">
//     <div style="position: absolute; top: 10px; right: 20px; font-size: 12px; text-align: right;">
//       EXG Branding
//     </div>
//     <h1 style="text-align: center; margin-bottom: 20px; font-size: 28px; word-wrap: break-word;">Annual Savings Report</h1>

//     <div>
//       <p><strong>Background</strong></p>
//       <ul style="padding-left: 20px; font-size: 14px;">
//         <li>Consumer Company Name: ${annualSavingResponse?.consumer_company_name || 'N/A'}</li>
//         <li>Consumption Unit Name, State: ${annualSavingResponse?.consumption_unit_name || 'N/A'}</li>
//         <li>Connected Voltage (kV), Tariff Category: ${annualSavingResponse?.connected_voltage || 'N/A'} kV, ${annualSavingResponse?.tariff_category || 'N/A'}</li>
//         <li>Annual Electricity Consumption (MWh): ${annualSavingResponse?.annual_electricity_consumption || 'N/A'}</li>
//       </ul>
//     </div>

//     <div>
//       <h2 style="font-size: 20px;">Analysis</h2>
//       <p style="font-size: 14px;">Potential savings under Group Captive Transaction Structure for your existing Contracted Demand of ${annualSavingResponse?.contracted_demand || 'N/A'} MW</p>

//       <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px;">
//         <thead>
//           <tr>
//             <th style="border: 1px solid #ccc; padding: 10px; text-align: left; background-color: #f2f2f2;">Particulars</th>
//             <th style="border: 1px solid #ccc; padding: 10px; text-align: left; background-color: #f2f2f2;">Units</th>
//             <th style="border: 1px solid #ccc; padding: 10px; text-align: left; background-color: #f2f2f2;">Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">Your Electricity Tariff (Energy charge as per regulations)</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">INR/kWh</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">${annualSavingResponse?.electricity_tariff || 'N/A'}</td>
//           </tr>
//           <tr>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">Potential RE Tariff Available (A)</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">INR/kWh</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">${annualSavingResponse?.potential_re_tariff || 'N/A'}</td>
//           </tr>
//           <tr>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">ISTS Charges (Interstate Transmission Charges) (B)</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">INR/kWh</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">${annualSavingResponse?.ISTS_charges || 'N/A'}</td>
//           </tr>
//           <tr>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">State Charges (C)</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">INR/kWh</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">${annualSavingResponse?.state_charges || 'N/A'}</td>
//           </tr>
//           <tr>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">Per Unit Savings Potential (A-B-C)</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">INR/kWh</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">${annualSavingResponse?.per_unit_savings_potential || 'N/A'}</td>
//           </tr>
//           <tr>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">Potential RE Replacement</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">%</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">${annualSavingResponse?.potential_re_replacement || 'N/A'}</td>
//           </tr>
//           <tr>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">Total Savings</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">INR crore</td>
//             <td style="border: 1px solid #ccc; padding: 10px; text-align: left;">${annualSavingResponse?.total_savings || 'N/A'}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>

//     <div>
//       <h3 style="font-size: 18px;">Group Captive Requirements:</h3>
//       <p style="font-size: 14px;">You can hold 26% equity in the project and consume electricity under the group captive route in Open Access. You pay the required ISTS and State charges without Cross Subsidy surcharge and Additional Surcharge.</p>
//     </div>

//     <p style="font-size: 14px; ">This savings is based on average available industry offers on the platform. To start your energy transition and know your exact savings, subscribe to EXG Global - EXT platform.</p>
//   </div>

//   <script>
//     // Adjust font sizes dynamically based on screen width
//     function adjustFontSize() {
//       if (window.innerWidth <= 768) {
//         document.querySelector('h1').style.fontSize = '24px';
//         document.querySelector('h2').style.fontSize = '18px';
//         document.querySelector('p').style.fontSize = '12px';
//         document.querySelector('ul').style.fontSize = '12px';
//         document.querySelector('table').style.fontSize = '12px';
//       } else if (window.innerWidth <= 480) {
//         document.querySelector('h1').style.fontSize = '20px';
//         document.querySelector('h2').style.fontSize = '16px';
//         document.querySelector('p').style.fontSize = '10px';
//         document.querySelector('ul').style.fontSize = '10px';
//         document.querySelector('table').style.fontSize = '10px';
//       }
//     }

//     // Call the adjustFontSize function on window resize
//     window.addEventListener('resize', adjustFontSize);
//     adjustFontSize();
//   </script>
// </body>

//   `;
// };
