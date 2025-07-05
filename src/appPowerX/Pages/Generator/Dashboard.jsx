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
import { dayAheadData } from "../../Redux/slices/generator/dayAheadSliceG";

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
  const [tableData, setTableData] = useState([]);
  const [statistiicsData, setStatisticsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const user_id = Number(JSON.parse(localStorage.getItem('user')).user.id);
  const user=JSON.parse(localStorage.getItem('user')).user;
  const [showLineGraph, setShowLineGraph] = useState(true); // New state to control line graph visibility
  const is_due_date=user.is_due_date;
  const [showDueModal,setShowDueModal]=useState(false);
  const [nextDay, setNextDay] = useState('');
  const [forecastDate, setForecastDate] = useState('');
  const [tableLoading,setTableLoading] = useState(false);
  var formattedDate = '';
// console.log(user_id);
// const nextDay = new Date();
// nextDay.setDate(nextDay.getDate() + 1);
// const nextDayDate = nextDay.toLocaleDateString();
  useEffect(() => {
    const id = user_id;
    const fetchData = async () => {
      setTableLoading(true);
      const res = await dispatch(fetchDashboardDataG(id));
      setTableLoading(false);
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
      if(res.payload === 'No demand data available for the next day') {
     // console.log('no data');
        setShowLineGraph(false); // Hide line graph card
                } else {
        setShowLineGraph(true); // Show line graph card
                  const dateStr = res.payload[0]?.date;
                  const date = new Date(dateStr);
                  
                  const options = { month: "long", day: "2-digit" };
                  const formattedDate = date.toLocaleDateString("en-US", options);
            
                  setNextDay(formattedDate); // Example output: "February 01"
                }
                setLoading(false);

      if(res.error) {
        // message.error(error)
        // console.log(error);
        
        // message.error(error);
      } else  {    
        setDashboardLine(Array.isArray(res.payload) ? res.payload : []);
      }
      setLoading(false);
    };
    fetchLineData();
  }, [dispatch]);


  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await dispatch(dayAheadData()).unwrap();
          // console.log(data);
          if (data?.predictions?.length > 0) {
            const dateStr = data.predictions[0]?.date;
            const date = new Date(dateStr);
            
            const options = { month: "long", day: "2-digit" };
            const formattedDate = date.toLocaleDateString("en-US", options);
      
            setForecastDate(formattedDate); // Example output: "February 01"
          }
          // const mcpData = data.predictions.map(item => item.mcp_prediction);
          const mcpData = data.predictions.map(item =>
  item.mcp_prediction === 0 ? null : Number(item.mcp_prediction)
);
          const mcvData = data.predictions.map(item => item.mcv_prediction);
  
          setTableData([{ MCP: mcpData, MCV: mcvData }]);
          setStatisticsData(data.statistics);
          setLoading(false);
        } catch (error) {
          message.error(error)
          // console.log(error);
        }
      };
      fetchData();
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
          text: 'Time (15-minute intervalssss)',
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
        title: {
          display: true,
          // text: `Energy Demand`, 
          font: {
            size: 18,
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
      title: {
        display: true,
        text: ` Energy Generation Pattern (${formattedDate})`,

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
    width:50,
    fontSize: 20,
  },
  {
    title: 'Technology', // New column for technology type
    key: 'Technology',
    dataIndex: 'technology', // Data index for technology
    fontSize: '14px',
  },
  {
    title: 'Total Install Capacity (MW)', // Added column title
    key: 'Total Install Capacity',
    dataIndex: 'totalInstallCapacity', // Corrected dataIndex
    fontSize: '14px',
  },
  {
    title: 'Available Capacity (MW)', // Added column title
    key: 'Available Capacity',
    dataIndex: 'availableCapacity', // Corrected dataIndex
    fontSize: '14px',
  }
];

const cardStyle = {
  margin: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  height: "380px", // Ensure all cards are the same height
};
const cardForecastGraph = {
  margin: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  height: "500px", // Ensure all cards are the same height
};
const cardThirdStyle = {
  margin: "20px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  height: "450px", // Ensure all cards are the same height
};
  // Define stateData variable
const stateData = [
  ...solarData.map((data, index) => ({
    key: `solar-${index}`,
    state: data.state,
    technology: 'Solar', // Set technology to Solar
    totalInstallCapacity: data.total_install_capacity,
    availableCapacity: data.available_capacity,
  })),
  ...windData.map((data, index) => ({
    key: `wind-${index}`,
    state: data.state,
    technology: 'Wind', // Set technology to Wind
    totalInstallCapacity: data.total_install_capacity,
    availableCapacity: data.available_capacity,
  })),
  ...essData.map((data, index) => ({
    key: `ess-${index}`,
    state: data.state,
    technology: 'ESS', // Set technology to ESS
    totalInstallCapacity: data.total_install_capacity,
    availableCapacity: data.available_capacity,
  })),
];
  
const timeLabels = Array.from({ length: 96 }, (_, i) => {
  const minutes = i * 15;
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
});


const data = {
  labels: timeLabels,
  datasets: [
    {
      label: 'MCP (INR/MWh)',
      data: tableData[0]?.MCP || [],
      borderColor: 'blue',
      fill: false,
      font: { weight: 'bold' },
      yAxisID: 'y-axis-mcp',
    },
    {
      label: 'MCV (MWh)',
      data: tableData[0]?.MCV || [],
      borderColor: 'green',
      fill: false,
      font: { weight: 'bold' },
      yAxisID: 'y-axis-mcv',
    },
  ],
};


const options = {
  responsive: true,
  scales: {
    x: {
      type: 'category',
      position: 'bottom',
      title: {
        display: true,
        text: 'Time (15-minute intervals)',
        font: {
          weight: 'bold',
          size: 16,
        },
      },
      ticks: {
        callback: function (val, index) {
          // Show tick every 2 hours (8 * 15 = 120 mins)
          return index % 8 === 0 ? this.getLabelForValue(val) : '';
        },
        autoSkip: false,
        maxTicksLimit: 12, // Only show every 2 hours
      },
    },
    'y-axis-mcv': {
      type: 'linear',
      position: 'left',
      beginAtZero: true,
      title: {
        display: true,
        text: 'MCV (MWh)',
        font: {
          weight: 'bold',
        },
      },
      ticks: {
        color: 'green',
      },
    },
    'y-axis-mcp': {
      type: 'linear',
      position: 'right',
      beginAtZero: true,
      title: {
        display: true,
        text: 'MCP (INR/MWh)',
        font: {
          weight: 'bold',
        },
      },
      ticks: {
        color: 'blue',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      align: 'end',
      labels: {
        padding: 20,
      },
    },
    title: {
      display: true,
      text: `Day Ahead Market Forecast (${forecastDate})`,
      font: {
        size: 18,
      },
    },
  },
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

  const tradeSummaryColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>, // Bold font for date
    },
    {
      title: 'Portfolio Details',
      children: [
        {
          title: 'Technology',
          dataIndex: 'techno',
          key: 'techno',
        },
        {
          title: 'State',
          dataIndex: 'state', 
          key: 'state',
        },
        {
          title: 'Connectivity',
          dataIndex: 'connectivity',
          key: 'connectivity',
        },
        {
          title: 'Available Capacity (MWh)',
          dataIndex: 'available_capacity',
          key: 'available_capacity',
        },
      ],
    },
    {
      title: 'Parameter',
      children: [
        {
          title: 'Ask Price (INR/MWh)',
          dataIndex: 'ask_price',
          key: 'ask_price',
        },
        {
          title: 'Executed Price (INR/MWh)',
          dataIndex: 'executed_price',
          key: 'executed_price',
        },
        {
          title: 'Ask Volume (MWh)',
          dataIndex: 'ask_volume',
          key: 'ask_volume',
        },
        {
          title: 'Executed Volume (MWh)',
          dataIndex: 'executed_volume',
          key: 'executed_volume',
        }, 
      ],
    },
    // {
    //   title: 'Value',
    //   dataIndex: 'value',
    //   key: 'value',
    // },
  ];
  
  const tradeSummaryData = [
    {
      key: '1',
      parameter: 'Ask Price (INR/MWh)',
      value: 4,
    },
    {
      key: '2',
      parameter: 'Ask Volume (MWh)',
      value: 200,
    },
    {
      key: '3',
      parameter: 'Executed Price (INR/MWh)',
      value: 4,
    },
    {
      key: '4',
      parameter: 'Executed Volume (MWh)',
      value: 4,
    },
  ];

  return (
    <div style={{ padding: "3%" }}>
      {/* <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
      Energy Generation Pattern
      </h1> */}
      <Card style={{ margin: "20px" }}>
        <Typography.Title level={3} style={{textAlign:'center'}}>State wise Generation Portfolio</Typography.Title>
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
                  <Spin spinning={tableLoading} tip={'Loading'}>
          <Table
            columns={stateColumn}
            dataSource={stateData}
            pagination={false} // Disable pagination
            bordered
            scroll={{ x: true, y: 300 }} // Enables horizontal and vertical scrolling
            style={{ maxHeight: "300px", overflowY: "auto" }} // Ensures the column does not exceed this height
          />
          </Spin>
        </Col>
        
                </Row>
      </Card>

  {showLineGraph && dashboardLine.length > 0 && ( // Ensure data is present before rendering
        <Card style={cardStyle}>
          <Col span={24} style={{ marginBottom: "20px" }}>
            <div
              style={{
                position: "relative",
                width: "80%",
                height: "350px",
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
      )}


      {/* <Card style={cardStyle}>
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
      </Card> */}
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
              <Card style={cardForecastGraph} >
                   {loading ? (
                     <div style={{ textAlign: 'center', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                       <Spin />
                       <p>Loading Day Ahead Merket Forecast Data...</p>
                       </div>
                   ) : (
                     <div style={{ height: '500px', width: '100%' }}>
                       <Line data={data} options={options} style={{height: '300px', width: 'full', padding: '25px', marginLeft: '50px'}}/>
                     </div>
                   )}
                 </Card>
      
      <Card style={cardThirdStyle}>
        <Row gutter={[16, 16]} justify="space-between">
          {/* <Col span={12} style={{ marginBottom: "20px", textAlign: 'center' }}>
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
                 Plan Your Energy for the Month
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
                 Execute trade for next day
              </span>
            </Col>
          </Col> */}
          <Col span={24} style={{ textAlign: 'center' }}>
            <Typography.Title level={4}>
              Executed Trade Summary
            </Typography.Title>
            <Table
              columns={tradeSummaryColumns}
              dataSource={tradeSummaryData}
              pagination={false}
              bordered
              // style={{ marginTop: '20px' }}
              scroll={{ x: true, y: 300 }} // Enables horizontal and vertical scrolling
            style={{ maxHeight: "350px", overflowY: "auto",marginTop:'20px' }} // Ensures the column does not exceed this height
        
            />
          </Col>
        </Row>
        {/* <Card style={cardThirdStyle}>
        <Row gutter={[16, 16]} justify="space-between">
        <Col span={24} style={{ textAlign: 'center' }}>
            <Typography.Title level={4}>
              Executed Trade Summary
            </Typography.Title>
            <Table
              columns={tradeSummaryColumns}
              dataSource={tradeSummaryData}
              pagination={false}
              bordered
              style={{ marginTop: '20px' }}
            />
          </Col>
          </Row>
          </Card> */}
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