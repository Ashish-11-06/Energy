import React, { useEffect, useState } from 'react';
import { Card, Statistic, Button, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

const Trading = () => {
  const navigate = useNavigate();
  const [tradeData, setTradeData] = useState([]);
  const [monthTradeData, setMonthTradeData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [navigationSource, setNavigationSource] = useState('');

  useEffect(() => {
    const storedNavigationSource = localStorage.getItem("navigationSource");
    setNavigationSource(storedNavigationSource);

    if (storedNavigationSource === "PlanYourTradePage") {
      const storedData = JSON.parse(localStorage.getItem("tradeData"));
      if (storedData) {
        setTradeData(storedData);
      }
    } else if (storedNavigationSource === "PlanMonthTrading") {
      const storedMonthData = JSON.parse(localStorage.getItem("monthTradeData"));
      const storedSelectedMonth = localStorage.getItem("selectedMonth");
      if (storedMonthData && storedSelectedMonth) {
        setMonthTradeData(storedMonthData);
        setSelectedMonth(storedSelectedMonth);
      }
    }
  }, []);

  const data = {
    labels: navigationSource === "PlanYourTradePage" 
      ? tradeData.map(item => item.time) 
      : monthTradeData.map(item => item.date),
    datasets: [
      {
        label: 'Demand (MW)',
        data: navigationSource === "PlanYourTradePage" 
          ? tradeData.map(item => item.demand) 
          : monthTradeData.map(item => item.demand),
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  const handleChat = () => {
    navigate('/px/chat-page');
  };

  const handleTradingStatus = () => {
    console.log('Trading Status');
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {/* Total Section */}
        <Col span={6}>
          <Card style={{ height: '150px', backgroundColor: '#669800' }}>
            <Statistic title="TOTAL" value={493} suffix="+" />
          </Card>
        </Col>

        {/* Trading Volume Section */}
        <Col span={6}>
          <Card style={{ height: '150px', backgroundColor: '#669800' }}>
            <Statistic title="TRADING VOLUME" value={8.324} />
          </Card>
        </Col>

        {/* Price Per Unit Section */}
        <Col span={6}>
          <Card style={{ height: '150px', backgroundColor: '#669800' }}>
            <Statistic title="PRICE PER UNIT" value={6.203} />
          </Card>
        </Col>

        {/* Planning Costs Section */}
        <Col span={6}>
          <Card style={{ height: '150px', backgroundColor: '#669800' }}>
            <Statistic title="PLANNING COSTS" value={64900} />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '20px' }}>
        <h2>Model Statistics</h2>
        <div style={{ height: '48vh', width: '80%', margin: '0 auto', marginTop: '10px' }}>
          <Line data={data} options={{ responsive: true }} />
          <p style={{ marginLeft: '30%', padding: '10px', marginBottom: '10px' }}>
            {navigationSource === "PlanYourTradePage" ? "Plan vs Trade (96 Blocks)" : `Plan vs Trade (${selectedMonth})`}
          </p>
        </div>
      </Card>

      {/* Chat with Expert Section */}
      <div style={{ padding: '20px' }}>
        <Row justify="space-between">
          <Col>
            <Button onClick={handleTradingStatus}>Trading Status</Button>
          </Col>
          <Col>
            <Button onClick={handleChat}>Chat with Expert</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Trading;