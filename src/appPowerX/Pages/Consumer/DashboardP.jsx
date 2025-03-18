/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Col, Typography, Row, Table, Spin, message} from "antd";
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
  const [loading,setLoading]=useState(false);
  const [nextDay, setNextDay] = useState('');
  const user_id = Number(JSON.parse(localStorage.getItem('user')).user.id);
// console.log(user_id);



  const cardStyle = {
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "400px", // Ensure all cards are the same height
  };
  const cardThirdStyle = {
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "250px", // Ensure all cards are the same height
  };


  useEffect(() => {
    const id=user_id;
    const fetchData = async () => {
      const res = await dispatch(fetchDashboardData(id));
      console.log(res.payload);
      
      setDashboardData(res.payload || []);
    };
    fetchData();
  }, [dispatch]);

console.log(dashboardData);


  useEffect(() => {
    const id=user_id;
    try {
      const fetchLineData = async () => {
        setLoading(true);
        const res = await dispatch(fetchDashboardLine(id)); 
        console.log(res);
        
        if (res.payload.length > 0) {
          const dateStr = res.payload[0]?.date;
          const date = new Date(dateStr);
          
          const options = { month: "long", day: "2-digit" };
          const formattedDate = date.toLocaleDateString("en-US", options);
    
          setNextDay(formattedDate); // Example output: "February 01"
        }
        console.log(res.payload);
        if(res.error){
        message.error(res.payload);
        } else {
        setDashboardLine(Array.isArray(res.payload) ? res.payload : []);
        }
        // setDashboardLine(Array.isArray(res.payload) ? res.payload : []);
        setLoading(false);
      };
      fetchLineData();
    } catch (error) {
      message.error(error.message); 
      console.log(error);
    }
 
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
          text: "Energy (MWh)",
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
          text: 'Time (15-minute intervals)',
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
      // zoom: {
      //   pan: {
      //     enabled: true,
      //     mode: 'x',
      //   },
      //   zoom: {
      //     wheel: {
      //       enabled: true,
      //     },
      //     pinch: {
      //       enabled: true,
      //     },
      //     mode: 'x',
      //   },
      // },
      title: {
        display: true,
        text: `Energy Demand (${nextDay})`, 
        font: {
          size: 18,
        },
      },
    },
  };

  // Extract state names and their demands from dashboardData
  const stateLabels = dashboardData?.map(data => data.state);
  const stateDemands = dashboardData?.map(data => data.contracted_demand);

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
            return `${label}: ${value} MW`; // 🎯 Show label on hover only
          },
        },
      },
      // zoom: {
      //   pan: {
      //     enabled: true,
      //     mode: 'x',
      //   },
      //   zoom: {
      //     wheel: {
      //       enabled: true,
      //     },
      //     pinch: {
      //       enabled: true,
      //     },
      //     mode: 'x',
      //   },
      // },
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
      Energy Demand Pattern
      </h1>
      <Card style={cardStyle}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>State wise Requirements</Typography.Title>
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
    pagination={false} // Disable pagination
    bordered

    scroll={{ x: true, y: 300 }} // Enables horizontal and vertical scrolling
    style={{ maxHeight: "300px", overflowY: "auto",textAlign:'center',justifyContent:'center',alignContent:'center' }} // Ensures the column does not exceed this height
  />
</Col>

        </Row>
      </Card>
      <Card style={cardStyle}>
        <Col span={24} style={{ marginBottom: "20px" }}>
          <div
            style={{
              position: "relative",
              width: "80%",
              height: "300px",
              margin: "0 auto",
            }}
          >
            {loading ? (
              <Spin />
            ) : (
              <Line data={lineData} options={lineOptions} />
            )}
          </div>
        </Col>
      </Card>
      <Card style={cardThirdStyle}>
        <Row gutter={[16, 16]} justify="space-between">
          <Col span={12} style={{ textAlign: 'center' }}>
            <Typography.Title level={4}>PowerX Overview</Typography.Title>
            <Col style={{ marginTop: '30px' }}>
              <img 
                src={market} 
                alt=""  
                style={{ height: '20px', width: '20px', marginRight: '10px' }} 
              />
              <span 
                onClick={handleUpcomingMarket} 
                style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)', fontSize: '15px', fontWeight: 'bold' }} // Default color
                onMouseEnter={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
                onMouseLeave={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
              >
                Upcoming Market
              </span>
            </Col>
            <Col style={{ marginTop: '30px' }}>
              <img 
                src={statistics}  
                alt="" 
                style={{ height: '20px', width: '20px', marginRight: '10px' }} 
              />
              <span 
                onClick={handleMarketStatistics} 
                style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)', fontSize: '15px', fontWeight: 'bold' }} // Default color
                onMouseEnter={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
                onMouseLeave={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
              >
                Market Statistics
              </span>
            </Col>
          </Col>
          <Col span={12} style={{ textAlign: 'center' }}>
            <Typography.Title level={4}>Executed Trade Summary</Typography.Title>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ marginBottom: '10px' }}>
                <strong>Ask Price</strong> <span style={{ fontSize: '12px' }}>(INR/MWh)</span>: 4
              </li>
              <li>
                <strong>Executed Price</strong> <span style={{ fontSize: '12px' }}>(INR/MWh)</span>: 4
              </li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardP;