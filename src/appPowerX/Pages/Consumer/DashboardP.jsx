import React, { useEffect, useState } from "react";
import { Card, Col, Typography, Row } from "antd";
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
} from "chart.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchDashboardData, fetchDashboardLine } from "../../Redux/slices/consumer/dashboardSlice";
import market from "../../assets/market.png";
import statistics from "../../assets/statistics.png";

// Register required chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardLine, setDashboardLine] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await dispatch(fetchDashboardData());
      setDashboardData(res.payload || []);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchLineData = async () => {
      const res = await dispatch(fetchDashboardLine());
      setDashboardLine(res.payload?.data || []);
    };
    fetchLineData();
  }, [dispatch]);

  // Line Chart Data
  const lineData = {
    labels: dashboardLine.length ? Array.from({ length: dashboardLine.length }, (_, i) => i + 1) : [],
    datasets: [
      {
        label: "Energy (MWh)",
        data: dashboardLine,
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
        title: {
          display: true,
          
        },
      },
    },
  };

  const barData = {
    labels: dashboardData.map((pattern) => pattern.month),
    datasets: [
      {
        label: "Consumption (MWh)",
        data: dashboardData.map((pattern) => pattern.value),
        backgroundColor: "#669800",
        barThickness: 30,
      },
    ],
  };

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
            let dataset = tooltipItem.dataset;
            let index = tooltipItem.dataIndex;
            let label = dataset.labels ? dataset.labels[index] : "";
            let value = dataset.data[index] || 0;
            return `${label}: ${value}%`; // 🎯 Show label on hover only
          },
        },
      },
    },
  };

  const doughnutData = {
    labels: ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Rajasthan"],
    datasets: [
      {
        data: [30, 20, 15, 25, 10],
        backgroundColor: ["#3F8600", "#4CAF50", "#66BB6A", "#81C784", "#A5D6A7"],
        hoverBackgroundColor: ["#2E7D32", "#388E3C", "#43A047", "#4CAF50", "#66BB6A"],
      },
    ],
  };

  const handleUpcomingMarket = () => {
    navigate("/px/consumer/month-ahead");
  };

  const handleMarketStatistics = () => {
    navigate("/px/consumer/statistical-information");
  };

  return (
    <div style={{ padding: "3%" }}>
      <Typography.Title level={3}>Your Energy Consumption Pattern</Typography.Title>
      <Card style={{ height: "50%" }}>
        <Col span={24} style={{ marginBottom: "20px" }}>
          <div style={{ position: "relative", width: "80%", height: "300px", margin: "0 auto" }}>
            {dashboardLine.length ? <Line data={lineData} options={lineOptions} /> : <p>Loading data...</p>}
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
    style={{ height: '20px', width: '20px', marginRight: '10px' }} 
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

<Col style={{marginTop:'10px'}}>
  <img 
    src={statistics}  
    alt="" 
    style={{ height: '20px', width: '20px', marginRight: '10px'}} 
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
          <Typography.Title level={4}>Consumer States</Typography.Title>
          <Col span={12} style={{ marginBottom: "20px" }}>
          <div style={{ width: "100%", height: "100px", margin: "0 auto",justifyContent:'center',alignItems:'center',display:'flex',margin:'0 auto' }}>
            <Doughnut data={doughnutData} options={chartDoughnutOptions} style={{justifyContent:'center',alignItems:'center',display:'flex',margin:'0 auto'}}/>
            </div>
    
          </Col>
        </Col>

        {/* Third Column */}
        <Col span={8}>
          <Typography.Title level={4}>Number of Trades Executed</Typography.Title>
          <div style={{borderRadius:'50%',width:'150px',height:'100px',backgroundColor:'rgb(63, 134, 0)',justifyContent:'center',alignItems:'center',display:'flex',margin:'0 auto'}}>
            <p style={{color:'white'}}>20+</p>
          </div>
        </Col>
      </Row>
    </Card>
    </div>
  );
};

export default DashboardP;
