/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Col, Typography, Row, Table, Spin, message, Modal} from "antd";
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
import { dayAheadData } from "../../Redux/slices/consumer/dayAheadSlice";
import { decryptData } from "../../../Utils/cryptoHelper";

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
  const [tableData, setTableData] = useState([]);
  const [statistiicsData, setStatisticsData] = useState([]);
  const [detailDataSource, setDetailDataSource] = useState([]);
  const [loading,setLoading]=useState(false);
  const [nextDay, setNextDay] = useState('');
  const [showDueModal,setShowDueModal]=useState(false);
  const [showLineGraph, setShowLineGraph] = useState(true); // New state to control line graph visibility
   const userData = decryptData(localStorage.getItem('user'));
  const user= userData?.user;
  const user_id =user?.id || null; // Ensure user_id is defined
  // const user=JSON.parse(localStorage.getItem('user')).user;
  const is_due_date=user.is_due_date;
  const [tableLoading,setTableLoading] = useState(false);
  const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const option = { day: 'numeric', month: 'long' };
const tomorrowDate = tomorrow.toLocaleDateString('en-GB', option);

// console.log(formattedDate);

  // const tomorrowDate = tomorrow.toISOString().split('T')[0];
  // console.log(tomorrowDate);
  
  useEffect(() => {
    if (is_due_date) {
      setShowDueModal(true);
    }
  }, [is_due_date]);

  const cardStyle = {
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "400px", // Ensure all cards are the same height
  };
  const cardThirdStyle = {
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "450px", // Ensure all cards are the same height
  };
  const cardForecastGraph ={ 
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "500px"
  }


  useEffect(() => {
    const id=user_id;
    const fetchData = async () => {
      setTableLoading(true);
      const res = await dispatch(fetchDashboardData(id));
      setDashboardData(Array.isArray(res.payload) ? res.payload : []); // Ensure it's an array
      setTableLoading(false);
    };
    fetchData();
  }, [dispatch]);

// console.log(dashboardData);


  useEffect(() => {
    const id=user_id;
    try {
      const fetchLineData = async () => {
        setLoading(true);
        const res = await dispatch(fetchDashboardLine(id)); 
        if(res.payload === 'No demand data available for the next day') {
// console.log('no data');
setShowLineGraph(false); // Hide line graph card
        } else {
setShowLineGraph(true); // Show line graph card
          const dateStr = res.payload[0]?.date;
          const date = new Date(dateStr);
          
          const options = { month: "long", day: "2-digit" };
          const formattedDat = date.toLocaleDateString("en-US", options);
    
          setNextDay(formattedDat); // Example output: "February 01"
        }
        // console.log(res.payload);
        if(res.error){
        // message.error(res.payload);
        } else {
        setDashboardLine(Array.isArray(res.payload) ? res.payload : []);
        }
        // setDashboardLine(Array.isArray(res.payload) ? res.payload : []);
        setLoading(false);
      };
      fetchLineData();
    } catch (error) {
      // message.error(error.message); 
      // console.log(error);
    }
 
  }, [dispatch]);

  const tradeSummaryColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      // render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>, // Bold font for date
    },
    {
      title: 'Requirement Details',
      children: [
        {
          title: 'State',
          dataIndex: 'state',
          key: 'state',
        },
        {
          title: 'Industry',
          dataIndex: 'industry',
          key: 'industry',
        },
        {
          title: 'Contracted Demand (MWh)',
          dataIndex: 'contracted_demand',
          key: 'contracted_demand',
        },
        // {
        //   title: 'Available Capacity (MWh)',
        //   dataIndex: 'available_capacity',
        //   key: 'available_capacity',
        // },
      ],
    },
    {
      title: 'Parameter',
      children: [
        {
          title: 'Ask Price (INR / MWh)',
          dataIndex: 'ask_price',
          key: 'ask_price',
        },
        {
          title: 'Executed Price (INR / MWh)',
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
  
  // const tradeSummaryData = [
  //   {
  //     key: '1',
  //     parameter: 'Ask Price (INR/MWh)',
  //     value: 4,
  //   },
  //   {
  //     key: '2',
  //     parameter: 'Ask Volume (MWh)',
  //     value: 200,
  //   },
  //   {
  //     key: '3',
  //     parameter: 'Executed Price (INR/MWh)',
  //     value: 4,
  //   },
  //   {
  //     key: '4',
  //     parameter: 'Executed Volume (MWh)',
  //     value: 4,
  //   },
  // ];

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await dispatch(dayAheadData()).unwrap();
          // console.log('data response',data);
          
          // console.log('data', data.predictions.map(item=>item.date));
          if (data?.predictions?.length > 0) {
            const dateStr = data.predictions[0]?.date;
            const date = new Date(dateStr);
            
            const options = { month: "long", day: "2-digit" };
            const formattedDat = date.toLocaleDateString("en-US", options);
      
            setNextDay(formattedDat); // Example output: "February 01"
          }
  
          const mcpDataOriginal = data.predictions.map(item => item.mcp_prediction);
          const mcpData=mcpDataOriginal.reverse();
          const mcvData = data.predictions.map(item => item.mcv_prediction);
  
          setTableData([{ MCP: mcpData, MCV: mcvData }]); // Ensure data is an array
  
          setStatisticsData(data.statistics);
          setLoading(false);
          // console.log(data.statistics);
          
        } catch (error) {
          // console.log(error);
          setLoading(false);
        }
      };
      fetchData();
    }, [dispatch]);

      useEffect(() => {
        if (statistiicsData.mcp && statistiicsData.mcv) {
          setDetailDataSource([
            {
              key: 'max',
              status: 'Maximum',
              mcp: statistiicsData.mcp.max.toFixed(2),
              mcv: statistiicsData.mcv.max.toFixed(2),
            },
            {
              key: 'min',
              status: 'Minimum',
              mcp: statistiicsData.mcp.min.toFixed(2),
              mcv: statistiicsData.mcv.min.toFixed(2),
            },
            {
              key: 'avg',
              status: 'Average',
              mcp: statistiicsData.mcp.avg.toFixed(2),
              mcv: statistiicsData.mcv.avg.toFixed(2),
            },
          ]);
        }
      }, [statistiicsData]);

      const timeLabels = Array.from({ length: 96 }, (_, i) => {
  const minutes = i * 15;
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
});
      // console.log('time labes',timeLabels);
      
        const data = {
           labels: timeLabels,
          datasets: [
            {
              label: 'MCP (INR / MWh)', // Label for MCP dataset
              data: tableData[0]?.MCP || [], // Updated data for MCP
              borderColor: 'blue',
              fill: false,
              color: 'blue',
              font :{
                weight: 'bold',
              },
              yAxisID: 'y-axis-mcp', // Assign to right Y-axis
            },
            {
              label: 'MCV (MWh)', // Label for MCY dataset
              data: tableData[0]?.MCV || [], // Updated data for MCY
              borderColor: 'green',
              fill: false,
              color: 'green',
              font :{
                weight: 'bold',
              },
              yAxisID: 'y-axis-mcv', // Assign to left Y-axis
            },
          ],
        };

  // Extract demand values from dashboardLine
  const demandValues = dashboardLine.map(item => item.demand);

