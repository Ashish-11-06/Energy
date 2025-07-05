/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, Card, Spin } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { fetchMonthAheadData, fetchMonthAheadLineData } from '../../Redux/slices/consumer/monthAheadSlice';
import moment from 'moment';

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const { Option } = Select;

const MonthAheadG = () => {
  const [tableData, setTableData] = useState('');
  const [lineData, setLineData] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const [loading,setLoading] = useState(true);
  const  [mcpHighestDate,setMcpHighestDate]=useState('');
  const  [mcpLowestDate,setMcpLowestDate]=useState('');
  const [mcvHighestDate,setMcvHighestDate]=useState('');
  const [mcvLowestDate,setMcvLowestDate]=useState('');
const [tableLoading,setTableLoading] =useState(false);
  const start_date = new Date(); 
  start_date.setDate(start_date.getDate() + 1); // Set to tomorrow
  
  const end_date = new Date(start_date); // Copy start_date
  end_date.setDate(start_date.getDate() + 30);

  const startDateString = start_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endDateString = end_date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  useEffect(() => {
    const fetchData = async () => {
      setTableLoading(true);
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
     // console.log("Error fetching data:", error);
      }
         setTableLoading(false);

    };

    fetchData();
  }, [dispatch]);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await dispatch(fetchMonthAheadData());
  //       const responseData = data.payload;

  //       if (Array.isArray(responseData?.daily_data)) {
  //         const mcvData = responseData.daily_data.map(item => item.mcv_prediction?.avg ?? 0);
  //         const mcpDataOriginal = responseData.daily_data.map(item => item.mcp_prediction?.avg ?? 0);
  //         const mcpData = mcpDataOriginal.reverse();
  //         const labels = Array.from({ length: 31 }, (_, i) => i + 1); // Creates an array [1, 2, ..., 31]

  //      // console.log("MCV Data:", mcvData);
  //      // console.log("MCP Data:", mcpData);
  //      // console.log("Labels:", labels);

  //         setLineData({
  //           labels,
  //           datasets: [
  //             {
  //               label: 'MCP (INR/MWh)',
  //               data: mcpData,
  //               borderColor: 'blue',
  //               fill: false,
  //               yAxisID: 'y-axis-mcp',
  //             },
  //             {
  //               label: 'MCV (MWh)',
  //               data: mcvData,
  //               borderColor: 'green',
  //               fill: false,
  //               yAxisID: 'y-axis-mcv',
  //             },
  //           ],
  //         });

  //         setTableData([
  //           {
  //             key: '1',
  //             status: 'Highest',
  //             mcp: responseData.overall_stats?.mcp_prediction?.highest ?? 0,
  //             mcv: responseData.overall_stats?.mcv_prediction?.highest ?? 0,
  //           },
  //           {
  //             key: '2',
  //             status: 'Lowest',
  //             mcp: responseData.overall_stats?.mcp_prediction?.lowest ?? 0,
  //             mcv: responseData.overall_stats?.mcv_prediction?.lowest ?? 0,
  //           },
  //           {
  //             key: '3',
  //             status: 'Average',
  //             mcp: responseData.overall_stats?.mcp_prediction?.average ?? 0,
  //             mcv: responseData.overall_stats?.mcv_prediction?.average ?? 0,
  //           },
  //         ]);
  //       } else {
  //         console.error("Error: daily_data is missing or not an array", responseData);
  //         setLineData({ labels: [], datasets: [] });
  //       }
  //     } catch (error) {
  //    // console.log("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch]);

const columns = [
  {
    title: 'Details',
    dataIndex: 'status',
    key: 'status',
    width: 200,
  },
  {
    title: 'MCP (INR/MWh)',
    children: [
      {
        title: 'Value',
        dataIndex: 'mcp',
        key: 'mcp',
        render: (value) =>
          Number(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
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
        render: (value) =>
          Number(value).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
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

  const handleNextTrade = () => {
    navigate('/px/generator/planning');
  };

  const handleStatistics = () => {
    // console.log('clicked');
    navigate('/px/generator/statistical-month-information');
  };

  return (
    <div style={{ padding: '3%', backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}> {/* Changed background color and set minHeight */}
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#669800', fontWeight: 'bold' }}>
        Market Forecast - Month Ahead <span style={{fontSize:'20px'}}>({startDateString} - {endDateString})</span>
      </h1>     
      <Card style={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', width: '100%' }}> {/* Updated shadow and card background color */}
        <Spin spinning={tableLoading} tip="Loading...">
        <Table columns={columns}  dataSource={tableData} pagination={false} bordered />
      </Spin>
      </Card>
      <div style={{ padding: '20px', width: '100%' }}>
        <Row justify="space-between">
          <Col>
            {/* <Button onClick={handleStatistics}>Historical Trend</Button> */}
          </Col>
          <Col>
            <Button onClick={handleNextTrade}>Schedule Trade</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default MonthAheadG;
