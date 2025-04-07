/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Table, Row, Col, Card,Spin, message } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchMonthAheadData } from '../../Redux/slices/consumer/monthAheadSlice';
import moment from 'moment';

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const MonthAhead = () => {
  const [tableData, setTableData] = useState([]);
  const [lineData, setLineData] = useState({ labels: [], datasets: [] });
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
const  [mcpHighestDate,setMcpHighestDate]=useState('');
const  [mcpLowestDate,setMcpLowestDate]=useState('');
const [mcvHighestDate,setMcvHighestDate]=useState('');
const [mcvLowestDate,setMcvLowestDate]=useState('');
  const start_date = new Date(); 
  start_date.setDate(start_date.getDate() + 1); // Set to tomorrow
  
  const end_date = new Date(start_date); // Copy start_date
  end_date.setDate(start_date.getDate() + 30);

  const startDateString = start_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endDateString = end_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dispatch(fetchMonthAheadData());
        const responseData = data.payload;

        if (Array.isArray(responseData?.daily_data)) {

          const mcvData = responseData.daily_data.map(item => item.mcv_prediction?.avg ?? 0);
          const mcpDataOriginal = responseData.daily_data.map(item => item.mcp_prediction?.avg ?? 0);
          const mcpData=mcpDataOriginal.reverse();
          const labels = Array.from({ length: 31 }, (_, i) => i + 1); // Creates an array [1, 2, ..., 31]
          setMcpHighestDate(moment(responseData.overall_stats?.mcp_prediction?.highest_date).format('DD-MM-YYYY'));
          setMcpLowestDate(moment(responseData.overall_stats?.mcp_prediction?.lowest_date).format('DD-MM-YYYY'));
          setMcvHighestDate(moment(responseData.overall_stats?.mcv_prediction?.highest_date).format('DD-MM-YYYY'));
          setMcvLowestDate(moment(responseData.overall_stats?.mcv_prediction?.lowest_date).format('DD-MM-YYYY'));

          // console.log(responseData.overall_stats?.mcp_prediction?.highest_date);
          
          // setMcpLowestDate(responseData.overall_stats?.mcp_prediction?.lowest_date);
          // console.log("MCV Data:", mcvData);
          // console.log("MCP Data:", mcpData);
          // console.log("Labels:", labels);

          setLineData({
            labels,
            datasets: [
              {
                label: 'MCP (INR/MWh)',
                data: mcpData,
                borderColor: 'blue',
                fill: false,
                yAxisID: 'y-axis-mcp',
              },
              {
                label: 'MCV (MWh)',
                data: mcvData,
                borderColor: 'green',
                fill: false,
                yAxisID: 'y-axis-mcv',
              },
            ],
          });

          setTableData([
            {
              key: '1',
              status: 'Highest Forecasted Value',
              mcp: responseData.overall_stats?.mcp_prediction?.highest ?? 0,
              mcv: responseData.overall_stats?.mcv_prediction?.highest ?? 0,
            
            },
            {
              key: '2',
              status: 'Lowest Forecasted Value',
              mcp: responseData.overall_stats?.mcp_prediction?.lowest ?? 0,
              mcv: responseData.overall_stats?.mcv_prediction?.lowest ?? 0,
             
            },
            {
              key: '3',
              status: 'Average Forecasted Value',
              mcp: responseData.overall_stats?.mcp_prediction?.average ?? 0,
              mcv: responseData.overall_stats?.mcv_prediction?.average ?? 0,
             
            },
          ]);

          setLoading(false);
        } else {
          console.error("Error: daily_data is missing or not an array", responseData);
          setLineData({ labels: [], datasets: [] });
        }
      } catch (error) {
        message.error(error);
        // console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

// console.log(mcpHighestDate);


  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category', // Change to 'category' if using string labels
        position: 'bottom',
        ticks: {
          autoSkip: false,
        },
        title: {
          display: true,
          text: 'Days',
        },
      },
      'y-axis-mcv': {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        title: {
          display: true,
          text: 'MCV (MWh)',
        },
         ticks: {
                  color: 'green', // Set scale number color for MCP
                },
      },
      'y-axis-mcp': {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'MCP (INR/MWh)',
        },
        grid: {
          drawOnChartArea: false,
        },
         ticks: {
                  color: 'blue', // Set scale number color for MCP
                },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'end',
        labels: {
          usePointStyle: false,
          padding: 20,
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

  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'MCP (INR/MWh)',
      children: [
        {
          title: 'Value',
          dataIndex: 'mcp',
          key: 'mcp',
        },
        {
          title: 'Date',
          dataIndex: 'mcpDate',
          key: 'mcpDate',
          render: (text, record) => {
            if (record.status === 'Highest Forecasted Value') return mcpHighestDate;
            if (record.status === 'Lowest Forecasted Value') return mcpLowestDate;
            return '-';
          },
        },
      ],
    },
    {
      title: 'MCV (MWh)',
      children: [
        {
          title: 'Value',
          dataIndex: 'mcv',
          key: 'mcv',
        },
        {
          title: 'Date',
          dataIndex: 'mcvDate',
          key: 'mcvDate',
          render: (text, record) => {
            if (record.status === 'Highest Forecasted Value') return mcvHighestDate;
            if (record.status === 'Lowest Forecasted Value') return mcvLowestDate;
            return '-';
          },
        },
      ],
    },
  ];
  

  return (
    <div style={{ padding: '3%', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}> {/* Changed background color and set minHeight */}
      {/* <h1>Market Forecast - Month Ahead</h1> */}
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
        Market Forecast - Month Ahead
         {/* <span style={{fontSize:'20px'}}>({startDateString} - {endDateString})</span> */}
      </h1>
      {/* <Card style={{ width: 'full',marginLeft:'0' }}>
        <div style={{ height: '400px', width: '100%' }}>
          {lineData.labels.length > 0 ? (
            <Line data={lineData} options={options} style={{marginLeft:'150px'}} />
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading chart data...</p>
            </div>
          )}
        </div>
      </Card> */}
      <Card style={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', width:'100%' }}> {/* Updated shadow and card background color */}
      <div style={{ margin: '20px 0' }}></div>
      {/* {lineData.labels.length > 0 ? ( */}
              <Table 
                columns={columns} 
                dataSource={tableData} 
                pagination={false} 
                bordered
                // style={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', width: '80%', backgroundColor: '#fff' }} // Updated shadow and table background color
              />
      {/* //     ) : (
      //       <div style={{ textAlign: 'center', padding: '20px' }}>
      //         <Spin />
      //       </div>
      //     )
      // } */}
      </Card>
      {/* <Table columns={columns} dataSource={tableData} pagination={false} /> */}
      <div style={{ padding: '20px', width: '100%' }}>
        <Row justify="space-between">
          <Col>
            {/* <Button onClick={() => navigate('/px/consumer/statistical-information-month')}>Historical Trend</Button> */}
          </Col>
          <Col>
            <Button onClick={() => navigate('/px/consumer/planning')}>Schedule Trade</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MonthAhead;