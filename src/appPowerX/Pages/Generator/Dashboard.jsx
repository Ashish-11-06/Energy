/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Col, Typography, Row, Table } from "antd"; // Added Table import
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import zoomPlugin from 'chartjs-plugin-zoom';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import market from "../../assets/market.png";
import statistics from "../../assets/statistics.png";
import { fetchDashboardDataG, fetchDashboardLineG } from "../../Redux/slices/generator/dashboardSlice";

// Register required chart.js components and plugins
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  zoomPlugin
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({});
  const [dashboardLine, setDashboardLine] = useState([]);
  const user_id = Number(JSON.parse(localStorage.getItem('user')).user.id);
// console.log(user_id);

  useEffect(() => {
    const id = user_id;
    const fetchData = async () => {
      const res = await dispatch(fetchDashboardDataG(id));
      setDashboardData(res.payload || {});
    };
    fetchData();
  }, [dispatch]);

  console.log(dashboardData);

  useEffect(() => {
    const id = user_id;
    const fetchLineData = async () => {
      const res = await dispatch(fetchDashboardLineG(id));
      console.log(res.payload);
      console.log('line data', res.payload);
      
      setDashboardLine(Array.isArray(res.payload) ? res.payload : []);
    };
    fetchLineData();
  }, [dispatch]);

  // Extract generation values from dashboardLine
  const generationValues = dashboardLine.map(item => item.generation);

  // Line Chart Data
  const lineData = {
    labels: generationValues.length
      ? Array.from({ length: generationValues.length }, (_, i) => i + 1)
      : [],
    datasets: [
      {
        label: "Generation (MWh)",
        data: generationValues,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        fill: true,
        tension: 0.3, // Smooth curves
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "MWh",
        },
      },
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: '96 time blocks',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Position legends at the bottom
        align: 'end', // Align legends to the right
        labels: {
          padding: 20, // Add padding around legend items
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
      title: {
        display: true,
        text: 'Energy Consumption Over Time',
        font: {
          size: 18,
        },
      },
    },
  };

  // Extract state names, total install capacity, and available capacity from dashboardData
  const solarData = dashboardData.solar || [];
  const windData = dashboardData.wind || [];
  const essData = dashboardData.ess || [];

  const combinedData = [...solarData, ...windData, ...essData];

  const stateLabels = combinedData.map(data => data.state);
  const totalInstallCapacities = combinedData.map(data => data.total_install_capacity);
  const availableCapacities = combinedData.map(data => data.available_capacity);

  const doughnutData = {
    labels: stateLabels,
    datasets: [
      {
        data: availableCapacities,
        backgroundColor: [
          "#3F8600",
          "#4CAF50",
          "#66BB6A",
          "#81C784",
          "#A5D6A7",
        ],
        hoverBackgroundColor: [
          "#2E7D32",
          "#388E3C",
          "#43A047",
          "#4CAF50",
          "#66BB6A",
        ],
      },
    ],
  };

const stateColumn = [
  {
    title: 'State', // Added column title
    key: 'State',
    dataIndex: 'state', // Corrected dataIndex
  },
  {
    title: 'Total Install Capacity (MW)', // Added column title
    key: 'Total Install Capacity',
    dataIndex: 'totalInstallCapacity', // Corrected dataIndex
  },
  {
    title: 'Available Capacity (MW)', // Added column title
    key: 'Available Capacity',
    dataIndex: 'availableCapacity', // Corrected dataIndex
  }
];

  // Define stateData variable
  const stateData = stateLabels.map((state, index) => ({
    key: index,
    state,
    totalInstallCapacity: totalInstallCapacities[index],
    availableCapacity: availableCapacities[index],
  }));

  const chartDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // ❌ Hide legend below chart
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            let index = tooltipItem.dataIndex;
            let state = stateLabels[index];
            let totalInstallCapacity = totalInstallCapacities[index];
            let availableCapacity = availableCapacities[index];
            return `${state}: Available Capacity: ${availableCapacity} MW, Total Install Capacity: ${totalInstallCapacity} MW`;
          },
        },
        padding: 10,
        bodyFont: {
          size: 14,
        },
        boxWidth: 200,
        boxHeight: 50,
        displayColors: false,
        multiKeyBackground: 'rgba(0,0,0,0)',
        titleFont: {
          size: 16,
        },
        bodySpacing: 10,
        footerSpacing: 10,
        footerFont: {
          size: 14,
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
  };

  const handleUpcomingMarket = () => {
    navigate("/px/generator/month-ahead");
  };

  const handleMarketStatistics = () => {
    navigate("/px/generator/statistical-information");
  };

  return (
    <div style={{ padding: "3%" }}>
      <Typography.Title level={3}>
        Your Energy Consumption Pattern
      </Typography.Title>
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
            {generationValues.length ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <p>Loading data...</p>
            )}
          </div>
        </Col>
      </Card>
      <Card style={{ margin: "20px" }}>
        <Row gutter={[16, 16]} justify="space-between">
          {/* First Column */}
          <Col span={12} style={{ marginBottom: "20px",textAlign:'center' }}>
            <Typography.Title level={4}>PowerX Details</Typography.Title>
            <Col style={{ marginBottom: "20px",marginTop:'20px' }}>
              <img 
                src={market} 
                alt=""  
                style={{ height: '20px', width: '20px', marginRight: '10px' }} 
              />
              <span 
                onClick={handleUpcomingMarket} 
                style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)', fontSize:'15px' }} // Default color
                onMouseEnter={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
                onMouseLeave={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
              >
                Upcoming Market
              </span>
            </Col>

            <Col style={{marginTop:'30px'}}>
              <img 
                src={statistics}  
                alt="" 
                style={{ height: '20px', width: '20px', marginRight: '10px'}} 
              />
              <span 
                onClick={handleMarketStatistics} 
                style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)', fontSize:'15px' }} // Default color
                onMouseEnter={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
                onMouseLeave={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
              >
                Market Statistics
              </span>
            </Col>
          </Col>

          {/* Second Column */}
          {/* <Col span={8}>
            <Typography.Title level={4}>State wise Requirements</Typography.Title>
            <Col span={12} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  width: "100%",
                  height: "100px",
                  margin: "0 auto",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex"
                }}
              >
                <Doughnut
                  data={doughnutData}
                  options={chartDoughnutOptions}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    margin: "0 auto",
                  }}
                />
              </div>
              <Table columns={stateColumn} dataSource={stateData} /> Added Table component
            </Col>
          </Col> */}

          {/* Third Column */}
          <Col span={12} style={{textAlign:'center'}}>
            <Typography.Title level={4}>
              Executed Trade Details
            </Typography.Title>
            <ul style={{marginTop:'20px'}}>
            Best Price: 4
              {/* <li>Best Price: 4</li> */}
            </ul>
          </Col>
        </Row>
        </Card>
      <Card style={{ margin: "20px" }}>
      <Typography.Title level={3} style={{textAlign:'center'}}>State wise Requirements</Typography.Title>

        <Row>
        <Col span={12}>
  {/* <Typography.Title level={4}>State wise Requirements</Typography.Title> */}
  <div
    style={{
      width: "100%",
      height: "150px",
      display: "flex",
      justifyContent: "center", // Centers horizontally
      alignItems: "center", // Centers vertically
      margin: "20px auto" // Keeps spacing consistent
    }}
  >
    <Doughnut
      data={doughnutData}
      options={chartDoughnutOptions}
      style={{
        maxWidth: "100%",
        maxHeight: "100%"
      }}
    />
  </div>
</Col>

          <Col span={12}>
          
        <Table columns={stateColumn} dataSource={stateData} pagination={false} bo /> {/* Added Table component */}
          </Col>
        </Row>

      </Card>
    </div>
  );
};

export default Dashboard;