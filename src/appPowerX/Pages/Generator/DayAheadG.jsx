/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Select, Table, Row, Col, Card, Spin, message } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
// import zoomPlugin from 'chartjs-plugin-zoom'; // Removed zoom plugin import
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { dayAheadData } from '../../Redux/slices/consumer/dayAheadSlice';
import { BlockOutlined, AppstoreOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { color } from 'framer-motion';

// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale);

const { Option } = Select;

const DayAheadG = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [statistiicsData, setStatisticsData] = useState([]);
  const [loading, setLoading] = useState(false);
   const [nextDay, setNextDay] = useState('');
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

  //  useEffect(() => {
  //     const today = new Date();
  //     const tomorrow = new Date(today);
  //     tomorrow.setDate(today.getDate() + 1);
  //     const options = { month: 'short', day: 'numeric' };
  //     setNextDay(tomorrow.toLocaleDateString(undefined, options));
  //   }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await dispatch(dayAheadData()).unwrap();
        console.log('datssss',data);
        if (data?.predictions?.length > 0) {
          const dateStr = data.predictions[0]?.date;
          const date = new Date(dateStr);
          
          const options = { month: "long", day: "2-digit" };
          const formattedDate = date.toLocaleDateString("en-US", options);
    
          setNextDay(formattedDate); // Example output: "February 01"
        }

const mcpData = data.predictions.map(item =>
  item.mcp_prediction === 0 ? null : Number(item.mcp_prediction)
);
        const mcvData = data.predictions.map(item => Number(item.mcv_prediction)); // Ensure numbers

        setTableData([{ MCP: mcpData, MCV: mcvData }]);
        setStatisticsData(data.statistics);
        setLoading(false);
      } catch (error) {
        message.error(error)
        // console.log(error);
      }
    };
    fetchData();
  }, [dispatch]);
// console.log('mcpData', tableData);
console.log('table dataaaaaa',tableData);

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

 const timeLabels = Array.from({ length: 96 }, (_, i) => {
  const minutes = i * 15;
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
});

const data = {
  labels: timeLabels,
  datasets: [
    {
      label: 'MCP (INR / MWh)',
      data: Array.isArray(tableData[0]?.MCP) ? tableData[0].MCP : [],
      borderColor: 'blue',
      backgroundColor: 'rgba(0, 0, 255, 0.1)',
      fill: false,
      yAxisID: 'mcp',
      pointRadius: 2,
      tension: 0.3,
      borderWidth: 2,
    },
    {
      label: 'MCV (MWh)',
      data: Array.isArray(tableData[0]?.MCV) ? tableData[0].MCV : [],
      borderColor: 'green',
      backgroundColor: 'rgba(0, 255, 0, 0.1)',
      fill: false,
      yAxisID: 'mcv',
      pointRadius: 2,
      tension: 0.3,
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    x: {
      type: 'category',
      title: {
        display: true,
        text: 'Time (15-min interval)',
        font: {
          weight: 'bold',
          size: 16,
        },
      },
      ticks: {
  callback: function (val, index, values) {
    // Show every 2 hours AND the last label (index 95 = "23:45")
    if (index % 8 === 0 || index === values.length - 1) {
      return this.getLabelForValue(val);
    }
    return '';
  },
  autoSkip: false,
  font: {
    size: 12,
  },
  color: '#333',
},
    },
    mcv: {
      type: 'linear',
      position: 'left',
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
    mcp: {
      type: 'linear',
      position: 'right',
      beginAtZero: true,
      title: {
        display: true,
        text: 'MCP (INR / MWh)',
        font: {
          weight: 'bold',
        },
      },
      ticks: {
        color: 'blue',
      },
      grid: {
        drawOnChartArea: false,
      },
    },
  },
  plugins: {
    title: {
      display: true,
      text: 'Day Ahead Market Forecast',
      font: {
        size: 18,
      },
    },
    legend: {
      position: 'top',
    },
  },
};




const detailColumns = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
     align: 'center',
  },
  {
    title: 'MCP (INR / MWh)',
    dataIndex: 'mcp',
     align: 'center',
    key: 'mcp',
    render: (value) => Number(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  },
  {
    title: 'MCV (MWh)',
    dataIndex: 'mcv',
     align: 'center',
    key: 'mcv',
    render: (value) => Number(value).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
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
                 <Line
                   data={data}
                   options={options}
                   key={JSON.stringify(data)} // Force re-render on data change
                   style={{height: '300px', width: 'full', padding: '25px', marginLeft: '100px'}}
                 />
               </div>
             )}
           </Card>
      <h2></h2>
        <Card style={{ boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff' }}> {/* Updated shadow and card background color */}
              <Table 
                columns={detailColumns} 
                dataSource={detailDataSource} 
                pagination={false} 
                bordered
                style={{ textAlign: 'center', backgroundColor: '#fff' }} // Center-align table content
              />
            </Card>
      {/* <Table columns={detailColumns} dataSource={detailDataSource} pagination={false} /> */}
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

export default DayAheadG;