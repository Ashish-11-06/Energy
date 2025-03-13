/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, Card } from 'antd';
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

const DayAheadG = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 const [statistiicsData, setStatisticsData] = useState([]);
  const [detailDataSource, setDetailDataSource] = useState([
    {
      key: 'max',
      status: 'Max',
      mcp: 0,
      mcv: 0,
    },
    {
      key: 'min',
      status: 'Min',
      mcp: 0,
      mcv: 0,
    },
    {
      key: 'avg',
      status: 'Avg',
      mcp: 0,
      mcv: 0,
    },
  ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(dayAheadData()).unwrap();
        console.log(data);
        
        const mcpData = data.predictions.map(item => item.mcp_prediction);
        const mcvData = data.predictions.map(item => item.mcv_prediction);

        setTableData([{ MCP: mcpData, MCV: mcvData }]);

        setStatisticsData(data.statistics);

        // setTableData(data ? [data] : []); // Ensure data is an array
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);
console.log(statistiicsData);

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

  const data = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1), // Updated X-axis labels
    datasets: [
      {
        label: 'MCP (INR/MWh)', // Label for MCP dataset
        data: tableData[0]?.MCP || [], // Updated data for MCP
        borderColor: 'blue',
        fill: false,
        font:{
          weight: 'bold',
        },
        yAxisID: 'y-axis-mcp', // Assign to right Y-axis
      },
      {
        label: 'MCV (MWh)', // Label for MCY dataset
        data: tableData[0]?.MCV || [], // Updated data for MCY
        borderColor: 'green',
        fill: false,
        font:{
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
          font:{
            weight: 'bold',
            size: 16,
          }
        },
        
      },
      'y-axis-mcv': {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        color: 'green',
        title: {
          display: true,
          text: 'MCV (MWh)',
          font:{
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
          font:{
            weight: 'bold',
          }
        },
         ticks: {
                  color: 'blue', // Set scale number color for MCV
                },
        grid: {
          drawOnChartArea: false, // Only draw grid lines for one Y-axis
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

  const detailColumns = [
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
    navigate('/px/generator/plan-day-trade-page');
  };

  const handleStatistics = () => {
    navigate('/px/generator/statistical-information');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Market Forecast - Day Ahead</h1>
      {/* <div style={{ display: "flex", gap: "15px", fontSize: "24px", color: "#669800" }}>
      <BlockOutlined />   
      <AppstoreOutlined /> 
      <CheckCircleOutlined /> 
    </div> */}
      <Card style={{height: '500px', width: '100%'}}>
        <div style={{ height: '500px', width: '100%' }}>
          <Line data={data} options={options} style={{height: '300px', width: 'full',padding:'25px',marginLeft:'100px'}}/>
        </div>
      </Card>
      <h2></h2>
      <Table columns={detailColumns} dataSource={detailDataSource} pagination={false} />
      
      {/* <Table columns={columns} dataSource={Array.isArray(tableData) ? tableData : []} pagination={false} /> */}

      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col>
            <Button onClick={handleStatistics}>Historical Trend</Button>
          </Col>
          <Col>
            <Button onClick={handleNextTrade}>Plan Your Next Day Trading</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DayAheadG;