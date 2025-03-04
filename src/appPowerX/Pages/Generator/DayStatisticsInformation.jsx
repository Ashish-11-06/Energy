import React, { useState } from "react";
import { Button, Select, Table, Row, Col, Card } from "antd";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { Option } = Select;

// Define chart data for Line chart with more X-axis values
const data = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8], // Updated X-axis labels
  datasets: [
    {
      label: "MCP (INR/MWh)", // Label for MCP dataset
      data: [2000, 5000, 4000, 2000, 1300, 2900, 3100, 1000], // Updated data for MCP
    },
    {
      label: "MCV (MWh)", // Label for MCY dataset
      data: [3000, 3000, 3000, 2088, 2341, 1020, 2000, 3200], // Updated data for MCY
    },
  ],
};

// Define columns for the table
const columns = [
  {
    title: "Details",
    dataIndex: "metric",
    key: "metric",
  },
  {
    title: "MCP (INR/MWh)",
    dataIndex: "mcp",
    key: "mcp",
  },
  {
    title: "MCV (MWh)",
    dataIndex: "mcy",
    key: "mcy",
  },
];

// Define table data
const tableData = [
  {
    key: "1",
    metric: "Accuracy",
    mcp: '80%',
    mcy: '90%'
  },
  {
    key: "2",
    metric: "Error",
    mcp: '20%',
    mcy: '10%',
  },

];

const DayStatisticsInformation = () => {
  const [selectedType, setSelectedType] = useState("Solar");
  const navigate = useNavigate();
  const handleChange = (value) => {
    setSelectedType(value);
  };

  const handleNextTrade = () => {
    navigate("/px/plan-trade-page");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Statistical Information</h1>

      <Card>
        <div style={{ height: "300px", width: "80%", margin: "0 auto" }}>
          <Line data={data} options={{ responsive: true }} />
        </div>
      </Card>
      <h2></h2>
      <Table columns={columns} dataSource={tableData} pagination={false} style={{width:'400px'}}/>
    </div>
  );
};

export default DayStatisticsInformation;
