import React from "react";
import { Table, Button, Typography, Row, Col } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Ensure Chart.js is loaded

const { Title, Text } = Typography;

const ConsumptionPattern = () => {
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
  ];

  // Table data
  const dataSource = [
    {
      key: "1",
      ipp: "1",
      states: "Karnataka",
      capacity: "50 MW",
      replacement: "65%",
    },
    {
      key: "2",
      ipp: "2",
      states: "Maharashtra",
      capacity: "30 MW",
      replacement: "65%",
    },
    {
      key: "3",
      ipp: "3",
      states: "Rajasthan",
      capacity: "10 MW",
      replacement: "65%",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#F5F6FB",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Row justify="center" align="middle" gutter={[16, 8]} style={{ marginTop: "60px", height: "100%" }}>
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
          <Title level={4} style={{ textAlign: "center", color: "#001529", marginTop:"15px"}}>
            Matching IPP Profile
          </Title>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6E8F1",
              // maxWidth:"900px"
            }}
          />
        </Col>

        <Col span={24} style={{ textAlign: "center" }}>
          <Button
            type="primary"
            style={{
              backgroundColor: "#669800",
              borderColor: "#669800",
              fontSize: "16px",
              padding: "10px 40px",
            }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ConsumptionPattern;
