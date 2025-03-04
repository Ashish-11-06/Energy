import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchMonthAheadData, fetchMonthAheadLineData } from '../../Redux/slices/consumer/monthAheadSlice';

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const { Option } = Select;

const MonthAhead = () => {
  const [tableData, setTableData] = useState('');
  const [lineData, setLineData] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchMonthAheadData());
        setTableData(data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchMonthAheadLineData());
        setLineData(data.payload);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);

  const data = {
    labels: Array.from({ length: 31 }, (_, i) => i + 1), // Updated X-axis labels
    datasets: [
      {
        label: 'MCP (INR/MWh)', // Label for MCP dataset
        data: lineData?.MCP, // Updated data for MCP
        borderColor: 'blue',
        fill: false,
        yAxisID: 'y-axis-mcp', // Assign to right Y-axis
      },
      {
        label: 'MCV (MWh)', // Label for MCY dataset
        data: lineData?.MCV, // Updated data for MCY
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
          usePointStyle: false, // Use point style for legend items
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
    navigate('/px/consumer/plan-month-trade');
  };

  const handleStatistics = () => {
    navigate('/px/consumer/statistical-information');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Market Forecast - Month Ahead</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '70%', marginBottom: '10px'}}>
        <label htmlFor="" style={{ width: 120, fontWeight: 'bold', marginRight: '0px', fontSize: '20px' }}>Technology: </label>
        <Select placeholder="Select Technology" style={{ width: 200 }} >
          <Option value="Solar">Solar</Option>
          <Option value="Non-solar">Non-solar</Option>
          <Option value="Hydro">Hydro</Option>
        </Select>
      </div>

      <Card style={{ width: 'full' }}>
        <div style={{ height: '60vh', width: '100%' }}>
          <Line data={data} options={options} style={{ width: '100%', marginLeft: '150px' }} />
        </div>
      </Card>
      <h2></h2>
      {/* <Table columns={columns} dataSource={tableData} pagination={false} /> */}

      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col>
            <Button onClick={handleStatistics}>Historical Trend</Button>
          </Col>
          <Col>
            <Button onClick={handleNextTrade}>Plan Your Month Ahead Trading</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MonthAhead;
