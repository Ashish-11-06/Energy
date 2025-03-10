import React, { useEffect, useState } from 'react';
import { Button, Table, Row, Col, Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchMonthAheadData } from '../../Redux/slices/consumer/monthAheadSlice';

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const MonthAhead = () => {
  const [tableData, setTableData] = useState([]);
  const [lineData, setLineData] = useState({ labels: [], datasets: [] });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchMonthAheadData());
        const responseData = data.payload;

        if (Array.isArray(responseData?.daily_data)) {
          const mcvData = responseData.daily_data.map(item => item.mcv_prediction?.avg ?? 0);
          const mcpData = responseData.daily_data.map(item => item.mcp_prediction?.avg ?? 0);
          const labels = Array.from({ length: 31 }, (_, i) => i + 1); // Creates an array [1, 2, ..., 31]

          console.log("MCV Data:", mcvData);
          console.log("MCP Data:", mcpData);
          console.log("Labels:", labels);

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
              status: 'Highest',
              mcp: responseData.overall_stats?.mcp_prediction?.highest ?? 0,
              mcv: responseData.overall_stats?.mcv_prediction?.highest ?? 0,
            },
            {
              key: '2',
              status: 'Lowest',
              mcp: responseData.overall_stats?.mcp_prediction?.lowest ?? 0,
              mcv: responseData.overall_stats?.mcv_prediction?.lowest ?? 0,
            },
            {
              key: '3',
              status: 'Average',
              mcp: responseData.overall_stats?.mcp_prediction?.average ?? 0,
              mcv: responseData.overall_stats?.mcv_prediction?.average ?? 0,
            },
          ]);
        } else {
          console.error("Error: daily_data is missing or not an array", responseData);
          setLineData({ labels: [], datasets: [] });
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category', // Change to 'category' if using string labels
        position: 'bottom',
        ticks: {
          autoSkip: false,
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
          usePointStyle: false,
          padding: 20,
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

  return (
    <div style={{ padding: '20px' }}>
      <h1>Market Forecast - Month Ahead</h1>
      <Card style={{ width: 'full' }}>
        <div style={{ height: '400px', width: '100%' }}>
          {lineData.labels.length > 0 ? (
            <Line data={lineData} options={options} />
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
      </Card>
      <Table columns={columns} dataSource={tableData} pagination={false} />
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col>
            <Button onClick={() => navigate('/px/consumer/statistical-information-month')}>Historical Trend</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MonthAhead;