import React, { useEffect, useState } from 'react';
import { Button, Select, Table,Row,Col, Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import {useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchMonthAheadData, fetchMonthAheadLineData } from '../../Redux/slices/consumer/monthAheadSlice';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const { Option } = Select;

// Define chart data for Line chart with more X-axis values


const MonthAheadG = () => {
    const [tableData,setTableData] = useState('');
    const [lineData,setLineData] = useState('');

  const navigate = useNavigate(); 
  const handleChange = (value) => {
    setSelectedType(value);
  };

const dispatch = useDispatch();
  const data = {
    labels:Array.from({ length: 31 }, (_, i) => i + 1), // Updated X-axis labels
    datasets: [
      {
        label: 'MCP (INR/MWh)', // Label for MCP dataset
        data: lineData?.MCP, // Updated data for MCP
      },
      {
        label: 'MCV (MWh)', // Label for MCY dataset
        data: lineData?.MCV, // Updated data for MCY
      },
    ],
  };
  
useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await dispatch(fetchMonthAheadData());
            // console.log(data.payload); // Logging the fetched data
            setTableData(data.payload);
        } catch (error) {
            console.log(error);         
        }
    };

    fetchData();
  }, []);

useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await dispatch(fetchMonthAheadLineData());
            // console.log(data.payload); // Logging the fetched data
             setLineData(data.payload);
        } catch (error) {
            console.log(error);         
        }
    };

    fetchData();
  }, []);
  // Define columns for the table
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
  
  // Define table data
//   const tableData = [
//     {
//       key: '1',
//       metric: 'Highest',
//       mcp: 8000,
//       mcy: 3000,
//     },
//     {
//       key: '2',
//       metric: 'Lowest',
//       mcp: 6000,
//       mcy: 3000,
//     },
//     {
//       key: '3',
//       metric: 'Average',
//       mcp: 8000,
//       mcy: 3000,
//     },
//   ];

  const handleNextTrade = () => {
navigate('/px/generator/plan-month-trade-page');
  }
  
  const handleStatistics = () => {
    navigate('/px/generator/statistical-information');
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Month ahead Forecasted Market</h1>
      {/* <Select defaultValue="Solar" style={{ width: 120 ,marginLeft:'80%',marginBottom:'10px'}} onChange={handleChange}>
        <Option value="Solar">Solar</Option>
        <Option value="Non-solar">Non-solar</Option>
        <Option value="Hydro">Hydro</Option>
      </Select> */}

<Card  style={{width:'full'}}>
      {/* <h2>Historical Trend</h2> */}
      <div style={{height:'60vh',width:'100%'}}>
        <Line data={data} style={{width:'100%', marginLeft:'150px'}} options={{ responsive: true }} />
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

export default MonthAheadG;
