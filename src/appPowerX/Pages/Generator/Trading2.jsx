import React from "react";
import { Card, Statistic, Button, Row, Col } from "antd";
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
import { DownloadOutlined } from "@ant-design/icons";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const Trading2 = () => {
  const navigate = useNavigate();

  // Chart Data
  const data = {
    labels: [1, 2, 3, 4, 5, 6, 7, 8],
    datasets: [
      {
        label: "MCP (INR/MWh)",
        data: [2000, 5000, 4000, 2000, 1300, 2900, 3100, 1000],
        borderColor: "#1890ff",
        backgroundColor: "rgba(24, 144, 255, 0.2)",
      },
      {
        label: "MCV (MWh)",
        data: [3000, 3000, 3000, 2088, 2341, 1020, 2000, 3200],
        borderColor: "#52c41a",
        backgroundColor: "rgba(82, 196, 26, 0.2)",
      },
    ],
  };

  // Navigation Handlers
  const handleChat = () => {
    navigate("/px/chat-page");
    console.log("Chat with Expert");
  };

  const handleTradingStatus = () => {
    console.log("Trading Status");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {/* Total Section */}
        <Col span={6}>
          <Card style={{ height: "150px", backgroundColor: "#669800", textAlign:'center' }}>
            <Statistic
              title="Total"
              value={493}
              suffix={
                <>
                  <DownloadOutlined style={{ marginLeft: 5, fontSize: "16px" }} />
                  <span style={{ fontSize: "16px", marginLeft: "5px" }}>32%</span>
                </>
              }
            />
            <p>Last day: 367</p>
          </Card>
        </Col>

        {/* Total Generator */}
        <Col span={6}>
          <Card style={{ height: "150px", backgroundColor: "#669800", textAlign:'center' }}>
            <Statistic title="Trading Volume" value={8.334} />
            <p>Last day:30</p>
          </Card>
        </Col>

        {/* Total Consumer */}
        <Col span={6}>
          <Card style={{ height: "150px", backgroundColor: "#669800",textAlign:'center' }}>
            <Statistic title="Price Per Unit" value={6.204} />
            <p>Last day: 334</p>
          </Card>
        </Col>

        {/* Total Energy */}
        <Col span={6}>
          <Card style={{ height: "150px", backgroundColor: "#669800",textAlign:'center' }}>
            <Statistic title="Planning Costs" value={4.900} />
            <p>Last day: 334</p>
          </Card>
        </Col>
      </Row>

      {/* Historical Trend */}
      <Card style={{ marginTop: "20px" }}>
        <h2>Historical Trend</h2>
        <div style={{ height: "300px", width: "80%", margin: "0 auto", marginTop: "10px" }}>
          <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
          <h1 style={{ textAlign: "center", marginTop: "3%" }}>Plan vs Trade</h1>
        </div>
      </Card>

      {/* Action Buttons */}
      <div style={{ padding: "20px", marginTop: "3%" }}>
        <Row justify="space-between">
          <Col>
            <Button onClick={handleTradingStatus}>Trading Status</Button>
          </Col>
          <Col>
            <Button onClick={handleChat}>Chat with Expert</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Trading2;
