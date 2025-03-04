import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { dayAheadData } from '../../Redux/slices/consumer/dayAheadSlice';
import { BlockOutlined, AppstoreOutlined, CheckCircleOutlined } from "@ant-design/icons";

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const { Option } = Select;

const DayAhead = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(dayAheadData()).unwrap();
        setTableData(data ? [data] : []); // Ensure data is an array
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);

  const data = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1), // Updated X-axis labels
    datasets: [
      {
        label: 'MCP (INR/MWh)', // Label for MCP dataset
        data: tableData[0]?.MCP || [], // Updated data for MCP
        borderColor: 'blue',
        fill: false,
        yAxisID: 'y-axis-mcp', // Assign to right Y-axis
      },
      {
        label: 'MCV (MWh)', // Label for MCY dataset
        data: tableData[0]?.MCV || [], // Updated data for MCY
        borderColor: 'green',
        fill: false,
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

  const columns = [
    {
      title: 'Details',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'MCP (INR/MWh)',
      dataIndex: 'mcp',
      key: 'mcp',
    },
    {
      title: 'MCV (MWh)',
      dataIndex: 'mcy',
      key: 'mcy',
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

export default DayAhead;