import React, { useState } from "react";
import { Table, Typography, Row, Col, message } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Ensure Chart.js is loaded
import IPPModal from "./Modal/IPPModal"; // Import the modal component

const { Title, Text } = Typography;

const ConsumptionPattern = () => {
  const [selectedIPP, setSelectedIPP] = useState(null); // State to store selected IPP
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility

  // Data for the chart
  const chartData = {
    labels: ["Mar/24", "Apr/24", "May/24", "Jun/24", "Jul/24"],
    datasets: [
      {
        label: "Consumption",
        data: [100, 80, 50, 90, 70], // Example data
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

  // Table columns
  const columns = [
    {
      title: "IPP",
      dataIndex: "ipp",
      key: "ipp",
    },
    {
      title: "States",
      dataIndex: "states",
      key: "states",
      render: (text) => (
        <Text style={{ backgroundColor: "#F5F6FB", padding: "4px 8px", borderRadius: "4px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Available Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Potential RE Replacement",
      dataIndex: "replacement",
      key: "replacement",
    },
    {
      title: "Per Unit Cost (₹)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
      render: (text) => `₹ ${text.toFixed(2)}`, // Format the cost to show as rupees
    },
  ];

  // Table data
  const dataSource = [
    {
      key: "1",
      ipp: "1",
      states: "Karnataka",
      capacity: "50 MW",
      replacement: "65%",
      perUnitCost: 5.45, // Example cost
    },
    {
      key: "2",
      ipp: "2",
      states: "Maharashtra",
      capacity: "30 MW",
      replacement: "65%",
      perUnitCost: 6.20, // Example cost
    },
    {
      key: "3",
      ipp: "3",
      states: "Rajasthan",
      capacity: "10 MW",
      replacement: "65%",
      perUnitCost: 4.85, // Example cost
    },
  ];

  // Handle row click logic
  const handleRowClick = (record) => {
    setSelectedIPP(record); // Set the selected IPP when a row is clicked
    setIsModalVisible(true); // Show modal when row is clicked
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Row justify="center" align="middle" gutter={[16, 8]} style={{ height: "100%" }}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Title level={3} style={{ color: "#001529" }}>
            Your Consumption Pattern
          </Title>
        </Col>

        <Col span={24} md={12} style={{ textAlign: "center" }}>
          <div style={{ position: "relative", width: "100%", height: "200px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Col>

        <Col span={24}>
          <Title level={4} style={{ textAlign: "center", color: "#001529", marginTop: "15px" }}>
            Matching IPP Profile
          </Title>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
            onRow={(record) => ({
              onClick: () => handleRowClick(record), // Handle row click
              style: {
                backgroundColor: record.key === selectedIPP?.key ? "#c4d4a5" : "white", // Change background color for selected row
              },
            })}
            rowClassName="" // No need for rowClassName since we're using inline styles
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6E8F1",
              overflowX: "auto", // Make the table scrollable on small screens
            }}
            scroll={{ x: true }} // Enable horizontal scroll for small screens
          />
        </Col>
      </Row>

      {/* IPP Modal Component */}
      {selectedIPP && (
        <IPPModal
          visible={isModalVisible}
          ipp={selectedIPP}
          onClose={() => setIsModalVisible(false)} // Close modal
        />
      )}
    </div>
  );
};

export default ConsumptionPattern;
