import React from 'react';
import { Card, Statistic, Progress, Button, Row, Col } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;

const Trading = () => {
  const navigate=useNavigate();
    const data = {
        labels: [1,2,3,4,5,6,7,8], // Updated X-axis labels
        datasets: [
          {
            label: 'MCP (INR/MWh)', // Label for MCP dataset
            data: [2000, 5000, 4000, 2000, 1300, 2900, 3100, 1000], // Updated data for MCP
          },
          {
            label: 'MCV (MWh)', // Label for MCY dataset
            data: [3000, 3000, 3000, 2088, 2341, 1020, 2000, 3200], // Updated data for MCY
          },
        ],
      };
      
      const handleChat = () => {
        navigate('/px/chat-page')
        console.log('Chat with Expert');
        
      }


      const handleTradingStatus = () => {
        console.log('Trading Status');
        
      }

  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {/* Total Section */}
        <Col span={6}>
          <Card style={{height:'150px',backgroundColor:'#669800'}}>
            <Statistic title="TOTAL" value={493} suffix="+" />
          </Card>
        </Col>

        {/* Trading Volume Section */}
        <Col span={6}>
          <Card style={{height:'150px',backgroundColor:'#669800'}}>
            <Statistic title="TRADING VOLUME" value={8.324} />
          </Card>
        </Col>

        {/* Price Per Unit Section */}
        <Col span={6}>
          <Card style={{height:'150px',backgroundColor:'#669800'}}>
            <Statistic title="PRICE PER UNIT" value={6.203} />
          </Card>
        </Col>

        {/* Planning Costs Section */}
        <Col span={6}>
          <Card style={{height:'150px',backgroundColor:'#669800'}}>
            <Statistic title="PLANNING COSTS" value={64900} />
          </Card>
        </Col>
      </Row>
{/* 
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
       
        <Col span={6}>
          <Card>
            <Statistic title="Lastage 2019" value={4819} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Lastage 2020" value={2826} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Lastage" value={20000} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Lastage" value={20000} />
          </Card>
        </Col>
      </Row> */}

   <Card style={{marginTop:'20px'}}>
         <h2>Model Statistics</h2>
         <div style={{ height: '300px' ,width:'80%',margin:'0 auto',marginTop:'10px'}}>
           <Line data={data} options={{ responsive: true }} />
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