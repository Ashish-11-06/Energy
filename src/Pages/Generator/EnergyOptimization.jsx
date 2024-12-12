import React, { useState } from "react";
import { Radio, Button, Table } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const EnergyOptimizationPage = () => {
  const [selectedConsumer, setSelectedConsumer] = useState("");
  const [optimize, setOptimize] = useState(null);

  const handleSubmit = () => {
    console.log({
      selectedConsumer,
      optimize,
    });
    alert("Submitted");
  };

  // Data for Recharts
  const chartData = [
    { month: "Mar/24", consumption: 100 },
    { month: "Apr/24", consumption: 80 },
    { month: "May/24", consumption: 60 },
    { month: "Jun/24", consumption: 100 },
    { month: "Jul/24", consumption: 80 },
  ];

  // Table Data for Ant Design
  const columns = [
    {
      title: "S. No",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: "Technology",
      dataIndex: "technology",
      key: "technology",
    },
    {
      title: "Offered Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Offered Energy (MUs)",
      dataIndex: "energy",
      key: "energy",
    },
  ];

  const tableData = [
    {
      key: "1",
      sno: "1",
      technology: "Solar",
      capacity: "50 MW",
      energy: "66",
    },
    {
      key: "2",
      sno: "2",
      technology: "Wind",
      capacity: "30 MW",
      energy: "65",
    },
    {
      key: "3",
      sno: "3",
      technology: "ESS",
      capacity: "10 MW",
      energy: "65",
    },
  ];

  return (
    <div style={{ padding: "20px", fontFamily: "Inter, sans-serif", backgroundColor: "#F5F6FB" }}>
      <h2 style={{ color: "#669800" }}>Energy Optimization</h2>

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
          <ResponsiveContainer width="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              {/* Change Bar color here */}
              <Bar dataKey="consumption" fill="#4CAF50" /> {/* Updated color */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Consumer Details */}
        <div style={{ width: "100%", maxWidth: "500px", marginTop: '3%'}}>
          <label style={{ color: "#9A8406" }}>Consumer Name:</label>
          <p style={{ marginTop: "20px" }}>Credit Rating: AAA</p>
          <p>Energy Demand: 20 MW</p>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={tableData}
        pagination={false}
        style={{ marginBottom: "20px", fontSize: "14px", borderColor: "#E6E8F1" }}
      />

      {/* Optimization Section */}
      <div>
        <p style={{ color: "#669800" }}>Do you want us to optimize capacity?</p>
      </div>

      {/* Submit Button */}
      <Button type="primary" onClick={handleSubmit} style={{ backgroundColor: "#669800", borderColor: "#669800" }}>
        Submit
      </Button>
    </div>
  );
};

export default EnergyOptimizationPage;
