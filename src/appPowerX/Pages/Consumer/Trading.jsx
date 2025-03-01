import React, { useEffect, useState } from 'react';
import { Card, Statistic, Button, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchTradingData } from '../../Redux/slices/consumer/tradingSlice';

const Trading = () => {
  const [tradeData, setTradeData] = useState({ plan: [], trade: [] });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(fetchTradingData()).unwrap(); // Await the dispatched action
        console.log(res); // Now you can safely access payload
        setTradeData(res);
      } catch (error) {
        console.error("Error fetching trading data:", error);
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
      },
      {
        label: 'Trade Data', // Label for Trade dataset
        data: tradeData.trade, // Updated data for Trade
        borderColor: 'green',
        fill: false,
      },
    ],
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
      <Row gutter={[16, 16]}>
        {/* Total Section */}
        <Col span={6}>
          <Card style={{ height: '100px', backgroundColor: '#669800',textAlign:'center' }}>
            <Statistic title="TOTAL" value={493} suffix="+" />
          </Card>
        </Col>

        {/* Trading Volume Section */}
        <Col span={6}>
          <Card style={{ height: '100px', backgroundColor: '#669800',textAlign:'center' }}>
            <Statistic title="TRADING VOLUME" value={8.324} />
          </Card>
        </Col>

        {/* Price Per Unit Section */}
        <Col span={6}>
          <Card style={{ height: '100px', backgroundColor: '#669800',textAlign:'center' }}>
            <Statistic title="PRICE PER UNIT" value={6.203} />
          </Card>
        </Col>

        {/* Planning Costs Section */}
        <Col span={6}>
          <Card style={{ height: '100px', backgroundColor: '#669800' ,textAlign:'center'}}>
            <Statistic title="PLANNING COSTS" value={64900} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '20px',height:'400px' }}>
        {/* <h2>Historical Trend</h2> */}
        <div style={{ height: '350px', width: '100%', marginTop: '10px' }}>
          <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} style={{ height: '350px' }} />
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
            <Button onClick={handleChat} style={{marginLeft:'1000px'}}>Chat with Expert</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Trading;