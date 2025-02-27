import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { dayAheadData } from '../../Redux/slices/consumer/dayAheadSlice';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

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
      },
      {
        label: 'MCV (MWh)', // Label for MCY dataset
        data: tableData[0]?.MCV || [], // Updated data for MCY
        borderColor: 'green',
        fill: false,
      },
    ],
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
      <h1>Day ahead Forecasted Market</h1>
      <Card style={{height: '500px', width: '100%'}}>
        <div style={{ height: '500px', width: '100%', margin: '0 auto' }}>
          <Line data={data} options={{ responsive: true }} style={{height: '300px', width: 'full',padding:'25px'}}/>
        </div>
      </Card>
      <h2></h2>
      {/* <Table columns={columns} dataSource={Array.isArray(tableData) ? tableData : []} pagination={false} /> */}

      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col>
            <Button onClick={handleStatistics}>Model Statistics</Button>
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