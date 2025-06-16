import React from "react";

const PdfContent = () => {
  return (
    <div style={{ width: "800px", margin: "0 auto", padding: "20px", border: "1px solid #ccc" }}>
      <div style={{ position: "absolute", top: "10px", right: "20px", fontSize: "12px" }}>
        {/* <EXG Branding> */}
      </div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Annual Savings Report</h1>

      <div>
        <p><strong>Background</strong></p>
        <ul>
          <li>Consumer Company Name: </li>
          <li>Consumption Unit name, State:</li>
          <li>Connected Voltage in kV, Tariff Category:</li>
          <li>Annual electricity consumption in MWh: [This is not asked currently, please add this to the requirements text box in Consumer journey]</li>
        </ul>
      </div>

      <div>
        <h2>Analysis</h2>
        <p>Potential savings under Group captive transaction structure for your existing Contracted Demand of </p>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left", backgroundColor: "#f2f2f2" }}>Particulars</th>
              <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left", backgroundColor: "#f2f2f2" }}>Units</th>
              <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left", backgroundColor: "#f2f2f2" }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Your Electricity Tariff (Energy charge as per regulations)</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>INR/kWh</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}><span className="state-wise-value">State-wise category wise value</span></td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Potential RE tariff available (A)</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>INR/kWh</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Average of IPP tariff quoted (we can modify this further later on for industry wise average)</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>ISTS Charges (Interstate transmission charges) (B)</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>INR/kWh</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}></td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>State Charges (C)</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>INR/kWh</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}></td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Per unit Savings Potential [Electricity tariff- (A+B+C)]</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>INR/kWh</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}></td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Potential RE replacement</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>9%</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Annual RE replacement</td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Total Savings</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>INR crore</td>
              <td style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Per unit savings X RE replacement X Annual electricity consumption X 1000 (convert this to INR crores, this value is INR)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3>Group Captive Requirements:</h3>
        <p>You can hold 26% equity in the project and consumer electricity under group captive route in Open Access. You pay the required ISTS and State charges without Cross Subsidy surcharge and Additional Surcharge</p>
      </div>

      <p>This savings is based on average available industry offers on the platform, to start your energy transition and to know your exact savings, subscribe to EXG Global - EXT platform.</p>
    </div>
  );
};

export default PdfContent;
