import React, { useState } from "react";
import { Radio, Button, Typography } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Ensure Chart.js is loaded
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const { Text } = Typography;

const EnergyOptimizationPage = () => {
  const [selectedConsumer, setSelectedConsumer] = useState("");
  const [optimize, setOptimize] = useState(null);
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSubmit = () => {
    console.log({
      selectedConsumer,
      optimize,
    });
    alert("Submitted");
    navigate('/generator/update-profile-details'); // Navigate to the renamed page for the generator
  };

  // Data for Chart.js
  const chartData = {
    labels: ["Mar/24", "Apr/24", "May/24", "Jun/24", "Jul/24"],
    datasets: [
      {
        label: "Consumption",
        data: [100, 80, 60, 100, 80],
        backgroundColor: "#669800",
        borderRadius: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#001529", // Custom color for labels
        },
      },
      y: {
        ticks: {
          color: "#001529", // Custom color for labels
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#001529", // Legend label color
        },
      },
    },
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#669800" }}>Energy Optimization</h2>
        <div style={{ textAlign: "right" }}>
          <Text style={{ color: "#9A8406" }}>Consumer Name: John Doe</Text>
          <br />
          <Text style={{ color: "#9A8406" }}>Credit Rating: AAA</Text>
          <br />
          <Text style={{ color: "#9A8406" }}>Energy Demand: 20 MW</Text>
        </div>
      </div>

      {/* Top Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* Left: Chart */}
        <div style={{ width: "100%", maxWidth: "500px", height: "200px", marginBottom: "20px" }}>
          <h4 style={{ color: "#669800" }}>Consumption Pattern</h4>
          <div style={{ position: "relative", width: "100%", height: "200px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Optimization Section */}
      <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", flexDirection: "column" }}>
        <p style={{ color: "#669800", textAlign: "center"}}>Do you want us to optimize capacity?</p>
      

      {/* Submit Button */}
      <Button type="primary" onClick={handleSubmit} style={{ backgroundColor: "#669800", borderColor: "#669800", textAlign: "center", maxWidth: "200px", margin: "0 auto" }}>
        Submit
      </Button>
    </div>
    </div>
  );
};

export default EnergyOptimizationPage;