const options = {
  responsive: true,
  scales: {
    x: {
      type: 'category',
      title: {
        display: true,
        text: 'Time (15-minute intervals)',
      },
      ticks: {
        maxRotation: 90,
        minRotation: 45,
        autoSkip: false,
        font: {
          size: 10,
        },
        callback: function (val, index) {
          const label = this.getLabelForValue(val); // Get actual time string
          const [hour, minute] = label.split(':').map(Number);
          return minute === 0 && hour % 2 === 0 ? label : ''; // Show every 2 hours
        },
      },
    },
    'y-axis-mcp': {
      position: 'right',
      title: {
        display: true,
        text: 'MCP (INR / MWh)',
      },
    },
    'y-axis-mcv': {
      position: 'left',
      title: {
        display: true,
        text: 'MCV (MWh)',
      },
    },
  },
  plugins: {
    title: {
      display: true,
      text: 'Day Ahead Market Forecast',
      font: {
        size: 18,
        weight: 'bold',
      },
      padding: {
        top: 10,
        bottom: 30,
      },
    },
  },
};


  const handleModalOk =()=> {
      navigate('/px/consumer/planning')
  }

  // Line Chart Data
  const lineData = {
     labels: timeLabels,
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
      type: 'category', // Change from 'linear' to 'category'
      title: {
        display: true,
        text: 'Time (15-minute intervals)',
        font: {
          weight: 'bold',
        }
      },
      ticks: {
        maxRotation: 90,
        minRotation: 45,
        autoSkip: false,
        font: {
          size: 10,
        },
        callback: function (val, index) {
          const label = this.getLabelForValue(val);
          const [hour, minute] = label.split(':').map(Number);
          return minute === 0 && hour % 2 === 0 ? label : '';
        },
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
      text: `Energy Demand pattern (${tomorrowDate})`,
      font: {
        size: 18,
      },
    },
  },
};


  // Extract state names and their demands from dashboardData
  const stateLabels = Array.isArray(dashboardData) ? dashboardData.map(data => data.state) : [];
  const stateDemands = Array.isArray(dashboardData) ? dashboardData.map(data => data.contracted_demand) : [];

  // console.log('state label',stateLabels);
  // console.log('state demand',stateDemands);
  
  

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

// console.log('state data',stateData);


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
        title: {
        display: true,
        text: `Day Ahead Market Forecast `, // Use the nextDay variable here
        font: {
          size: 18,
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

  const tradeSummaryData = [
    {
      key: '1',
      parameter: 'Ask Price (INR / MWh)',
      value: 4,
    },
    {
      key: '2',
      parameter: 'Ask Volume (MWh)',
      value: 200,
    },
    {
      key: '3',
      parameter: 'Executed Price (INR / MWh)',
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
      Energy Demand Pattern
      </h1> */}
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
          <Spin spinning={tableLoading} tip="Loading...">
  <Table
    columns={stateColumn}
    dataSource={stateData}
    pagination={false} // Disable pagination
    bordered


    scroll={{ x: true, y: 240 }} // Enables horizontal and vertical scrolling
    style={{ maxHeight: "400px", overflowY: "auto",textAlign:'center',justifyContent:'center',alignContent:'center' }} // Ensures the column does not exceed this height
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
      )}

 <Card style={cardForecastGraph}> {/* Updated shadow and card background color */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Spin />
            <p>Loading Day Ahead Merket Forecast Data...</p>
          </div>
        ) : (
          <div style={{ height: '500px', width: '100%' }}>
            <Line data={data} options={options} style={{height: '300px', width: 'full', padding: '25px', marginLeft: '100px'}}/>
          </div>
        )}
      </Card>

      <Card style={cardThirdStyle}>
        <Row gutter={[16, 16]} justify="space-between">
          {/* <Col span={12} style={{ textAlign: 'center' }}>
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
                Plan Your Energy for the Month
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
                        scroll={{ x: true, y: 300 }} // Enables horizontal and vertical scrolling
            style={{ maxHeight: "350px", overflowY: "auto",marginTop:'20px' }} // Ensures the column does not exceed this height
        

                      />
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

export default DashboardP;