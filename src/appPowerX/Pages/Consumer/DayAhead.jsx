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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dispatch(dayAheadData()).unwrap();
        console.log('data', data.predictions);

        const mcpDataOriginal = data.predictions.map(item => item.mcp_prediction);
        const mcpData=mcpDataOriginal.reverse();
        const mcvData = data.predictions.map(item => item.mcv_prediction);

        setTableData([{ MCP: mcpData, MCV: mcvData }]); // Ensure data is an array

        setStatisticsData(data.statistics);
        setLoading(false);
        console.log(data.statistics);
        
      } catch (error) {
        console.log(error);
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

console.log('table data',detailDataSource);


  const detailColumns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Market Clearing Price (INR/MWh)',
      dataIndex: 'mcp',
      key: 'mcp',
    },
    {
      title: 'Market Clearing Volume (MWh)',
      dataIndex: 'mcv',
      key: 'mcv',
    },
  ];

  const data = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1), // Updated X-axis labels
    datasets: [
      {
        label: 'MCP (INR/MWh)', // Label for MCP dataset
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

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        ticks: {
          autoSkip: false, // Ensure all ticks are shown
          maxTicksLimit: 96, // Ensure at least 96 ticks are shown
        },
        title: {
          display: true,
          text: '96 time blocks',
          font: {
            weight: 'bold',
            size: 16,
          }
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
          }
        },
        ticks: {
          color: 'green', // Set scale number color for MCV
        },
      },
      'y-axis-mcp': {
        type: 'linear',
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'MCP (INR/MWh)',
          font :{
            weight: 'bold',
          }
        },
        grid: {
          drawOnChartArea: false, // Only draw grid lines for one Y-axis
        },
        ticks: {
          color: 'blue', // Set scale number color for MCP
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Position legends at the bottom
        align: 'end', // Align legends to the right
        labels: {
          // usePointStyle: true, // Use point style for legend items
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
        text: 'Day Ahead Market Forecast',
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
    <div style={{ padding: '20px' }}>
      <h1>Market Forecast - Day Ahead</h1>
      <Card style={{height: '500px', width: '100%'}}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
            <p>Loading chart data...</p>
          </div>
        ) : (
          <div style={{ height: '500px', width: '100%' }}>
            <Line data={data} options={options} style={{height: '300px', width: 'full',padding:'25px',marginLeft:'100px'}}/>
          </div>
        )}
      </Card>
      <div style={{ margin: '20px 0' }}></div> {/* Add space between card and table */}
      <Table 
        columns={detailColumns} 
        dataSource={detailDataSource} 
        pagination={false} 
        style={{ textAlign: 'center' }} // Center-align table content
      />
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col>
            <Button onClick={handleStatistics}>Historical Trend</Button>
          </Col>
          <Col>
            <Button onClick={handleNextTrade}>Set Up Next-Day Trade</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DayAhead;
