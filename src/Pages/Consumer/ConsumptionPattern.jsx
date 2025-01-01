import React, { useState, useEffect } from "react";
import { Table, Typography, Row, Col, Spin, Progress, Slider, Button } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import IPPModal from "./Modal/IPPModal";

const { Title, Text } = Typography;

const ConsumptionPattern = () => {
  const [selectedIPP, setSelectedIPP] = useState(null); // State to store selected IPP
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [isLoading, setIsLoading] = useState(true); // State to control loader visibility
  const [loadingProgress, setLoadingProgress] = useState(0); // State to manage progress bar
  const [showSlider, setShowSlider] = useState(false); // State to show slider for Potential RE Replacement
  const [sliderValue, setSliderValue] = useState(65); // State for slider value
  const [dataSource, setDataSource] = useState([ // Add state for dataSource
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
  ]); // Initialize the dataSource with initial values

  // Simulate loading delay for 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000);

    const progressTimer = setInterval(() => {
      setLoadingProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressTimer); // Clear interval when progress reaches 100
          return 100;
        }
        return prevProgress + 20; // Increase progress by 10 every second
      });
    }, 1000);

    return () => {
      clearTimeout(timer); // Cleanup timer on unmount
      clearInterval(progressTimer); // Cleanup progress interval on unmount
    };
  }, []);

  // Handle click on Potential RE Replacement to show slider
  const handlePotentialReplacementClick = (record) => {
    setSelectedIPP(record);
    setSliderValue(parseInt(record.replacement)); // Set the current value of the replacement percentage
    setShowSlider(true); // Show the slider
  };

  // Handle slider change and update all values
  const handleSliderChange = (value) => {
    setSliderValue(value);

    const updatedDataSource = dataSource.map((item) => ({
      ...item,
      replacement: `${value}%`, // Update replacement value for all records
    }));

    setDataSource(updatedDataSource); // Update the state of dataSource with the modified values
  };

  const handleOptimizeClick = () => {
    setShowSlider(false); // Hide slider after optimization
  };

  // Data for the chart
  const chartData = {
    labels: ["Jan/24","Feb/24","Mar/24", "Apr/24", "May/24", "Jun/24", "Jul/24","Aug/24","Sep/24","Oct/24","Nov/24","Dec/24",],
    datasets: [
      {
        label: "Consumption",
        data: [100, 80, 50, 90, 70,40,75,90,35,85,55,40],
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
      render: (text, record) => (
        <Text
          style={{
            backgroundColor: "#F5F6FB",
            padding: "4px 8px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => handlePotentialReplacementClick(record)}
        >
          {text}
        </Text>
      ),
    },
    {
      title: "Per Unit Cost (₹)",
      dataIndex: "perUnitCost",
      key: "perUnitCost",
      render: (text) => `₹ ${text.toFixed(2)}`,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            setSelectedIPP(record);
            setIsModalVisible(true); // Open modal on button click
          }}
        >
          Select
        </Button>
      ),
    },
  ];

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

        <Col span={24} style={{ textAlign: "center" }}>
          <div
            style={{
              position: "relative",
              width: "80%",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <Bar data={chartData} options={chartOptions} />
          </div>
        </Col>

        <Col span={24} style={{ marginTop: "20px" }}>
          <Title level={4} style={{ textAlign: "center", color: "#001529" }}>
            Optimized IPP
          </Title>

          {/* Slider section */}
          {showSlider && (
            <Row justify="center" style={{ marginBottom: "20px" }}>
              <Col span={12} style={{ textAlign: "center" }}>
                <Slider
                  min={0}
                  max={100}
                  value={sliderValue}
                  onChange={handleSliderChange}
                  tipFormatter={(value) => `${value}%`}
                />
                <Text style={{ color: "#001529", fontSize: "16px" }}>
                  Potential RE Replacement of IPP : {sliderValue}%
                </Text>
                <Button
                  type="primary"
                  style={{ marginTop: "10px", marginLeft: "20%" }}
                  onClick={handleOptimizeClick}
                >
                  Optimize
                </Button>
              </Col>
            </Row>
          )}

          {isLoading ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Progress
                type="line"
                percent={loadingProgress}
                status="active"
                showInfo={true}
                width={400}
                strokeColor="#4CAF50"
              />
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              bordered
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
