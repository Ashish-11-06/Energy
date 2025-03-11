/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Col, Typography, Row, Table} from "antd";
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
import {
  fetchDashboardData,
  fetchDashboardLine,
} from "../../Redux/slices/consumer/dashboardSlice";
import market from "../../assets/market.png";
import statistics from "../../assets/statistics.png";

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

const DashboardP = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardLine, setDashboardLine] = useState([]);
  const user_id = Number(JSON.parse(localStorage.getItem('user')).user.id);
// console.log(user_id);

  useEffect(() => {
    const id=user_id;
    const fetchData = async () => {
      const res = await dispatch(fetchDashboardData(id));
      setDashboardData(res.payload || []);
    };
    fetchData();
  }, [dispatch]);

console.log(dashboardData);


  useEffect(() => {
    const id=user_id;
    const fetchLineData = async () => {
      const res = await dispatch(fetchDashboardLine(id));
      console.log(res.payload);
      setDashboardLine(Array.isArray(res.payload) ? res.payload : []);
    };
    fetchLineData();
  }, [dispatch]);

  // Extract demand values from dashboardLine
  const demandValues = dashboardLine.map(item => item.demand);

  // Line Chart Data
  const lineData = {
    labels: demandValues.length
      ? Array.from({ length: demandValues.length }, (_, i) => i + 1)
      : [],
    datasets: [
      {
        label: "Energy (MWh)",
        data: demandValues,
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
          font: {
            weight: "bold",
          },
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
          font: {
            weight: 'bold',
          }
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

  // Extract state names and their demands from dashboardData
  const stateLabels = dashboardData.map(data => data.state);
  const stateDemands = dashboardData.map(data => data.contracted_demand);

  const stateColumn = [
    {
      title: 'State', // Added column title
      key: 'State',
      dataIndex: 'state', // Corrected dataIndex
    },
    {
      title: 'Demand (MW)', // Added column title
      key: 'Demand',
      dataIndex: 'contracted_demand', // Corrected dataIndex
    }
  ];
  
    // Define stateData variable
    const stateData = stateLabels.map((state, index) => ({
      key: index,
      state,
      contracted_demand: stateDemands[index], // Corrected property name
    }));

  const doughnutData = {
    labels: stateLabels,
    datasets: [
      {
        data: stateDemands,
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
            return `${label}: ${value} kW`; // 🎯 Show label on hover only
          },
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
    navigate("/px/consumer/month-ahead");
  };

  const handleMarketStatistics = () => {
    navigate("/px/consumer/statistical-information");
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
            {demandValues.length ? (
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
          <Col span={12} style={{textAlign:'center'}}>  
            <Typography.Title level={4}>PowerX Details</Typography.Title>
            <Col style={{marginTop:'30px'}}>
              <img 
                src={market} 
                alt=""  
                style={{ height: '20px', width: '20px', marginRight: '10px' }} 
              />
              <span 
                onClick={handleUpcomingMarket} 
                style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)' ,fontSize:'15px'}} // Default color
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
                style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)',fontSize:'15px' }} // Default color
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
            </Col>
          </Col> */}

          {/* Third Column */}
          <Col span={12} style={{textAlign:'center'}}>
            <Typography.Title level={4}>
              Executed Trade Details
            </Typography.Title>
            <ul>
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
            <Col  style={{ marginBottom: "20px" ,marginTop:'30px'}}>
              <div
                style={{
                  width: "100%",
                  height: "150px",
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
            </Col>
          </Col>
          <Col span={12}>
        <Table 
          columns={stateColumn} 
          dataSource={stateData} 
          pagination={false}
          bordered
          
          // style={{width:'70%',textAlign:'center',marginLeft:'15%'}} 
        />
        </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardP;