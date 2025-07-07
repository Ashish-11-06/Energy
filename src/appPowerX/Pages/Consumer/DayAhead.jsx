/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, Card, Spin } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { dayAheadData } from '../../Redux/slices/consumer/dayAheadSlice';
import { BlockOutlined, AppstoreOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { color } from 'framer-motion';

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const { Option } = Select;

const DayAhead = () => {
  const [tableData, setTableData] = useState([]);
  const [loading,setLoading] = useState(false);
  const [statistiicsData, setStatisticsData] = useState([]);
  const [nextDay, setNextDay] = useState('');
  const [detailDataSource, setDetailDataSource] = useState([
    {
      key: 'max',
      status: 'Maximum',
      mcp: 0,
      mcv: 0,
    },
    {
      key: 'min',
      status: 'Minimum',
      mcp: 0,
      mcv: 0,
    },
    {
      key: 'avg',
      status: 'Average',
      mcp: 0,
      mcv: 0,
    },
  ]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const today = new Date();
  //   const tomorrow = new Date(today);
  //   tomorrow.setDate(today.getDate() + 1);
  //   const options = { month: 'short', day: 'numeric' };
  //   setNextDay(tomorrow.toLocaleDateString(undefined, options));
  // }, []);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await dispatch(dayAheadData()).unwrap();
      console.log('data', data.predictions);

      // Format and set the next day's date for display
      if (data?.predictions?.length > 0) {
        const dateStr = data.predictions[0]?.date;
        const date = new Date(dateStr);
        const options = { month: "long", day: "2-digit" };
        const formattedDate = date.toLocaleDateString("en-US", options);
        setNextDay(formattedDate); // Example: "July 06"
      }

      // Extract and reverse MCP and MCV values for the chart
      const mcpData = data.predictions.map(item => item.mcp_prediction).reverse();
      const mcvData = data.predictions.map(item => item.mcv_prediction).reverse();

      setTableData([{ MCP: mcpData, MCV: mcvData }]);

      // Set statistics if available
      setStatisticsData(data.statistics);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching day ahead data:', error);
      setLoading(false);
    }
  };

  fetchData();
}, [dispatch]);

console.log('table data 89',tableData);


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

// console.log('table data',detailDataSource);


const detailColumns = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: 'Market Clearing Price (INR/MWh)',
    dataIndex: 'mcp',
    key: 'mcp',
    align: 'center',
    render: (value) =>
      Number(value).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    title: 'Market Clearing Volume (MWh)',
    dataIndex: 'mcv',
    key: 'mcv',
    align: 'center',
    render: (value) =>
      Number(value).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
];

const timeLabels = Array.from({ length: 96 }, (_, i) => {
  const totalMinutes = i * 15;
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const minutes = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${minutes}`;
});


const mcp = Array.isArray(tableData[0]?.MCP) ? [...tableData[0].MCP] : [];
const mcv = Array.isArray(tableData[0]?.MCV) ? [...tableData[0].MCV] : [];

console.log('mcp',mcp);



const data = {
  labels: timeLabels, // 96 formatted time blocks
  datasets: [
    {
      label: 'MCP (INR/MWh)',
      data: mcp,
      borderColor: 'blue',
      fill: false,
      yAxisID: 'y-axis-mcp',
    },
    {
      label: 'MCV (MWh)',
      data: mcv,
      borderColor: 'green',
      fill: false,
      yAxisID: 'y-axis-mcv',
    },
  ],
};


const options = {
  responsive: true,
  maintainAspectRatio: false,
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
          return index % 8 === 0 || index === 95 ? this.getLabelForValue(val) : '';
        },
        autoSkip: false,
        font: {
          size: 12,
        },
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
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: 'blue',
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
      text: `Day Ahead Market Forecast (${nextDay})`,
      font: {
        size: 18,
      },
    },
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
      dataIndex: 'mcp',
      key: 'mcp',
    },
    {
      title: 'MCV (MWh)',
      dataIndex: 'mcv',
      key: 'mcv',
    },
  ];

  const handleNextTrade = () => {
    navigate('/px/consumer/plan-trade-page');
  };

  const handleStatistics = () => {
    navigate('/px/consumer/statistical-information');
  };

  return (
    <div style={{ padding: '3%', backgroundColor: '#f0f2f5', minHeight: '100vh', position: 'relative' }}> {/* Changed background color and set minHeight */}
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800',fontWeight:'bold' }}>
        Market Forecast - Day Ahead <span style={{fontSize:'20px'}}>({nextDay})</span>
      </h1>
      <Card style={{height: '500px', width: '100%', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff' }}> {/* Updated shadow and card background color */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <Spin />
            <p>Loading chart data...</p>
          </div>
        ) : (
          <div style={{ height: '500px', width: '100%' }}>
            <Line data={data} options={options} style={{height: '300px', width: 'full', padding: '25px', marginLeft: '100px'}}/>
          </div>
        )}
      </Card>
      <div style={{ margin: '20px 0' }}></div> {/* Add space between card and table */}
      <Card style={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff' }}> {/* Updated shadow and card background color */}
        <Table 
          columns={detailColumns} 
          dataSource={detailDataSource} 
          pagination={false} 
          style={{ textAlign: 'center', backgroundColor: '#fff' }} // Center-align table content
        />
      </Card>
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col>
            <Button type="primary" onClick={handleStatistics} style={{ borderRadius: '5px', backgroundColor: '#ff5722', borderColor: '#ff5722' }}>Historical Trend</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={handleNextTrade} style={{ borderRadius: '5px', backgroundColor: '#ff5722', borderColor: '#ff5722' }}>Set Up Next-Day Trade</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DayAhead;
