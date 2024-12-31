import React, { useState, useEffect } from "react";
import { Table, Typography, Row, Col, Spin, Progress } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import IPPModal from "./Modal/IPPModal";

const { Title, Text } = Typography;

const ConsumptionPattern = () => {
  const [selectedIPP, setSelectedIPP] = useState(null); // State to store selected IPP
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [isLoading, setIsLoading] = useState(true); // State to control loader visibility
  const [loadingProgress, setLoadingProgress] = useState(0); // State to manage progress bar

  useEffect(() => {
    // Simulate loading delay for 10 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    // Simulate progress bar update every second for the 10 seconds
    const progressTimer = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressTimer); // Clear interval when progress reaches 100
          return 100;
        }
        return prevProgress + 10; // Increase progress by 10 every second
      });
    }, 1000);

    return () => {
      clearTimeout(timer); // Cleanup timer on unmount
      clearInterval(progressTimer); // Cleanup progress interval on unmount
    };
  }, []);

  // Data for the chart
  const chartData = {
    labels: ["Mar/24", "Apr/24", "May/24", "Jun/24", "Jul/24"],
    datasets: [
      {
        label: "Consumption",
        data: [100, 80, 50, 90, 70],
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
          color: "#001529",
        },
      },
      y: {
        ticks: {
          color: "#001529",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#001529",
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
        <Text
          style={{
            backgroundColor: "#F5F6FB",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
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
      render: (text) => `₹ ${text.toFixed(2)}`,
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
      perUnitCost: 5.45,
    },
    {
      key: "2",
      ipp: "2",
      states: "Maharashtra",
      capacity: "30 MW",
      replacement: "65%",
      perUnitCost: 6.2,
    },
    {
      key: "3",
      ipp: "3",
      states: "Rajasthan",
      capacity: "10 MW",
      replacement: "65%",
      perUnitCost: 4.85,
    },
  ];

  // Handle row click logic
  const handleRowClick = (record) => {
    setSelectedIPP(record);
    setIsModalVisible(true);
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

        <Col span={24} style={{ marginTop: "20px" }}>
          <Title level={4} style={{ textAlign: "center", color: "#001529" }}>
            Matching IPP Profile
          </Title>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Progress
                type="line"
                percent={loadingProgress}
                status="active"
                showInfo={true} // Show percentage
                width={400}
                strokeColor="#4CAF50" // Green color
              />
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              bordered
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: {
                  backgroundColor: record.key === selectedIPP?.key ? "#c4d4a5" : "white",
                },
              })}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E6E8F1",
                overflowX: "auto",
              }}
              scroll={{ x: true }}
            />
          )}
        </Col>
      </Row>

      {selectedIPP && (
        <IPPModal
          visible={isModalVisible}
          ipp={selectedIPP}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </div>
  );
};

export default ConsumptionPattern;
