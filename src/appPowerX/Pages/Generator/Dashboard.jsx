/* eslint-disable no-unused-vars */
import React from "react";
import { Card, Col, Typography, Row } from "antd";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import Title from "antd/es/typography/Title";
// Register required chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
import market from '../../assets/market.png';
import statistics from '../../assets/statistics.png';
import { useNavigate } from "react-router-dom";

const DashboardPG = () => {
  const navigate = useNavigate();
  const energyPortfolio = [
    { id: 1, type: "Solar", energy: 150, projects: 100 },
    { id: 2, type: "Wind", energy: 100, projects: 150 },
    { id: 3, type: "Ess", energy: 200, projects: 190 },
  ];

  const barData = {
    labels: energyPortfolio.map((item) => item.type), // X-axis labels
    datasets: [
      {
        label: "Energy in MW",
        data: energyPortfolio.map((item) => item.energy), // Energy values
        backgroundColor: "#669800", // Green color for energy
        barThickness: 60, // Adjust bar thickness
      },
      {
        label: "Number of Projects",
        data: energyPortfolio.map((item) => item.projects), // Number of projects
        backgroundColor: "#A5E67F", // Orange color for projects
        barThickness: 60, // Adjust bar thickness
      },
    ],
  };

  const handleUpcomingMarket = () => {
    navigate("/px/generator/month-ahead");
  };

  const handleMarketStatistics = () => {
    navigate("/px/generator/statistical-information");
  };

  const stateData = {
    labels: ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Rajasthan"],
    datasets: [
      {
        label: "State-wise Distribution",
        data: [30, 20, 15, 25, 10], // Percentage distribution
        backgroundColor: "#669800", // Green color for bars
        barThickness: 25, // Adjust bar thickness
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Value",
        },
      },
      x: {
        title: {
          display: true,
          text: "Energy Type",
        },
      },
    },
  };

  const stateChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage",
        },
      },
      x: {
        title: {
          display: true,
          text: "States",
        },
      },
    },
  };

  return (
    <div style={{ marginTop: "10px", padding: "3%" }}>
      <Typography.Title level={3}>Portfolio Details</Typography.Title>
      <Card style={{ height: "50%" }}>
        <Col span={24} style={{ marginBottom: "20px" }}>
          <div
            style={{
              position: "relative",
              width: "80%",
              height: "300px",
              margin: "0 auto",
            }}
          >
            <Bar data={barData} options={chartOptions} />
          </div>
        </Col>
      </Card>
      <Card style={{ margin: "20px" }}>
        <Row gutter={[16, 16]} justify="space-between">
          {/* First Column */}
          <Col span={8}>
            <Typography.Title level={4}>PowerX Detail</Typography.Title>
            <Col>
              <img 
                src={market} 
                alt=""  
                style={{ height: '20px', width: '20px', marginRight: '5px' }} 
              />
              <span 
                onClick={handleUpcomingMarket} 
                style={{ cursor: 'pointer', color: 'black' }} // Default color
                onMouseEnter={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
                onMouseLeave={(e) => e.target.style.color = 'black'}
              >
                Upcoming Market
              </span>
            </Col>
            <Col>
              <img 
                src={statistics}  
                alt="" 
                style={{ height: '20px', width: '20px', marginRight: '5px', marginTop: '5px' }} 
              />
              <span 
                onClick={handleMarketStatistics} 
                style={{ cursor: 'pointer', color: 'black' }} // Default color
                onMouseEnter={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
                onMouseLeave={(e) => e.target.style.color = 'black'}
              >
                Market Statistics
              </span>
            </Col>
          </Col>

          {/* Second Column */}
          <Col span={8}>
            <Typography.Title level={4}>State-wise Distribution</Typography.Title>
            <Col span={24} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "300px",
                  margin: "0 auto",
                }}
              >
                <Bar data={stateData} options={stateChartOptions} style={{height:'200px'}}/>
              </div>
            </Col>
          </Col>

          {/* Third Column */}
          <Col span={8}>
            <Typography.Title level={4}>
              Executed Trade Details
            </Typography.Title>
            <ul>
              <li>Best Price: 4</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardPG;