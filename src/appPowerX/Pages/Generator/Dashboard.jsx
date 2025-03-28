/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Col, Typography, Row, Table, Spin, message,Modal } from "antd"; // Added Table import
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
import { error } from "pdf-lib";

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
  const [loading, setLoading] = useState(false);
  const user_id = Number(JSON.parse(localStorage.getItem('user')).user.id);
  const user=JSON.parse(localStorage.getItem('user')).user;
  const is_due_date=user.is_due_date;
    const [showDueModal,setShowDueModal]=useState(false);
  var formattedDate = '';
// console.log(user_id);
const nextDay = new Date();
nextDay.setDate(nextDay.getDate() + 1);
const nextDayDate = nextDay.toLocaleDateString();
  useEffect(() => {
    const id = user_id;
    const fetchData = async () => {
      const res = await dispatch(fetchDashboardDataG(id));
      setDashboardData(res.payload || {});
    };
    fetchData();
  }, [dispatch]);

  // console.log(dashboardData);
  useEffect(() => {
    if (is_due_date) {
      setShowDueModal(true);
    }
  }, [is_due_date]);
  useEffect(() => {
    const id = user_id;
    const fetchLineData = async () => {
      setLoading(true);
      const res = await dispatch(fetchDashboardLineG(id)); 
      if(res.error) {
        console.log(error);
        
        // message.error(error);
      } else  {    
        setDashboardLine(Array.isArray(res.payload) ? res.payload : []);
      }
      setLoading(false);
    };
    fetchLineData();
  }, [dispatch]);

  // Extract generation values from dashboardLine
  const firstDate = dashboardLine[0]?.date;
    const generationValues = dashboardLine.map(item => item.generation);

    if (firstDate) {
      const dateObj = new Date(firstDate);
    formattedDate = dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric" });
      // console.log(formattedDate); // Output: March 21
  } else {
      // console.log("No date available");
  }
  
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

  const handleModalOk =()=> {
    navigate('/px/generator/planning')
}

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
          text: 'Time (15-minute intervals)',
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
        text: `Energy Demand for ${formattedDate}`,

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

const cardStyle = {
  margin: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  height: "400px", // Ensure all cards are the same height
};

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
    navigate("/px/generator/month-ahead");
  };

  const handleMarketStatistics = () => {
    navigate("/px/generator/statistical-information");
  };

  return (
    <div style={{ padding: "3%" }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
      Energy Demand Pattern
      </h1>
      <Card style={{ margin: "20px" }}>
        <Typography.Title level={3} style={{textAlign:'center'}}>State wise Requirements</Typography.Title>
        {/* <Row>
          <Col span={12}>
            <div
              style={{
                width: "100%",
                height: "150px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px auto"
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
            <Table columns={stateColumn} dataSource={stateData} pagination={false} />
          </Col>
        </Row> */}
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
            style={{ maxHeight: "300px", overflowY: "auto" }} // Ensures the column does not exceed this height
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
       {/* <Card style={{ height: "50%" }}>
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
      </Card>  */}
      
      <Card style={{ margin: "20px" }}>
        <Row gutter={[16, 16]} justify="space-between">
          <Col span={12} style={{ marginBottom: "20px", textAlign: 'center' }}>
            <Typography.Title level={4}>PowerX Details</Typography.Title>
            <Col style={{ marginBottom: "20px", marginTop: '20px' }}>
              <img 
                src={market} 
                alt=""  
                style={{ height: '20px', width: '20px', marginRight: '10px' }} 
              />
              <span 
                onClick={handleUpcomingMarket} 
                style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)', fontSize:'15px' }} 
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
                style={{ height: '20px', width: '20px', marginRight: '10px'}} 
              />
              <span 
                onClick={handleMarketStatistics} 
                style={{ cursor: 'pointer', color: 'rgb(154, 132, 6)', fontSize:'15px' }} 
                onMouseEnter={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
                onMouseLeave={(e) => e.target.style.color = 'rgb(154, 132, 6)'}
              >
                Market Statistics
              </span>
            </Col>
          </Col>
          <Col span={12} style={{ textAlign: 'center' }}>
            <Typography.Title level={4}>
              Executed Trade Details
            </Typography.Title>
            <ul style={{ marginTop: '20px' }}>
              Best Price: 4
            </ul>
          </Col>
        </Row>
      </Card>
      <Modal 
              open={showDueModal}  
              onCancel={() => setShowDueModal(false)}
              onOk={handleModalOk}
              title="Upload 96 times block data"
            >
              <p>Your due date is tomorrow at 10 AM. Please upload the data before the deadline..</p>
            </Modal>
    </div>
  );
};

export default Dashboard;