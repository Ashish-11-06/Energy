/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Statistic, Button, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchTradingData } from '../../Redux/slices/consumer/tradingSlice';
// import './Trading.css';
// Register Chart.js components and plugins
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, zoomPlugin);

const Trading = () => {
  const [tradeData, setTradeData] = useState({ plan: [], trade: [] });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tradingData = {
    trade: [
      2000, 5000, 4000, 2000, 1300, 4500, 3200, 3800, 4100, 2900, 3050, 2700, 3300, 2950, 4100, 4200, 4300, 3000, 2850, 3100, 2800, 3250, 3600, 4000, 3800, 3400, 3900, 4050, 3850, 3950, 4100, 4500, 4700, 4900, 5000, 5150, 5250, 5350, 5500, 5600, 5700, 5800, 5900, 6000, 5800, 5700, 5600, 5500, 5400, 5300, 5200, 5100, 5000, 4900, 4800, 4700, 4600, 4500, 4400, 4300, 4200, 4100, 4000, 3900, 3800, 3700, 3600, 3500, 3400, 3300, 3200, 3100, 3000, 2900, 2800, 2700, 2600, 2500, 2400, 2300, 2200, 2100, 2000, 1900, 1800, 1700, 1600, 1500, 1400, 1300, 1200, 1100, 1000, 900, 800, 700
    ],
    plan: [
      2000, 5000, 4000, 2000, 1300, 4500, 3200, 3800, 4100, 2900, 3050, 2700, 3300, 2950, 4100, 4200, 4300, 3000, 2850, 3100, 2800, 3250, 3600, 4000, 3800, 3400, 3900, 4050, 3850, 3950, 4100, 4500, 4700, 4900, 2000, 5000, 4000, 2000, 1300, 4500, 3200, 3800, 4100, 2900, 3050, 2700, 3300, 2950, 4100, 4200, 4300, 3000, 2850, 3100, 2800, 3250, 3600, 4000, 3800, 3400, 3900, 4050, 3850, 3950, 4100, 4500, 4700, 4900, 2000, 5000, 4000, 2000, 1300, 4500, 3200, 3800, 4100, 2900, 3050, 2700, 3300, 2950, 4100, 4200, 4300, 3000, 2850, 3100, 2800, 3250, 3600, 4000, 3800, 3400, 3900, 4050
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchTradingData()).unwrap(); // Await the dispatched action
        console.log(res); // Now you can safely access payload
        setTradeData(res || tradingData);
      } catch (error) {
        console.error("Error fetching trading data:", error);
        setTradeData(tradingData);
      }
    };

    fetchData(); // Call the async function
  }, [dispatch]);

  const data = {
    labels: Array.from({ length: 96 }, (_, i) => i + 1), // Updated X-axis labels
    datasets: [
      {
        label: 'Plan Data', // Label for Plan dataset
        data: tradeData.plan, // Updated data for Plan
        borderColor: 'blue',
        fill: false,
        tension: 0.4, // Add tension for smooth curve
      },
      {
        label: 'Trade Data', // Label for Trade dataset
        data: tradeData.trade, // Updated data for Trade
        borderColor: 'green',
        fill: false,
        tension: 0.4, // Add tension for smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'MWh',
          font:{
            weight: 'bold',
            
          }
        },
      },
      x: {
        type: 'linear',
        position: 'bottom',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Time (15-minute intervals)',
          font:{ 
            weight: 'bold',
            size: 16,
          }
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Position legends at the bottom
        align: 'end', // Align legends to the right
        labels: {
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
        text: 'Plan vs Trade Data',
        font: {
          size: 18,
        },
      },
    },
  };

  const handleChat = () => {
    navigate('/px/chat-page');
    console.log('Chat with Expert');
  };

  const handleTradingStatus = () => {
    console.log('Trading Status');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]} >
        {/* Total Section */}
        <Col span={6}>
          <Card style={{ height: '100px', backgroundColor: '#669800',textAlign:'center' }}>
            <Statistic title="TOTAL" value={493} suffix="+" style={{color:'white',fontWeight:'bold'}} valueStyle={{color:'white'}} formatter={(value) => (
    <span>
      {value} <span style={{ fontSize: '12px' }}>MW</span>
    </span>
  )}/>
          </Card>
        </Col>

        {/* Trading Volume Section */}
        <Col span={6}>
          <Card style={{ height: '100px', backgroundColor: '#669800',textAlign:'center' }}>
            <Statistic title="TRADING VOLUME" value={8.324} style={{color:'white',fontWeight:'bold'}} valueStyle={{color:'white'}} formatter={(value) => (
    <span>
      {value} <span style={{ fontSize: '12px' }}>MW</span>
    </span>
  )}/>
          </Card>
        </Col>

        {/* Price Per Unit Section */}
        <Col span={6}>
          <Card style={{ height: '100px', backgroundColor: '#669800',textAlign:'center' }}>
            <Statistic title="PRICE PER UNIT" value={6.203} style={{color:'white',fontWeight:'bold'}} valueStyle={{color:'white'}} formatter={(value) => (
    <span>
      {value} <span style={{ fontSize: '12px' }}>MW</span>
    </span>
  )}/>
          </Card>
        </Col>

        {/* Planning Costs Section */}
        <Col span={6}>
          <Card style={{ height: '100px', backgroundColor: '#669800' ,textAlign:'center'}}>
            <Statistic title="PLANNING COSTS" value={64900} style={{color:'white',fontWeight:'bold'}} valueStyle={{color:'white'}} formatter={(value) => (
    <span>
      {value} <span style={{ fontSize: '12px' }}>MW</span>
    </span>
  )}/>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '20px',height:'400px' }}>
        {/* <h2>Historical Trend</h2> */}
        <div style={{ height: '350px', width: '100%', marginTop: '10px' }}>
          <Line data={data} options={options} style={{ height: '350px' }} />
          {/* <p style={{ marginLeft: '30%', padding: '10px', marginBottom: '10px' }}>
            Plan vs Trade
          </p> */}
        </div>
      </Card>

      {/* Chat with Expert Section */}
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          {/* <Col>
            <Button onClick={handleTradingStatus}>Trading Status</Button>
          </Col> */}
          <Col>
            {/* <Button onClick={handleChat} style={{marginLeft:'1000px'}}>Chat with Expert</Button> */}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Trading;