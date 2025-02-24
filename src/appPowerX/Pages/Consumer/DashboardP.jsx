import React, { useEffect, useState } from "react";
import { Card, Col, Typography, Row, } from "antd";
import { Bar,Pie,Doughnut  } from "react-chartjs-2";
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
import market from'../../assets/market.png';
import statistics from'../../assets/statistics.png';
import { fetchDashboardData } from "../../Redux/slices/consumer/dashboardSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const DashboardP = () => {
const dispatch=useDispatch();
const [dashboardData,setDashboardData] = useState([]);
const navigate=useNavigate();
useEffect(() => {
  const fetchData = async () => {
    const res = await dispatch(fetchDashboardData());
    console.log(res.payload);
    setDashboardData(res.payload);
  };
  fetchData();
}, []);

  // const consumptionPatterns = [
  //   { id: 1, month: "Jan/24", value: 150 },
  //   { id: 2, month: "Feb/24", value: 250 },
  //   { id: 3, month: "Mar/24", value: 100 },
  //   { id: 4, month: "Apr/24", value: 300 },
  //   { id: 5, month: "May/24", value: 100 },
  //   { id: 6, month: "Jun/24", value: 300 },
  //   { id: 7, month: "July/24", value: 250 },
  //   { id: 8, month: "Aug/24", value: 180 },
  //   { id: 9, month: "Sep/24", value: 120 },
  //   { id: 10, month: "Oct/24", value: 100 },
  //   { id: 11, month: "Nov/24", value: 350 },
  //   { id: 12, month: "Dec/24", value: 300 },
  // ];

  const barData = {
    labels: dashboardData.map((pattern) => pattern.month), // X-axis labels
    datasets: [
      {
        type: "bar",
        label: "Consumption (MWh)",
        data: dashboardData.map((pattern) => pattern.value), // Use value, not consumption
        backgroundColor: "#669800",
        barThickness: 30, // Adjust bar thickness
      },
    ],
  };

  const doughnutData = {
    labels: ["Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Rajasthan"],
    datasets: [
      {
        data: [30, 20, 15, 25, 10], // Percentage distribution
        backgroundColor: ["rgb(63, 134, 0)", "rgb(63, 134, 0)", "rgb(63, 134, 0)", "rgb(63, 134, 0)", "rgb(63, 134, 0)"],
        hoverBackgroundColor: ["rgb(63, 134, 0)", "rgb(63, 134, 0)", "rgb(63, 134, 0)", "rgb(63, 134, 0)", "rgb(63, 134, 0)"],
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
  
const handleUpcomingMarket =()=> {
  navigate('/px/consumer/month-ahead')
}
const handleMarketStatistics =()=> {
  navigate('/px/consumer/statistical-information')
}

  const chartOptions = {
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
          text: "Month",
        },
      },
    },
  };

  return (
    <div style={{ marginTop: "10px", padding: "3%" }}>
      <Typography.Title level={3}>Your Consumption Pattern</Typography.Title>
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
          <Typography.Title level={4}>Power X Detail</Typography.Title>
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
